import { finding, type Finding, type Report } from '../model.js';
import { bookingVendor, type Crawl, type Page } from './pages.js';
import {
	check,
	hintEvidence,
	lastTen,
	locate,
	pageEvidence,
	patterns,
	quote,
	usablePages
} from './signals.js';

/**
 * Patient-experience checks. Every finding here is about what a prospective dental patient
 * can find and do on the website: call, book, understand cost, find the office, trust the
 * dentist. The checks are objective (a thing is present, absent, vague or broken); the
 * copy module holds the editorial opinions.
 */
export function patientExperience(
	crawl: Crawl,
	practice: Report['practice']
): { findings: Finding[]; journeys: Report['journeys'] } {
	const pages = usablePages(crawl);
	const home = pages[0];
	const out: Finding[] = [];
	if (!home) {
		for (const [id, title] of Object.entries(untestedTitles))
			out.push(
				finding(id, 'experience', title, 'not_tested', {
					scope: 'dental',
					impact: 'No public page could be fetched, so patient journeys were not assessed.',
					fix: 'Resolve the access problem listed under crawl errors and rerun.'
				})
			);
		return { findings: out, journeys: journeys(out, pages, practice) };
	}
	const factPages = (key: string) =>
		pages.filter((p) =>
			practice.facts.some((f) => f.key === key && f.evidence.some((e) => e.url === p.url))
		);

	// 1. Phone: the single most-used action on a dental website.
	const phonePages = pages.filter((p) => p.links.some((l) => l.kind === 'phone'));
	const headerPhone = pages.filter((p) => p.links.some((l) => l.kind === 'phone' && l.inHeader));
	const smsPages = pages.filter(
		(p) =>
			p.links.some((l) => l.kind === 'sms') ||
			/text us|send us a text|text (?:the office|\(?\d{3}\)?)/i.test(p.text)
	);
	out.push(
		check(
			'experience-contact',
			'experience',
			'Click-to-call phone number',
			!phonePages.length
				? 'failed'
				: headerPhone.length < Math.ceil(pages.length / 2)
					? 'failed'
					: 'passed',
			{
				scope: 'dental',
				section: 'contact',
				severity: !phonePages.length ? 'high' : 'moderate',
				evidence: phonePages.length
					? [
							pageEvidence(
								home,
								`tel: links on ${phonePages.length} of ${pages.length} fetched pages; inside the header/nav on ${headerPhone.length}. ${smsPages.length ? 'A text/SMS option was also observed.' : 'No text/SMS option was observed.'}`
							)
						]
					: [
							pageEvidence(
								home,
								`No tel: link on any of ${pages.length} fetched pages. A phone number written as plain text cannot be tapped on a phone.`
							)
						],
				impact: !phonePages.length
					? 'Most dental appointments still start with a phone call, usually from a phone. Without a tappable number, a patient has to memorize or copy it.'
					: 'A patient who decides to call should not have to scroll to the footer or go to the contact page; the number belongs in the header of every page.',
				fix: !phonePages.length
					? 'Wrap the office number in an <a href="tel:+1…"> link in the site header and footer, and on the contact and emergency pages.'
					: 'Add the tel: link to the shared header template so it appears on every page, and keep it visible in the mobile header.',
				effort: !phonePages.length
					? '1 hour: header and footer template'
					: '30–60 minutes: header template'
			}
		)
	);

	// 2. Booking handoff: online scheduling or a request form, and whether it works.
	const bookingLinks = pages.flatMap((p) =>
		p.links.filter((l) => l.kind === 'booking').map((l) => ({ page: p, link: l }))
	);
	const brokenBooking = crawl.linkChecks.filter(
		(l) => l.kind === 'booking' && l.status && l.status >= 400
	);
	const vendors = [
		...new Set(bookingLinks.map((b) => bookingVendor(new URL(b.link.url).hostname)).filter(Boolean))
	] as string[];
	const appointmentForms = pages.filter((p) =>
		p.forms.some((f) =>
			f.fields.some((x) =>
				/appointment|preferred (?:day|time|date)|schedule/i.test(
					`${x.name} ${x.label} ${x.placeholder}`
				)
			)
		)
	);
	const bookingStatus: Finding['status'] = brokenBooking.length
		? 'failed'
		: bookingLinks.length || appointmentForms.length
			? vendors.length
				? 'passed'
				: 'needs_confirmation'
			: 'failed';
	out.push(
		check('experience-booking', 'experience', 'Appointment booking route', bookingStatus, {
			scope: 'dental',
			section: 'contact',
			severity: brokenBooking.length ? 'high' : bookingStatus === 'failed' ? 'moderate' : 'info',
			priority: brokenBooking.length
				? 'urgent'
				: bookingStatus === 'passed'
					? 'none'
					: 'improvement',
			evidence: brokenBooking.length
				? brokenBooking.map((l) =>
						pageEvidence(
							{ ...home, url: l.url, fetchedAt: l.observedAt },
							`“${l.label}” linked from ${l.from} returned HTTP ${l.status}.`,
							'HTTP booking-link check'
						)
					)
				: bookingLinks.length || appointmentForms.length
					? [
							pageEvidence(
								bookingLinks[0]?.page ?? appointmentForms[0]!,
								[
									bookingLinks.length
										? `${bookingLinks.length} booking links, e.g. “${bookingLinks[0]!.link.label}” → ${bookingLinks[0]!.link.url}.`
										: '',
									vendors.length
										? `Recognised scheduling vendor: ${vendors.join(', ')} (real-time booking).`
										: bookingLinks.length
											? 'No recognised real-time scheduling vendor; this looks like an appointment request rather than a confirmed booking.'
											: '',
									appointmentForms.length
										? `Appointment request form on ${appointmentForms.map((p) => p.url).join(', ')}.`
										: ''
								]
									.filter(Boolean)
									.join(' ')
							)
						]
					: [
							pageEvidence(
								home,
								`No booking link, scheduling widget or appointment form on ${pages.length} fetched pages.`
							)
						],
			impact: brokenBooking.length
				? 'A patient who clicked “book” hit an error page. This is the most expensive kind of defect a dental website can have.'
				: bookingStatus === 'failed'
					? 'Roughly half of prospective patients prefer to book outside office hours. Phone-only booking loses them to a practice with online scheduling.'
					: bookingStatus === 'needs_confirmation'
						? 'A request form is better than nothing, but patients expect to know whether they have an appointment. Say clearly that the office will call back, and how fast.'
						: 'Patients can start booking online. Confirm the widget preselects the right office and provider and that someone monitors it.',
			fix: brokenBooking.length
				? 'Fix or replace the failing booking URL, then click every “book” button on mobile.'
				: bookingStatus === 'failed'
					? 'Add real-time online scheduling from your practice management system or a vendor (NexHealth, LocalMed, Flex, Zocdoc, etc.), or at minimum a short appointment-request form with a stated callback time.'
					: bookingStatus === 'needs_confirmation'
						? 'Label the form honestly (“Request an appointment — we call back within one business day”), keep it to five fields, and add a phone alternative beside it.'
						: 'Test the booking flow end to end in a vendor test environment; this tool does not submit appointments.',
			effort: brokenBooking.length
				? '1–3 hours: fix URL, retest on mobile'
				: bookingStatus === 'failed'
					? '1–2 days: vendor setup and integration'
					: '1–2 hours'
		})
	);

	// 3. New-patient path.
	const np = locate(crawl, pages, patterns.newPatient, patterns.newPatient);
	const accepting = factPages('accepting_new_patients');
	const pdfForms = pages.flatMap((p) =>
		p.links.filter(
			(l) =>
				patterns.patientFormsPdf.test(new URL(l.url, p.url).pathname) &&
				/form|paperwork|registration|history|intake/i.test(l.label + l.url)
		)
	);
	const onlineForms = pages.flatMap((p) =>
		p.links.filter(
			(l) =>
				patterns.onlineFormsVendor.test(l.url) ||
				/online forms|complete (?:your )?forms online|digital forms|fill out forms online/i.test(
					l.label
				)
		)
	);
	const bring = np.pages.filter((p) => patterns.whatToBring.test(p.text));
	const length = np.pages.filter((p) => patterns.visitLength.test(p.text));
	const npSignals = [
		accepting.length ? 'states it is accepting new patients' : '',
		onlineForms.length ? 'offers online forms' : pdfForms.length ? 'offers PDF forms' : '',
		bring.length ? 'says what to bring' : '',
		length.length ? 'says how long the first visit takes' : ''
	].filter(Boolean);
	const npStatus: Finding['status'] = np.pages.length
		? npSignals.length >= 2
			? 'passed'
			: 'needs_confirmation'
		: np.hints.length
			? 'needs_confirmation'
			: 'failed';
	out.push(
		check('experience-new-patient', 'experience', 'New-patient path', npStatus, {
			scope: 'dental',
			section: 'new_patient',
			evidence: np.pages.length
				? [
						pageEvidence(
							np.pages[0]!,
							`New-patient content on ${np.pages.map((p) => p.url).join(', ')}. It ${npSignals.length ? npSignals.join(', ') : 'does not state new-patient acceptance, forms, what to bring or visit length'}.`
						)
					]
				: [
						pageEvidence(
							home,
							`No new-patient or first-visit page among ${pages.length} fetched pages.`
						),
						...hintEvidence(home, np.hints, 'new-patient guidance')
					],
			impact:
				'A first-time patient is deciding whether this office is easy to deal with. “Are you taking new patients, what do I fill out, what do I bring, how long will it take” are the four questions they arrive with.',
			fix: np.pages.length
				? `Add the missing pieces to the new-patient page: ${['a one-line “now accepting new patients”', 'digital intake forms (or a PDF link until then)', 'what to bring (ID, insurance card, medication list)', 'how long the first visit takes and what happens in it'].filter((_, i) => !npSignals[i]).join('; ') || 'keep it current'}.`
				: 'Create a /new-patients page: accepting-new-patients statement, how to book, what the first visit includes and how long it takes, what to bring, insurance and payment basics, and a link to forms.',
			effort: npStatus === 'failed' ? '3–5 hours: owner input plus one page' : '1–2 hours'
		})
	);
	if (pdfForms.length && !onlineForms.length)
		out.push(
			check('experience-forms-pdf', 'experience', 'Patient forms are PDF only', 'failed', {
				scope: 'dental',
				section: 'new_patient',
				basis: 'subjective',
				confidence: 'medium',
				severity: 'low',
				evidence: [
					pageEvidence(
						home,
						`PDF form links: ${pdfForms
							.slice(0, 3)
							.map((l) => l.url)
							.join(', ')}; no online intake vendor link observed.`
					)
				],
				impact:
					'Printable PDFs assume a printer and a scanner. Many patients will skip them and the front desk ends up re-keying paper, or asking people to arrive 20 minutes early.',
				fix: 'Move intake to a HIPAA-compliant digital forms tool (most practice management systems offer one) and keep the PDF as a fallback.',
				rationale:
					'Opinion based on front-desk workflow, not a measured defect: PDF forms work, they just push work onto the patient and the staff.',
				effort: '2–4 hours plus vendor setup'
			})
		);

	// 4. Insurance and payment clarity.
	const ins = locate(
		crawl,
		pages,
		/insurance|financ|payment|membership|pricing|fees|cost/i,
		patterns.insuranceText
	);
	const insurers = practice.facts.filter((f) => f.key === 'insurer').map((f) => f.value);
	const inNetwork = ins.mentions.find((p) => patterns.inNetwork.test(p.text));
	const vague = ins.mentions.find((p) => patterns.vagueInsurance.test(p.text));
	const financing = practice.facts.filter((f) => f.key === 'financing').map((f) => f.value);
	const membership = practice.facts.find((f) => f.key === 'membership_plan');
	const uninsured = ins.mentions.find((p) => patterns.uninsured.test(p.text));
	const insStatus: Finding['status'] = !ins.mentions.length
		? ins.hints.length
			? 'needs_confirmation'
			: 'failed'
		: insurers.length || inNetwork
			? 'passed'
			: 'failed';
	out.push(
		check('experience-insurance', 'experience', 'Insurance and payment clarity', insStatus, {
			scope: 'dental',
			section: 'insurance',
			severity: insStatus === 'failed' ? 'moderate' : 'info',
			evidence: ins.mentions.length
				? [
						pageEvidence(
							ins.mentions[0]!,
							[
								insurers.length ? `Named plans: ${insurers.join(', ')}.` : 'No insurer is named.',
								inNetwork
									? `In-network wording: “${quote(inNetwork.text, patterns.inNetwork, 60)}”.`
									: 'No in-network / participating-provider statement.',
								vague ? `Vague wording: “${quote(vague.text, patterns.vagueInsurance, 40)}”.` : '',
								financing.length
									? `Financing: ${financing.join(', ')}.`
									: 'No financing provider named.',
								membership
									? `In-house plan: “${membership.value.slice(0, 120)}”.`
									: 'No in-house membership plan mentioned.'
							]
								.filter(Boolean)
								.join(' ')
						)
					]
				: [
						pageEvidence(
							home,
							`No insurance, financing or payment wording on ${pages.length} fetched pages.`
						),
						...hintEvidence(home, ins.hints, 'insurance information')
					],
			impact:
				insStatus === 'failed' && ins.mentions.length
					? '“We accept most insurance” is the sentence patients trust least. They want to know whether you are in network with their plan, because that decides their bill.'
					: insStatus === 'failed'
						? 'Cost is the top reason people delay dental care. A site that says nothing about insurance or payment loses the price-sensitive majority before they call.'
						: 'Patients can tell whether their plan is likely to work here. Keep the list current; a stale insurer list generates angry calls.',
			fix:
				insStatus === 'passed'
					? 'Review the insurer list quarterly and keep the in-network/out-of-network distinction explicit.'
					: 'Publish an insurance page that lists the plans you are in network with, explains how out-of-network billing works, names your financing partner and any in-house membership plan, and says what an uninsured new-patient visit costs.',
			effort: '2–3 hours: owner provides the list; one page'
		})
	);
	if (ins.mentions.length && !membership && !financing.length && !uninsured)
		out.push(
			check(
				'experience-uninsured-path',
				'experience',
				'Nothing for patients without insurance',
				'failed',
				{
					scope: 'dental',
					section: 'insurance',
					basis: 'subjective',
					confidence: 'medium',
					severity: 'low',
					evidence: [
						pageEvidence(
							ins.mentions[0]!,
							'Insurance text exists but no financing partner, in-house membership plan or self-pay guidance was found.'
						)
					],
					impact:
						'About a third of US adults have no dental coverage. If the site only talks about insurance, those visitors assume they cannot afford you.',
					fix: 'Add a short “No insurance?” section: an in-house membership plan if you have one, your financing partner, and the price of a new-patient exam and x-rays.',
					rationale:
						'Opinion: a practice may deliberately focus on insured patients; this is a missed-opportunity flag, not a defect.',
					effort: '1–2 hours'
				}
			)
		);

	// 5. Emergency path.
	const em = locate(crawl, pages, patterns.emergencyPage, patterns.emergency);
	const emWithPhone = em.mentions.filter((p) => p.links.some((l) => l.kind === 'phone'));
	const afterHours = em.mentions.find((p) => patterns.afterHours.test(p.text));
	const sameDay = em.mentions.find((p) => patterns.sameDay.test(p.text));
	const triage = em.mentions.find((p) => patterns.emergencyTriage.test(p.text));
	const emStatus: Finding['status'] = !em.mentions.length
		? em.hints.length
			? 'needs_confirmation'
			: 'failed'
		: !emWithPhone.length
			? 'failed'
			: afterHours
				? 'passed'
				: 'needs_confirmation';
	out.push(
		check(
			'experience-emergency',
			'experience',
			'Emergency and after-hours instructions',
			emStatus,
			{
				scope: 'dental',
				section: 'emergency',
				evidence: em.mentions.length
					? [
							pageEvidence(
								em.pages[0] ?? em.mentions[0]!,
								[
									em.pages.length
										? `Dedicated page: ${em.pages[0]!.url}.`
										: 'Emergency is mentioned but has no dedicated page.',
									emWithPhone.length
										? 'A tel: link is on the same page.'
										: 'No tel: link on the page that mentions emergencies.',
									afterHours
										? `After-hours wording: “${quote(afterHours.text, patterns.afterHours, 60)}”.`
										: 'Nothing about what happens outside office hours.',
									triage
										? 'Gives guidance on what counts as an emergency.'
										: 'No guidance on what counts as an emergency (knocked-out tooth, swelling, bleeding).',
									sameDay
										? `Same-day claim: “${quote(sameDay.text, patterns.sameDay, 40)}” — confirm this is true every day it is published.`
										: ''
								]
									.filter(Boolean)
									.join(' ')
							)
						]
					: [
							pageEvidence(
								home,
								`No emergency or urgent-care wording on ${pages.length} fetched pages.`
							),
							...hintEvidence(home, em.hints, 'emergency instructions')
						],
				impact:
					'Someone searching “emergency dentist near me” at 9 pm is in pain and will call the first office whose site tells them what to do. This is the highest-intent traffic a practice gets.',
				fix:
					emStatus === 'passed'
						? 'Keep the after-hours number and routing current; test the number quarterly.'
						: 'Create an /emergency page with: the number to call, what happens after hours (answering service, on-call dentist, or “go to the ER if…”), which problems are true emergencies, and whether same-day visits are realistic.',
				effort:
					emStatus === 'passed'
						? 'No change required'
						: '2–3 hours: owner decides routing; one page'
			}
		)
	);

	// 6. The dentist.
	const dentists = practice.facts.filter((f) => f.key === 'dentist').map((f) => f.value);
	const bio = locate(
		crawl,
		pages,
		/about|team|meet|dentist|doctor|staff|dr[-_]/i,
		/\bDr\.?\s+[A-Z]/
	);
	const bioPage = bio.pages[0];
	const depth = bioPage
		? [
				patterns.dentalSchool.test(bioPage.mainText) ? 'education' : '',
				patterns.experienceYears.test(bioPage.mainText) ? 'years in practice' : '',
				patterns.memberships.test(bioPage.mainText) ? 'memberships or continuing education' : '',
				bioPage.images.some((i) =>
					/dr\b|doctor|dentist|headshot|portrait|team/i.test(`${i.alt ?? ''} ${i.src}`)
				)
					? 'a portrait'
					: ''
			].filter(Boolean)
		: [];
	const unnamedDr = pages.some((p) => /\bDr\.?\s+[A-Z][a-z]+/.test(p.text)) && !dentists.length;
	const drStatus: Finding['status'] =
		dentists.length || unnamedDr
			? bioPage
				? depth.length >= 2
					? 'passed'
					: 'needs_confirmation'
				: 'failed'
			: bio.hints.length
				? 'needs_confirmation'
				: 'failed';
	out.push(
		check(
			'experience-dentist',
			'experience',
			'The dentist is a real, identifiable person',
			drStatus,
			{
				scope: 'dental',
				section: 'team',
				severity: !dentists.length && !unnamedDr ? 'high' : 'moderate',
				priority:
					drStatus === 'failed' ? 'improvement' : drStatus === 'passed' ? 'none' : 'improvement',
				evidence: [
					pageEvidence(
						bioPage ?? home,
						[
							dentists.length
								? `Named with credentials: ${[...new Set(dentists)].join('; ')}.`
								: unnamedDr
									? 'A “Dr. …” is mentioned but no DDS/DMD credential appears beside the name.'
									: 'No named dentist with a DDS/DMD credential on any fetched page.',
							bioPage
								? `Biography page: ${bioPage.url} covers ${depth.length ? depth.join(', ') : 'none of education, years in practice, memberships or a portrait'}.`
								: 'No about/team/meet-the-dentist page was fetched.'
						].join(' '),
						'Bounded public page review'
					),
					...hintEvidence(home, bioPage ? [] : bio.hints, 'a dentist biography')
				],
				impact:
					'People choose a dentist, not a building. A nervous patient wants to see who will be in their mouth, where they trained and how long they have practised; a faceless site reads like a corporate chain.',
				fix:
					drStatus === 'passed'
						? 'Keep the biography current and written to the patient (“Dr. X will…”), not as a CV.'
						: 'Add a Meet-the-Dentist page per clinician: real portrait, name with DDS/DMD, dental school, year started, memberships, one paragraph on how they treat anxious patients, and a booking link.',
				effort:
					drStatus === 'passed'
						? 'No change required'
						: '2–4 hours per dentist, plus a photo session'
			}
		)
	);

	// 7. Service pages and whether they lead anywhere.
	const servicePages = pages.filter(
		(p) =>
			p !== home &&
			patterns.servicePage.test(`${new URL(p.url).pathname} ${p.title}`) &&
			p.wordCount > 40
	);
	const thinServicePages = servicePages.filter((p) => p.wordCount < 150);
	const lumpPage = servicePages.find((p) =>
		/\/(?:services?|treatments?|procedures?|dental-services|our-services)\/?$/i.test(
			new URL(p.url).pathname
		)
	);
	const specificPages = servicePages.filter((p) => p !== lumpPage);
	const deadEnds = specificPages.filter(
		(p) => !p.links.some((l) => l.kind === 'phone' || l.kind === 'booking') && !p.forms.length
	);
	const serviceHints =
		crawl.sitemap?.locations.filter((loc) => patterns.servicePage.test(loc)).length ?? 0;
	const sedation = pages.find((p) => patterns.sedation.test(p.text));
	const kids = pages.find((p) => patterns.pediatric.test(p.text));
	const svcStatus: Finding['status'] =
		!servicePages.length && !pages.some((p) => patterns.serviceWords.test(p.text))
			? 'failed'
			: !specificPages.length
				? serviceHints > 2
					? 'needs_confirmation'
					: 'failed'
				: deadEnds.length >= Math.ceil(specificPages.length / 2)
					? 'failed'
					: thinServicePages.length >= Math.ceil(specificPages.length / 2)
						? 'needs_confirmation'
						: 'passed';
	out.push(
		check(
			'experience-services',
			'experience',
			'Service pages that lead to a next step',
			svcStatus,
			{
				scope: 'dental',
				section: 'service',
				evidence: [
					pageEvidence(
						specificPages[0] ?? lumpPage ?? home,
						[
							`${specificPages.length} individual service pages fetched${lumpPage ? ` plus an overview page (${lumpPage.url})` : ''}; sitemap suggests about ${serviceHints} service URLs in total.`,
							deadEnds.length
								? `${deadEnds.length} service pages have no phone or booking link: ${deadEnds
										.slice(0, 4)
										.map((p) => p.url)
										.join(', ')}.`
								: specificPages.length
									? 'Each fetched service page has a phone or booking link.'
									: '',
							thinServicePages.length
								? `${thinServicePages.length} service pages are thin (under 150 words): ${thinServicePages
										.slice(0, 3)
										.map((p) => `${p.url} (${p.wordCount} words)`)
										.join(', ')}.`
								: '',
							sedation
								? 'Sedation/anxiety options are mentioned.'
								: 'No sedation or dental-anxiety wording was found.',
							kids ? 'Children/family wording is present.' : ''
						]
							.filter(Boolean)
							.join(' ')
					)
				],
				impact:
					svcStatus === 'failed' && !specificPages.length
						? 'Patients search for the procedure (“dental implants near me”), not the practice. One page listing twenty services cannot rank for any of them or answer the question “should I come to you for this?”.'
						: svcStatus === 'failed'
							? 'A patient who has just read about implants is as warm as a lead gets. A page that ends without a call or book button sends them back to Google.'
							: svcStatus === 'needs_confirmation'
								? 'The service pages exist but say very little. A patient comparing practices wants to know what the visit involves, how long it takes and roughly what it costs.'
								: 'The service pages exist and lead somewhere. Keep the clinical wording approved by the dentist.',
				fix:
					svcStatus === 'failed' && !specificPages.length
						? 'Create one page per high-value service (implants, Invisalign, emergency, crowns, whitening, kids): who it is for, what the visit involves, how long, cost range or how it is estimated, and a book/call action.'
						: svcStatus === 'failed'
							? 'Add a consistent call-to-action block (phone + book) to the service page template, above the fold and at the end.'
							: svcStatus === 'needs_confirmation'
								? 'Expand each thin service page to 300–600 words: who it is for, what happens at the visit, how long, aftercare, cost or how it is estimated, and the dentist’s own words.'
								: 'Add a short “what it costs / how we estimate” paragraph to the top three services if not present.',
				effort:
					svcStatus === 'failed'
						? specificPages.length
							? '1–2 hours: template change'
							: '4–8 hours per page for the top five services'
						: 'No change required'
			}
		)
	);

	// 8. Hours.
	const hoursPages = pages.filter((p) => patterns.hours.test(p.text));
	const hoursOnHome = patterns.hours.test(home.text) || patterns.hours.test(home.footerText);
	const extended = hoursPages.find((p) =>
		patterns.extendedHours.test(quote(p.text, patterns.hours, 200))
	);
	out.push(
		check(
			'experience-hours',
			'experience',
			'Office hours where patients look',
			!hoursPages.length ? 'failed' : hoursOnHome ? 'passed' : 'needs_confirmation',
			{
				scope: 'dental',
				section: 'contact',
				severity: !hoursPages.length ? 'moderate' : 'low',
				priority: !hoursPages.length ? 'improvement' : hoursOnHome ? 'none' : 'polish',
				evidence: hoursPages.length
					? [
							pageEvidence(
								hoursPages[0]!,
								`Hours wording “${quote(hoursPages[0]!.text, patterns.hours, 30)}” on ${hoursPages.length} pages; ${hoursOnHome ? 'present on the homepage/footer' : 'not on the homepage or footer'}. ${extended ? 'Evening or weekend hours are mentioned.' : ''}`
							)
						]
					: [pageEvidence(home, `No day/time hours pattern on ${pages.length} fetched pages.`)],
				impact:
					'Hours are the second thing people check after the phone number, often from the car. If they are only on the contact page, half the visitors never see them.',
				fix: hoursPages.length
					? 'Put the weekly hours in the footer template and keep them identical to the Google listing.'
					: 'Add weekly hours to the footer and contact page, and mirror them in the Google Business Profile.',
				effort: '30–60 minutes'
			}
		)
	);

	// 9. Location and directions.
	const addressPages = factPages('address');
	const mapsLinkPages = pages.filter((p) => p.links.some((l) => l.kind === 'maps'));
	const mapEmbedPages = pages.filter((p) =>
		p.iframes.some((src) =>
			/google\.com\/maps|maps\.google|mapbox|openstreetmap|bing\.com\/maps/i.test(src)
		)
	);
	const parking = pages.find((p) => patterns.parking.test(p.text));
	const accessibleOffice = pages.find((p) => patterns.accessibilityOffice.test(p.text));
	const dirStatus: Finding['status'] =
		!addressPages.length && !mapsLinkPages.length
			? 'failed'
			: addressPages.length && (mapsLinkPages.length || mapEmbedPages.length)
				? 'passed'
				: 'needs_confirmation';
	out.push(
		check('experience-directions', 'experience', 'Address, map and getting there', dirStatus, {
			scope: 'dental',
			section: 'contact',
			evidence: [
				pageEvidence(
					addressPages[0] ?? mapsLinkPages[0] ?? home,
					[
						addressPages.length
							? `Visible street address matching structured data on ${addressPages.length} pages.`
							: 'No street address that appears both visibly and in structured data.',
						mapsLinkPages.length
							? 'A Google Maps directions link exists.'
							: 'No Google Maps directions link.',
						mapEmbedPages.length ? 'An embedded map exists.' : '',
						parking ? 'Parking is explained.' : 'Parking is not mentioned.',
						accessibleOffice ? 'Office accessibility (wheelchair/entrance) is mentioned.' : ''
					]
						.filter(Boolean)
						.join(' ')
				)
			],
			impact:
				'A local business that hides its address looks temporary. Patients also want to know about parking before they commit to a 7:30 am appointment.',
			fix:
				dirStatus === 'passed'
					? 'Add a one-line parking note next to the address if there is none.'
					: 'Show the full address in the footer, mark it up in Dentist schema, and add a “Get directions” link to the exact Google Maps listing plus a sentence about parking and the entrance.',
			effort: '30–90 minutes'
		})
	);

	// 10. Reviews and social proof.
	const reviewLinks = pages.flatMap((p) =>
		p.links.filter((l) =>
			/g\.page|search\.google\.com\/local\/writereview|google\.com\/maps.*reviews|yelp\.com|healthgrades\.com|zocdoc\.com\/dentist/i.test(
				l.url
			)
		)
	);
	const reviewWidgets = pages.filter((p) =>
		p.thirdPartyHosts.some((h) =>
			/birdeye|podium|reviewsonmywebsite|elfsight|trustindex|embedsocial|grade\.us|nicejob|swellcx|rateabiz|reviewwave|demandforce|solutionreach/i.test(
				h
			)
		)
	);
	const reviewText = pages.filter(
		(p) =>
			patterns.reviews.test(p.headings.map((h) => h.text).join(' ')) ||
			/★|⭐|5-star|five.star/i.test(p.text)
	);
	const rvStatus: Finding['status'] =
		reviewLinks.length || reviewWidgets.length
			? 'passed'
			: reviewText.length
				? 'needs_confirmation'
				: 'failed';
	out.push(
		check('experience-reviews', 'experience', 'Reviews patients can verify', rvStatus, {
			scope: 'dental',
			section: 'reviews',
			severity: 'low',
			priority: rvStatus === 'passed' ? 'none' : 'improvement',
			evidence: [
				pageEvidence(
					reviewWidgets[0] ?? reviewText[0] ?? home,
					[
						reviewWidgets.length
							? `Review widget vendor detected (${[...new Set(reviewWidgets.flatMap((p) => p.thirdPartyHosts.filter((h) => /birdeye|podium|reviewsonmywebsite|elfsight|trustindex|embedsocial|grade\.us|nicejob|swellcx|rateabiz|reviewwave|demandforce|solutionreach/i.test(h))))].join(', ')}).`
							: '',
						reviewLinks.length
							? `Links to third-party review profiles: ${reviewLinks
									.slice(0, 3)
									.map((l) => l.url)
									.join(', ')}.`
							: 'No link to Google, Yelp or Healthgrades reviews.',
						reviewText.length && !reviewWidgets.length
							? 'Testimonials are quoted on the site itself, where visitors cannot check them.'
							: ''
					]
						.filter(Boolean)
						.join(' ')
				)
			],
			impact:
				'Patients read Google reviews before they read your website. Hand-picked quotes on your own site carry little weight; a live feed or a link to the real profile does.',
			fix:
				rvStatus === 'passed'
					? 'Keep responding to reviews; the responses are read as much as the reviews.'
					: 'Link “Read our Google reviews” to the exact listing, or embed a live review feed. Keep on-site testimonials, but only with written patient authorization.',
			effort: '30–60 minutes'
		})
	);

	// 11. Phone-number consistency (local SEO and call tracking).
	const numbers = new Set(
		pages
			.flatMap((p) => p.links.filter((l) => l.kind === 'phone').map((l) => lastTen(l.url)))
			.filter((n) => n.length === 10)
	);
	const callTracking = pages.some((p) =>
		p.thirdPartyHosts.some((h) =>
			/callrail|calltrackingmetrics|whatconverts|invoca|marchex|callsource/i.test(h)
		)
	);
	if (numbers.size > 1 && practice.resolution !== 'ambiguous')
		out.push(
			check(
				'experience-phone-consistency',
				'experience',
				'More than one phone number for one office',
				'needs_confirmation',
				{
					scope: 'dental',
					section: 'contact',
					confidence: callTracking ? 'medium' : 'high',
					severity: 'low',
					priority: 'polish',
					evidence: [
						pageEvidence(
							home,
							`${numbers.size} distinct tel: numbers across fetched pages (ending …${[...numbers].map((n) => n.slice(-4)).join(', …')}). ${callTracking ? 'A call-tracking vendor script is present, which may explain the difference.' : 'No call-tracking vendor script was detected.'}`
						)
					],
					impact:
						'Different numbers on the website and the Google listing confuse patients and weaken local search consistency. Call-tracking numbers are fine only when swapped in dynamically for the matching ad source.',
					fix: callTracking
						? 'Confirm the tracking vendor uses dynamic number insertion and that the HTML source carries the real office number.'
						: 'Use one published office number everywhere unless the second number belongs to a second real location.',
					effort: '30–60 minutes'
				}
			)
		);

	// 12. Positive signals worth telling the owner about.
	const languages = practice.facts.find((f) => f.key === 'languages');
	if (languages)
		out.push(
			check('experience-languages', 'experience', 'Language availability is stated', 'passed', {
				scope: 'dental',
				evidence: languages.evidence,
				impact:
					'Spanish-speaking (and other) patients can see they will be understood; a real differentiator in many markets.',
				fix: 'Consider a Spanish version of the new-patient and insurance pages if that audience matters locally.'
			})
		);

	return { findings: out, journeys: journeys(out, pages, practice) };
}
const untestedTitles: Record<string, string> = {
	'experience-contact': 'Click-to-call phone number',
	'experience-booking': 'Appointment booking route',
	'experience-new-patient': 'New-patient path',
	'experience-insurance': 'Insurance and payment clarity',
	'experience-emergency': 'Emergency and after-hours instructions',
	'experience-dentist': 'The dentist is a real, identifiable person',
	'experience-services': 'Service pages that lead to a next step',
	'experience-hours': 'Office hours where patients look',
	'experience-directions': 'Address, map and getting there',
	'experience-reviews': 'Reviews patients can verify'
};
function journeys(out: Finding[], pages: Page[], practice: Report['practice']): Report['journeys'] {
	const home = pages[0];
	const byId = (ids: string[]) => out.filter((f) => ids.includes(f.id));
	const step = (label: string, pattern: RegExp, observation: string) => {
		const p = pages.find((x) => pattern.test(x.url + ' ' + x.text));
		return {
			label,
			url: p?.url,
			observation: p ? observation : 'No relevant page was found in the bounded crawl.'
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
	return [
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
					/DDS|DMD|\bDr\.?\s+[A-Z]/,
					'A named clinician is visible; tone, credentials and portrait need review.'
				),
				step(
					'Understand the first visit',
					/first.visit|new.patient/i,
					'First-visit content exists; see the new-patient finding for what it covers.'
				),
				step(
					'Request an appointment',
					/appointment|schedul|book/i,
					'Booking destinations are HTTP-checked; no forms were submitted.'
				)
			]
		),
		journey(
			'Someone in pain at 9 pm',
			['experience-emergency', 'experience-contact', 'experience-hours'],
			[
				step(
					'Find urgent instructions',
					/emergenc|urgent/i,
					'Urgent-care wording is visible; see the emergency finding for after-hours coverage.'
				),
				step('Tap to call', /tel:|call/i, 'Public phone links are reviewed without making calls.'),
				step(
					'Check the hours',
					/hours|monday|directions/i,
					'Public hours wording is compared where available.'
				)
			]
		),
		journey(
			'Someone researching a procedure',
			['experience-services', 'experience-dentist', 'experience-insurance', 'experience-booking'],
			[
				step(
					'Read about the procedure',
					patterns.serviceWords,
					'Service text is assessed for a next step and practical detail.'
				),
				step(
					'Understand the clinician and the cost',
					/insurance|DDS|DMD/i,
					'Only published credentials and payment wording are observed.'
				),
				step(
					'Book from the service page',
					/appointment|schedul|book/i,
					'Service pages are checked for a phone or booking action.'
				)
			]
		)
	];
}
