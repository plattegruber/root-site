import { evidence, finding, type Finding, type Report } from '../model.js';
import { safeError, type SafeFetcher } from '../security/fetch.js';

type Metric = { percentile?: number; category?: string };
export type PsiPayload = {
	analysisUTCTimestamp?: string;
	lighthouseResult?: {
		lighthouseVersion?: string;
		finalUrl?: string;
		environment?: { networkUserAgent?: string };
		configSettings?: { formFactor?: string; throttlingMethod?: string; throttling?: unknown };
		audits?: Record<string, { numericValue?: number; displayValue?: string }>;
	};
	loadingExperience?: { id?: string; metrics?: Record<string, Metric> };
	originLoadingExperience?: { id?: string; metrics?: Record<string, Metric> };
};
const units: Record<string, string> = {
	LARGEST_CONTENTFUL_PAINT_MS: 'ms',
	CUMULATIVE_LAYOUT_SHIFT_SCORE: 'score/100',
	INTERACTION_TO_NEXT_PAINT: 'ms',
	FIRST_CONTENTFUL_PAINT_MS: 'ms',
	EXPERIMENTAL_TIME_TO_FIRST_BYTE: 'ms'
};
export function interpretPsi(
	payload: PsiPayload,
	url: string,
	device: 'mobile' | 'desktop'
): Report['performance'][number] {
	const lh = payload.lighthouseResult;
	const at = payload.analysisUTCTimestamp ?? new Date().toISOString();
	const urlField = payload.loadingExperience;
	const originField = payload.originLoadingExperience;
	const field =
		urlField?.metrics && Object.keys(urlField.metrics).length
			? urlField
			: originField?.metrics && Object.keys(originField.metrics).length
				? originField
				: undefined;
	const scope = !field ? 'unavailable' : field === urlField ? 'url' : 'origin';
	const metrics: Record<string, { percentile: number; category: string; unit: string }> = {};
	for (const [key, value] of Object.entries(field?.metrics ?? {}))
		if (typeof value.percentile === 'number')
			metrics[key] = {
				percentile:
					key === 'CUMULATIVE_LAYOUT_SHIFT_SCORE' ? value.percentile / 100 : value.percentile,
				category: value.category ?? 'UNKNOWN',
				unit:
					key === 'CUMULATIVE_LAYOUT_SHIFT_SCORE' ? 'unitless' : (units[key] ?? 'provider units')
			};
	const labMetrics: Record<string, number> = {};
	for (const key of [
		'first-contentful-paint',
		'largest-contentful-paint',
		'speed-index',
		'total-blocking-time',
		'cumulative-layout-shift',
		'interactive'
	]) {
		const v = lh?.audits?.[key]?.numericValue;
		if (typeof v === 'number') labMetrics[key] = v;
	}
	return {
		device,
		source: 'pagespeed_insights',
		status: lh ? 'completed' : 'failed',
		measuredAt: at,
		url: lh?.finalUrl ?? url,
		conditions: `Google PageSpeed Insights strategy=${device}; Lighthouse formFactor=${lh?.configSettings?.formFactor ?? 'not exposed'}, throttlingMethod=${lh?.configSettings?.throttlingMethod ?? 'not exposed'}, throttling=${JSON.stringify(lh?.configSettings?.throttling ?? {})}.`,
		lab: lh
			? {
					metrics: labMetrics,
					lighthouseVersion: lh.lighthouseVersion,
					environment: lh.environment?.networkUserAgent
				}
			: undefined,
		field: {
			scope,
			metrics,
			explanation: field
				? `CrUX ${scope} data: 75th-percentile values from eligible real Chrome visits over a rolling 28-day period. PageSpeed response does not expose exact collection dates. ${scope === 'origin' ? 'Origin data is not specific to this page.' : ''}`
				: 'No eligible CrUX field data was returned. This is not a performance failure and is not replaced by the lab run.'
		},
		limitation:
			'One Lighthouse lab run per strategy; results vary with test conditions. Lab LCP/CLS are not real-user measurements; total blocking time is not INP. No overall numerical score is assigned.'
	};
}
export async function measurePerformance(
	url: string,
	fetcher: SafeFetcher,
	signal: AbortSignal,
	enabled: boolean,
	key?: string
): Promise<{ measurements: Report['performance']; findings: Finding[] }> {
	const findings: Finding[] = [];
	const measurements = await Promise.all(
		(['mobile', 'desktop'] as const).map(async (device) => {
			if (!enabled)
				return {
					device,
					source: 'pagespeed_insights' as const,
					status: 'not_tested' as const,
					measuredAt: new Date().toISOString(),
					url,
					conditions: 'PageSpeed integration disabled.',
					limitation:
						'Enable PAGESPEED_ENABLED=true. A restricted Google Cloud PageSpeed Insights key is recommended; unkeyed requests may be rejected or rate limited.'
				};
			try {
				const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
				endpoint.searchParams.set('url', url);
				endpoint.searchParams.set('strategy', device);
				endpoint.searchParams.append('category', 'performance');
				if (key) endpoint.searchParams.set('key', key);
				const response = await fetcher(endpoint.href, {
					signal,
					maxBytes: 4_000_000,
					timeoutMs: 55_000,
					preserveQuery: true
				});
				if (response.status !== 200) throw new Error('pagespeed_status');
				return interpretPsi(JSON.parse(response.body.toString()) as PsiPayload, url, device);
			} catch (e) {
				return {
					device,
					source: 'pagespeed_insights' as const,
					status: 'failed' as const,
					measuredAt: new Date().toISOString(),
					url,
					conditions: `PageSpeed request: ${safeError(e)}`,
					limitation:
						'The provider did not complete. Check API enablement, quota, key restrictions and network access. Website findings and browser observations remain available.'
				};
			}
		})
	);
	for (const m of measurements) {
		const lcp = m.lab?.metrics['largest-contentful-paint'];
		const fieldPoor =
			m.field &&
			Object.entries(m.field.metrics).filter(
				([k, v]) =>
					[
						'LARGEST_CONTENTFUL_PAINT_MS',
						'CUMULATIVE_LAYOUT_SHIFT_SCORE',
						'INTERACTION_TO_NEXT_PAINT'
					].includes(k) && v.category === 'SLOW'
			);
		findings.push(
			finding(
				`performance-${m.device}`,
				'technical',
				`${m.device === 'mobile' ? 'Mobile' : 'Desktop'} Lighthouse lab performance`,
				m.status !== 'completed' || typeof lcp !== 'number'
					? 'not_tested'
					: lcp > 4000
						? 'failed'
						: 'passed',
				{
					evidence: [
						evidence(
							m.url,
							m.status === 'completed'
								? `Lab LCP ${lcp === undefined ? 'not exposed' : `${Math.round(lcp)} ms`}; lab ${JSON.stringify(m.lab?.metrics)}; field scope ${m.field?.scope}; field ${JSON.stringify(m.field?.metrics)}.`
								: m.limitation,
							'Google PageSpeed Insights / Lighthouse / CrUX',
							m.measuredAt
						)
					],
					impact:
						'Slow loading or unstable pages can make it harder for patients to find information and contact the practice.',
					fix:
						m.status === 'completed'
							? 'Use the Lighthouse diagnostics and resource trace to optimize the LCP element, images, critical styles, fonts and nonessential scripts. Retest under comparable conditions and monitor field trends.'
							: 'Configure the PageSpeed provider and rerun; do not infer site speed from missing measurements.',
					effort:
						m.status === 'completed'
							? '4–12 hours: diagnose, optimize, validate; hosting changes may add time'
							: '30–60 minutes: provider setup',
					severity: typeof lcp === 'number' && lcp > 4000 ? 'moderate' : 'info'
				}
			)
		);
		const hasField =
			m.field && m.field.scope !== 'unavailable' && Object.keys(m.field.metrics).length > 0;
		findings.push(
			finding(
				`performance-${m.device}-field`,
				'technical',
				`${m.device === 'mobile' ? 'Mobile' : 'Desktop'} real-user CrUX availability`,
				!hasField ? 'not_tested' : fieldPoor && fieldPoor.length ? 'failed' : 'passed',
				{
					evidence: [
						evidence(
							m.url,
							hasField
								? `${m.field?.scope}-level real-user p75 data: ${JSON.stringify(m.field?.metrics)}. ${m.field?.explanation}`
								: 'No eligible real-user sample was returned or the provider was unavailable. Missing field data is not a website failure.',
							'Google CrUX via PageSpeed',
							m.measuredAt
						)
					],
					impact:
						'Real-user loading, responsiveness and stability describe eligible visitors; origin data may cover multiple pages.',
					fix: hasField
						? 'Review field trends separately from lab tests and investigate poor metrics against actual page/templates.'
						: 'Rerun with PageSpeed configured; retain unavailable status if the site has no eligible CrUX sample.',
					effort: hasField
						? '4–12 hours: trace diagnosis and validation'
						: 'No website repair established by unavailable data',
					severity: fieldPoor && fieldPoor.length ? 'moderate' : 'info'
				}
			)
		);
	}
	return { measurements, findings };
}
