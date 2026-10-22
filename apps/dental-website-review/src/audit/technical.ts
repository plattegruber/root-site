import { evidence, finding, type Finding, type Report } from '../model.js';
import type { Crawl, Page } from './pages.js';
import { isPracticeNode, schemaNodes } from './pages.js';

export function technicalChecks(crawl: Crawl, practice: Report['practice']): Finding[] {
	// Content checks run on pages that actually rendered; error pages are reported once below.
	const pages = crawl.pages.filter((p) => p.status < 400);
	const allPages = crawl.pages;
	const out: Finding[] = [];
	const pageCheck = (
		id: string,
		title: string,
		bad: Page[],
		detail: (p: Page) => string,
		impact: string,
		fix: string,
		effort: string,
		severity: Finding['severity'] = 'moderate'
	) => {
		out.push(
			finding(
				id,
				'technical',
				title,
				!pages.length ? 'not_tested' : bad.length ? 'failed' : 'passed',
				{
					severity: bad.length ? severity : 'info',
					priority: bad.length
						? severity === 'high'
							? 'urgent'
							: severity === 'low'
								? 'polish'
								: 'improvement'
						: 'none',
					evidence: (bad.length ? bad : pages.slice(0, 1)).map((p) =>
						evidence(p.url, detail(p), 'Public HTML/HTTP inspection', p.fetchedAt)
					),
					impact,
					fix,
					effort: bad.length ? effort : 'No change required'
				}
			)
		);
	};
	pageCheck(
		'tech-status',
		'Page status codes',
		allPages.filter((p) => p.status >= 400),
		(p) => `HTTP ${p.status}.`,
		'A failed public page prevents visitors and crawlers from reaching its content.',
		'Repair or redirect the failing page to a relevant destination; update incoming links.',
		'1–4 hours: routing or server diagnosis',
		'moderate'
	);
	pageCheck(
		'tech-https',
		'HTTPS on fetched pages',
		pages.filter((p) => !p.url.startsWith('https:')),
		(p) => `Final page URL: ${p.url}. Certificate verification is enabled on HTTPS requests.`,
		'An unencrypted page undermines trust and can expose data entered on the website.',
		'Enable a valid HTTPS certificate and redirect HTTP to HTTPS before offering forms.',
		'2–4 hours: certificate, redirects, mixed-resource review',
		'high'
	);
	pageCheck(
		'tech-mixed',
		'Insecure resource references',
		pages.filter((p) => p.url.startsWith('https:') && p.insecureResources.length > 0),
		(p) =>
			`${p.insecureResources.length} HTTP resource references: ${p.insecureResources.slice(0, 5).join(', ')}. Browser blocking depends on resource type.`,
		'Mixed resources can be blocked or loaded insecurely, affecting appearance and trust.',
		'Serve referenced images, scripts, styles and frames over HTTPS; retest the rendered pages.',
		'1–3 hours: asset and embed updates'
	);
	pageCheck(
		'tech-titles',
		'Page titles',
		pages.filter((p) => !p.title || pages.some((q) => q !== p && q.title === p.title)),
		(p) =>
			`Title: ${p.title || '(empty)'}. Duplicate titles are compared only within fetched pages.`,
		'A missing or repeated title makes search results and browser tabs harder to understand.',
		'Write one descriptive title per page that reflects its purpose and verified office facts.',
		'1–2 hours: title map and CMS update'
	);
	pageCheck(
		'tech-descriptions',
		'Search descriptions',
		pages.filter(
			(p) => !p.description || pages.some((q) => q !== p && q.description === p.description)
		),
		(p) =>
			`Description: ${p.description || '(empty)'}. Search engines may choose different snippets.`,
		'Poor descriptions miss a chance to explain the page’s relevance to a visitor.',
		'Write specific, accurate descriptions for important pages; avoid clinical promises.',
		'1–2 hours: copy and metadata update',
		'low'
	);
	pageCheck(
		'tech-headings',
		'Heading structure',
		pages.filter(
			(p) =>
				p.headings.filter((h) => h.level === 1).length !== 1 ||
				p.headings.some((h, i) => i > 0 && h.level > p.headings[i - 1]!.level + 1)
		),
		(p) =>
			`Heading levels: ${p.headings
				.map((h) => `H${h.level} ${h.text}`)
				.slice(0, 12)
				.join(
					' | '
				)}. More than one H1 is a review signal, not automatically an accessibility failure.`,
		'An unclear heading outline makes key information harder to scan and navigate.',
		'Use a clear primary page heading and logical subsections; confirm the rendered accessibility tree.',
		'1–3 hours: template outline changes',
		'low'
	);
	pageCheck(
		'tech-canonical',
		'Canonical URLs',
		pages.filter((p) => !p.canonical || !validCanonical(p)),
		(p) => `Canonical: ${p.canonical || '(not declared)'}.`,
		'Canonical hints can be ambiguous or invalid, especially with duplicate URL variants.',
		'Set valid canonical URLs reflecting the intended indexable page, then verify redirects and sitemap URLs.',
		'1–3 hours: CMS canonical and URL mapping',
		'low'
	);
	pageCheck(
		'tech-indexability',
		'HTML indexability signals',
		pages.filter((p) => /noindex|none/.test(p.robots)),
		(p) =>
			`Robots/X-Robots-Tag: ${p.robots || '(none observed)'}. This checks directives, not actual Google indexing.`,
		'A noindex directive can prevent an important public page from appearing in search.',
		'Confirm the page should be public; remove unintended noindex directives and verify using owner-authorized Search Console.',
		'1–3 hours: directive review and validation'
	);
	const robot = crawl.robots;
	out.push(
		finding(
			'tech-robots',
			'technical',
			'robots.txt crawl policy',
			robot
				? robot.status === 200
					? 'passed'
					: [404, 410].includes(robot.status)
						? 'passed'
						: 'not_tested'
				: 'not_tested',
			{
				evidence: robot
					? [
							evidence(
								robot.url,
								`HTTP ${robot.status}; ${robot.body.slice(0, 600)}; homepage crawl allowed: ${crawl.robotsAllows(practice.websiteUrl) ?? 'unknown'}.`,
								'Robots policy request',
								robot.observedAt
							)
						]
					: [],
				impact: 'Crawl permissions affect what this tool and compliant crawlers can inspect.',
				fix: 'Review intended public crawl permissions; no robots file is required for an unrestricted public site.',
				effort: '30–60 minutes if permissions need adjustment'
			}
		)
	);
	const sitemap = crawl.sitemap;
	out.push(
		finding(
			'tech-sitemap',
			'technical',
			'Sitemap discovery',
			sitemap?.status === 200 && sitemap.locations.length
				? 'passed'
				: sitemap?.status === 404
					? 'needs_confirmation'
					: 'not_tested',
			{
				evidence: sitemap
					? [
							evidence(
								sitemap.url,
								`HTTP ${sitemap.status}; ${sitemap.locations.length} URL or child-sitemap entries found. Child sitemap recursion is outside V0.`,
								'Bounded XML sitemap inspection',
								sitemap.observedAt
							)
						]
					: [],
				impact:
					'A usable sitemap helps crawlers discover the intended pages but does not guarantee indexing.',
				fix: 'Confirm the canonical sitemap is advertised in robots.txt and contains public canonical URLs. A sitemap at another path may already exist.',
				effort: '1–2 hours: CMS sitemap configuration'
			}
		)
	);
	// Broken booking links are reported by the appointment finding; do not count them twice.
	const broken = crawl.linkChecks.filter(
		(l) => l.status && l.status >= 400 && l.kind !== 'booking'
	);
	const unknown = crawl.linkChecks.filter((l) => l.error);
	out.push(
		finding(
			'tech-links',
			'technical',
			'Bounded broken-link check',
			broken.length
				? 'failed'
				: unknown.length
					? 'needs_confirmation'
					: pages.length
						? 'passed'
						: 'not_tested',
			{
				priority: broken.length ? 'improvement' : 'none',
				severity: broken.length ? 'moderate' : 'info',
				evidence: broken.length
					? broken.map((l) =>
							evidence(
								l.from,
								`${l.url} (${l.label}) returned HTTP ${l.status}.`,
								'HTTP destination check',
								l.observedAt
							)
						)
					: pages.length
						? [
								evidence(
									pages[0]!.url,
									`${crawl.linkChecks.length} additional unique internal/booking links checked; ${unknown.length} could not be completed. Fetched page status codes are checked separately.`
								)
							]
						: [],
				impact: 'Broken links interrupt service research and contact journeys.',
				fix: 'Replace broken destinations with useful equivalent pages; manually check any destinations that blocked requests.',
				effort: broken.length
					? '1–3 hours: link updates and regression check'
					: 'No repair established'
			}
		)
	);
	pageCheck(
		'tech-alt',
		'Image alternative text',
		pages.filter((p) => p.images.some((i) => i.alt === undefined)),
		(p) =>
			`${p.images.filter((i) => i.alt === undefined).length} of ${p.images.length} images lack an alt attribute. Empty alt can be appropriate for decoration; meaning is not certified.`,
		'People using screen readers may miss information carried by meaningful images.',
		'Add useful alt text to informative images; use empty alt for purely decorative images after a visual review.',
		'1–3 hours: image purpose and text review'
	);
	pageCheck(
		'tech-labels',
		'Form labels',
		pages.filter((p) =>
			p.forms.some((f) => f.fields.some((x) => !x.label && !['button', 'reset'].includes(x.type)))
		),
		(p) =>
			`${p.forms.flatMap((f) => f.fields).filter((f) => !f.label).length} fields lack an associated visible or ARIA label in static HTML. Dynamic form labels are checked in the browser.`,
		'Unlabeled controls are harder to use with assistive technology and can increase form errors.',
		'Associate every input with an accessible label and specific error/help text; verify keyboard operation.',
		'2–5 hours: form template and accessibility review'
	);
	pageCheck(
		'tech-scripts',
		'Script and render-blocking review',
		pages.filter((p) => p.scripts.length > 15 || p.blocking.length > 12),
		(p) =>
			`${p.scripts.length} external scripts, ${p.blocking.length} potentially blocking stylesheet/script references, ${p.fonts.length} font link/preload references. These counts do not establish whether a script is unnecessary.`,
		'Large dependency chains can delay useful content, particularly on mobile networks.',
		'Use the performance trace and a tag inventory to establish owners and necessity; defer nonessential scripts and load critical styles/fonts efficiently.',
		'4–8 hours: measurement, dependency review, staged retest',
		'low'
	);
	const invalid = pages.filter((p) => p.jsonLdErrors);
	const invisible = pages.flatMap((p) =>
		p.jsonLd
			.flatMap(schemaNodes)
			.filter(
				(n) =>
					isPracticeNode(n) &&
					typeof n.name === 'string' &&
					!p.text.toLowerCase().includes(n.name.toLowerCase())
			)
			.map((n) => ({ page: p, name: String(n.name) }))
	);
	if (invalid.length || invisible.length)
		out.push(
			finding(
				'tech-schema',
				'technical',
				'Structured data that is broken or contradicts the page',
				'failed',
				{
					scope: 'general',
					priority: 'improvement',
					severity: 'moderate',
					evidence: [
						...invalid.map((p) =>
							evidence(
								p.url,
								`${p.jsonLdErrors} malformed JSON-LD blocks (parse error).`,
								'JSON-LD parser',
								p.fetchedAt
							)
						),
						...invisible.map(({ page, name }) =>
							evidence(
								page.url,
								`Schema names the business “${name}” but that name does not appear in the visible page text.`,
								'JSON-LD/visible text comparison',
								page.fetchedAt
							)
						)
					],
					impact:
						'Broken structured data is ignored; structured data that contradicts the visible page is treated as spam. Either way Google trusts the site less.',
					fix: 'Fix the JSON syntax (validate with the Rich Results Test) and make the schema name identical to the visible business name.',
					effort: '30–90 minutes'
				}
			)
		);
	const noViewport = pages.filter((p) => !/width=device-width/i.test(p.viewport));
	pageCheck(
		'tech-viewport',
		'Mobile viewport declaration',
		noViewport,
		(p) => `meta viewport: ${p.viewport || '(missing)'}.`,
		'Without a viewport meta tag, phones render the desktop layout shrunk to fit; text becomes unreadable and buttons untappable. Most dental traffic is mobile.',
		'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the document head template.',
		'15 minutes',
		noViewport.includes(pages[0]!) ? 'high' : 'moderate'
	);
	pageCheck(
		'tech-lang',
		'Document language attribute',
		pages.filter((p) => !p.lang),
		() => 'The <html> element has no lang attribute.',
		'Screen readers pick a voice from the lang attribute; without it, English copy can be read with the wrong pronunciation rules. It is also a WCAG requirement.',
		'Add lang="en" (or the page language) to the <html> element in the template.',
		'15 minutes',
		'low'
	);
	const year = new Date().getUTCFullYear();
	const stale = pages.filter(
		(p) => p.copyrightYears.length && Math.max(...p.copyrightYears) < year - 1
	);
	if (pages.some((p) => p.copyrightYears.length))
		out.push(
			finding(
				'tech-copyright',
				'technical',
				'Footer copyright year',
				stale.length ? 'failed' : 'passed',
				{
					scope: 'general',
					priority: stale.length ? 'polish' : 'none',
					severity: stale.length ? 'low' : 'info',
					evidence: (stale.length ? stale : pages)
						.slice(0, 1)
						.map((p) =>
							evidence(
								p.url,
								`Footer copyright year(s): ${p.copyrightYears.join(', ')}; current year ${year}.`,
								'Footer text',
								p.fetchedAt
							)
						),
					impact: stale.length
						? 'A footer that says © two years ago is the quickest way to make a visitor wonder whether the office is still open. It is also the most common defect on dental websites.'
						: 'The footer year is current.',
					fix: stale.length
						? 'Output the year dynamically in the footer template.'
						: 'No change required.',
					effort: stale.length ? '15 minutes' : 'No change required'
				}
			)
		);
	const locality = practice.locations[0]?.split(',')[1]?.trim();
	if (locality && pages[0])
		out.push(
			finding(
				'tech-title-city',
				'technical',
				'Homepage title names the city',
				new RegExp(locality.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(pages[0].title)
					? 'passed'
					: 'failed',
				{
					scope: 'general',
					priority: 'polish',
					severity: 'low',
					evidence: [
						evidence(
							pages[0].url,
							`Title: “${pages[0].title}”; visible locality: ${locality}.`,
							'Title tag vs structured address',
							pages[0].fetchedAt
						)
					],
					impact:
						'People search “dentist in [city]”. A title tag that is just the practice name wastes the strongest local relevance signal the page has.',
					fix: `Use a title like “[Practice] | Dentist in ${locality}” on the homepage, and “[Service] in ${locality} | [Practice]” on service pages.`,
					effort: '30 minutes'
				}
			)
		);
	const vendors = new Map<string, Set<string>>();
	for (const p of pages)
		for (const h of p.thirdPartyHosts) vendors.set(h, (vendors.get(h) ?? new Set()).add(p.url));
	if (vendors.size)
		out.push(
			finding(
				'tech-third-parties',
				'technical',
				'Third-party services loaded by the site',
				'passed',
				{
					scope: 'general',
					priority: 'none',
					severity: 'info',
					evidence: [
						evidence(
							pages[0]!.url,
							`${vendors.size} external hosts: ${[...vendors.entries()]
								.sort((a, b) => b[1].size - a[1].size)
								.slice(0, 25)
								.map(([h, urls]) => `${h} (${urls.size} page${urls.size === 1 ? '' : 's'})`)
								.join(', ')}.`,
							'Script, frame and stylesheet hosts'
						)
					],
					impact:
						'An inventory for the developer: every external host is a performance cost, a privacy question and a thing that can break. Dental sites accumulate chat widgets, review feeds and pixels from successive agencies.',
					fix: 'Confirm each vendor is still paid for and wanted; remove the rest. Check the privacy section for pixels on form pages.',
					effort: 'No change required'
				}
			)
		);
	return out;
}
function validCanonical(page: Page): boolean {
	try {
		const u = new URL(page.canonical, page.url);
		return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password;
	} catch {
		return false;
	}
}
