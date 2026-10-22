import { evidence, type Fact, type Report } from '../model.js';
import type { Page } from './pages.js';
import { isPracticeNode, schemaNodes } from './pages.js';

export const serviceNames = [
	'dental implants',
	'emergency dentistry',
	'root canal',
	'dental crowns',
	'teeth whitening',
	'Invisalign',
	'dentures',
	'dental cleanings',
	'cosmetic dentistry',
	'pediatric dentistry',
	'tooth extraction',
	'veneers'
];
/** Insurers patients search for by name; a named list beats "we accept most insurance". */
export const insurerNames = [
	'Delta Dental',
	'Cigna',
	'Aetna',
	'MetLife',
	'Guardian',
	'UnitedHealthcare',
	'United Healthcare',
	'Humana',
	'Blue Cross',
	'BlueCross',
	'BCBS',
	'Anthem',
	'Principal',
	'Ameritas',
	'Sun Life',
	'Lincoln Financial',
	'Careington',
	'DentaQuest',
	'Medicaid',
	'Medicare',
	'CHIP',
	'Tricare',
	'Denali',
	'Dental Network of America',
	'GEHA',
	'Liberty Dental',
	'MCNA'
];
/** Third-party patient financing brands; naming one is a concrete, checkable claim. */
export const financingNames = [
	'CareCredit',
	'Sunbit',
	'Cherry',
	'LendingClub',
	'Proceed Finance',
	'Alphaeon',
	'Scratchpay',
	'Wells Fargo Health Advantage',
	'Affirm'
];
export function practiceFromPages(pages: Page[], fallback: string): Report['practice'] {
	const home = pages[0];
	const facts: Fact[] = [];
	const locations = new Set<string>();
	const add = (key: string, value: string, page: Page, detail: string) => {
		if (!value || facts.some((f) => f.key === key && f.value === value)) return;
		facts.push({
			key,
			value: value.slice(0, 600),
			verification: 'observed',
			evidence: [
				evidence(
					page.url,
					detail,
					'Website fact observed; owner verification still required',
					page.fetchedAt
				)
			]
		});
	};
	const visible = (page: Page, value: string) =>
		page.text.toLowerCase().includes(value.toLowerCase());
	for (const page of pages.filter((p) => p.status >= 200 && p.status < 300)) {
		for (const node of page.jsonLd.flatMap(schemaNodes)) {
			if (isPracticeNode(node)) {
				if (typeof node.name === 'string' && visible(page, node.name))
					add(
						'practice_name',
						node.name,
						page,
						`Visible name also in structured data: ${node.name}`
					);
				const address = node.address;
				if (address && typeof address === 'object') {
					const a = address as Record<string, unknown>;
					const street = String(a.streetAddress ?? '');
					const locality = String(a.addressLocality ?? '');
					if (street && visible(page, street) && locality && visible(page, locality)) {
						const full = [street, locality, a.addressRegion, a.postalCode]
							.filter(
								(value) => typeof value === 'string' && value.length > 0 && visible(page, value)
							)
							.join(', ');
						locations.add(full);
						add(
							'address',
							full,
							page,
							`Visible street and locality match schema; verify region/postcode: ${full}`
						);
					}
				}
			}
		}
		for (const phone of page.links.filter((l) => l.kind === 'phone')) {
			const value = phone.url.slice(4).replace(/[^\d+]/g, '');
			if (/^\+?\d{7,15}$/.test(value))
				add('phone', value, page, `Public click-to-call link: ${phone.url}`);
		}
		for (const match of page.text.matchAll(
			/(?:Dr\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z]\.)?\s+[A-Z][a-z]+),?\s+(D\.?D\.?S\.?|D\.?M\.?D\.?)(?!\w)/g
		)) {
			add(
				'dentist',
				match[0],
				page,
				`Public identity/credential wording: “${match[0]}”; licensing not independently checked.`
			);
		}
		for (const service of serviceNames) {
			const sentences = page.text
				.split(/(?<=[.!?])\s+/)
				.filter((t) => t.toLowerCase().includes(service.toLowerCase()));
			const affirmative = sentences.find(
				(t) =>
					!/(?:not|no longer|don't|do not|does not|never|unavailable).{0,45}(?:offer|provide|perform)|(?:do not|don't|no)\s+(?:offer\s+)?/i.test(
						t
					)
			);
			if (affirmative)
				add(
					'service',
					service,
					page,
					`Website mentions “${service}”: ${affirmative.slice(0, 300)}. Confirm availability before publishing.`
				);
		}
		const hourMatch = page.text.match(
			/(?:Monday|Mon)\s*(?:[-–]\s*(?:Friday|Fri))?\s*:?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)/i
		);
		if (hourMatch)
			add(
				'hours_wording',
				hourMatch[0],
				page,
				`Visible hours: ${hourMatch[0]}. Holiday and emergency hours not inferred.`
			);
		const insurance = page.text.match(
			/[^.!?]{0,100}(?:insurance|financing|payment plan)[^.!?]{0,200}[.!?]?/i
		)?.[0];
		if (insurance)
			add(
				'insurance_wording',
				insurance.trim(),
				page,
				`Exact website wording, not a verified participation/coverage claim: ${insurance.trim()}`
			);
		for (const insurer of insurerNames)
			if (new RegExp(`\\b${insurer.replace(/\s+/g, '\\s+')}\\b`, 'i').test(page.text))
				add(
					'insurer',
					insurer,
					page,
					`Website names “${insurer}”; participation status is not verified.`
				);
		// Lender names double as ordinary words ("Cherry", "Affirm"), so require payment context.
		if (/financ|payment plan|pay over time|monthly payments|payment options/i.test(page.text))
			for (const lender of financingNames)
				if (new RegExp(`\\b${lender.replace(/\s+/g, '\\s+')}\\b`).test(page.text))
					add(
						'financing',
						lender,
						page,
						`Website names “${lender}” financing; terms are not verified.`
					);
		const membership = page.text.match(
			/[^.!?]{0,80}(?:membership plan|in-house (?:dental |savings )?plan|dental savings plan|no insurance\? no problem|wellness plan)[^.!?]{0,160}[.!?]?/i
		)?.[0];
		if (membership)
			add(
				'membership_plan',
				membership.trim(),
				page,
				`In-house plan wording: ${membership.trim()}`
			);
		const language = page.text.match(
			/(se habla español|hablamos español|spanish[- ]speaking|we speak (?:spanish|[a-z]+ and [a-z]+)|bilingual staff)/i
		)?.[0];
		if (language) add('languages', language, page, `Language wording: ${language}`);
		const newPatients = page.text.match(
			/(?:now |currently |always )?(?:accepting|welcoming|taking) new patients/i
		)?.[0];
		if (newPatients)
			add('accepting_new_patients', newPatients, page, `New-patient wording: ${newPatients}`);
		for (const email of page.links.filter((l) => l.kind === 'email'))
			add('email', email.url.slice(7).toLowerCase(), page, `Public mailto link: ${email.url}`);
	}
	if (!facts.some((f) => f.key === 'practice_name') && home) {
		const title = home.title
			.split(/[|–—]/)[0]
			?.trim()
			.replace(/^Home\s*[-:]?\s*/i, '');
		if (title && title.length < 120 && title.toLowerCase() !== 'home')
			add(
				'practice_name',
				title,
				home,
				`Candidate practice name from page title: ${home.title}; confirm owner/business identity.`
			);
	}
	const addressHints = pages.flatMap((p) =>
		p.links.filter((l) => /location|offices/i.test(l.label)).map((l) => l.label + ' ' + l.url)
	);
	const multi =
		locations.size > 1 || addressHints.filter((v, i, a) => a.indexOf(v) === i).length > 2;
	const resolution = multi
		? 'ambiguous'
		: locations.size === 1
			? 'single_location_observed'
			: 'unresolved';
	return {
		name: facts.find((f) => f.key === 'practice_name')?.value ?? new URL(fallback).hostname,
		websiteUrl: home?.url ?? fallback,
		resolution,
		explanation: multi
			? 'Multiple location signals were observed. Choose and confirm the exact office before comparing a Google listing or publishing copy.'
			: locations.size === 1
				? 'One visible street/locality pair was found. This is a website observation; it does not establish independent ownership or prove no other offices exist.'
				: 'A unique office address could not be established from fetched pages. A Google listing will remain unconfirmed.',
		facts,
		locations: [...locations]
	};
}
