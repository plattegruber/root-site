import type { Finding, Report } from '../model.js';
import type { Crawl, Page } from './pages.js';
import { check, pageEvidence, patterns, readingGrade, usablePages } from './signals.js';

/**
 * Editorial review of the words on the site. Everything here is explicitly subjective:
 * each finding quotes what it saw, says why that is usually a problem for a dental
 * practice, and states its confidence. A dentist can disagree with any of it.
 */

/** Phrases that appear on a large share of dental templates and therefore say nothing. */
const cliches = [
	'state-of-the-art',
	'state of the art',
	'gentle dental',
	'gentle care',
	'caring team',
	'family-friendly',
	'family friendly',
	'comprehensive dental care',
	'comprehensive care',
	'smile of your dreams',
	'beautiful smile',
	'healthy smile',
	'healthy, beautiful smile',
	'treat you like family',
	'treat our patients like family',
	'committed to excellence',
	'highest quality',
	'highest standard',
	'compassionate care',
	'comfortable environment',
	'relaxing environment',
	'welcoming environment',
	'cutting-edge',
	'cutting edge',
	'latest technology',
	'latest in dental technology',
	'advanced technology',
	'exceed your expectations',
	'personalized care',
	'personalized treatment',
	'friendly staff',
	'world-class',
	'top-notch',
	'one-stop',
	'your dental home',
	'dental needs',
	'all of your dental needs',
	'look no further',
	'we look forward to seeing you',
	'we are dedicated to',
	'passionate about',
	'lifetime of healthy smiles',
	'smile with confidence',
	'optimal oral health',
	'exceptional dental care',
	'exceptional care'
];
/** Clinical vocabulary with the words a patient would actually use. */
const jargon: [RegExp, string][] = [
	[/\bprophylaxis\b/i, 'prophylaxis → cleaning'],
	[/\brestorative dentistry\b/i, 'restorative dentistry → fillings, crowns and repairs'],
	[/\bperiodontal (?:disease|therapy|treatment)\b/i, 'periodontal → gum disease / gum treatment'],
	[/\bendodontic(?:s| therapy| treatment)?\b/i, 'endodontic → root canal'],
	[/\bprosthodontic(?:s)?\b/i, 'prosthodontics → crowns, bridges and dentures'],
	[/\bocclus(?:al|ion)\b/i, 'occlusion → how your teeth fit together / bite'],
	[/\bcomposite resin\b/i, 'composite resin → tooth-coloured filling'],
	[/\bedentulous\b/i, 'edentulous → missing all teeth'],
	[/\bcaries\b/i, 'caries → cavities'],
	[/\bmalocclusion\b/i, 'malocclusion → crooked teeth or a bad bite'],
	[/\bscaling and root planing\b/i, 'scaling and root planing → deep cleaning under the gums'],
	[/\bbruxism\b/i, 'bruxism → teeth grinding'],
	[/\bextraction\b/i, 'extraction → tooth removal'],
	[/\bdentition\b/i, 'dentition → your teeth'],
	[/\bintraoral\b/i, 'intraoral → inside the mouth'],
	[/\boral maxillofacial\b/i, 'oral maxillofacial → jaw and face surgery'],
	[/\bradiograph(?:s|y)?\b/i, 'radiographs → x-rays'],
	[/\bsealants?\b/i, 'sealants → protective coating on back teeth (say so)'],
	[/\bveneers?\b/i, 'veneers → thin porcelain covers for front teeth (explain once)'],
	[/\bfluoride varnish\b/i, 'fluoride varnish → fluoride treatment'],
	[/\bTMJ\b|\bTMD\b/, 'TMJ/TMD → jaw joint pain']
];
const genericHeadline =
	/^(?:welcome(?: to [^!.]*)?!?|home|our (?:practice|office|dental office)|about us|dentist|your (?:local )?dentist|family dentistry|general dentistry|quality dental care|dental care)$/i;
