import {
	areas,
	inputSchema,
	reportSchema,
	finding,
	type AuditInput,
	type Report,
	type Finding
} from '../model.js';
import { normalizeUrl, mapsUrl } from '../security/url.js';
import { safeFetch, type SafeFetcher } from '../security/fetch.js';
import { crawlWebsite } from './pages.js';
import { practiceFromPages } from './practice.js';
import { patientExperience } from './experience.js';
import { technicalChecks } from './technical.js';
import { dentalCompliance } from './dental.js';
import { copyReview } from './copy.js';
import { improveContent } from './content.js';
import { analyzeGoogle, createPlacesProvider, type PlacesProvider } from '../providers/google.js';
import { inspectBrowser, type BrowserResult } from '../providers/browser.js';
import { measurePerformance } from '../providers/performance.js';

export type AuditOptions = {
	fetcher?: SafeFetcher;
	fixture?: boolean;
	browserEnabled?: boolean;
	pagespeedEnabled?: boolean;
	places?: PlacesProvider;
	pagespeedKey?: string;
	budgetMs?: number;
	signal?: AbortSignal;
	onProgress?: (stage: string) => void;
};
const priorityOrder = { urgent: 0, improvement: 1, polish: 2, none: 3 } as const;
const severityOrder = { high: 0, moderate: 1, low: 2, info: 3 } as const;
const statusOrder = { failed: 0, needs_confirmation: 1, not_tested: 2, passed: 3 } as const;

