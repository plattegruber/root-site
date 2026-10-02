import * as cheerio from 'cheerio';
import { createRequire } from 'node:module';
import { evidence, type Evidence } from '../model.js';
import { normalizeUrl } from '../security/url.js';
import { safeError, type FetchResult, type SafeFetcher } from '../security/fetch.js';
const robotsParser = createRequire(import.meta.url)('robots-parser') as (
	url: string,
	body: string
) => { isAllowed: (url: string, agent: string) => boolean | undefined };

export type Link = {
	url: string;
	label: string;
	kind: 'internal' | 'external' | 'phone' | 'email' | 'booking' | 'maps';
};
export type Page = {
	url: string;
	status: number;
	fetchedAt: string;
	html: string;
	text: string;
	bytes: number;
	title: string;
	description: string;
	canonical: string;
	robots: string;
	headings: { level: number; text: string }[];
	links: Link[];
	images: { src: string; alt: string | undefined; width: number; height: number }[];
	forms: {
		action: string;
		method: string;
		fields: { label: string; type: string; name: string }[];
	}[];
	jsonLd: unknown[];
	jsonLdErrors: number;
	insecureResources: string[];
	scripts: string[];
	fonts: string[];
	blocking: string[];
	headers: Record<string, string>;
	excerpt: Evidence;
};
const tidy = (x: string) => x.replace(/\s+/g, ' ').trim();
export function parsePage(result: FetchResult): Page {
	const html = result.body.toString('utf8');
	const $ = cheerio.load(html);
	const jsonLd: unknown[] = [];
	let jsonLdErrors = 0;
	$('script[type="application/ld+json"]').each((_, n) => {
		try {
			jsonLd.push(JSON.parse($(n).text()));
		} catch {
			jsonLdErrors++;
		}
	});
	const scripts = $('script[src]')
		.map((_, n) => $(n).attr('src') ?? '')
		.get();
	const fonts = $('link[rel="preload"][as="font"],link[href*="fonts."]')
		.map((_, n) => $(n).attr('href') ?? '')
		.get();
	const blocking = $(
		'link[rel="stylesheet"],script[src]:not([async]):not([defer]):not([type="module"])'
	)
		.map((_, n) => $(n).attr('src') ?? $(n).attr('href') ?? '')
		.get();
	const insecureResources = $('script[src],img[src],link[href],iframe[src],video[src],source[src]')
		.map((_, n) => $(n).attr('src') ?? $(n).attr('href') ?? '')
		.get()
		.filter((x) => x.startsWith('http:'));
	$('script,style,noscript,template,[hidden],[aria-hidden="true"]').remove();
	const links: Link[] = [];
	$('a[href]').each((_, n) => {
		const raw = $(n).attr('href') ?? '';
		const label = tidy($(n).text() || $(n).attr('aria-label') || '');
		if (raw.startsWith('tel:')) {
			links.push({ url: raw, label, kind: 'phone' });
			return;
		}
		if (raw.startsWith('mailto:')) {
			links.push({ url: raw.split('?')[0]!, label, kind: 'email' });
			return;
		}
		try {
			const u = normalizeUrl(new URL(raw, result.url).href);
			const internal = u.origin === new URL(result.url).origin;
			const kind = /google\.com\/maps|maps\.app\.goo\.gl|maps\.google\.com/.test(u.href)
				? 'maps'
				: /book|schedul|appointment|reserve/i.test(label + ' ' + u.pathname)
					? 'booking'
					: internal
						? 'internal'
						: 'external';
			links.push({ url: u.href, label, kind });
		} catch {
			/* Non-web actions are outside the crawl. */
		}
	});
	const headings = $('h1,h2,h3,h4,h5,h6')
		.map((_, n) => ({ level: Number(n.tagName[1]), text: tidy($(n).text()) }))
		.get();
	const images = $('img')
		.map((_, n) => ({
			src: $(n).attr('src') ?? '',
			alt: $(n).attr('alt'),
			width: Number($(n).attr('width') ?? 0),
			height: Number($(n).attr('height') ?? 0)
		}))
		.get();
	const forms = $('form')
		.map((_, n) => ({
			action: $(n).attr('action') ?? result.url,
			method: $(n).attr('method') ?? 'get',
			fields: $(n)
				.find('input:not([type="hidden"]):not([type="submit"]),select,textarea')
				.map((_, f) => {
					const id = $(f).attr('id');
					const label = id
						? $('label')
								.filter((_, l) => $(l).attr('for') === id)
								.text()
						: '';
					return {
						label: tidy(
							label ||
								$(f).closest('label').text() ||
								$(f).attr('aria-label') ||
								($(f).attr('aria-labelledby') ?? '')
									.split(/\s+/)
									.map((x) => $(`[id="${x.replace(/[^\w-]/g, '')}"]`).text())
									.join(' ')
						),
						type: $(f).attr('type') ?? f.tagName,
						name: $(f).attr('name') ?? ''
					};
				})
				.get()
		}))
		.get();
	const text = tidy($('body').text()).slice(0, 70_000);
	const canonical = $('link[rel="canonical"]').attr('href') ?? '';
	return {
		url: result.url,
		status: result.status,
		fetchedAt: result.fetchedAt,
		html,
		text,
		bytes: result.body.length,
		title: tidy($('title').text()),
		description: $('meta[name="description"]').attr('content') ?? '',
		canonical,
		robots: [
			...$('meta[name="robots"],meta[name="googlebot"]')
				.map((_, n) => $(n).attr('content') ?? '')
				.get(),
			result.headers['x-robots-tag'] ?? ''
		]
			.join(',')
			.toLowerCase(),
		headings,
		links,
		images,
		forms,
		jsonLd,
		jsonLdErrors,
		insecureResources,
		scripts,
		fonts,
		blocking,
		headers: result.headers,
		excerpt: evidence(
			result.url,
			`HTTP ${result.status}; title: ${tidy($('title').text())}; headings: ${headings
				.slice(0, 8)
				.map((x) => x.text)
				.join(' | ')}`,
			'Public HTML inspection',
			result.fetchedAt
		)
	};
}
export type Crawl = {
	pages: Page[];
	errors: string[];
	robots: { url: string; status: number; body: string; observedAt: string } | undefined;
	sitemap: { url: string; status: number; locations: string[]; observedAt: string } | undefined;
	linkChecks: {
		from: string;
		url: string;
		status?: number;
		finalUrl?: string;
		error?: string;
		observedAt: string;
		label: string;
		kind: Link['kind'];
	}[];
	maxPages: number;
	maxLinks: number;
	robotsAllows: (url: string) => boolean | undefined;
};
const rank = (link: Link) =>
	/contact|emergency|new.patient|insurance|financ|dentist|about|team|services|implant|crown|invisalign|root.canal|location/i.test(
		link.url + ' ' + link.label
	)
		? 0
		: 1;
