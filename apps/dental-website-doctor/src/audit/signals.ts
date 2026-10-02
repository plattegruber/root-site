import { evidence, finding, type Evidence, type Finding } from '../model.js';
import { pagesAbout, sitemapHints, type Crawl, type Page } from './pages.js';

/**
 * Shared vocabulary for the dental checks. Keeping the patterns in one place makes it
 * obvious what each check looks for and keeps the three check modules consistent.
 */
export const patterns = {
	emergency: /emergenc|urgent (?:dental )?care|dental pain|toothache|knocked.out|same.?day/i,
	emergencyPage: /emergenc|urgent/i,
	afterHours:
		/after.?hours|answering service|on.?call|emergency (?:line|number|phone)|outside (?:of )?(?:office|business) hours|weekends? and evenings|24\/7|24 hours/i,
	sameDay:
		/same.?day (?:appointment|emergency|care|visit)s?|seen (?:the )?same day|walk.?ins? welcome/i,
	emergencyTriage:
		/knocked.out|swelling|uncontrolled bleeding|broken (?:tooth|jaw)|severe pain|abscess|call 911|emergency room/i,
	newPatient:
		/new.?patient|first.?visit|your first appointment|what to expect|patient.?forms|paperwork|intake/i,
	whatToBring:
		/insurance card|photo id|driver'?s licen|list of (?:current )?medications|bring (?:your|a)/i,
	visitLength: /(?:\d{2,3}|sixty|ninety|forty-five) minutes|(?:an|one|1|1\.5|two|2) hours?/i,
	insuranceText:
		/insurance|financ|payment plan|payment options|membership plan|savings plan|self.?pay/i,
	inNetwork: /in.?network|participating provider|preferred provider|\bPPO\b|contracted with/i,
	vagueInsurance:
		/accept (?:all|most|many|virtually all|nearly all) (?:major |dental |ppo )*(?:insurance|plans)|(?:all|most) (?:major )?(?:dental )?insurance(?:s| plans)? (?:accepted|welcome)|we (?:accept|take|work with) (?:all|most) insurance/i,
	uninsured:
		/no insurance|without insurance|uninsured|self.?pay|cash pay|fee.for.service|don'?t have (?:dental )?insurance/i,
	hours:
		/(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?\s*(?:[-–]\s*(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?)?\s*:?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?\s*[-–to]+\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)/i,
	extendedHours: /saturday|weekend|evening|early morning|7:?00 ?am|after 5|until [6-9] ?pm/i,
	parking: /parking|park(?:ed)? (?:in|at|behind)|street parking|garage/i,
	reviews: /reviews?|testimonials?|what (?:our )?patients (?:say|are saying)|patient stories/i,
	beforeAfter: /before (?:and|&) after|smile gallery|case gallery|our results/i,
	resultsDisclaimer: /results (?:may|will|can) vary|individual results|actual patients?/i,
	sedation: /sedation|nitrous|laughing gas|sleep dentistry|iv sedation|oral conscious/i,
	pediatric: /pediatric|children|kids|child'?s first|family dentist/i,
	dentalSchool:
		/university|college of dentistry|school of dentistry|dental school|dental medicine|graduated|\bD\.?D\.?S\.?\b|\bD\.?M\.?D\.?\b/i,
	experienceYears:
		/(?:over|more than|nearly|almost)?\s*\d{1,2}\+?\s*years? (?:of )?(?:clinical |private practice )?experience|practicing (?:dentistry )?since (?:19|20)\d\d|in practice since (?:19|20)\d\d/i,
	memberships:
		/american dental association|\bADA member|academy of general dentistry|\bAGD\b|dental (?:association|society)|academy of cosmetic dentistry|fellow of|continuing education|study club/i,
	serviceWords:
		/implant|crown|bridge|invisalign|clear aligner|braces|orthodont|root.?canal|whitening|veneer|denture|extraction|wisdom|sedation|pediatric|cleaning|hygiene|periodont|gum|filling|tmj|sleep apnea|botox|emergency|cosmetic|restorative|preventive|prevention|exam/i,
	servicePage:
		/\/(?:services?|treatments?|procedures?|dental-services|what-we-do|our-services)(?:\/|$)|implant|crown|bridge|invisalign|aligner|braces|orthodont|root-?canal|whitening|veneer|denture|extraction|wisdom|sedation|pediatric|cleaning|hygiene|periodont|gum|filling|tmj|sleep-apnea|cosmetic|restorative|preventive/i,
	accessibilityOffice:
		/wheelchair|accessible (?:entrance|parking|office|restroom)|ground floor|elevator/i,
	privacyLink: /privacy|hipaa|notice of privacy/i,
	patientFormsPdf: /\.pdf$/i,
	onlineFormsVendor:
		/jotform|intakeq|yapiapp|modento|nexhealth|dentalforms|formstack|docusign|hellosign|cognitoforms|typeform|wufoo|gravityforms|mdentalforms|curvehero|solutionreach|revenuewell/i
};

export type Located = {
	/** Pages whose URL, title or headings are about the topic. */
	pages: Page[];
	/** Pages whose visible text mentions the topic anywhere. */
	mentions: Page[];
	/** Sitemap URLs that look relevant but were not fetched. */
	hints: string[];
};
export function locate(
	crawl: Crawl,
	usable: Page[],
	pagePattern: RegExp,
	textPattern: RegExp
): Located {
	return {
		pages: pagesAbout(usable, pagePattern),
		mentions: usable.filter((p) => textPattern.test(p.text)),
		hints: sitemapHints(crawl, pagePattern)
	};
}
/** A short quote around the first match, for evidence a human can verify at a glance. */
export function quote(text: string, pattern: RegExp, radius = 90): string {
	const m = text.match(pattern);
	if (!m || m.index === undefined) return '';
	const start = Math.max(0, m.index - radius);
	const end = Math.min(text.length, m.index + m[0].length + radius);
	return `${start ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}
export function quoteAll(text: string, pattern: RegExp, limit = 4): string[] {
	const out: string[] = [];
	for (const m of text.matchAll(
		new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g')
	)) {
		if (m.index === undefined) continue;
		out.push(text.slice(Math.max(0, m.index - 50), m.index + m[0].length + 50).trim());
		if (out.length >= limit) break;
	}
	return out;
}
export function pageEvidence(
	page: Page,
	detail: string,
	method = 'Bounded public page review'
): Evidence {
	return evidence(page.url, detail, method, page.fetchedAt);
}
export function hintEvidence(home: Page, hints: string[], topic: string): Evidence[] {
	return hints.length
		? [
				pageEvidence(
					home,
					`Not found in the fetched pages, but the sitemap lists ${hints.join(', ')}; that page was outside the crawl budget, so ${topic} may exist there.`,
					'Sitemap cross-reference'
				)
			]
		: [];
}
export const usablePages = (crawl: Crawl) =>
	crawl.pages.filter((p) => p.status >= 200 && p.status < 300);
export const digits = (s: string) => s.replace(/\D/g, '');
export const lastTen = (s: string) => digits(s).slice(-10);

type CheckOptions = Partial<Omit<Finding, 'id' | 'area' | 'title' | 'status'>>;
/** finding() with the convention that failures default to "improvement/moderate" unless told otherwise. */
export function check(
	id: string,
	area: Finding['area'],
	title: string,
	status: Finding['status'],
	options: CheckOptions
): Finding {
	const priority =
		options.priority ??
		(status === 'failed'
			? options.severity === 'high'
				? 'urgent'
				: options.severity === 'low'
					? 'polish'
					: 'improvement'
			: status === 'needs_confirmation'
				? 'improvement'
				: 'none');
	return finding(id, area, title, status, {
		...options,
		priority,
		severity: options.severity ?? (status === 'failed' ? 'moderate' : 'info'),
		effort: options.effort ?? (status === 'passed' ? 'No change required' : '1–3 hours')
	});
}
/** Flesch–Kincaid grade level; a rough but widely understood readability yardstick. */
export function readingGrade(text: string): number | undefined {
	const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().split(/\s+/).length > 2);
	const words = text.split(/\s+/).filter((w) => /[a-z]/i.test(w));
	if (sentences.length < 5 || words.length < 100) return undefined;
	const syllables = words.reduce((n, w) => n + countSyllables(w), 0);
	const grade =
		0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59;
	return Math.round(grade * 10) / 10;
}
function countSyllables(word: string): number {
	const w = word.toLowerCase().replace(/[^a-z]/g, '');
	if (w.length <= 3) return 1;
	const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
	const groups = stripped.match(/[aeiouy]{1,2}/g);
	return Math.max(1, groups?.length ?? 1);
}
