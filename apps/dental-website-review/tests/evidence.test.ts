import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLinks, mapSite, readPages } from '../src/evidence/collect.js';
import { response, siteFetcher } from './helpers.js';
import type { SafeFetcher } from '../src/security/fetch.js';

const page = (title: string, main: string) =>
	`<!doctype html><html lang="en"><head><title>${title}</title></head><body><header><nav><a href="/new-patients">New Patients</a><a href="/emergency">Emergency</a><a href="/contact">Contact</a></nav><a href="tel:+15550100">Call</a></header><main>${main}</main><footer><a href="/privacy">Privacy</a>Monday 8:30 - 4:00 · 1 Main St</footer></body></html>`;
const long = (word: string) => `<p>${`${word} `.repeat(80)}</p>`;
const text = (url: string, body: string) =>
	response(url, body, 200, { 'content-type': 'text/plain' });

function site(overrides: (u: URL, url: string) => ReturnType<SafeFetcher> | undefined) {
	const fetched: string[] = [];
	const fetcher: SafeFetcher = async (url) => {
		fetched.push(url);
		const u = new URL(url);
		const hit = overrides(u, url);
		if (hit) return hit;
		if (u.pathname === '/robots.txt')
			return text(url, 'User-agent: *\nDisallow: /staff-only\n\nUser-agent: OtherBot\nDisallow: /');
		if (u.pathname === '/sitemap.xml')
			return response(
				url,
				'<urlset><url><loc>https://site.example/</loc></url><url><loc>https://site.example/new-patients</loc></url><url><loc>https://site.example/our-story-video</loc></url></urlset>',
				200,
				{ 'content-type': 'text/xml' }
			);
		if (u.pathname === '/' || u.pathname === '/home/')
			return response(url, page('Home', long('welcome')));
		if (u.pathname === '/new-patients') return response(url, page('New Patients', long('forms')));
		return response(url, page('Not found', 'Not found'), 404);
	};
	return { fetcher, fetched };
}

test('map_site returns the menu in order, footer links, every sitemap URL and robots rules, unranked', async () => {
	const { fetcher, fetched } = site(() => undefined);
	const map = await mapSite('https://site.example/', { fetcher });
	assert.deepEqual(
		map.menu.map((l) => [l.label, new URL(l.url).pathname]),
		[
			['New Patients', '/new-patients'],
			['Emergency', '/emergency'],
			['Contact', '/contact']
		]
	);
	assert.deepEqual(
		map.footerLinks.map((l) => new URL(l.url).pathname),
		['/privacy']
	);
	assert.equal(map.sitemap.urlCount, 3);
	assert.ok(map.sitemap.urls.includes('https://site.example/our-story-video'));
	// Only rules for every crawler (or this one) apply; OtherBot's blanket ban does not.
	assert.deepEqual(map.robots.disallow, ['/staff-only']);
	assert.match(map.homepage!.footerText, /Monday 8:30 - 4:00/);
	// Nothing beyond the homepage is fetched until the model asks.
	assert.deepEqual(
		fetched.map((u) => new URL(u).pathname),
		['/robots.txt', '/', '/sitemap.xml']
	);
});

test('read_pages fetches exactly what was asked, under robots, with shared chrome sent once', async () => {
	const { fetcher, fetched } = site(() => undefined);
	const { pages, duplicates, errors } = await readPages(
		[
			'https://site.example/',
			'https://site.example/home/',
			'https://site.example/new-patients',
			'https://site.example/staff-only'
		],
		{ fetcher }
	);
	assert.deepEqual(
		pages.map((p) => new URL(p.url).pathname),
		['/', '/new-patients']
	);
	assert.deepEqual(
		duplicates.map((d) => new URL(d.url).pathname),
		['/home/']
	);
	assert.ok(
		!fetched.some((u) => u.includes('staff-only')),
		'robots-disallowed page is not fetched'
	);
	assert.ok(!fetched.some((u) => u.includes('sitemap')), 'no sitemap or discovery');
	assert.match(pages[0]!.footerText, /Monday/);
	assert.equal(pages[1]!.footerText, '');
	assert.equal(pages[1]!.headerText, '');
	// Menu and footer links are not repeated on every page.
	assert.deepEqual(pages[1]!.internalLinks, []);
	assert.deepEqual(errors, []);
});

test('check_links keeps the query minus tracking, retries HEAD with GET, and never calls a robots block broken', async () => {
	const methods: string[] = [];
	const { fetcher, fetched } = site((u, url) => {
		if (u.hostname === 'sched.vendor.example') {
			if (u.pathname === '/robots.txt') return text(url, 'User-agent: *\nAllow: /');
			return response(url, 'scheduler', u.searchParams.get('id') === 'abc123' ? 200 : 500);
		}
		if (u.hostname === 'forms.vendor.example')
			return u.pathname === '/robots.txt'
				? text(url, 'User-agent: *\nDisallow: /')
				: response(url, 'form');
		return undefined;
	});
	const tracked: SafeFetcher = async (url, options) => {
		methods.push(`${options?.method ?? 'GET'} ${new URL(url).pathname}`);
		const r = await fetcher(url, options);
		return options?.method === 'HEAD' && url.includes('emergency') ? { ...r, status: 405 } : r;
	};
	const links = await checkLinks(
		[
			'https://sched.vendor.example/schedule/anon.do?id=abc123&utm_source=site&gclid=x',
			'https://forms.vendor.example/start',
			'https://site.example/emergency'
		],
		{ fetcher: tracked }
	);
	assert.deepEqual(links[0], {
		url: 'https://sched.vendor.example/schedule/anon.do?id=abc123',
		status: 200,
		finalUrl: 'https://sched.vendor.example/schedule/anon.do?id=abc123',
		checked: true
	});
	assert.equal(links[1]!.checked, false);
	assert.match(links[1]!.error!, /^robots:/);
	assert.ok(methods.includes('GET /emergency'), 'a failed HEAD is retried with GET');
	assert.ok(!fetched.some((u) => /utm_|gclid/.test(u)), 'tracking parameters are never sent');
});

test('a well-run practice: menu-led reading finds booking, tap-to-call and no trackers', async () => {
	const fetcher = siteFetcher('riverbend');
	const map = await mapSite('https://riverbend.example/', { fetcher });
	assert.ok(map.menu.some((l) => l.label === 'New patients'));
	assert.ok(map.homepage!.contact.phoneLinks.some((l) => l.inHeader));
	const { pages } = await readPages(
		map.menu.filter((l) => l.url.startsWith('https://riverbend.example/')).map((l) => l.url),
		{ fetcher }
	);
	assert.ok(pages.length >= 7);
	assert.ok(
		[map.homepage!, ...pages].some((p) => p.bookingLinks.some((b) => b.vendor === 'NexHealth'))
	);
	for (const p of pages) {
		assert.deepEqual(p.thirdParty.advertising, [], p.url);
		assert.deepEqual(p.thirdParty.sessionReplay, [], p.url);
	}
	assert.ok(
		map.homepage!.structuredData.nodes.some((n) => n.types.includes('Dentist') && n.telephone)
	);
});
