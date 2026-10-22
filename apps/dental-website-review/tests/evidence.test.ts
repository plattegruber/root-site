import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectSiteEvidence } from '../src/evidence/collect.js';
import { response, siteFetcher } from './helpers.js';
import type { SafeFetcher } from '../src/security/fetch.js';

const page = (title: string, main: string, extra = '') =>
	`<!doctype html><html lang="en"><head><title>${title}</title>${extra}</head><body><header><a href="tel:+15550100">Call</a></header><main>${main}</main><footer>Monday 8:30 - 4:00 · 1 Main St</footer></body></html>`;
const long = (word: string) => `<p>${`${word} `.repeat(80)}</p>`;

test('duplicate URLs and non-content paths are skipped; robots-blocked links are not broken', async () => {
	const home = page(
		'Home',
		`${long('welcome')}<a href="/home/">Home</a><a href="/cart">Cart</a><a href="/team">Team</a><a href="/team-alias">Team</a><a href="https://forms.vendor.example/start">Book online</a><a href="/missing">Old page</a>`
	);
	const team = page(
		'Team',
		long('dentist'),
		'<link rel="canonical" href="https://dup.example/team">'
	);
	const fetched: string[] = [];
	const fetcher: SafeFetcher = async (url) => {
		fetched.push(url);
		const u = new URL(url);
		if (u.hostname === 'forms.vendor.example')
			return u.pathname === '/robots.txt'
				? response(url, 'User-agent: *\nDisallow: /', 200, { 'content-type': 'text/plain' })
				: response(url, 'form');
		if (u.pathname === '/robots.txt')
			return response(url, 'User-agent: *\nAllow: /', 200, { 'content-type': 'text/plain' });
		if (u.pathname === '/sitemap.xml')
			return response(
				url,
				'<urlset><url><loc>https://dup.example/</loc></url><url><loc>https://dup.example/our-story-video</loc></url></urlset>',
				200,
				{ 'content-type': 'text/xml' }
			);
		if (u.pathname === '/' || u.pathname === '/home/') return response(url, home);
		if (u.pathname === '/team' || u.pathname === '/team-alias') return response(url, team);
		return response(url, page('Not found', 'Not found'), 404);
	};
	const evidence = await collectSiteEvidence('https://dup.example/', { fetcher });
	// Error pages stay in the evidence with their status; that is itself worth seeing.
	assert.deepEqual(
		evidence.pages.filter((p) => p.status === 200).map((p) => new URL(p.url).pathname),
		['/', '/team']
	);
	assert.equal(evidence.pages.find((p) => p.url.endsWith('/missing'))?.status, 404);
	assert.deepEqual(evidence.crawl.duplicatesSkipped.map((d) => new URL(d.url).pathname).sort(), [
		'/home/',
		'/team-alias'
	]);
	assert.ok(!fetched.some((u) => new URL(u).pathname === '/cart'), 'cart is never fetched');
	assert.deepEqual(
		evidence.linksNotChecked.map((l) => l.url),
		['https://forms.vendor.example/start']
	);
	assert.ok(evidence.brokenLinks.every((l) => !l.url.includes('vendor')));
	assert.deepEqual(evidence.sitemap.unfetchedUrls, ['https://dup.example/our-story-video']);
	// Footer text survives intact so the model can see hours written without am/pm.
	assert.match(evidence.pages[0]!.footerText, /Monday 8:30 - 4:00/);
});

test('a well-run practice shows booking, tap-to-call and no trackers', async () => {
	const evidence = await collectSiteEvidence('https://riverbend.example/', {
		fetcher: siteFetcher('riverbend')
	});
	const home = evidence.pages[0]!;
	assert.ok(home.contact.phoneLinks.some((l) => l.inHeader));
	assert.ok(evidence.pages.some((p) => p.bookingLinks.some((b) => b.vendor === 'NexHealth')));
	for (const p of evidence.pages) {
		assert.deepEqual(p.thirdParty.advertising, [], p.url);
		assert.deepEqual(p.thirdParty.sessionReplay, [], p.url);
	}
	assert.ok(home.structuredData.nodes.some((n) => n.types.includes('Dentist') && n.telephone));
});

test('external links keep their query (minus tracking) so schedulers needing an id are not reported broken', async () => {
	const home = page(
		'Home',
		`${long('welcome')}<a href="https://sched.vendor.example/schedule/anon.do?id&#x3D;abc123&amp;utm_source=site&amp;gclid=x">Schedule Online</a>`
	);
	const fetched: string[] = [];
	const fetcher: SafeFetcher = async (url, options) => {
		fetched.push(url);
		const u = new URL(url);
		if (u.pathname === '/robots.txt')
			return response(url, 'User-agent: *\nAllow: /', 200, { 'content-type': 'text/plain' });
		if (u.hostname === 'sched.vendor.example')
			return response(
				url,
				'scheduler',
				options?.preserveQuery && u.searchParams.get('id') === 'abc123' ? 200 : 500
			);
		if (u.pathname === '/') return response(url, home);
		return response(url, page('Not found', 'Not found'), 404);
	};
	const evidence = await collectSiteEvidence('https://q.example/', { fetcher });
	assert.deepEqual(evidence.brokenLinks, []);
	assert.deepEqual(
		evidence.pages[0]!.bookingLinks.map((b) => b.url),
		['https://sched.vendor.example/schedule/anon.do?id=abc123']
	);
	assert.ok(!fetched.some((u) => /utm_|gclid/.test(u)), 'tracking parameters are never sent');
});