export async function crawlWebsite(
	raw: string,
	fetcher: SafeFetcher,
	signal: AbortSignal,
	maxPages = 8,
	maxLinks = 12
): Promise<Crawl> {
	const entry = normalizeUrl(raw);
	const output: Crawl = {
		pages: [],
		errors: [],
		robots: undefined,
		sitemap: undefined,
		linkChecks: [],
		maxPages,
		maxLinks,
		robotsAllows: () => undefined
	};
	const robotsUrl = new URL('/robots.txt', entry).href;
	try {
		const r = await fetcher(robotsUrl, { maxBytes: 256_000, signal });
		output.robots = {
			url: r.url,
			status: r.status,
			body: r.body.toString(),
			observedAt: r.fetchedAt
		};
		if (r.status === 200) {
			const rules = robotsParser(robotsUrl, r.body.toString());
			output.robotsAllows = (url) => rules.isAllowed(url, 'DentalWebsiteDoctor') ?? true;
		} else if (r.status === 404 || r.status === 410) output.robotsAllows = () => true;
		else
			output.errors.push(
				`robots.txt returned HTTP ${r.status}; crawling stopped because permission is uncertain.`
			);
	} catch (e) {
		output.errors.push(
			`robots.txt: ${safeError(e)}; crawling stopped because permission is uncertain.`
		);
	}
	if (output.robotsAllows(entry.href) !== true) {
		output.errors.push(
			'Homepage was not crawled: robots permission is unavailable or disallows this user agent.'
		);
		return output;
	}
	const pending = [entry.href];
	const seen = new Set<string>();
	let origin = entry.origin;
	while (
		pending.length &&
		output.pages.length < maxPages &&
		seen.size < maxPages + 3 &&
		!signal.aborted
	) {
		const url = pending.shift()!;
		if (seen.has(url) || output.robotsAllows(url) !== true) continue;
		seen.add(url);
		try {
			const r = await fetcher(url, { signal });
			if (output.pages.length === 0 && r.redirects.length) {
				const redirectedOrigin = new URL(r.url).origin;
				// A host redirect needs that host's own robots policy before content analysis.
				if (redirectedOrigin !== origin) {
					const rr = await fetcher(new URL('/robots.txt', r.url).href, {
						maxBytes: 256_000,
						signal
					});
					if (rr.status === 200) {
						const parser = robotsParser(rr.url, rr.body.toString());
						output.robotsAllows = (u) => parser.isAllowed(u, 'DentalWebsiteDoctor') ?? true;
					} else if (rr.status === 404 || rr.status === 410) output.robotsAllows = () => true;
					else throw new Error('redirect_robots');
					output.robots = {
						url: rr.url,
						status: rr.status,
						body: rr.body.toString(),
						observedAt: rr.fetchedAt
					};
					if (output.robotsAllows(r.url) !== true) throw new Error('redirect_robots');
					origin = redirectedOrigin;
				}
			}
			if (!/text\/html|application\/xhtml\+xml/i.test(r.headers['content-type'] ?? '')) {
				output.errors.push(`${url}: response is not HTML.`);
				continue;
			}
			const page = parsePage(r);
			output.pages.push(page);
			if (page.status >= 400) continue;
			for (const link of [...page.links].sort((a, b) => rank(a) - rank(b))) {
				if (
					['internal', 'booking'].includes(link.kind) &&
					new URL(link.url).origin === origin &&
					!/\.(pdf|jpe?g|png|gif|svg|zip|xml|mp4)$/i.test(new URL(link.url).pathname) &&
					!seen.has(link.url) &&
					!pending.includes(link.url)
				)
					pending.push(link.url);
			}
		} catch (e) {
			output.errors.push(`${url}: ${safeError(e)}`);
		}
	}
	try {
		const advertised = output.robots?.body.match(/^sitemap:\s*(https?:\/\/[^\s]+)/im)?.[1];
		const sitemapUrl = advertised ?? new URL('/sitemap.xml', origin).href;
		if (output.robotsAllows(sitemapUrl) === true) {
			const r = await fetcher(sitemapUrl, { maxBytes: 1_000_000, signal });
			const xml = cheerio.load(r.body.toString(), { xml: true });
			output.sitemap = {
				url: r.url,
				status: r.status,
				locations: xml('loc')
					.map((_, n) => xml(n).text())
					.get()
					.slice(0, 100),
				observedAt: r.fetchedAt
			};
		}
	} catch (e) {
		output.errors.push(`sitemap: ${safeError(e)}`);
	}
	const checked = new Set(output.pages.map((x) => x.url));
	const links = output.pages
		.flatMap((page) => page.links.map((link) => ({ from: page.url, ...link })))
		.filter((l) => ['internal', 'booking'].includes(l.kind) && !checked.has(l.url));
	const unique = links
		.filter((l) => {
			if (checked.has(l.url)) return false;
			checked.add(l.url);
			return true;
		})
		.sort((a, b) => Number(b.kind === 'booking') - Number(a.kind === 'booking'))
		.slice(0, maxLinks);
	for (let i = 0; i < unique.length; i += 4) {
		await Promise.all(
			unique.slice(i, i + 4).map(async (l) => {
				try {
					if (new URL(l.url).origin !== origin) {
						const robot = await fetcher(new URL('/robots.txt', l.url).href, {
							signal,
							maxBytes: 256_000
						});
						if (
							robot.status !== 404 &&
							robot.status !== 410 &&
							(robot.status !== 200 ||
								robotsParser(robot.url, robot.body.toString()).isAllowed(
									l.url,
									'DentalWebsiteDoctor'
								) === false)
						)
							throw new Error('robots');
					} else if (output.robotsAllows(l.url) !== true) throw new Error('robots');
					let r = await fetcher(l.url, { method: 'HEAD', maxBytes: 100_000, signal });
					if ([403, 405, 501].includes(r.status))
						r = await fetcher(l.url, { maxBytes: 1_000_000, signal });
					output.linkChecks.push({
						from: l.from,
						url: l.url,
						status: r.status,
						finalUrl: r.url,
						observedAt: r.fetchedAt,
						label: l.label,
						kind: l.kind
					});
				} catch (e) {
					output.linkChecks.push({
						from: l.from,
						url: l.url,
						error: safeError(e),
						observedAt: new Date().toISOString(),
						label: l.label,
						kind: l.kind
					});
				}
			})
		);
	}
	return output;
}

export function schemaNodes(value: unknown): Record<string, unknown>[] {
	if (Array.isArray(value)) return value.flatMap(schemaNodes);
	if (!value || typeof value !== 'object') return [];
	const node = value as Record<string, unknown>;
	return [
		node,
		...(Array.isArray(node['@graph']) ? (node['@graph'] as unknown[]).flatMap(schemaNodes) : [])
	];
}
