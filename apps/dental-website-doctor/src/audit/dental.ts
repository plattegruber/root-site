import type { Finding } from '../model.js';
import { isPracticeNode, schemaNodes, type Crawl, type Page } from './pages.js';
import { check, pageEvidence, patterns, quoteAll, usablePages } from './signals.js';

/**
 * Compliance and trust checks that are specific to a healthcare business. These are the
 * findings a generic website checker never produces: PHI leaking through forms and ad
 * pixels, advertising claims state dental boards police, patient photos without
 * authorization, and structured-data habits that get a listing ignored.
 */

/** Script/frame hosts that sell or retarget on behaviour; the HHS tracking bulletin's main concern. */
const advertisingHosts =
	/connect\.facebook\.net|facebook\.com\/tr|analytics\.tiktok\.com|snap\.licdn\.com|bat\.bing\.com|ads\.linkedin|doubleclick\.net|googleadservices\.com|googlesyndication|pinimg\.com|ct\.pinterest\.com|sc-static\.net|adsrvr\.org|criteo|taboola|outbrain|adroll|quantserve|scorecardresearch/i;
/** Tools that record keystrokes or sessions; they capture what a patient types even without a submit. */
const recorderHosts =
	/hotjar|clarity\.ms|fullstory|mouseflow|luckyorange|crazyegg|smartlook|logrocket|inspectlet|quantummetric/i;
const analyticsHosts =
	/google-analytics\.com|googletagmanager\.com|heap\.io|segment\.(?:com|io)|mixpanel|amplitude|plausible|matomo|statcounter/i;
/** Fields that ask for health, insurance or identity details outright. */
const strongPhiField =
	/insurance|member.?id|group.?(?:number|id)|subscriber|symptom|pain|tooth|teeth|dental (?:history|problem|issue|concern)|medical|health|condition|medication|allerg|pregnan|date.?of.?birth|\bdob\b|birth.?date|\bssn\b|social.?security|treatment|procedure|reason|concern|appointment.?type|new.?patient|existing.?patient/i;
/** Free-text boxes where patients often volunteer health details unprompted. */
const freeTextField = /message|comments?|notes?|describe|how can we help|question/i;
/** Labels that explicitly tell the patient not to enter health details. */
const phiDisclaimer =
	/do not include|don'?t include|please do not|no (?:health|medical) (?:details|information)/i;
