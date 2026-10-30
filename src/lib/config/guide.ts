/**
 * The dental website guide — a 21-page PDF root gives away in exchange
 * for an email address. Single source of truth for its title, the file,
 * the page renders the site shows of it, and the places that offer it
 * (the homepage, /free-resources, and the pillar post).
 *
 * The PDF lives under static/guides/ and is sent as an attachment by
 * /api/guide (see src/lib/server/guide.ts). The page images come from
 * scripts/generate-guide-pages.mjs, which renders the guide's HTML
 * source; re-run it when the guide changes.
 */
export const guide = {
	id: 'dental-website-guide',
	title: 'How to tell if your dental website is doing its job',
	/** The cover's second line. */
	subtitle: 'Five quick checks now. A deeper guide when you need it.',
	pages: 21,
	/** Public path of the PDF under static/. Also what the email attaches. */
	pdf: '/guides/how-to-tell-if-your-dental-website-is-doing-its-job.pdf',
	/** File name the attachment arrives with. */
	filename: 'root-dental-website-guide.pdf',
	/** The pillar post that tells the story behind the guide. */
	post: '/writing/how-to-tell-if-your-dental-website-is-doing-its-job',
	cover: {
		src: '/guides/pages/cover.webp',
		small: '/guides/pages/cover-560.webp',
		width: 1224,
		height: 1584,
		alt: 'The guide’s cover: “How to tell if your dental website is doing its job”, with its three questions: Can they find an answer? Do they know what to expect? Can they take the next step?'
	},
	/** The three questions the guide is organised around. */
	questions: [
		{
			q: 'Can they find an answer?',
			what: 'A patient at 9 p.m., a worked example on a real site, and what a useful answer looks like.'
		},
		{
			q: 'Do they know what to expect?',
			what: 'Booking language, forms on a real phone, service pages, the first visit, insurance and payment.'
		},
		{
			q: 'Can they take the next step?',
			what: 'What to ask your provider, what a good answer proves, how to pick the first fix, and a worksheet.'
		}
	],
	/** The ten-minute version on page 2: five checks, phone in hand. */
	checks: [
		{
			check: 'Can someone call you?',
			good: 'Tap the number from the homepage and a service page. Your dialer opens with the correct office number.',
			fix: 'Put a working call link in the mobile header.'
		},
		{
			check: 'What happens when you’re closed?',
			good: 'The emergency or contact information explains the real after-hours process and who to contact.',
			fix: 'Publish those instructions beside the call option.'
		},
		{
			check: 'Can someone schedule a visit?',
			good: 'The booking button opens the right practice and says whether you are requesting or booking a time.',
			fix: 'Fix the destination and make the label match the process.'
		},
		{
			check: 'Can a new patient prepare?',
			good: 'The team is identified, and arrival details and the usual first visit are explained.',
			fix: 'Add the answers your front desk gives most often.'
		},
		{
			check: 'Can someone ask about cost?',
			good: 'Your actual insurance and payment policy, and a way to ask about a specific plan, are clear.',
			fix: 'Replace vague assurances with the policy your team uses.'
		}
	]
} as const;

/** Where a guide request came from. Carried on every guide event. */
export type GuidePlacement = 'homepage' | 'free_resources' | 'post';