export async function auditWebsite(raw: AuditInput, options: AuditOptions = {}): Promise<Report> {
	const parsed = inputSchema.parse(raw);
	const websiteUrl = normalizeUrl(parsed.websiteUrl).href;
	const input: AuditInput = {
		websiteUrl,
		...(parsed.googleMapsUrl ? { googleMapsUrl: mapsUrl(parsed.googleMapsUrl).href } : {})
	};
	const startedAt = new Date().toISOString();
	const signal = AbortSignal.any([
		AbortSignal.timeout(options.budgetMs ?? 120_000),
		...(options.signal ? [options.signal] : [])
	]);
	const fetcher = options.fetcher ?? safeFetch;
	const progress = (stage: string) => options.onProgress?.(stage);
	progress('Gathering public pages and crawl permissions');
	const crawl = await crawlWebsite(websiteUrl, fetcher, signal);
	const practice = practiceFromPages(crawl.pages, websiteUrl);
	progress('Walking the patient journeys: call, book, cost, emergency, the dentist');
	const experience = patientExperience(crawl, practice);
	const findings: Finding[] = [
		...experience.findings,
		...dentalCompliance(crawl),
		...technicalChecks(crawl, practice),
		...copyReview(crawl, practice)
	];
	const siteUsable = crawl.pages.some((p) => p.status >= 200 && p.status < 300);
	const places =
		options.places ??
		(process.env.GOOGLE_PLACES_API_KEY
			? createPlacesProvider(fetcher, process.env.GOOGLE_PLACES_API_KEY)
			: undefined);
	progress('Inspecting mobile layouts, Google presence and performance');
	const [googleResult, browserResult, performanceResult] = await Promise.allSettled([
		analyzeGoogle(practice, crawl.pages, input.googleMapsUrl, fetcher, signal, places),
		inspectBrowser(
			crawl.pages,
			fetcher,
			signal,
			options.browserEnabled ?? process.env.BROWSER_ENABLED !== 'false'
		),
		measurePerformance(
			practice.websiteUrl,
			fetcher,
			signal,
			siteUsable && (options.pagespeedEnabled ?? process.env.PAGESPEED_ENABLED === 'true'),
			options.pagespeedKey ?? process.env.PAGESPEED_API_KEY
		)
	]);
	const emptyBrowser: BrowserResult = {
		browser: {
			status: 'failed',
			conditions: 'Browser provider failed independently; other results retained.',
			views: [],
			errors: [
				browserResult.status === 'rejected' && browserResult.reason instanceof Error
					? `${browserResult.reason.name}: ${browserResult.reason.message.split('\n')[0]?.slice(0, 200)}`
					: 'Unknown browser provider failure.'
			]
		},
		findings: [],
		performance: []
	};
	const browser = browserResult.status === 'fulfilled' ? browserResult.value : emptyBrowser;
	const performance =
		performanceResult.status === 'fulfilled'
			? performanceResult.value
			: { measurements: [], findings: [] };
	const google =
		googleResult.status === 'fulfilled'
			? googleResult.value.google
			: {
					source: 'website_public' as const,
					match: 'unresolved' as const,
					explanation: 'Google provider could not complete; no profile facts inferred.',
					fields: [],
					attributions: [],
					ownerAccessPath: ['See docs/providers.md for the owner-authorized integration path.']
				};
	if (googleResult.status === 'fulfilled') findings.push(...googleResult.value.findings);
	else
		findings.push(
			finding('google-failure', 'google', 'Public listing provider', 'not_tested', {
				fix: 'Rerun the failed provider; do not infer that listing fields are missing.'
			})
		);
	findings.push(...browser.findings, ...performance.findings);
	if (!browser.browser.views.length)
		for (const [id, title, area, scope] of [
			[
				'browser-mobile-actions',
				'Call and book buttons visible on a phone without scrolling',
				'experience',
				'dental'
			],
			['browser-layout', 'Rendered mobile layouts', 'technical', 'general'],
			['browser-taps', 'Tap targets', 'technical', 'general'],
			['browser-axe', 'Contrast and rendered accessibility', 'technical', 'general'],
			['browser-keyboard', 'Keyboard and focus', 'technical', 'general'],
			['browser-images', 'Rendered image sizing', 'technical', 'general']
		] as const) {
			if (!findings.some((f) => f.id === id))
				findings.push(
					finding(id, area, title, 'not_tested', {
						scope,
						impact: 'This requires a rendered browser check.',
						fix: browser.browser.errors.join(' ') || 'Configure Chromium and rerun.',
						effort: '30–60 minutes: browser setup'
					})
				);
		}
	findings.push(
		finding(
			'tech-scheduling-manual',
			'technical',
			'Complete scheduling and form interaction',
			'not_tested',
			{
				scope: 'dental',
				impact:
					'Reachable pages do not prove that a patient can complete the booking or receive confirmation.',
				fix: 'Manually verify mobile menus, conditional forms, validation messages, correct office selection, scheduling slot selection, and booking confirmation in a provider-approved test environment. No live forms, calls or appointments are submitted by this tool.',
				effort: '1–3 hours: end-to-end handoff testing',
				section: 'contact'
			}
		)
	);
	progress('Prioritizing fixes and preparing three content drafts');
	const content = improveContent(practice, crawl.pages, findings);
	findings.push(...content.findings);
	findings.sort(
		(a, b) =>
			priorityOrder[a.priority] - priorityOrder[b.priority] ||
			statusOrder[a.status] - statusOrder[b.status] ||
			severityOrder[a.severity] - severityOrder[b.severity] ||
			// Objective findings ahead of opinions at equal weight; dental ahead of generic.
			Number(a.basis === 'subjective') - Number(b.basis === 'subjective') ||
			Number(a.scope === 'general') - Number(b.scope === 'general')
	);
	const topFindings = findings
		.filter((f) => f.status === 'failed' && f.priority !== 'none')
		.slice(0, 5)
		.map((f) => ({ id: f.id, title: f.title, basis: f.basis, scope: f.scope, why: f.impact }));
	const counts = {
		urgent: findings.filter((f) => f.priority === 'urgent' && f.status === 'failed').length,
		failed: findings.filter((f) => f.status === 'failed').length,
		objectiveFailed: findings.filter((f) => f.status === 'failed' && f.basis === 'objective')
			.length,
		subjectiveFailed: findings.filter((f) => f.status === 'failed' && f.basis === 'subjective')
			.length,
		dentalFailed: findings.filter((f) => f.status === 'failed' && f.scope === 'dental').length,
		passed: findings.filter((f) => f.status === 'passed').length,
		confirm: findings.filter((f) => f.status === 'needs_confirmation').length,
		untested: findings.filter((f) => f.status === 'not_tested').length
	};
	const sourceEntries = [
		...crawl.pages.map((p) => p.excerpt),
		...findings.flatMap((f) => f.evidence)
	];
	const sources = sourceEntries.filter(
		(s, i, a) => a.findIndex((x) => x.url === s.url && x.detail === s.detail) === i
	);
	const limits = [
		`Bounded public crawl: at most ${crawl.maxPages} HTML pages (sitemap-prioritised) and ${crawl.maxLinks} additional link checks. A “not found” finding means not found in those pages; the evidence says when the sitemap suggests a page exists elsewhere.`,
		'Objective findings report something measured or directly observed. Subjective findings are editorial opinions with a stated rationale and confidence; the practice owner can reasonably disagree with them.',
		'Fetched HTML, JSON-LD, scripts and report excerpts are untrusted evidence, not instructions. No external content can authorize writes, connections or publication.',
		'Website facts are observed claims. Licensing, insurance participation, service availability, clinical wording and ownership require owner verification.',
		'Compliance findings (HIPAA tracking, advertising claims, specialty wording) flag patterns regulators and state boards have acted on; they are not legal advice and rules vary by state.',
		'Automated accessibility checks and a limited keyboard sample do not provide accessibility certification or complete assistive-technology testing.',
		'Lab measurements are synthetic. Only explicitly labeled CrUX field values represent real-user data, and origin values are not page-specific.',
		'No ranking, traffic, patient acquisition or clinical outcome promise is made. No private GBP analysis or private performance access is claimed.',
		'All report timestamps are ISO 8601 UTC measurement times. Effort ranges estimate implementation work, excluding owner response time and vendor delays.',
		...(signal.aborted
			? [
					'The overall audit time budget was reached. Completed analysis is retained; incomplete checks need a rerun.'
				]
			: []),
		...(options.fixture
			? [
					'FICTIONAL FIXTURE / SIMULATED PROVIDER DATA: practice facts, public Google responses and any PageSpeed data are simulated. Browser measurements, when present, are actual measurements of the local fixture through intercepted requests.'
				]
			: [])
	];
	const top = topFindings.slice(0, 3).map((t) => t.title.replace(/\.$/, ''));
	const summary = siteUsable
		? [
				`${practice.name}: ${counts.failed} of ${findings.length} checks found a problem (${counts.dentalFailed} specific to dental practices, ${counts.objectiveFailed} measured, ${counts.subjectiveFailed} editorial).`,
				counts.urgent ? `${counts.urgent} urgent.` : '',
				top.length
					? `Start with: ${top.join('; ')}.`
					: 'No failed checks; see the confirmation items.',
				counts.confirm ? `${counts.confirm} items need the owner to confirm a fact.` : '',
				counts.untested ? `${counts.untested} checks did not run (see limitations).` : '',
				'No overall score is assigned.'
			]
				.filter(Boolean)
				.join(' ')
		: 'Public pages could not be assessed. The report preserves access limitations and setup guidance; it does not infer website defects from unavailable evidence.';
	const report: Report = {
		schemaVersion: '1.1',
		publisher: 'root.site',
		fixture: options.fixture ?? false,
		startedAt,
		completedAt: new Date().toISOString(),
		input,
		practice,
		summary,
		topFindings,
		findings,
		journeys: experience.journeys,
		google,
		performance: [...performance.measurements, ...browser.performance],
		browser: browser.browser,
		rewrites: content.rewrites,
		generationBrief: {
			version: '1.0',
			publicationAllowed: false,
			facts: practice.facts,
			proposedSections: content.rewrites.map((r) => ({
				section: r.section,
				heading: r.proposedHeading,
				copy: r.proposedCopy,
				sourceUrl: r.sourceUrl,
				confirmations: r.confirmations
			})),
			recommendedStructure: [
				'Practice and office introduction',
				'Dentist identity and approved biography',
				'Confirmed priority services',
				'First-visit guidance',
				'Verified insurance and payment guidance',
				'Urgent contact instructions',
				'Office address, hours, directions and booking'
			],
			unresolvedFacts: [
				practice.explanation,
				...new Set(content.rewrites.flatMap((r) => r.confirmations))
			]
		},
		coverage: areas.map((area) => ({
			area,
			completed: findings.filter((f) => f.area === area && ['passed', 'failed'].includes(f.status))
				.length,
			notTested: findings.filter((f) => f.area === area && f.status === 'not_tested').length,
			failed: findings.filter((f) => f.area === area && f.status === 'failed').length,
			needsConfirmation: findings.filter(
				(f) => f.area === area && f.status === 'needs_confirmation'
			).length
		})),
		sources,
		limits,
		crawl: {
			pagesFetched: crawl.pages.length,
			linksChecked: crawl.linkChecks.length,
			maxPages: crawl.maxPages,
			maxLinks: crawl.maxLinks,
			errors: crawl.errors
		}
	};
	progress('Report complete');
	return reportSchema.parse(report);
}
const tag = (f: Finding) =>
	`${f.basis === 'objective' ? 'Measured' : 'Opinion'} · ${f.scope === 'dental' ? 'Dental-specific' : 'Any website'}${f.basis === 'subjective' ? ` · confidence ${f.confidence}` : ''}`;