const weakCta =
	/^(?:learn more|read more|click here|more info|more information|submit|go|here|view more|see more)$/i;

export function copyReview(crawl: Crawl, practice: Report['practice']): Finding[] {
	const pages = usablePages(crawl);
	const home = pages[0];
	const out: Finding[] = [];
	if (!home) return out;
	const servicePages = pages.filter(
		(p) => p !== home && patterns.servicePage.test(new URL(p.url).pathname) && p.wordCount > 150
	);
	const sample = [home, ...servicePages.slice(0, 3)];
	const city = practice.locations[0]?.split(',')[1]?.trim();

	// 1. Reading level.
	const grades = sample
		.map((p) => ({ page: p, grade: readingGrade(p.prose) }))
		.filter((x): x is { page: Page; grade: number } => x.grade !== undefined);
	if (grades.length) {
		const worst = grades.sort((a, b) => b.grade - a.grade)[0]!;
		const avg = Math.round((grades.reduce((n, g) => n + g.grade, 0) / grades.length) * 10) / 10;
		out.push(
			check(
				'content-readability',
				'content',
				'Reading level of the copy',
				avg > 11 ? 'failed' : avg > 9 ? 'needs_confirmation' : 'passed',
				{
					basis: 'subjective',
					scope: 'general',
					confidence: 'medium',
					severity: 'low',
					priority: avg > 11 ? 'polish' : avg > 9 ? 'polish' : 'none',
					evidence: grades.map((g) =>
						pageEvidence(
							g.page,
							`Flesch–Kincaid grade ${g.grade} over ${g.page.prose.split(/\s+/).length} words of paragraph text.`,
							'Readability formula on paragraph and list text'
						)
					),
					impact:
						avg > 9
							? `The copy averages grade ${avg} (worst: ${worst.grade} on ${worst.page.url}). Patients skim dental sites on a phone in a waiting room or in pain; copy that reads like a journal article gets skipped.`
							: `The copy averages grade ${avg}, which is comfortable to skim on a phone.`,
					fix:
						avg > 9
							? 'Aim for grade 6–8: shorter sentences, one idea each, everyday words, and explain any clinical term the first time it appears.'
							: 'No change required.',
					rationale:
						'Flesch–Kincaid is a blunt instrument (it penalises long but familiar words like “appointment”), so this is a prompt to read the page aloud, not a hard rule.',
					effort: '2–4 hours of editing for the main pages'
				}
			)
		);
	}

	// 2. Template filler.
	const homeLower = home.mainText.toLowerCase();
	const matched = cliches.filter((c) => homeLower.includes(c));
	// Count "all of your dental needs" once, not again as "dental needs".
	const found = matched.filter((c) => !matched.some((o) => o !== c && o.includes(c)));
	out.push(
		check(
			'content-template-filler',
			'content',
			'Copy that could be any dental office',
			found.length >= 4 ? 'failed' : found.length >= 2 ? 'needs_confirmation' : 'passed',
			{
				basis: 'subjective',
				scope: 'dental',
				confidence: found.length >= 4 ? 'high' : 'medium',
				severity: 'low',
				priority: found.length >= 2 ? 'polish' : 'none',
				section: 'homepage',
				evidence: [
					pageEvidence(
						home,
						found.length
							? `Stock phrases on the homepage: ${found.map((f) => `“${f}”`).join(', ')}.`
							: 'No common dental-template phrases detected on the homepage.',
						'Phrase list comparison'
					)
				],
				impact:
					found.length >= 2
						? 'These phrases appear on most dental websites in any city. A patient comparing three practices in three tabs cannot tell them apart, so they pick on price or proximity.'
						: 'The homepage uses its own words, which is rarer than it should be.',
				fix:
					found.length >= 2
						? 'Replace each stock phrase with a specific, checkable fact: how long the first visit is, how you handle anxious patients, what the hygienist does differently, a real photo of the room.'
						: 'Keep writing specifically.',
				rationale:
					'Phrase matching cannot judge tone; it only shows the copy is indistinguishable from the template default. Four or more matches on one page is a strong signal, two is a hint.',
				effort: '2–3 hours of rewriting'
			}
		)
	);

	// 3. Jargon without translation.
	const jargonHits = sample.flatMap((p) =>
		jargon.filter(([re]) => re.test(p.mainText)).map(([, hint]) => ({ page: p, hint }))
	);
	const uniqueJargon = [...new Set(jargonHits.map((j) => j.hint))];
	if (uniqueJargon.length >= 3)
		out.push(
			check('content-jargon', 'content', 'Clinical vocabulary patients do not use', 'failed', {
				basis: 'subjective',
				scope: 'dental',
				confidence: 'medium',
				severity: 'low',
				priority: 'polish',
				evidence: [
					pageEvidence(
						jargonHits[0]!.page,
						`${uniqueJargon.length} clinical terms across ${new Set(jargonHits.map((j) => j.page.url)).size} sampled pages: ${uniqueJargon.slice(0, 8).join('; ')}.`,
						'Vocabulary list comparison'
					)
				],
				impact:
					'Patients search for “deep cleaning” and “root canal”, not “scaling and root planing” or “endodontic therapy”. Jargon reads as the practice talking to itself, and it does not match search queries.',
				fix: 'Use the patient’s word first and the clinical term in brackets once: “deep cleaning (scaling and root planing)”. Keep the clinical term for the service page title only if patients actually search it.',
				rationale:
					'Some of these terms are fine on a detailed service page for an informed patient; the flag is about density on the pages a new patient reads first.',
				effort: '1–2 hours'
			})
		);

	// 4. Who the homepage is about.
	const we = (homeLower.match(/\b(?:we|our|us|ourselves)\b/g) ?? []).length;
	const you = (homeLower.match(/\b(?:you|your|yourself)\b/g) ?? []).length;
	{
		const enough = we + you >= 12;
		const ratio = enough ? Math.round((we / (we + you)) * 100) : 0;
		out.push(
			check(
				'content-patient-focus',
				'content',
				'Copy talks about the practice more than the patient',
				ratio >= 65 ? 'failed' : 'passed',
				{
					basis: 'subjective',
					scope: 'general',
					confidence: 'medium',
					severity: 'low',
					priority: ratio >= 65 ? 'polish' : 'none',
					section: 'homepage',
					evidence: [
						pageEvidence(
							home,
							enough
								? `Homepage uses we/our/us ${we} times and you/your ${you} times (${ratio}% practice-focused).`
								: `Homepage uses we/our/us ${we} times and you/your ${you} times; too little copy to judge perspective.`,
							'Pronoun count on main content'
						)
					],
					impact:
						ratio >= 65
							? 'The page is a description of the practice. Patients read looking for themselves: will I be in pain, what will it cost, how long will it take, can I come on Saturday.'
							: 'The homepage addresses the reader directly, which is what converts.',
					fix:
						ratio >= 65
							? 'Rewrite the hero and the first two sections from the patient’s side: “Your first visit takes about an hour” instead of “We offer comprehensive new-patient exams”.'
							: 'No change required.',
					rationale:
						'A pronoun ratio is a crude proxy for perspective; it is reliable at the extremes and noisy in the middle, hence medium confidence and a 65% threshold.',
					effort: '1–2 hours'
				}
			)
		);
	}

	// 5. The headline.
	const h1 = home.headings.find((h) => h.level === 1)?.text ?? '';
	const nameOnly =
		h1 &&
		practice.name &&
		h1.toLowerCase().replace(/[^a-z]/g, '') === practice.name.toLowerCase().replace(/[^a-z]/g, '');
	const says = {
		what: /dentist|dental|smile|teeth|tooth|implant|invisalign|orthodont/i.test(h1),
		where: city
			? new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(h1)
			: /\bin [A-Z][a-z]+/.test(h1)
	};
	const generic = !h1 || genericHeadline.test(h1.trim()) || Boolean(nameOnly);
	out.push(
		check(
			'content-headline',
			'content',
			'The homepage headline says who, what and where',
			generic ? 'failed' : says.what && says.where ? 'passed' : 'needs_confirmation',
			{
				basis: 'subjective',
				scope: 'dental',
				confidence: generic ? 'high' : 'medium',
				severity: 'low',
				priority: generic ? 'polish' : says.what && says.where ? 'none' : 'polish',
				section: 'homepage',
				evidence: [
					pageEvidence(
						home,
						h1
							? `H1: “${h1}”. Mentions what you do: ${says.what}; mentions where: ${says.where}.`
							: 'No H1 on the homepage.',
						'Heading review'
					)
				],
				impact: generic
					? '“Welcome to our practice” tells a visitor nothing they did not know from the URL. The headline is the one sentence everyone reads; it should answer “am I in the right place?” in a glance.'
					: 'The headline gives a visitor a reason to keep reading.',
				fix:
					generic || !(says.what && says.where)
						? `Try a headline shaped like “[Specific promise] dentistry in ${city ?? '[City]'}” or “The dentist ${city ? `${city} families` : 'families'} see for [service]”, with the practice name in the logo rather than the H1.`
						: 'No change required.',
				rationale:
					'Headline quality is a judgement; the objective part is only whether the H1 names a place and a service. Treat the suggestion as a starting point.',
				effort: '30–60 minutes, plus the owner’s approval'
			}
		)
	);

	// 6. Calls to action.
	const ctas = [
		...home.links
			.filter(
				(l) =>
					l.kind === 'booking' ||
					l.kind === 'phone' ||
					/book|schedule|appointment|request|call|contact/i.test(l.label)
			)
			.map((l) => l.label),
		...home.buttons.filter((b) =>
			/book|schedule|appointment|request|call|contact|submit|learn|read|click/i.test(b)
		)
	]
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean);
	const distinct = [...new Set(ctas)];
	const weak = distinct.filter((c) => weakCta.test(c));
	const strong = distinct.filter((c) => /book|schedule|appointment|request|call|text/i.test(c));
	const ctaStatus: Finding['status'] = !distinct.length
		? 'failed'
		: strong.length === 0
			? 'failed'
			: distinct.length > 6
				? 'needs_confirmation'
				: 'passed';
	out.push(
		check('content-cta-clarity', 'content', 'One obvious thing to do next', ctaStatus, {
			basis: 'subjective',
			scope: 'general',
			confidence: 'medium',
			severity: 'low',
			priority: ctaStatus === 'passed' ? 'none' : 'polish',
			section: 'homepage',
			evidence: [
				pageEvidence(
					home,
					`${distinct.length} distinct action labels on the homepage: ${distinct
						.slice(0, 10)
						.map((c) => `“${c}”`)
						.join(', ')}. ${weak.length ? `Weak labels: ${weak.join(', ')}.` : ''}`,
					'Link and button label review'
				)
			],
			impact:
				ctaStatus === 'failed'
					? 'A visitor who is ready should see one clear action: call or book. “Learn more” buttons everywhere make them hunt.'
					: ctaStatus === 'needs_confirmation'
						? 'Many competing actions dilute the one that matters. Usually a site needs two: call and book.'
						: 'The homepage makes the next step clear.',
			fix:
				ctaStatus === 'passed'
					? 'No change required.'
					: 'Use two primary actions (“Call (555) 123-4567” and “Book online”) in the header and after each section; demote everything else to text links.',
			rationale:
				'Counting labels cannot see visual hierarchy; a page with eight links can still have one obvious button. Check the rendered page before acting.',
			effort: '1–2 hours'
		})
	);

	// 7. Homepage length.
	if (home.wordCount < 120 || home.wordCount > 1500)
		out.push(
			check(
				'content-homepage-length',
				'content',
				home.wordCount < 120 ? 'Homepage says almost nothing' : 'Homepage is a wall of text',
				'failed',
				{
					basis: 'subjective',
					scope: 'general',
					confidence: 'medium',
					severity: 'low',
					priority: 'polish',
					section: 'homepage',
					evidence: [
						pageEvidence(
							home,
							`${home.wordCount} words of main content on the homepage (header, nav and footer excluded).`,
							'Word count'
						)
					],
					impact:
						home.wordCount < 120
							? 'A homepage that is mostly images gives Google and the patient nothing to go on: no services, no location, no reason to choose you.'
							: 'Nobody reads 1,500 words on a homepage. The important facts (location, hours, what you do, how to book) get buried.',
					fix:
						home.wordCount < 120
							? 'Add 200–400 words: who you are, where, what you focus on, what the first visit is like, how to book.'
							: 'Cut to the essentials and move detail to service and about pages.',
					rationale:
						'Word count is a proxy; a short page with a great photo and a clear booking button can work. This flags the extremes only.',
					effort: '1–3 hours'
				}
			)
		);

	// 8. Stock photography.
	const stock = pages.flatMap((p) =>
		p.images
			.filter((i) =>
				/shutterstock|istock|gettyimages|unsplash|pexels|pixabay|stock\.adobe|adobestock|depositphotos|dreamstime|123rf|freepik/i.test(
					i.src
				)
			)
			.map((i) => ({ page: p, src: i.src }))
	);
	if (stock.length)
		out.push(
			check(
				'content-stock-photos',
				'content',
				'Stock photos where patients expect real people',
				'failed',
				{
					basis: 'subjective',
					scope: 'dental',
					confidence: 'high',
					severity: 'low',
					priority: 'polish',
					evidence: [
						pageEvidence(
							stock[0]!.page,
							`${stock.length} images whose filenames or hosts identify a stock library, e.g. ${stock
								.slice(0, 3)
								.map((s) => s.src)
								.join(', ')}.`,
							'Image source review'
						)
					],
					impact:
						'Patients recognise the smiling stock family instantly, and it signals the practice could not be bothered to show its own team or rooms. Real photos are the cheapest trust signal a dental site can add.',
					fix: 'Replace hero and team images with photos of the actual dentist, staff, reception and operatories (two hours with a local photographer). Keep stock only for abstract illustrations.',
					rationale:
						'The filenames prove the source; whether a given photo hurts is a judgement. Stock is more damaging on the homepage and team page than on a blog post.',
					effort: 'Half a day including a photo session'
				}
			)
		);

	// 9. Stale dated content.
	const dates = pages
		.flatMap((p) => p.dates.map((d) => ({ page: p, date: new Date(d) })))
		.filter((d) => !Number.isNaN(d.date.getTime()));
	if (dates.length) {
		const latest = dates.sort((a, b) => b.date.getTime() - a.date.getTime())[0]!;
		const months = (Date.now() - latest.date.getTime()) / (30 * 24 * 3600 * 1000);
		if (months > 18)
			out.push(
				check('content-stale-dates', 'content', 'Dated content that has gone quiet', 'failed', {
					basis: 'objective',
					scope: 'general',
					confidence: 'high',
					severity: 'low',
					priority: 'polish',
					evidence: [
						pageEvidence(
							latest.page,
							`Most recent dated item: ${latest.date.toISOString().slice(0, 10)} (about ${Math.round(months)} months ago).`,
							'time[datetime] and article metadata'
						)
					],
					impact:
						'A blog whose last post is years old makes a visitor wonder whether the practice is still open. It is better to have no dates than old ones.',
					fix: 'Either commit to one useful post a quarter (new-patient FAQs, insurance changes, a new hygienist) or remove the dates and the “blog” label.',
					effort: '30 minutes to remove dates; ongoing otherwise'
				})
			);
	}
	return out;
}
