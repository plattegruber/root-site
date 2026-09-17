/**
 * Site-wide metadata. Single source of truth for title, description,
 * canonical URL, social cards, pricing, and the author identity used
 * across the homepage, About page, contact form receipts, and SEO tags.
 */
export const site = {
	name: 'root.',
	title: 'root. — The dental web agency for solo practices',
	tagline: 'The dental web agency for solo practices',
	description:
		'Your website and Google presence, taken care of. Custom website, ongoing updates, and Google Business Profile management for independent dentists. $149 a month, no setup fee, no contract.',
	url: 'https://root.site',
	email: 'platte@root.site',
	emailDisplay: 'platte@root.site',
	/** Display name used in bylines, meta author tags, and Person schema. */
	author: 'Platte Gruber',
	/**
	 * The person behind root. One identity, used everywhere a name appears:
	 * the About page intro, article bylines, `meta name="author"`, and the
	 * Person node in the sitewide JSON-LD graph. Add established profile
	 * URLs (LinkedIn, GitHub, etc.) to `sameAs` so search and AI engines can
	 * tie the name here to the same person elsewhere.
	 */
	person: {
		name: 'Platte Gruber',
		givenName: 'Platte',
		jobTitle: 'Founder',
		/** Where root is run from. Shown on About and in schema. */
		location: 'Colorado',
		/** Public profile URLs for the same person. Empty until added. */
		sameAs: [] as readonly string[]
	},
	twitter: undefined,
	locale: 'en_US',
	year: new Date().getFullYear(),
	/**
	 * About-page headshot. Set `src` to a path under `static/` (e.g.
	 * `/about-photo.jpg`) once a real photo lands; the placeholder frame
	 * stays until then. Recommended source dimensions: at least 400×480
	 * (1.2× the rendered 200×240 frame for retina); keep file under 80 KB
	 * via mozjpeg/squoosh.
	 */
	about: {
		photo: {
			src: '/about-photo.jpg' as string | undefined,
			alt: 'Platte and his wife, in the Colorado foothills.'
		}
	}
} as const;

/**
 * Pricing. There is one product and one price; `founding` is the
 * launch offer for the first practices. Flip `active` to false to
 * remove every founding-offer mention from the site at once.
 */
export const pricing = {
	monthly: 149,
	founding: {
		active: true,
		monthly: 100,
		limit: 10
	}
} as const;

/** `$149` — the standard price, formatted for prose and titles. */
export const price = `$${pricing.monthly}`;
/** `$100` — the founding price, formatted for prose and titles. */
export const foundingPrice = `$${pricing.founding.monthly}`;

export const nav = [
	{ label: 'Home', href: '/', id: 'home' },
	{ label: 'Demos', href: '/demos', id: 'demos' },
	{ label: 'About', href: '/about', id: 'about' },
	{ label: 'What’s included', href: '/whats-included', id: 'included' },
	{ label: 'Writing', href: '/writing', id: 'writing' }
] as const;

export type NavId = (typeof nav)[number]['id'];
