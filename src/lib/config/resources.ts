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
 * Adding a tool is one entry here. Flip `status` to 'live' (and point
 * `href` at the real thing) the day it ships.
 */
export type Resource = {
	/** Name as it appears on the tool itself. */
	name: string;
	/** Short kicker line, e.g. "ChatGPT plugin". */
	kind: string;
	/** Two or three sentences: what it does and where it came from. */
	blurb: string;
	/** Where the name links. Internal paths stay in-tab; full URLs open a new tab. */
	href: string;
	/** 'soon' renders a muted status instead of the arrow. */
	status: 'live' | 'soon';
	/** Status wording when `status` is 'soon'. */
	statusLabel?: string;
	/** Optional second link under the blurb (an announcement, a guide). */
	more?: { label: string; href: string };
	/** Schema.org applicationCategory for the SoftwareApplication node. */
	category: string;
};

export const resources: Resource[] = [
	{
		name: 'ProofQL',
		kind: 'Reviews, searched by meaning',
		blurb:
			'Bring your existing customer reviews and ProofQL finds the one that answers the question a visitor has right now. A nervous patient on a sedation page sees the review from another nervous patient, not “Great staff!”. The words stay the customer’s own. Built for dental sites, open to any site with reviews.',
		href: 'https://proofql.dev',
		status: 'live',
		more: { label: 'Why we built it', href: '/writing/introducing-proofql' },
		category: 'DeveloperApplication'
	},
	{
		name: 'Dental Website Review',
		kind: 'ChatGPT plugin',
		blurb:
			'Ask ChatGPT to go through a dental practice’s website the way eight kinds of patient would, from someone in pain on a phone to someone checking insurance, and say what to fix first. It is the same framework we use on every site we build or review.',
		href: '/dental-website-review',
		status: 'soon',
		statusLabel: 'Coming soon to ChatGPT',
		category: 'UtilitiesApplication'
	}
];
