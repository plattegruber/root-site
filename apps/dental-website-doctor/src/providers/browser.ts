import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { evidence, finding, type Report, type Finding } from '../model.js';
import { safeError, type SafeFetcher } from '../security/fetch.js';
import type { Page } from '../audit/pages.js';

const axeSource = readFileSync(
	createRequire(import.meta.url).resolve('axe-core/axe.min.js'),
	'utf8'
);
// Browser errors never carry provider credentials, so the error class and first line are
// safe to keep; a generic "provider failed" hides exactly the detail a developer needs.
function describeBrowserError(e: unknown): string {
	if (e instanceof Error && /Timeout/.test(e.name)) return 'browser timeout';
	if (e instanceof Error) {
		const firstLine = e.message.split('\n')[0] ?? '';
		return `${e.name}: ${firstLine.slice(0, 200)}`;
	}
	return safeError(e);
}
export type BrowserResult = {
	browser: Report['browser'];
	findings: Finding[];
	performance: Report['performance'];
};
export async function inspectBrowser(
	pages: Page[],
	fetcher: SafeFetcher,
	signal: AbortSignal,
	enabled: boolean
): Promise<BrowserResult> {
	const browser: Report['browser'] = {
		status: 'not_tested',
		conditions:
			'Fresh headless Chromium context; anonymous public pages; scripts enabled, GET/HEAD requests only, no cookies forwarded, no forms submitted. Viewports: 360×800, 390×844, 1440×900. Browser timings are synthetic observations without CPU/network throttling. All page requests go through the bounded DNS-pinned fetcher.',
		views: [],
		errors: []
	};
	const result: BrowserResult = { browser, findings: [], performance: [] };
	const home = pages.find((p) => p.status >= 200 && p.status < 300);
	if (!enabled || !home) {
		browser.errors.push(
			!enabled
				? 'Browser inspection disabled by configuration.'
				: 'No usable public page was fetched.'
		);
		return result;
	}
	let instance: Awaited<ReturnType<typeof chromium.launch>> | undefined;
	try {
		instance = await chromium.launch({
			headless: true,
			executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
			proxy: { server: 'http://127.0.0.1:9' },
			args: [
				'--disable-dev-shm-usage',
				'--disable-background-networking',
				'--disable-quic',
				'--force-webrtc-ip-handling-policy=disable_non_proxied_udp'
			]
		});
		const context = await instance.newContext({ serviceWorkers: 'block', acceptDownloads: false });
		// tsx/esbuild (keepNames) rewrites the functions passed to page.evaluate so that they
		// call a `__name` helper. That helper exists only in the Node bundle, so without this
		// shim every rendered check fails with "__name is not defined" under `pnpm dev`/tests.
		await context.addInitScript('globalThis.__name = globalThis.__name || ((fn) => fn);');
		await context.routeWebSocket(/.*/, (ws) => ws.close());
		let totalRequests = 0;
		let totalBytes = 0;
		await context.route('**/*', async (route) => {
			const request = route.request();
			if (
				signal.aborted ||
				++totalRequests > 160 ||
				totalBytes > 25_000_000 ||
				!['GET', 'HEAD'].includes(request.method())
			) {
				await route.abort().catch(() => {});
				return;
			}
			try {
				const r = await fetcher(request.url(), {
					maxBytes: 4_000_000,
					timeoutMs: 8_000,
					signal,
					preserveQuery: true
				});
				totalBytes += r.body.length;
				if (r.status >= 300 && r.status < 400) {
					await route.abort();
					return;
				}
				await route.fulfill({
					status: r.status,
					headers: {
						'content-type': r.headers['content-type'] ?? 'application/octet-stream',
						'cache-control': 'no-store'
					},
					body: r.body
				});
			} catch {
				await route.abort().catch(() => {});
			}
		});
		const specs = [
			{ url: home.url, width: 360, height: 800 },
			{ url: home.url, width: 390, height: 844 },
			{ url: home.url, width: 1440, height: 900 }
		];
		const contact = pages.find((p) => p !== home && /contact|appointment|new.patient/i.test(p.url));
		const service = pages.find(
			(p) => p !== home && p !== contact && /implant|crown|service|emergency/i.test(p.url)
		);
		if (contact) specs.push({ url: contact.url, width: 390, height: 844 });
		if (service) specs.push({ url: service.url, width: 390, height: 844 });
		for (const spec of specs) {
			if (signal.aborted) break;
			const tab = await context.newPage();
			await tab.setViewportSize({ width: spec.width, height: spec.height });
			const started = Date.now();
			try {
				await tab.goto(spec.url, { waitUntil: 'domcontentloaded', timeout: 18_000 });
				await tab.evaluate(() =>
					Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 700))])
				);
				await tab.addScriptTag({ content: axeSource });
				const data = await tab.evaluate(async () => {
					const shown = (el: Element) => {
						const rect = el.getBoundingClientRect();
						return (
							rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== 'hidden'
						);
					};
					const controls = Array.from(
						document.querySelectorAll(
							'a[href],button,input:not([type="hidden"]),select,textarea,[role="button"]'
						)
					).filter(shown);
					const small = controls.filter((el) => {
						const r = el.getBoundingClientRect();
						return r.width < 24 || r.height < 24;
					}).length;
					const images = Array.from(document.images)
						.filter(
							(img) => img.naturalWidth > Math.max(img.clientWidth * 2, 1200) && img.clientWidth > 0
						)
						.map((img) => img.currentSrc);
					const axe = (
						window as unknown as {
							axe: {
								run: (
									root: Document,
									options: unknown
								) => Promise<{
									violations: {
										id: string;
										impact: string;
										help: string;
										nodes: { target: string[] }[];
									}[];
								}>;
							};
						}
					).axe;
					const scan = await axe.run(document, {
						runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
					});
					const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
					const navigation = performance.getEntriesByType('navigation')[0] as
						| PerformanceNavigationTiming
						| undefined;
					const inFirstViewport = (el: Element) => {
						const r = el.getBoundingClientRect();
						const style = getComputedStyle(el);
						return (
							r.width > 0 &&
							r.height > 0 &&
							r.bottom > 0 &&
							r.top < innerHeight &&
							style.visibility !== 'hidden' &&
							style.opacity !== '0'
						);
					};
					const isSticky = (el: Element) => {
						let node: Element | null = el;
						while (node && node !== document.body) {
							const pos = getComputedStyle(node).position;
							if (pos === 'fixed' || pos === 'sticky') return true;
							node = node.parentElement;
						}
						return false;
					};
					const callLinks = Array.from(document.querySelectorAll('a[href^="tel:"]'));
					const bookLinks = Array.from(document.querySelectorAll('a[href],button')).filter((el) =>
						/book|schedule|appointment|request a visit/i.test(
							`${el.textContent ?? ''} ${el.getAttribute('aria-label') ?? ''} ${el.getAttribute('href') ?? ''}`
						)
					);
					return {
						callAboveFold: callLinks.some(inFirstViewport),
						bookAboveFold: bookLinks.some(inFirstViewport),
						stickyActions: [...callLinks, ...bookLinks].some(
							(el) => inFirstViewport(el) && isSticky(el)
						),
						horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 2,
						smallTapTargets: small,
						axeViolations: scan.violations.map((v) => ({
							id: v.id,
							impact: v.impact ?? 'unknown',
							count: v.nodes.length,
							help: v.help,
							selectors: v.nodes.slice(0, 5).flatMap((n) => n.target.map(String))
						})),
						formCount: document.forms.length,
						phoneLinks: Array.from(document.querySelectorAll('a[href^="tel:"]')).map(
							(a) => a.getAttribute('href') ?? ''
						),
						navigationLinks: document.querySelectorAll('nav a[href],[role="navigation"] a[href]')
							.length,
						resourceBytes: resources.reduce((n, r) => n + r.transferSize, 0),
						oversizedImages: images.slice(0, 10),
						renderBlocking: document.querySelectorAll(
							'link[rel="stylesheet"],script[src]:not([async]):not([defer]):not([type="module"])'
						).length,
						scriptCount: document.scripts.length,
						fontCount: resources.filter((r) => /\.(woff2?|ttf|otf)(\?|$)/i.test(r.name)).length,
						tabbable: controls.length,
						navigation: navigation
							? {
									domContentLoadedMs: navigation.domContentLoadedEventEnd,
									responseStartMs: navigation.responseStart
								}
							: ({} as Record<string, number>)
					};
				});
				const focusSeen = new Set<string>();
				let invisibleFocus = 0;
				let repeatCount = 0;
				for (let i = 0; i < Math.min(data.tabbable + 2, 24); i++) {
					await tab.keyboard.press('Tab');
					const focused = await tab.evaluate(() => {
						const el = document.activeElement;
						if (!el || el === document.body) return null;
						const style = getComputedStyle(el);
						const r = el.getBoundingClientRect();
						return {
							key: [
								el.tagName,
								el.id,
								el.getAttribute('href'),
								el.getAttribute('name'),
								Array.from(document.querySelectorAll('*')).indexOf(el)
							].join('|'),
							invisible:
								r.width === 0 ||
								r.height === 0 ||
								style.visibility === 'hidden' ||
								style.display === 'none',
							indicator:
								(style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) ||
								style.boxShadow !== 'none'
						};
					});
					if (focused) {
						if (focusSeen.has(focused.key)) repeatCount++;
						focusSeen.add(focused.key);
						if (focused.invisible || !focused.indicator) invisibleFocus++;
					}
				}
				browser.views.push({
					url: spec.url,
					width: spec.width,
					height: spec.height,
					measuredAt: new Date().toISOString(),
					...data,
					keyboard: {
						tabbable: data.tabbable,
						reached: focusSeen.size,
						invisibleFocus,
						trapSuspected: data.tabbable > 1 && repeatCount > 3 && focusSeen.size < 2
					}
				});
				if (spec.url === home.url && spec.width !== 360)
					result.performance.push({
						device: spec.width < 800 ? 'mobile' : 'desktop',
						source: 'browser_navigation',
						status: 'completed',
						measuredAt: new Date().toISOString(),
						url: spec.url,
						conditions: `Chromium ${instance.version()}, ${spec.width}×${spec.height}, no throttling, safe-fetch interception, elapsed ${Date.now() - started} ms including accessibility scan.`,
						lab: { metrics: data.navigation },
						limitation:
							'Synthetic browser navigation timings only. Intercepted resources and the audit network affect timings. This is neither Lighthouse nor real-user Core Web Vitals.'
					});
			} catch (e) {
				browser.errors.push(`${spec.url} at ${spec.width}px: ${describeBrowserError(e)}`);
			} finally {
				await tab.close();
			}
		}
		await context.close();
		browser.status = browser.views.length
			? browser.errors.length || signal.aborted
				? 'partial'
				: 'completed'
			: 'failed';
	} catch (e) {
		browser.status = 'not_tested';
		browser.errors.push(
			`Chromium could not launch (${describeBrowserError(e)}). Install with pnpm exec playwright install chromium (Linux dependencies may also be required).`
		);
	} finally {
		await instance?.close();
	}
	const checked = browser.views;
	const check = (
		id: string,
		title: string,
		bad: typeof checked,
		description: (v: (typeof checked)[number]) => string,
		impact: string,
		fix: string,
		effort: string
	) =>
		result.findings.push(
			finding(
				id,
				'technical',
				title,
				checked.length ? (bad.length ? 'failed' : 'passed') : 'not_tested',
				{
					evidence: (bad.length ? bad : checked.slice(0, 1)).map((v) =>
						evidence(
							v.url,
							`${v.width}×${v.height}: ${description(v)}`,
							'Guarded Chromium inspection',
							v.measuredAt
						)
					),
					impact,
					fix,
					effort: bad.length ? effort : 'No defect established in tested views',
					severity: bad.length ? 'moderate' : 'info'
				}
			)
		);
	check(
		'browser-layout',
		'Rendered mobile layouts',
		checked.filter((v) => v.horizontalOverflow),
		(v) => `Horizontal overflow ${v.horizontalOverflow}.`,
		'Sideways scrolling can hide important text or appointment actions.',
		'Fix fixed-width components and responsive spacing; retest at 360px and 390px.',
		'2–6 hours: responsive template diagnosis'
	);
	const mobileViews = checked.filter((v) => v.width < 800);
	if (mobileViews.length)
		result.findings.push(
			finding(
				'browser-mobile-actions',
				'experience',
				'Call and book buttons visible on a phone without scrolling',
				mobileViews.some((v) => v.callAboveFold || v.bookAboveFold) ? 'passed' : 'failed',
				{
					scope: 'dental',
					section: 'contact',
					priority: mobileViews.some((v) => v.callAboveFold || v.bookAboveFold)
						? 'none'
						: 'improvement',
					severity: mobileViews.some((v) => v.callAboveFold || v.bookAboveFold)
						? 'info'
						: 'moderate',
					evidence: mobileViews.map((v) =>
						evidence(
							v.url,
							`${v.width}×${v.height}: tel: link in first viewport ${v.callAboveFold}; book/schedule control in first viewport ${v.bookAboveFold}; sticky/fixed action bar ${v.stickyActions}.`,
							'Guarded Chromium inspection',
							v.measuredAt
						)
					),
					impact:
						'On a phone, the first screen is the whole site for most visitors. If “call” and “book” are not on it, the patient has to open a menu or scroll to the footer, and a share of them will not.',
					fix: 'Keep a tappable phone number and a “Book” button in the mobile header, or add a fixed bottom bar with Call / Book / Directions.',
					effort: '1–3 hours: mobile header or sticky bar'
				}
			)
		);
	check(
		'browser-taps',
		'Tap-target geometry',
		checked.filter((v) => v.smallTapTargets > 0),
		(v) =>
			`${v.smallTapTargets} visible controls smaller than 24 CSS px on at least one axis. Spacing exceptions and inline links need manual review.`,
		'Crowded small controls are harder to tap accurately.',
		'Increase primary navigation/action hit areas and spacing; review applicable WCAG exceptions.',
		'1–4 hours: mobile hit-area and spacing changes'
	);
	check(
		'browser-axe',
		'Automated accessibility fundamentals',
		checked.filter((v) => v.axeViolations.length > 0),
		(v) =>
			v.axeViolations
				.map(
					(x) => `${x.id}: ${x.count} (${x.impact}); ${x.help}; selectors ${x.selectors.join(', ')}`
				)
				.join('; ') || 'No automated WCAG A/AA violations found by axe.',
		'Observed label, contrast or structure defects can prevent patients from using the website.',
		'Resolve the listed axe issues with a visual and assistive-technology review; an automated pass is not a certification.',
		'2–8 hours initially; scope depends on affected templates'
	);
	check(
		'browser-keyboard',
		'Keyboard and focus sample',
		checked.filter((v) => v.keyboard.invisibleFocus > 0 || v.keyboard.trapSuspected),
		(v) =>
			`${v.keyboard.reached} unique elements reached in up to 24 Tab presses; ${v.keyboard.invisibleFocus} instances lacked a default outline/box-shadow indicator or were invisible; suspected trap ${v.keyboard.trapSuspected}. Custom focus indicators and complex dialogs require manual testing.`,
		'Keyboard users need a visible, understandable path to contact and appointment controls.',
		'Review every primary journey with Tab/Shift+Tab, open/close mobile navigation, check dialogs and custom focus states. Fix any confirmed trap or missing focus indicator.',
		'2–5 hours: keyboard and focus verification'
	);
	check(
		'browser-images',
		'Rendered image sizing',
		checked.filter((v) => v.oversizedImages.length > 0),
		(v) =>
			`${v.oversizedImages.length} images have natural widths over twice rendered width and over 1200px: ${v.oversizedImages.join(', ')}`,
		'Unnecessarily large images can delay the mobile first impression.',
		'Confirm encoded file sizes in a performance trace; provide responsive srcset/sizes, modern compression, and appropriate loading priorities.',
		'2–4 hours: image pipeline and template update'
	);
	return result;
}