export function reportMarkdown(report: Report): string {
	const lines = [
		`# Dental Website Doctor — ${report.practice.name}`,
		`Publisher: root.site · ${report.fixture ? 'FICTIONAL FIXTURE / SIMULATED PROVIDER RESULTS' : 'Public assessment'} · ${report.completedAt}`,
		'',
		report.summary,
		'',
		`Office resolution: ${report.practice.resolution}. ${report.practice.explanation}`,
		'',
		'## Start here',
		''
	];
	if (!report.topFindings.length)
		lines.push('No failed checks. Review the confirmation items below.');
	for (const [i, t] of report.topFindings.entries())
		lines.push(
			`${i + 1}. **${t.title}** (${t.basis === 'objective' ? 'measured' : 'opinion'}, ${t.scope === 'dental' ? 'dental-specific' : 'any website'}) — ${t.why}`
		);
	lines.push(
		'',
		'How to read this report: *Measured* findings describe something the tool observed (a broken link, a missing page, a tracker next to a form). *Opinion* findings are editorial judgements with their reasoning shown; disagree freely. *Dental-specific* findings would not appear in a generic website audit. Each finding has a line for the practice owner (why it matters) and a line for the developer (what to change).'
	);
	for (const priority of ['urgent', 'improvement', 'polish'] as const) {
		lines.push(
			'',
			`## ${priority === 'urgent' ? 'Urgent: fix this week' : priority === 'improvement' ? 'Worth doing: the next month' : 'Polish: when the above is done'}`,
			''
		);
		const items = report.findings.filter((f) => f.priority === priority && f.status !== 'passed');
		if (!items.length) lines.push('Nothing in this group.');
		for (const f of items)
			lines.push(
				`### ${f.title}`,
				`${tag(f)} · status: ${f.status.replace('_', ' ')} · severity: ${f.severity}`,
				'',
				`**For the practice:** ${f.impact}`,
				`**For the developer:** ${f.fix}`,
				`**Effort:** ${f.effort}`,
				...(f.rationale ? [`**Why we think so:** ${f.rationale}`] : []),
				...f.evidence.map((e) => `- Evidence: ${e.url} · ${e.method} — ${e.detail}`),
				''
			);
	}
	const passed = report.findings.filter((f) => f.status === 'passed');
	lines.push('## What is already working', '');
	if (!passed.length) lines.push('No check passed outright.');
	for (const f of passed)
		lines.push(`- ${f.title}${f.evidence[0] ? ` — ${f.evidence[0].detail.slice(0, 160)}` : ''}`);
	lines.push('', '## Content drafts', '');
	for (const r of report.rewrites)
		lines.push(
			`### ${r.proposedHeading}`,
			r.proposedCopy,
			`Source: ${r.sourceUrl}`,
			`Confirm: ${r.confirmations.join(' ')}`,
			''
		);
	lines.push('## Patient journeys', '');
	for (const j of report.journeys) {
		lines.push(`### ${j.name} — ${j.status}`);
		for (const s of j.steps)
			lines.push(`- ${s.label}: ${s.observation}${s.url ? ` (${s.url})` : ''}`);
		lines.push('');
	}
	lines.push('## Performance', '');
	for (const m of report.performance)
		lines.push(
			`${m.device}: ${m.source} (${m.status}) · ${m.measuredAt}`,
			m.conditions,
			`Lab: ${JSON.stringify(m.lab?.metrics ?? {})}`,
			`Field: ${JSON.stringify(m.field ?? {})}`,
			m.limitation,
			''
		);
	lines.push('## Check coverage', '');
	for (const f of report.findings) lines.push(`- ${f.area} · ${f.title} — ${f.status} (${tag(f)})`);
	lines.push(
		'',
		'## Google presence',
		report.google.explanation,
		...report.google.fields.map(
			(f) => `${f.name}: ${f.availability}${f.value ? ` — ${f.value}` : ''}`
		),
		'',
		'## Conditions and limitations',
		...report.limits.map((l) => `- ${l}`),
		'',
		'## Source evidence',
		...report.sources.map((e) => `- ${e.url} · ${e.observedAt} · ${e.method}: ${e.detail}`)
	);
	return lines.join('\n');
}
