import { normalizeUrl } from '../security/url.js';
import { safeFetch } from '../security/fetch.js';
import { crawlWebsite } from '../audit/pages.js';
import { inspectBrowser } from '../providers/browser.js';
import { measurePerformance } from '../providers/performance.js';
import type { Report } from '../model.js';
import type { CollectOptions } from './collect.js';

export type RenderOptions = CollectOptions & { browserEnabled?: boolean };

/**
 * Rendered measurements for up to three pages: each at a 390px phone width, and the first
 * also at 360px and desktop width. Each page is fetched first so robots rules apply.
 */
export async function inspectRenderedPages(
	rawUrls: string[],
	options: RenderOptions = {}
): Promise<Report['browser']> {
	const urls = [...new Set(rawUrls.map((u) => normalizeUrl(u).href))].slice(0, 3);
	const fetcher = options.fetcher ?? safeFetch;
	const signal = AbortSignal.any([
		AbortSignal.timeout(options.budgetMs ?? 100_000),
		...(options.signal ? [options.signal] : [])
	]);
	const crawls = await Promise.all(
		urls.map((u) => crawlWebsite(u, fetcher, signal, 1, 0, { discover: false, sitemap: false }))
	);
	const pages = crawls.flatMap((c) => c.pages).filter((p) => p.status >= 200 && p.status < 300);
	const blocked = crawls.flatMap((c, i) =>
		c.pages.length ? [] : [`${urls[i]}: ${c.errors.join(' ')}`]
	);
	const [first, ...rest] = pages;
	const targets = first
		? [
				{ url: first.url, width: 360, height: 800 },
				{ url: first.url, width: 390, height: 844 },
				{ url: first.url, width: 1440, height: 900 },
				...rest.map((p) => ({ url: p.url, width: 390, height: 844 }))
			]
		: [];
	const result = await inspectBrowser(
		pages,
		fetcher,
		signal,
		options.browserEnabled ?? process.env.BROWSER_ENABLED !== 'false',
		targets
	);
	result.browser.errors.unshift(...blocked);
	return result.browser;
}

export async function measurePagePerformance(
	rawUrl: string,
	options: CollectOptions & { pagespeedEnabled?: boolean; pagespeedKey?: string } = {}
): Promise<Report['performance']> {
	const url = normalizeUrl(rawUrl).href;
	const signal = AbortSignal.any([
		AbortSignal.timeout(options.budgetMs ?? 110_000),
		...(options.signal ? [options.signal] : [])
	]);
	const { measurements } = await measurePerformance(
		url,
		options.fetcher ?? safeFetch,
		signal,
		options.pagespeedEnabled ?? process.env.PAGESPEED_ENABLED === 'true',
		options.pagespeedKey ?? process.env.PAGESPEED_API_KEY
	);
	return measurements;
}
