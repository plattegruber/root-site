import { evidence, finding, type Finding, type Report } from '../model.js';
import type { Crawl, Page } from './pages.js';

export function patientExperience(
	crawl: Crawl,
	practice: Report['practice']
): { findings: Finding[]; journeys: Report['journeys'] } {
	const pages = crawl.pages.filter((p) => p.status >= 200 && p.status < 300);
	const home = pages[0];
	const out: Finding[] = [];
	const tested = (
		id: string,
		title: string,
		section: Finding['section'],
		matches: Page[],
		detail: string,
		impact: string,
		fix: string
	) => {
		const status = home ? (matches.length ? 'passed' : 'needs_confirmation') : 'not_tested';
		out.push(
			finding(id, 'experience', title, status, {
				section,
				priority: status === 'needs_confirmation' ? 'improvement' : 'none',
				severity: status === 'needs_confirmation' ? 'moderate' : 'info',
				evidence: matches.length
					? matches
							.slice(0, 3)
							.map((p) => evidence(p.url, detail, 'Bounded public page review', p.fetchedAt))
					: home
						? [
								evidence(
									home.url,
									`No clear ${title.toLowerCase()} signal in ${pages.length} fetched pages. Content outside this crawl may exist.`,
									'Bounded public page review',
									home.fetchedAt
								)
							]
						: [],
				impact,
				fix,
				effort:
					status === 'passed'
						? 'No change required'
						: '2–4 hours: owner fact check, copy and placement review'
			})
		);
	};
	tested(
		'experience-first-impression',
		'Clear first impression',
		'homepage',
		home &&
			practice.facts.some((f) => f.key === 'practice_name') &&
			home.headings.some((h) => h.level === 1)
			? [home]
			: [],
		'A page title and visible primary heading identify the practice. Visual first impressions are separately inspected in the browser.',
		'Visitors need to quickly understand whose practice this is and how to take the next step.',
		'Use a specific primary heading, office location, dentist identity, and a clear appointment action. Confirm the owner-approved practice name.'
	);
	tested(
		'experience-dentist',
		'Dentist identity and credibility',
		'team',
		pages.filter((p) =>
			practice.facts.some((f) => f.key === 'dentist' && f.evidence.some((e) => e.url === p.url))
		),
		'A named dentist with a DDS/DMD credential was observed. Biography, portrait quality, licensing, and any specialist claims still require review.',
		'A nervous visitor may hesitate if they cannot identify the clinician or understand their approach.',
		'Place the dentist’s verified name, approved credentials, a genuine portrait, and a concise patient-focused biography on the homepage and team page.'
	);
	tested(
		'experience-services',
		'Useful service information',
		'service',
		pages.filter(
			(p) =>
				/services|implant|crown|root.canal|invisalign|denture|whitening/i.test(
					p.url + ' ' + p.headings.map((h) => h.text).join(' ')
				) && p.text.length > 500
		),
		'A service-oriented page with substantive text was fetched; benefit/risks wording and actual service availability need owner/clinical approval.',
		'Someone researching a procedure needs to know whether this practice offers it and what a consultation involves.',
		'Create one useful landing page per confirmed priority service, including who assesses suitability, what the consultation involves, practical next steps, and a relevant booking action. Avoid outcome promises.'
	);
	tested(
		'experience-insurance',
		'Insurance and financing guidance',
		'insurance',
		pages.filter((p) => /insurance|financing|payment plan|self.pay/i.test(p.text)),
		'Public insurance/payment wording was observed; network participation, accepted plans, coverage and financing eligibility have not been verified.',
		'Uncertain costs or ambiguous “accept insurance” wording can stop a patient from booking.',
		'Explain how the office checks benefits, distinguish accepted billing from in-network participation, and state only confirmed financing terms. Link the guidance near booking.'
	);
	tested(
		'experience-new-patient',
		'New-patient next steps',
		'new_patient',
		pages.filter((p) =>
			/new.patient|first.visit/i.test(p.url + ' ' + p.headings.map((h) => h.text).join(' '))
		),
		'New-patient or first-visit guidance was found in the fetched pages.',
		'A first-time visitor needs to understand how to request care, what happens next, and what to bring.',
		'Write a short first-visit sequence, with a visible contact action and owner-confirmed expectations. Keep patient information collection in the practice’s approved systems.'
	);
	tested(
		'experience-emergency',
		'Emergency contact instructions',
		'emergency',
		pages.filter(
			(p) => /emergency|urgent dental/i.test(p.text) && p.links.some((l) => l.kind === 'phone')
		),
		'An emergency/urgent-care mention and a phone action appear on the same page. Availability and after-hours routing are not inferred.',
		'A person seeking urgent care needs a fast, accurate route to the office and clear availability expectations.',
		'Put the confirmed urgent contact number on the emergency page, state verified hours and after-hours routing, and avoid promising same-day or 24-hour care unless confirmed.'
	);
	tested(
		'experience-contact',
		'Phone and contact route',
		'contact',
		pages.filter((p) => p.links.some((l) => l.kind === 'phone')),
		'A usable tel: link was observed. Phone ownership and live call routing were not tested.',
		'Mobile visitors should be able to reach the correct office without copying a number.',
		'Use a correctly formatted click-to-call link in the header, contact page, and relevant patient/service pages. Verify routing for this office.'
	);
	tested(
		'experience-directions',
		'Office location and directions',
		'contact',
		pages.filter(
			(p) =>
				p.links.some((l) => l.kind === 'maps') ||
				practice.facts.some((f) => f.key === 'address' && f.evidence.some((e) => e.url === p.url))
		),
		'A visible address or a Maps directions link was observed. Confirm it points to the audited office.',
		'A patient should know which office they are booking and how to get there.',
		'Place an owner-confirmed address, hours, directions link, and practical arrival information next to the appointment action.'
	);
	const booking = pages.flatMap((p) =>
		p.links.filter((l) => l.kind === 'booking').map((l) => ({ page: p, link: l }))
	);
	const failed = crawl.linkChecks.filter(
		(l) => l.kind === 'booking' && l.status && l.status >= 400
	);
	out.push(
		finding(
			'experience-booking',
			'experience',
			'Appointment handoff',
			failed.length
				? 'failed'
				: booking.length
					? 'needs_confirmation'
					: home
						? 'needs_confirmation'
						: 'not_tested',
			{
				priority: failed.length ? 'urgent' : home ? 'improvement' : 'none',
				severity: failed.length ? 'high' : 'info',
				section: 'contact',
				evidence: failed.length
					? failed.map((l) =>
							evidence(
								l.url,
								`“${l.label}” linked from ${l.from} returned HTTP ${l.status}.`,
								'HTTP booking-link check',
								l.observedAt
							)
						)
					: booking
							.slice(0, 3)
							.map((x) =>
								evidence(
									x.page.url,
									`Appointment link: ${x.link.url}. A reachable endpoint does not prove slot availability, office preselection or form completion.`,
									'Public handoff review',
									x.page.fetchedAt
								)
							),
				impact:
					'An unclear or broken booking handoff can lose a patient after they have decided to contact the office.',
				fix: failed.length
					? 'Repair the failing appointment destination, then verify the correct office and mobile handoff.'
					: 'Verify the correct office, explain whether this is a request or a confirmed appointment, and test the handoff without submitting patient data. Provide a phone alternative.',
				effort: failed.length
					? '1–3 hours: URL/routing fix and mobile retest'
					: '1–2 hours: handoff and wording verification'
			}
		)
	);
	const byId = (ids: string[]) => out.filter((f) => ids.includes(f.id));
	const step = (label: string, pattern: RegExp, observation: string) => {
		const p = pages.find((x) => pattern.test(x.url + ' ' + x.text));
		return {
			label,
			url: p?.url,
			observation: p ? observation : 'No relevant page was established in the bounded crawl.'
		};
	};
	const journey = (
		name: string,
		ids: string[],
		steps: Report['journeys'][number]['steps']
	): Report['journeys'][number] => ({
		name,
		status: !home
			? 'not_tested'
			: byId(ids).every((f) => f.status === 'passed')
				? 'passed'
				: 'friction',
		steps,
		findingIds: ids
	});
	return {
		findings: out,
		journeys: [
			journey(
				'A nervous new patient',
				[
					'experience-dentist',
					'experience-new-patient',
					'experience-insurance',
					'experience-booking'
				],
				[
					{ label: 'Understand the practice', url: home?.url, observation: practice.explanation },
					step(
						'Meet the dentist',
						/DDS|DMD/,
						'Named clinician wording is visible; tone, credentials, and portrait suitability need review.'
					),
					step(
						'Understand the first visit',
						/first.visit|new.patient/,
						'First-visit content exists; clear expectations and an easy next step matter.'
					),
					step(
						'Request an appointment',
						/appointment|schedul|book/,
						'Booking destinations are checked where crawl limits permit; no forms were submitted.'
					)
				]
			),
			journey(
				'Someone seeking emergency care',
				['experience-emergency', 'experience-contact', 'experience-booking'],
				[
					step(
						'Find urgent instructions',
						/emergency|urgent dental/,
						'Urgent-care wording is visible; availability and after-hours coverage require confirmation.'
					),
					step(
						'Call the correct office',
						/emergency|contact/,
						'Public phone links are reviewed without making calls.'
					),
					step(
						'See office and hours',
						/hours|Monday|directions/,
						'Public location and hours wording is compared when available.'
					)
				]
			),
			journey(
				'Someone researching a procedure',
				['experience-services', 'experience-dentist', 'experience-insurance', 'experience-booking'],
				[
					step(
						'Read service information',
						/implant|crown|root.canal|invisalign|denture|whitening/,
						'Service text is assessed for practical consultation and contact guidance.'
					),
					step(
						'Understand clinician and payment',
						/insurance|DDS|DMD/,
						'Only published credentials and payment wording are observed.'
					),
					step(
						'Reach a relevant booking page',
						/appointment|schedul|book/,
						'Service context and office preselection require handoff verification.'
					)
				]
			)
		]
	};
}
