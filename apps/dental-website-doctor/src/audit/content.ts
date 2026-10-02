import { evidence, finding, type Finding, type Report } from '../model.js';
import type { Page } from './pages.js';

const sectionTitles = {
	homepage: 'A clearer introduction',
	new_patient: 'Your first visit',
	emergency: 'Need urgent dental care?',
	service: 'Explore your care options',
	insurance: 'Questions about insurance or payment?',
	contact: 'Contact the office',
	team: 'Meet your dentist'
};
export function improveContent(
	practice: Report['practice'],
	pages: Page[],
	findings: Finding[]
): { rewrites: Report['rewrites']; findings: Finding[] } {
	const home = pages.find((p) => p.status >= 200 && p.status < 300);
	if (!home)
		return {
			rewrites: [],
			findings: [
				finding('content-unavailable', 'content', 'Evidence-grounded copy', 'not_tested', {
					impact: 'Copy needs reliable public practice facts.',
					fix: 'Rerun after public pages can be fetched; no practice facts or claims were invented.',
					effort: 'Depends on source access'
				})
			]
		};
	const order = { urgent: 0, improvement: 1, polish: 2, none: 3 };
	const candidates = findings
		.filter((f) => f.section && ['failed', 'needs_confirmation'].includes(f.status))
		.sort((a, b) => order[a.priority] - order[b.priority]);
	const sections: Array<keyof typeof sectionTitles> = [];
	for (const f of candidates)
		if (f.section && !sections.includes(f.section)) sections.push(f.section);
	for (const s of ['homepage', 'new_patient', 'contact'] as const)
		if (!sections.includes(s)) sections.push(s);
	const name = practice.facts.find((f) => f.key === 'practice_name');
	const phone = practice.facts.find((f) => f.key === 'phone');
	const address = practice.facts.find((f) => f.key === 'address');
	const dentist = practice.facts.find((f) => f.key === 'dentist');
	const services = practice.facts.filter((f) => f.key === 'service').slice(0, 3);
	const hours = practice.facts.find((f) => f.key === 'hours_wording');
	const voice = /\b(?:we|our)\b/i.test(home.text)
		? 'Plain, welcoming first-person language based on the website’s “we/our” voice.'
		: 'Plain, informative third-person language based on the fetched website. Owner review is needed for final voice.';
	const rewrites: Report['rewrites'] = sections.slice(0, 3).map((section) => {
		const keys = new Set<string>();
		const confirmations = ['Confirm every practice fact and approve wording before publication.'];
		const use = (fact: typeof name, fallback: string) => {
			if (fact) {
				keys.add(fact.key);
				return fact.value;
			}
			return fallback;
		};
		const practiceName = use(name, 'the practice');
		const call = phone
			? `Call ${use(phone, '')} to ask about an appointment.`
			: 'Contact the office to ask about an appointment. [Confirm and insert the correct office phone or booking link.]';
		const place = address ? `Find us at ${use(address, '')}.` : '';
		let copy: string;
		let heading = sectionTitles[section];
		if (section === 'homepage') {
			heading = `Welcome to ${practiceName}`;
			copy = [
				dentist
					? `Meet ${use(dentist, '')}.`
					: '[Add the dentist’s owner-approved name, credentials and a short introduction.]',
				place,
				call
			]
				.filter(Boolean)
				.join(' ');
			confirmations.push(
				'Confirm the precise office identity and location. Approve the dentist introduction and genuine portrait.'
			);
		} else if (section === 'new_patient') {
			copy =
				`New to ${practiceName}? ${call} Ask the office what to bring, how the first visit is arranged, and how to check insurance or payment questions before your appointment. ${place}`.trim();
			confirmations.push(
				'Confirm first-visit sequence, forms, arrival time and what to bring; add only the approved details. Do not place patient records in this tool.'
			);
		} else if (section === 'emergency') {
			copy =
				`If you need urgent dental care, ${call.replace(/^Call/, 'call')} Ask the office to confirm current availability and the right next step. ${hours ? `Published office hours: ${use(hours, '')}.` : ''} [Add verified after-hours contact instructions.]`.trim();
			confirmations.push(
				'Confirm whether emergency appointments are offered, current availability, hours and after-hours routing. No same-day, 24-hour, or treatment outcome claim has been added.'
			);
		} else if (section === 'service') {
			copy = services.length
				? `Learn about ${services
						.map((s) => {
							keys.add(s.key);
							return s.value;
						})
						.join(
							', '
						)} at ${practiceName}. ${call} Ask which care options the dentist can assess with you and what a consultation involves.`
				: `${call} Ask the office which services are available and how to arrange a consultation. [Insert the confirmed priority service and clinician-approved explanation.]`;
			confirmations.push(
				'Confirm that each mentioned service is currently provided at this office. Have the clinician approve suitability, risks, benefits and treatment descriptions before adding them.'
			);
		} else if (section === 'insurance') {
			copy = `Have questions about insurance or payment? ${call} Ask the office to confirm whether it participates in your specific plan and what information it needs to help you check benefits. Confirm any estimated patient costs and available payment arrangements with the office before treatment.`;
			confirmations.push(
				'Confirm insurance participation separately from billing/acceptance, verification process, and financing providers/terms. No plan, lender, eligibility or coverage promise is asserted.'
			);
		} else if (section === 'team') {
			heading = dentist ? `Meet ${use(dentist, '')}` : 'Meet your dentist';
			copy = `Get to know the clinician at ${practiceName}. [Add an owner-approved biography, verified credentials and a genuine portrait.] ${call}`;
			confirmations.push(
				'Confirm licensing, approved credentials, biography and any specialist title; credential wording observed on a website is not a license verification.'
			);
		} else {
			copy = [
				call,
				place,
				hours ? `Published hours: ${use(hours, '')}.` : '[Add confirmed office opening hours.]',
				'Ask whether an online booking is a request or a confirmed appointment, and confirm you have selected the correct office.'
			].join(' ');
			confirmations.push(
				'Confirm office phone routing, full weekly and special hours, directions and the third-party scheduling handoff.'
			);
		}
		const pattern = {
			homepage: /^$/,
			new_patient: /new.patient|first.visit/i,
			emergency: /emergency/i,
			service: /services|implant|crown|whitening/i,
			insurance: /insurance|financ/i,
			contact: /contact|appointment/i,
			team: /team|about|dentist/i
		}[section];
		const source =
			section === 'homepage'
				? home
				: (pages.find((p) => p.status >= 200 && p.status < 300 && pattern.test(p.url)) ?? home);
		const related = candidates.filter((f) => f.section === section);
		return {
			section,
			sourceUrl: source.url,
			findingIds: related.map((f) => f.id),
			before: source.text.slice(0, 550),
			proposedHeading: heading,
			proposedCopy: copy,
			reason: related.length
				? related.map((f) => f.impact).join(' ')
				: 'Make this section easier to scan and give visitors a clear, accurate next step.',
			preservedFactKeys: [...keys].filter((key) =>
				practice.facts.some((f) => f.key === key && copy.includes(f.value))
			),
			confirmations,
			voice
		};
	});
	return {
		rewrites,
		findings: rewrites.map((r, i) =>
			finding(`content-rewrite-${i + 1}`, 'content', r.proposedHeading, 'needs_confirmation', {
				section: r.section as Finding['section'],
				priority: 'improvement',
				severity: 'info',
				evidence: [evidence(r.sourceUrl, r.before, 'Source excerpt used for proposed copy')],
				impact: r.reason,
				fix: r.proposedCopy,
				effort: '1–3 hours: owner/clinical fact approval, voice edit and CMS placement'
			})
		)
	};
}