const inlinePixel = /fbq\(|_fbq|ttq\.load|snaptr\(|pintrk\(|uetq|lintrk|gtag\('config',\s*'AW-/;

/** Wording most US state dental boards treat as false, misleading or unverifiable advertising. */
const superlatives: [RegExp, string][] = [
	[
		/\bpain-?less\b|\bpain-?free\b|\bno pain\b/i,
		'promises an outcome (“painless”) no clinician can guarantee'
	],
	[/\bguarantee[ds]?\b/i, 'offers a guarantee; many boards treat guaranteed results as misleading'],
	[
		/\bbest (?:dentist|dental (?:office|practice|care))\b|\b#\s?1\b|\bno\.\s?1\b|\btop[- ]rated\b|\bvoted best\b|\baward[- ]winning\b/i,
		'superiority claim that must be substantiated and attributed (who voted, when)'
	],
	[/\bpermanent(?:ly)? (?:whiten|straighten|fix|solution)/i, 'describes a result as permanent'],
	[/\bcure[sd]?\b/i, 'uses “cure” for a dental condition'],
	[/\bone[- ]visit\b.*\bguarantee|\bsame[- ]day\b.*\bguarantee/i, 'guarantees a timeline'],
	[
		/\b(?:lifetime|life-long) (?:warranty|results|guarantee)\b/i,
		'promises lifetime results or warranty'
	]
];
/** ADA/NCRDSCB recognised specialties. Anything else described as a “specialty” is a board risk. */
const recognisedSpecialties =
	/endodont|orthodont|pediatric dent|periodont|prosthodont|oral (?:and|&) maxillofacial|oral surg|dental public health|oral medicine|orofacial pain|dental anesthesiolog|oral patholog|oral radiolog/i;
const nonSpecialtyWord =
	'(?:cosmetic|implant|sedation|family|general|holistic|biological|laser|smile|restorative|preventive|emergency|sleep|tmj|whitening|invisalign|veneers?|dentures?|full.mouth)';
/** “cosmetic dentistry specialist”, “specializes in implant dentistry”, “specialty: sedation”. */
const specialtyClaims = [
	new RegExp(`\\b${nonSpecialtyWord}[a-z -]{0,25}?\\s+specialists?\\b`, 'gi'),
	new RegExp(
		`\\bspecial(?:ist|ists|ty|ity)s?\\s+(?:in|of|for)\\s+[a-z ,&-]{0,20}?${nonSpecialtyWord}`,
		'gi'
	),
	new RegExp(`\\bspecializ(?:e|es|ing)\\s+in\\s+[a-z ,&-]{0,20}?${nonSpecialtyWord}`, 'gi')
];

export function dentalCompliance(crawl: Crawl): Finding[] {
	const pages = usablePages(crawl);
	const home = pages[0];
	const out: Finding[] = [];
	if (!home) return out;

	// 1. Forms that collect health information next to advertising, recording or analytics tools.
	const formPages = pages.filter((p) => p.forms.some((f) => f.fields.length));
	const fieldText = (x: { name: string; label: string; placeholder: string }) =>
		`${x.name} ${x.label} ${x.placeholder}`;
	const isStrong = (x: { name: string; label: string; placeholder: string }) =>
		strongPhiField.test(fieldText(x)) && !phiDisclaimer.test(fieldText(x));
	const isFreeText = (x: { name: string; label: string; placeholder: string; type: string }) =>
		!isStrong(x) && (x.type === 'textarea' || freeTextField.test(fieldText(x)));
	type Exposure = {
		page: Page;
		strong: string[];
		freeText: string[];
		ad: string[];
		recorders: string[];
		analytics: string[];
		transport: string[];
	};
	const name = (x: { name: string; label: string; placeholder: string; type: string }) =>
		x.label || x.name || x.placeholder || x.type;
	const exposures: Exposure[] = formPages
		.map((page) => {
			const fields = page.forms.flatMap((f) => f.fields);
			const ad = page.thirdPartyHosts.filter((h) => advertisingHosts.test(h));
			if (inlinePixel.test(page.inlineScriptText)) ad.push('inline pixel code');
			const transport = page.forms
				.filter((f) => f.fields.some((x) => isStrong(x) || isFreeText(x)))
				.flatMap((f) => [
					...(f.action.startsWith('mailto:') ? [`posts by mailto: (${f.action})`] : []),
					...(f.method === 'get' && !/search/i.test(f.action + f.fields.map((x) => x.name).join())
						? ['submits with GET, so answers land in URLs and server logs']
						: []),
					...(/^http:/i.test(f.action) ? [`submits to an insecure http: URL (${f.action})`] : [])
				]);
			return {
				page,
				strong: [...new Set(fields.filter(isStrong).map(name))],
				freeText: [...new Set(fields.filter(isFreeText).map(name))],
				ad: [...new Set(ad)],
				recorders: page.thirdPartyHosts.filter((h) => recorderHosts.test(h)),
				analytics: page.thirdPartyHosts.filter((h) => analyticsHosts.test(h)),
				transport
			};
		})
		.filter((e) => e.strong.length || e.freeText.length);
	// Tiered so an ordinary contact form next to Google Analytics is not reported as urgent.
	const adStrong = exposures.filter((e) => e.ad.length && e.strong.length);
	const adFreeText = exposures.filter((e) => e.ad.length && !e.strong.length);
	const recorded = exposures.filter((e) => !e.ad.length && e.recorders.length);
	const analyticsStrong = exposures.filter(
		(e) => !e.ad.length && !e.recorders.length && e.analytics.length && e.strong.length
	);
	const tier = adStrong.length
		? 'ad-strong'
		: adFreeText.length
			? 'ad-free'
			: recorded.length
				? 'recorder'
				: analyticsStrong.length
					? 'analytics'
					: 'clean';
	const flagged = [...adStrong, ...adFreeText, ...recorded, ...analyticsStrong];
	const impacts = {
		'ad-strong':
			'A dental practice is a HIPAA covered entity. Meta, TikTok and Google Ads pixels on a page where patients type “tooth pain, Delta Dental, DOB” have been the basis of class actions and OCR enforcement since the 2022 HHS tracking bulletin. This is a legal exposure, not a UX nit.',
		'ad-free':
			'An advertising pixel sits on a page whose form has an open message box. Patients routinely type “my crown fell off” or their insurer there, and the pixel reports the visit and submission to the ad network.',
		recorder:
			'Session-recording tools capture what patients type into a form, keystroke by keystroke. HHS treats that as PHI disclosure unless the vendor signs a BAA, and most of these vendors do not.',
		analytics:
			'The form asks for health or insurance details on a page with analytics or a tag manager. Google Analytics does not sign BAAs, and a tag manager can quietly load an ad pixel later. Confirm what the container fires on this page.',
		clean:
			'Health-related form fields are not sitting next to advertising pixels or session recorders in the fetched pages.'
	} as const;
	const fixes = {
		'ad-strong':
			'Remove advertising pixels from every page with a form (or from the whole site), or move intake to a HIPAA-compliant forms vendor with a signed BAA. Review the tag manager container; use server-side conversion tracking without PHI if ads must be measured.',
		'ad-free':
			'Remove the pixel from form pages, or add a line under the message box asking patients not to include health details and send conversions server-side without form content.',
		recorder:
			'Exclude form pages from session recording and mask all inputs, or remove the tool; confirm a BAA if it stays.',
		analytics:
			'Open the tag manager container and confirm no ad or recording tags fire on this page; disable form-field capture in analytics; prefer a HIPAA-compliant forms vendor for intake.',
		clean: 'Keep it that way: no pixels on intake pages, and a BAA with the forms vendor.'
	} as const;
	out.push(
		check(
			'compliance-form-phi',
			'compliance',
			'Health information in forms next to tracking pixels',
			!formPages.length
				? 'not_tested'
				: tier === 'clean'
					? 'passed'
					: tier === 'analytics'
						? 'needs_confirmation'
						: 'failed',
			{
				scope: 'dental',
				section: 'privacy',
				severity:
					tier === 'ad-strong'
						? 'high'
						: tier === 'ad-free' || tier === 'recorder'
							? 'moderate'
							: tier === 'analytics'
								? 'low'
								: 'info',
				confidence: tier === 'ad-strong' ? 'high' : 'medium',
				evidence: (flagged.length ? flagged : exposures).length
					? (flagged.length ? flagged : exposures)
							.slice(0, 4)
							.map((e) =>
								pageEvidence(
									e.page,
									[
										e.strong.length
											? `Fields asking for health, insurance or identity details: ${e.strong.slice(0, 6).join(', ')}.`
											: '',
										e.freeText.length
											? `Free-text fields: ${e.freeText.slice(0, 3).join(', ')}.`
											: '',
										e.ad.length
											? `Advertising trackers on the same page: ${e.ad.join(', ')}.`
											: 'No advertising tracker on this page.',
										e.recorders.length ? `Session recorders: ${e.recorders.join(', ')}.` : '',
										e.analytics.length ? `Analytics/tag manager: ${e.analytics.join(', ')}.` : ''
									]
										.filter(Boolean)
										.join(' '),
									'Static HTML: form fields and third-party script hosts'
								)
							)
					: [
							pageEvidence(
								home,
								formPages.length
									? 'Forms were found but none of their fields ask for health details or free text.'
									: 'No forms with fields were found in the fetched pages.'
							)
						],
				impact: impacts[tier],
				fix: fixes[tier],
				rationale:
					'Based on the HHS OCR bulletin on online tracking technologies (Dec 2022, updated Mar 2024). Parts were vacated for unauthenticated pages in June 2024, so a plain contact form is a judgement call; a form that asks for symptoms, insurance or date of birth next to an ad pixel is the case the bulletin still squarely covers.',
				effort: tier === 'ad-strong' ? '2–4 hours plus marketing sign-off' : '1–2 hours'
			}
		)
	);
	const badTransport = exposures.filter((e) => e.transport.length);
	if (badTransport.length)
		out.push(
			check(
				'compliance-form-transport',
				'compliance',
				'Patient form submits insecurely',
				'failed',
				{
					scope: 'dental',
					section: 'privacy',
					severity: 'high',
					evidence: badTransport.map((e) =>
						pageEvidence(e.page, e.transport.join('; '), 'Static HTML form attributes')
					),
					impact:
						'A form that emails or GETs health details sends them in plain text through systems no BAA covers. Patients cannot see this; regulators can.',
					fix: 'Submit forms over HTTPS with POST to a HIPAA-compliant handler or forms vendor; never use mailto: for anything beyond a name and phone number.',
					effort: '1–3 hours'
				}
			)
		);

	// 2. Privacy policy / Notice of Privacy Practices.
	const privacyLinks = pages.flatMap((p) =>
		p.links.filter((l) => patterns.privacyLink.test(`${l.label} ${l.url}`))
	);
	const npp = privacyLinks.find((l) => /hipaa|notice of privacy/i.test(`${l.label} ${l.url}`));
	out.push(
		check(
			'compliance-privacy-policy',
			'compliance',
			'Privacy policy and HIPAA notice',
			privacyLinks.length ? (npp ? 'passed' : 'needs_confirmation') : 'failed',
			{
				scope: 'dental',
				section: 'privacy',
				severity: privacyLinks.length ? 'low' : 'moderate',
				priority: privacyLinks.length ? (npp ? 'none' : 'polish') : 'improvement',
				evidence: [
					pageEvidence(
						home,
						privacyLinks.length
							? `Privacy-related links: ${[...new Set(privacyLinks.map((l) => l.url))].slice(0, 3).join(', ')}. ${npp ? 'A HIPAA Notice of Privacy Practices link is present.' : 'No link that names HIPAA or the Notice of Privacy Practices.'}`
							: `No privacy, HIPAA or notice-of-privacy link on ${pages.length} fetched pages.`
					)
				],
				impact: privacyLinks.length
					? 'A website privacy policy exists. Covered entities must also make the Notice of Privacy Practices prominently available on the site.'
					: 'Any site with a form needs a privacy policy, and a dental practice must post its HIPAA Notice of Privacy Practices. Its absence is the first thing a complaint investigator checks.',
				fix: privacyLinks.length
					? 'Link the Notice of Privacy Practices (PDF or page) from the footer next to the privacy policy.'
					: 'Add a footer link to a privacy policy that covers the forms and trackers in use, and a link to the Notice of Privacy Practices.',
				effort: '1–2 hours'
			}
		)
	);

	// 3. Advertising claims.
	const claims = pages.flatMap((p) =>
		superlatives.flatMap(([re, why]) => {
			const hits = quoteAll(p.mainText, re, 2);
			return hits.map((h) => ({ page: p, quote: h, why }));
		})
	);
	if (claims.length)
		out.push(
			check(
				'compliance-advertising-claims',
				'compliance',
				'Advertising claims a dental board may question',
				'failed',
				{
					scope: 'dental',
					confidence: 'medium',
					severity: 'moderate',
					evidence: claims
						.slice(0, 6)
						.map((c) => pageEvidence(c.page, `“${c.quote}” — ${c.why}.`, 'Visible copy review')),
					impact:
						'State dental practice acts prohibit false, misleading or unverifiable advertising, and competitors do file complaints. “Painless”, “guaranteed” and “best” are the usual triggers.',
					fix: 'Rewrite to what you can substantiate: “we use topical and local anesthetic and go slowly”, “voted Best of [City] 2025 by [publication]”, “most whitening lasts 1–3 years with touch-ups”.',
					rationale:
						'The text is objectively present; whether a given state board would act on it is a judgement, so confidence is medium. Have the dentist review against their state’s rules.',
					effort: '1–2 hours of copy edits'
				}
			)
		);
	const specialty = pages.flatMap((p) =>
		specialtyClaims
			.flatMap((re) => [...p.mainText.matchAll(re)])
			.map((m) => ({
				hit: m[0],
				window: p.mainText
					.slice(Math.max(0, (m.index ?? 0) - 60), (m.index ?? 0) + m[0].length + 60)
					.trim()
			}))
			// “we refer you to a specialist” is the opposite of a claim.
			.filter(({ hit, window }) => !recognisedSpecialties.test(hit) && !/\brefer/i.test(window))
			.slice(0, 2)
			.map(({ window }) => ({ page: p, quote: `…${window}…` }))
	);
	if (specialty.length)
		out.push(
			check(
				'compliance-specialty-claims',
				'compliance',
				'“Specialist” wording for a non-recognised specialty',
				'failed',
				{
					scope: 'dental',
					confidence: 'medium',
					severity: 'moderate',
					evidence: specialty
						.slice(0, 4)
						.map((s) => pageEvidence(s.page, `“${s.quote}”`, 'Visible copy review')),
					impact:
						'Cosmetic, implant, sedation and family dentistry are not ADA-recognised specialties. Many states let only licensed specialists use “specialist”/“specializes in”; a general dentist can be disciplined for it.',
					fix: 'Use “focuses on”, “with advanced training in” or “provides” instead, and name the actual training (e.g. “AAID credentialed”, “300+ hours of implant CE”).',
					rationale:
						'Rules differ by state and courts have struck some down on First Amendment grounds; this is a review flag for the dentist, not a verdict.',
					effort: '30–60 minutes'
				}
			)
		);

	// 4. Patient photos and testimonials.
	const testimonialPages = pages.filter(
		(p) =>
			/testimonial|what (?:our )?patients say|patient stories|reviews/i.test(
				p.headings.map((h) => h.text).join(' ')
			) && /[“"][^”"]{40,}[”"]\s*[-–—]\s*[A-Z][a-z]+/.test(p.mainText)
	);
	const galleryPages = pages.filter((p) =>
		patterns.beforeAfter.test(`${p.url} ${p.title} ${p.headings.map((h) => h.text).join(' ')}`)
	);
	const disclaimer = galleryPages.some((p) => patterns.resultsDisclaimer.test(p.text));
	if (testimonialPages.length || galleryPages.length)
		out.push(
			check(
				'compliance-patient-media',
				'compliance',
				'Patient testimonials and before/after photos need authorization',
				galleryPages.length && !disclaimer ? 'failed' : 'needs_confirmation',
				{
					scope: 'dental',
					section: 'reviews',
					severity: 'low',
					priority: 'improvement',
					evidence: [
						...testimonialPages
							.slice(0, 2)
							.map((p) => pageEvidence(p, 'Named patient testimonials quoted on the site.')),
						...galleryPages
							.slice(0, 2)
							.map((p) =>
								pageEvidence(
									p,
									`Before/after or smile gallery content. ${disclaimer ? 'A results-may-vary disclaimer is present.' : 'No “results may vary / actual patient” disclaimer found.'}`
								)
							)
					],
					impact:
						'Using a patient’s name, photo or treatment story in marketing requires a signed HIPAA marketing authorization, separate from the consent to treat. Several states also require a disclaimer on before/after images.',
					fix: 'Keep a signed authorization on file for every named testimonial and photo; add “Actual patient. Individual results vary.” under galleries; remove anything you cannot document.',
					effort: '1–2 hours of records review'
				}
			)
		);

	// 5. Structured data: self-serving reviews and practice schema completeness.
	const nodes = pages.flatMap((p) =>
		p.jsonLd.flatMap(schemaNodes).map((n) => ({ page: p, node: n }))
	);
	const practiceNodes = nodes.filter(({ node }) => isPracticeNode(node));
	const selfReviews = practiceNodes.filter(
		({ node }) => node.aggregateRating || node.review || node.reviews
	);
	if (selfReviews.length)
		out.push(
			check('compliance-schema-reviews', 'compliance', 'Self-serving review markup', 'failed', {
				scope: 'general',
				severity: 'low',
				priority: 'polish',
				evidence: selfReviews
					.slice(0, 2)
					.map(({ page, node }) =>
						pageEvidence(
							page,
							`${JSON.stringify(node['@type'])} node carries ${['aggregateRating', 'review', 'reviews'].filter((k) => node[k]).join(' and ')}.`,
							'JSON-LD inspection'
						)
					),
				impact:
					'Google stopped showing star snippets for reviews a business publishes about itself in 2019. This markup is ignored at best and treated as spammy at worst; many dental templates still ship it.',
				fix: 'Remove aggregateRating/review from the Dentist/LocalBusiness node. Earn stars through the Google Business Profile instead.',
				effort: '30 minutes'
			})
		);
	const visiblePhones = new Set(
		pages.flatMap((p) =>
			p.links.filter((l) => l.kind === 'phone').map((l) => l.url.replace(/\D/g, '').slice(-10))
		)
	);
	const schemaDetail = practiceNodes.map(({ page, node }) => {
		const address = node.address as Record<string, unknown> | undefined;
		const phone = String(node.telephone ?? '')
			.replace(/\D/g, '')
			.slice(-10);
		return {
			page,
			type: JSON.stringify(node['@type']),
			dentistType: [node['@type']].flat().some((t) => /Dentist|DentalClinic/.test(String(t))),
			has: {
				telephone: Boolean(node.telephone),
				phoneMatches: !phone || visiblePhones.size === 0 ? undefined : visiblePhones.has(phone),
				address: Boolean(address && typeof address === 'object' && address.streetAddress),
				geo: Boolean(node.geo),
				hours: Boolean(node.openingHoursSpecification || node.openingHours),
				image: Boolean(node.image || node.logo),
				url: Boolean(node.url),
				priceRange: Boolean(node.priceRange)
			}
		};
	});
	const best = schemaDetail.sort(
		(a, b) =>
			Object.values(b.has).filter(Boolean).length - Object.values(a.has).filter(Boolean).length
	)[0];
	const missing = best
		? Object.entries(best.has)
				.filter(([k, v]) => k !== 'phoneMatches' && k !== 'priceRange' && !v)
				.map(([k]) => k)
		: [];
	out.push(
		check(
			'compliance-schema-practice',
			'compliance',
			'Dentist structured data for local search',
			!best
				? 'failed'
				: best.has.phoneMatches === false
					? 'failed'
					: missing.length
						? 'failed'
						: best.dentistType
							? 'passed'
							: 'needs_confirmation',
			{
				scope: 'dental',
				severity: !best ? 'moderate' : 'low',
				priority: !best
					? 'improvement'
					: best.has.phoneMatches === false || missing.length
						? 'polish'
						: best.dentistType
							? 'none'
							: 'polish',
				evidence: best
					? [
							pageEvidence(
								best.page,
								`${best.type} node: ${Object.entries(best.has)
									.filter(([, v]) => v)
									.map(([k]) => k)
									.join(
										', '
									)} present${missing.length ? `; missing ${missing.join(', ')}` : ''}${best.has.phoneMatches === false ? '; schema telephone does not match any visible tel: link' : ''}${best.dentistType ? '' : '; type is not Dentist/DentalClinic'}.`,
								'JSON-LD inspection'
							)
						]
					: [
							pageEvidence(
								home,
								`No Dentist, DentalClinic, MedicalClinic or LocalBusiness JSON-LD on ${pages.length} fetched pages.`,
								'JSON-LD inspection'
							)
						],
				impact: !best
					? 'Structured data is how Google confirms the website, phone, address and hours belong to the same dental office as the Maps listing. Without it the connection relies on guesswork.'
					: 'The practice node exists; the gaps limit how confidently Google ties the site to the listing and shows hours and location.',
				fix: !best
					? 'Add a Dentist JSON-LD node on the homepage: name, url, telephone, image, address (PostalAddress), geo, openingHoursSpecification, and sameAs for the Google listing and social profiles. Values must match the visible page and the Google Business Profile exactly.'
					: `Complete the node: ${[...missing, ...(best.has.phoneMatches === false ? ['make telephone match the visible number'] : []), ...(best.dentistType ? [] : ['use @type Dentist'])].join(', ') || 'no change required'}.`,
				effort: '1–2 hours'
			}
		)
	);

	// 6. Hours in schema vs visible hours (days only; times are too varied to parse safely).
	const schemaDays = new Set(
		practiceNodes.flatMap(({ node }) => {
			const spec = node.openingHoursSpecification;
			const specs = Array.isArray(spec) ? spec : spec ? [spec] : [];
			return specs.flatMap((s) => {
				const d = (s as Record<string, unknown>).dayOfWeek;
				return (Array.isArray(d) ? d : d ? [d] : []).map((x) =>
					String(x).replace(/.*\//, '').toLowerCase()
				);
			});
		})
	);
	if (schemaDays.size) {
		const visible = visibleDays(pages.map((p) => p.text).join(' '));
		const unmentioned = [...schemaDays].filter((d) => !visible.has(d.slice(0, 3)));
		out.push(
			check(
				'compliance-hours-consistency',
				'compliance',
				'Hours in structured data match the visible hours',
				unmentioned.length ? 'needs_confirmation' : 'passed',
				{
					scope: 'dental',
					section: 'contact',
					severity: 'low',
					priority: unmentioned.length ? 'polish' : 'none',
					evidence: [
						pageEvidence(
							home,
							`Schema lists ${[...schemaDays].join(', ')}; ${unmentioned.length ? `${unmentioned.join(', ')} never appear in visible text` : 'each day also appears in visible text'}. Times are not compared automatically.`,
							'JSON-LD vs visible text'
						)
					],
					impact:
						'Patients see the visible hours; Google reads the schema and the Business Profile. When they disagree, someone drives to a closed office.',
					fix: 'Keep one source of truth for hours and generate the footer, the schema and the Google listing from it.',
					effort: '30 minutes'
				}
			)
		);
	}
	return out;
}
/** Days named in visible text, with ranges like “Mon–Thu” or “Monday to Friday” expanded. */
export function visibleDays(text: string): Set<string> {
	const order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	const found = new Set<string>();
	const lower = text.toLowerCase();
	for (const d of order) if (new RegExp(`\\b${d}`).test(lower)) found.add(d);
	for (const m of lower.matchAll(
		/\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?\s*(?:[-–—]|to|through|thru)\s*(mon|tue|wed|thu|fri|sat|sun)/g
	)) {
		const a = order.indexOf(m[1]!);
		const b = order.indexOf(m[2]!);
		if (a !== -1 && b !== -1 && a <= b) for (let i = a; i <= b; i++) found.add(order[i]!);
	}
	return found;
}
export { advertisingHosts, analyticsHosts };
