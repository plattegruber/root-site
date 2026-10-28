/**
 * Free resources — tools root built for its own dental clients and then
 * released on their own. Single source of truth for the /free-resources
 * page and its structured data.
 *
 * The pitch of that page is deliberate: each entry is a piece of how root
 * builds and reviews practice websites that turned out to stand on its
 * own. The parts that only work together stay in the monthly service, so
 * the page is a sample of the work, not the work.
 *
 * Each tool gets a full feature section: a rendered mockup (see
 * scripts/resource-images/), a one-line tagline, the blurb, and three or
 * four concrete `details` that show what it actually does. Adding a tool
 * is one entry here plus one HTML card for its image. Flip `status` to
 * 'live' (and point `href` at the real thing) the day it ships.
 */
export type Resource = {
	/** URL-safe id, used for the in-page anchor and the image file name. */
	id: string;
	/** Name as it appears on the tool itself. */
	name: string;
	/** Short kicker line, e.g. "ChatGPT plugin". */
	kind: string;
	/** One line under the name: the promise, in plain words. */
	tagline: string;
	/** Two or three sentences: what it does and where it came from. */
	blurb: string;
	/** Three or four specifics. Each one should be something a competitor's list wouldn't say. */
	details: string[];
	/** Rendered mockup under static/resources/, 3:2. */
	image: { src: string; alt: string; width: number; height: number };
	/** Where the name links. Internal paths stay in-tab; full URLs open a new tab. */
	href: string;
	/** Button label for `href`. */
	cta: string;
	/** 'soon' renders a status pill and a secondary button instead of the primary one. */
	status: 'live' | 'soon';
	/** Status wording when `status` is 'soon'. */
	statusLabel?: string;
	/** Optional second link under the buttons (an announcement, a guide). */
	more?: { label: string; href: string };
	/** Schema.org applicationCategory for the SoftwareApplication node. */
	category: string;
};

export const resources: Resource[] = [
	{
		id: 'proofql',
		name: 'ProofQL',
		kind: 'Reviews, searched by meaning',
		tagline: 'The right review on the right page, in the customer’s own words.',
		blurb:
			'Bring your existing customer reviews and ProofQL finds the one that answers the question a visitor has right now. A nervous patient on a sedation page sees the review from another nervous patient, not “Great staff!”. Built for dental sites, open to any site with reviews.',
		details: [
			'Searches by meaning, not keywords. “Gentle with kids” finds the review that never used those words.',
			'Each page asks for the review it needs. A small widget or the API puts it there.',
			'Never rewrites a review. The words stay exactly as the customer wrote them.',
			'Started on dental sites. Works for anyone with a pile of reviews and pages that could use them.'
		],
		image: {
			src: '/resources/proofql.webp',
			alt: 'A sedation dentistry page showing one patient review, “I’ve always hated going to the dentist, but they explained everything and never made me feel rushed”, with a note that ProofQL matched it from 212 reviews for the search “scared of needles”.',
			width: 2400,
			height: 1600
		},
		href: 'https://proofql.dev',
		cta: 'Open ProofQL',
		status: 'live',
		more: { label: 'Why we built it', href: '/writing/introducing-proofql' },
		category: 'DeveloperApplication'
	},
	{
		id: 'dental-website-review',
		name: 'Dental Website Review',
		kind: 'ChatGPT plugin',
		tagline: 'Your website, read by eight kinds of patient. Then: what to fix first.',
		blurb:
			'Ask ChatGPT to go through a dental practice’s website the way patients do, from someone in pain on a phone to someone checking insurance, and say what to fix first. It is the same framework we use on every site we build or review, and it costs nothing to run.',
		details: [
			'Reads the pages a patient would, starting with contact, new patients, emergency and insurance.',
			'Opens the site in a real phone-sized browser: is Call or Book on the first screen, and do the taps work.',
			'Flags advertising trackers on pages where patients type health or insurance details.',
			'Every finding names the page, quotes what it saw, and says whether it is a measurement or a judgment.'
		],
		image: {
			src: '/resources/dental-website-review.webp',
			alt: 'A ChatGPT conversation. The user asks for a review of brightsmiles.example; the reply lists three things to fix first, each tagged with the kind of patient it affects and the page it was found on.',
			width: 2400,
			height: 1600
		},
		href: '/dental-website-review',
		cta: 'How the review works',
		status: 'soon',
		statusLabel: 'Coming soon to ChatGPT',
		category: 'UtilitiesApplication'
	}
];

/**
 * The eight patients Dental Website Review walks a site as. Shown on the
 * resources page as the clearest proof that the review is opinionated
 * about dentistry rather than a generic SEO checker. Same eight as the
 * plugin's own guide, in plainer words.
 */
export const patients: { who: string; needs: string }[] = [
	{
		who: 'Someone in pain',
		needs: 'A number they can tap, and an emergency page that says what to do tonight.'
	},
	{
		who: 'A family choosing a dentist',
		needs: 'Reviews, the location, whether you take their insurance, and how to book.'
	},
	{
		who: 'A nervous patient',
		needs: 'The dentist’s face, and a calm explanation of what the first visit is like.'
	},
	{
		who: 'Someone considering cosmetic work',
		needs: 'Real before-and-after photos, and a page per service that ends with a next step.'
	},
	{
		who: 'Someone who wants to book now',
		needs: 'A Book button they can see on a phone without scrolling, and that actually works.'
	},
	{
		who: 'An older patient',
		needs: 'Readable type, real contrast, and the details on parking and getting in.'
	},
	{
		who: 'Someone checking insurance and cost',
		needs: 'Named plans, financing, and what happens if they have no insurance.'
	},
	{
		who: 'Someone who wants answers online',
		needs: 'Questions answered in plain language, and the hours where they expect them.'
	}
];
