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
	kind: 'internal' | 'external' | 'phone' | 'email' | 'booking' | 'maps' | 'sms';
	/** True when the link sits inside <header> or a <nav> element. */
	inHeader: boolean;
};
export type FormField = {
	label: string;
	type: string;
	name: string;
	placeholder: string;
};
export type Page = {
	url: string;
	status: number;
	fetchedAt: string;
	html: string;
	/** Visible text of the whole document (header, main and footer). */
	text: string;
	/** Visible text excluding header, nav and footer regions; the page's own content. */
	mainText: string;
	/** Paragraph and list-item text with sentence punctuation preserved, for readability maths. */
	prose: string;
	headerText: string;
	footerText: string;
	wordCount: number;
	bytes: number;
	lang: string;
	viewport: string;
	title: string;
	description: string;
	og: Record<string, string>;
	canonical: string;
	robots: string;
	headings: { level: number; text: string }[];
	links: Link[];
	/** Visible text of <button> elements and link-styled calls to action. */
	buttons: string[];
	images: {
		src: string;
		alt: string | undefined;
		width: number;
		height: number;
		loading: string;
	}[];
	iframes: string[];
	forms: {
		action: string;
		method: string;
		fields: FormField[];
	}[];
	/** Hostnames of scripts, frames and stylesheets served from another origin. */
	thirdPartyHosts: string[];
	/** Years found next to a copyright symbol or the word copyright. */
	copyrightYears: number[];
	/** ISO-like dates from <time datetime> and article metadata. */
	dates: string[];
	jsonLd: unknown[];
	jsonLdErrors: number;
	insecureResources: string[];
	scripts: string[];
	inlineScriptText: string;
	fonts: string[];
	blocking: string[];
	headers: Record<string, string>;
	excerpt: Evidence;
};
const tidy = (x: string) => x.replace(/\s+/g, ' ').trim();
const hostOf = (value: string, base: string) => {
	try {
		return new URL(value, base).hostname.toLowerCase();
	} catch {
		return '';
	}
};
export function parsePage(result: FetchResult): Page {
	const html = result.body.toString('utf8');
	const $ = cheerio.load(html);
	const origin = new URL(result.url).origin;
	const originHost = new URL(result.url).hostname.toLowerCase().replace(/^www\./, '');
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
	const inlineScriptText = $('script:not([src])')
		.map((_, n) => $(n).text())
		.get()
		.join('\n')
		.slice(0, 200_000);
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
	const iframes = $('iframe[src]')
		.map((_, n) => $(n).attr('src') ?? '')
		.get();
	const thirdPartyHosts = [
		...new Set(
			[
				...scripts,
				...iframes,
				...$('link[rel="stylesheet"][href]')
					.map((_, n) => $(n).attr('href') ?? '')
					.get()
			]
				.map((src) => hostOf(src, result.url))
				.filter((h) => h && h.replace(/^www\./, '') !== originHost)
		)
	];
	const og: Record<string, string> = {};
	$('meta[property^="og:"],meta[name^="og:"],meta[property^="article:"]').each((_, n) => {
		const key = $(n).attr('property') ?? $(n).attr('name') ?? '';
		const content = $(n).attr('content');
		if (key && content && !og[key]) og[key] = content;
	});
	const dates = [
		...$('time[datetime]')
			.map((_, n) => $(n).attr('datetime') ?? '')
			.get(),
		...['article:published_time', 'article:modified_time'].map((k) => og[k] ?? '').filter(Boolean)
	].filter((d) => /^\d{4}-\d{2}/.test(d));
	const images = $('img')
		.map((_, n) => ({
			src: $(n).attr('src') ?? $(n).attr('data-src') ?? '',
			alt: $(n).attr('alt'),
			width: Number($(n).attr('width') ?? 0),
			height: Number($(n).attr('height') ?? 0),
			loading: $(n).attr('loading') ?? ''
		}))
		.get();
	const forms = $('form')
		.map((_, n) => ({
			action: $(n).attr('action') ?? result.url,
			method: ($(n).attr('method') ?? 'get').toLowerCase(),
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
						name: $(f).attr('name') ?? '',
						placeholder: tidy($(f).attr('placeholder') ?? '')
					};
				})
				.get()
		}))
		.get();
	$('script,style,noscript,template,[hidden],[aria-hidden="true"]').remove();
	const buttons = $('button,[role="button"],input[type="submit"]')
		.map((_, n) => tidy($(n).text() || $(n).attr('value') || $(n).attr('aria-label') || ''))
		.get()
		.filter(Boolean);
	const links: Link[] = [];
	$('a[href]').each((_, n) => {
		const raw = ($(n).attr('href') ?? '').trim();
		const label = tidy(
			$(n).text() ||
				$(n).attr('aria-label') ||
				$(n).attr('title') ||
				$(n).find('img').attr('alt') ||
				''
		);
		const inHeader = $(n).closest('header,nav,[role="banner"],[role="navigation"]').length > 0;
		if (raw.startsWith('tel:')) {
			links.push({ url: raw, label, kind: 'phone', inHeader });
			return;
		}
		if (raw.startsWith('sms:')) {
			links.push({ url: raw, label, kind: 'sms', inHeader });
			return;
		}
		if (raw.startsWith('mailto:')) {
			links.push({ url: raw.split('?')[0]!, label, kind: 'email', inHeader });
			return;
		}
		try {
			const u = normalizeUrl(new URL(raw, result.url).href);
			const internal = u.origin === origin;
			const kind = /google\.com\/maps|maps\.app\.goo\.gl|maps\.google\.com|goo\.gl\/maps/.test(
				u.href
			)
				? 'maps'
				: /book|schedul|appointment|reserve|request.?a.?visit/i.test(label + ' ' + u.pathname) ||
					  bookingVendor(u.hostname)
					? 'booking'
					: internal
						? 'internal'
						: 'external';
			links.push({ url: u.href, label, kind, inHeader });
		} catch {
			/* Non-web actions are outside the crawl. */
		}
	});
	const headings = $('h1,h2,h3,h4,h5,h6')
		.map((_, n) => ({ level: Number(n.tagName[1]), text: tidy($(n).text()) }))
		.get();
	const text = tidy($('body').text()).slice(0, 70_000);
	const headerText = tidy($('header,[role="banner"],nav,[role="navigation"]').text()).slice(
		0,
		5_000
	);
	const footerText = tidy($('footer,[role="contentinfo"]').text()).slice(0, 5_000);
	const mainClone = $('body').clone();
	mainClone
		.find('header,[role="banner"],nav,[role="navigation"],footer,[role="contentinfo"]')
		.remove();
	const mainText = tidy(mainClone.text()).slice(0, 70_000);
	const prose = mainClone
		.find('p,li,blockquote,dd')
		.map((_, n) => tidy($(n).text()))
		.get()
		.filter((t) => t.split(/\s+/).length > 3)
		.map((t) => (/[.!?]$/.test(t) ? t : `${t}.`))
		.join(' ')
		.slice(0, 70_000);
	const copyrightYears = [
		...new Set(
			[
				...(footerText || text).matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)
			].map((m) => Number(m[1]))
		)
	].filter((y) => y > 1990 && y < 2100);
	const canonical = $('link[rel="canonical"]').attr('href') ?? '';
	return {
		url: result.url,
		status: result.status,
		fetchedAt: result.fetchedAt,
		html,
		text,
		mainText,
		prose,
		headerText,
		footerText,
		wordCount: mainText ? mainText.split(/\s+/).length : 0,
		bytes: result.body.length,
		lang: ($('html').attr('lang') ?? '').toLowerCase(),
		viewport: $('meta[name="viewport"]').attr('content') ?? '',
		title: tidy($('title').first().text()),
		description: $('meta[name="description"]').attr('content') ?? '',
		og,
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
		buttons,
		images,
		iframes,
		forms,
		thirdPartyHosts,
		copyrightYears,
		dates,
		jsonLd,
		jsonLdErrors,
		insecureResources,
		scripts,
		inlineScriptText,
		fonts,
		blocking,
		headers: result.headers,
		excerpt: evidence(
			result.url,
			`HTTP ${result.status}; title: ${tidy($('title').first().text())}; headings: ${headings
				.slice(0, 8)
				.map((x) => x.text)
				.join(' | ')}`,
			'Public HTML inspection',
			result.fetchedAt
		)
	};
}
/** Online scheduling vendors common in US dentistry; a hostname match marks a link as booking. */
export function bookingVendor(hostname: string): string | undefined {
	const h = hostname.toLowerCase();
	const vendors: [RegExp, string][] = [
		[/nexhealth\.com$/, 'NexHealth'],
		[/localmed\.com$/, 'LocalMed'],
		[/flexdental\.com$|flex\.dental$/, 'Flex Dental'],
		[/zocdoc\.com$/, 'Zocdoc'],
		[/dentrixascend\.com$/, 'Dentrix Ascend'],
		[/opendental\.com$|patientviewer\.com$/, 'Open Dental Web Sched'],
		[/mydentalhub\.com$|lighthouse360\.com$/, 'Lighthouse 360'],
		[/getweave\.com$|weaveconnect\.com$/, 'Weave'],
		[/modento\.io$|dentalintel\.com$/, 'Modento'],
		[/yapiapp\.com$/, 'YAPI'],
		[/curvehero\.com$|curvedental\.com$/, 'Curve Dental'],
		[/carestack\.com$/, 'CareStack'],
		[/denticon\.com$/, 'Denticon'],
		[/doctible\.com$/, 'Doctible'],
		[/solutionreach\.com$/, 'Solutionreach'],
		[/revenuewell\.com$/, 'RevenueWell'],
		[/adit\.com$/, 'Adit'],
		[/jotform\.com$/, 'Jotform'],
		[/calendly\.com$/, 'Calendly'],
		[/acuityscheduling\.com$/, 'Acuity Scheduling'],
		[/mysocialpractice\.com$/, 'My Social Practice'],
		[/patientpop\.com$|tebra\.com$/, 'Tebra/PatientPop']
	];
	return vendors.find(([re]) => re.test(h))?.[1];
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
/** Pages a patient (and this audit) cares most about, in rough priority order. */
const priorityPatterns: RegExp[] = [
	/contact|location|directions|hours/i,
	/new.?patient|first.?visit|patient.?forms|forms|paperwork|what.to.expect/i,
	/emergenc|urgent|same.?day/i,
	/insurance|financ|payment|membership|savings.?plan|pricing|fees|cost/i,
	/about|team|meet|dentist|doctor|staff|our.?practice/i,
	/services|treatment|implant|crown|invisalign|root.?canal|whitening|veneer|denture|extraction|sedation|pediatric|kids|children|cleaning|hygiene|periodont/i,
	/review|testimonial|smile.?gallery|before.and.after/i,
	/faq|privacy|hipaa|accessib|blog|news/i
];
export function pageRank(url: string, label = ''): number {
	const haystack = `${url} ${label}`;
	const index = priorityPatterns.findIndex((re) => re.test(haystack));
	return index === -1 ? priorityPatterns.length : index;
}
async function readSitemap(
	url: string,
	fetcher: SafeFetcher,
	signal: AbortSignal
): Promise<Crawl['sitemap']> {
	const r = await fetcher(url, { maxBytes: 1_000_000, signal });
	const xml = cheerio.load(r.body.toString(), { xml: true });
	let locations = xml('url > loc')
		.map((_, n) => xml(n).text().trim())
		.get();
	const children = xml('sitemap > loc')
		.map((_, n) => xml(n).text().trim())
		.get();
	// One level of sitemap-index recursion covers most CMS defaults (WordPress, Wix, Squarespace).
	for (const child of children.slice(0, 4)) {
		if (signal.aborted) break;
		try {
			const c = await fetcher(child, { maxBytes: 1_000_000, signal });
			const cx = cheerio.load(c.body.toString(), { xml: true });
			locations.push(
				...cx('url > loc')
					.map((_, n) => cx(n).text().trim())
					.get()
			);
		} catch {
			/* A child sitemap that fails is simply not used for seeding. */
		}
	}
	locations = [...new Set(locations)].slice(0, 300);
	return { url: r.url, status: r.status, locations, observedAt: r.fetchedAt };
}
export async function crawlWebsite(
	raw: string,
	fetcher: SafeFetcher,
	signal: AbortSignal,
	maxPages = 12,
	maxLinks = 16
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
	const loadSitemap = async () => {
		try {
			const advertised = output.robots?.body.match(/^sitemap:\s*(https?:\/\/[^\s]+)/im)?.[1];
			const sitemapUrl = advertised ?? new URL('/sitemap.xml', origin).href;
			if (output.robotsAllows(sitemapUrl) === true)
				output.sitemap = await readSitemap(sitemapUrl, fetcher, signal);
		} catch (e) {
			output.errors.push(`sitemap: ${safeError(e)}`);
		}
	};
	const seedFromSitemap = () => {
		if (!output.sitemap || output.sitemap.status !== 200) return;
		const candidates = output.sitemap.locations
			.map((loc) => {
				try {
					return normalizeUrl(loc).href;
				} catch {
					return '';
				}
			})
			.filter(
				(u) =>
					u &&
					new URL(u).origin === origin &&
					!/\.(pdf|jpe?g|png|gif|svg|zip|xml|mp4|webp)$/i.test(new URL(u).pathname) &&
					pageRank(u) < priorityPatterns.length
			)
			.sort((a, b) => pageRank(a) - pageRank(b));
		for (const u of candidates.slice(0, maxPages - 1))
			if (!seen.has(u) && !pending.includes(u)) pending.push(u);
	};
	while (
		pending.length &&
		output.pages.length < maxPages &&
		seen.size < maxPages + 6 &&
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
			if (output.pages.length === 1) {
				// The sitemap is read after the homepage so the final origin is known; its
				// high-value URLs are queued ahead of whatever the homepage happens to link.
				await loadSitemap();
				seedFromSitemap();
			}
			if (page.status >= 400) continue;
			const discovered = [...page.links]
				.filter(
					(link) =>
						['internal', 'booking'].includes(link.kind) &&
						new URL(link.url).origin === origin &&
						!/\.(pdf|jpe?g|png|gif|svg|zip|xml|mp4|webp)$/i.test(new URL(link.url).pathname) &&
						!seen.has(link.url) &&
						!pending.includes(link.url)
				)
				.sort((a, b) => pageRank(a.url, a.label) - pageRank(b.url, b.label));
			for (const link of discovered) pending.push(link.url);
			// Keep the queue ordered by patient value, not discovery order.
			pending.sort((a, b) => pageRank(a) - pageRank(b));
		} catch (e) {
			output.errors.push(`${url}: ${safeError(e)}`);
		}
	}
	if (!output.sitemap && !output.errors.some((e) => e.startsWith('sitemap:'))) await loadSitemap();
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
		.sort(
			(a, b) =>
				Number(b.kind === 'booking') - Number(a.kind === 'booking') ||
				pageRank(a.url, a.label) - pageRank(b.url, b.label)
		)
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
/** True when a JSON-LD node describes the practice itself (not an article or breadcrumb). */
export function isPracticeNode(node: Record<string, unknown>): boolean {
	return [node['@type']]
		.flat()
		.some((t) =>
			[
				'Dentist',
				'DentalClinic',
				'MedicalClinic',
				'LocalBusiness',
				'MedicalBusiness',
				'HealthAndBeautyBusiness',
				'Organization'
			].includes(String(t))
		);
}
/** Pages whose URL, title or headings match a topic; the usual way checks find a page. */
export function pagesAbout(pages: Page[], pattern: RegExp): Page[] {
	return pages.filter((p) =>
		pattern.test(`${new URL(p.url).pathname} ${p.title} ${p.headings.map((h) => h.text).join(' ')}`)
	);
}
/** Sitemap URLs that look like they cover a topic the crawl did not fetch. */
export function sitemapHints(crawl: Crawl, pattern: RegExp): string[] {
	const fetched = new Set(crawl.pages.map((p) => p.url));
	return (crawl.sitemap?.locations ?? [])
		.filter((loc) =>
			pattern.test(new URL(loc, crawl.pages[0]?.url ?? 'https://example.invalid').pathname)
		)
		.filter((loc) => {
			try {
				return !fetched.has(normalizeUrl(loc).href);
			} catch {
				return false;
			}
		})
		.slice(0, 3);
}
