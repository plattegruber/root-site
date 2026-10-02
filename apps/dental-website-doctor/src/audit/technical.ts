import { evidence, finding, type Finding, type Report } from '../model.js';
import type { Crawl, Page } from './pages.js';
import { schemaNodes } from './pages.js';

export function technicalChecks(crawl: Crawl, practice: Report['practice']): Finding[] {
	const pages = crawl.pages;
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
		pages.filter((p) => p.status >= 400),
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
	const broken = crawl.linkChecks.filter((l) => l.status && l.status >= 400);
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
	const nodes = pages.flatMap((p) =>
		p.jsonLd.flatMap(schemaNodes).map((n) => ({ page: p, node: n }))
	);
	const practiceNodes = nodes.filter(({ node }) =>
		[node['@type']]
			.flat()
			.some((t) =>
				['Dentist', 'DentalClinic', 'MedicalClinic', 'LocalBusiness'].includes(String(t))
			)
	);
	const invisible = practiceNodes.filter(
		({ page, node }) =>
			typeof node.name === 'string' && !page.text.toLowerCase().includes(node.name.toLowerCase())
	);
	const invalid = pages.filter((p) => p.jsonLdErrors);
	out.push(
		finding(
			'tech-schema',
			'technical',
			'Practice structured data and visible facts',
			invalid.length || invisible.length
				? 'failed'
				: practiceNodes.length
					? 'needs_confirmation'
					: pages.length
						? 'needs_confirmation'
						: 'not_tested',
			{
				priority: invalid.length || invisible.length ? 'improvement' : 'none',
				severity: invalid.length || invisible.length ? 'moderate' : 'info',
				evidence: [
					...invalid.map((p) =>
						evidence(
							p.url,
							`${p.jsonLdErrors} malformed JSON-LD blocks.`,
							'JSON-LD parser',
							p.fetchedAt
						)
					),
					...practiceNodes
						.slice(0, 3)
						.map(({ page, node }) =>
							evidence(
								page.url,
								`Practice schema type ${JSON.stringify(node['@type'])}, name ${String(node.name ?? '(not exposed)')}; visible name match ${typeof node.name === 'string' && page.text.toLowerCase().includes(node.name.toLowerCase())}. Phone, hours and address need owner/source consistency review.`,
								'JSON-LD/visible text comparison',
								page.fetchedAt
							)
						)
				],
				impact: 'Inaccurate machine-readable facts can confuse directories and crawlers.',
				fix: 'Use an appropriate Dentist/LocalBusiness schema for each real office; match visible name, canonical website, phone, address, hours and dentist identities. Validate with the relevant Google tools. Do not add unverified rating or clinical claims.',
				effort: '2–4 hours: schema mapping, fact confirmation and validation'
			}
		)
	);
	out.push(
		finding(
			'tech-location',
			'technical',
			'Location and service page coverage',
			practice.resolution === 'ambiguous'
				? 'needs_confirmation'
				: practice.locations.length &&
					  pages.some((p) => /services|implant|crown|root.canal/.test(p.url))
					? 'passed'
					: pages.length
						? 'needs_confirmation'
						: 'not_tested',
			{
				evidence: pages.slice(0, 2).map((p) => p.excerpt),
				impact:
					'Patients need a clear office and relevant information about the care they are researching.',
				fix: 'Confirm whether this is a single-office practice; create distinct location pages only for real offices and useful pages only for services actually offered.',
				effort: '4–12 hours per approved page, depending on content and design'
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
