/**
 * Pricing. There is one product and one price; `founding` is the
 * launch offer for the first practices. Flip `active` to false to
 * remove every founding-offer mention from the site at once.
 */
export const pricing = {
	monthly: 249,
	founding: {
		active: true,
		monthly: 100,
		limit: 10
	}
} as const;

/** `$249` — the standard price, formatted for prose and titles. */
export const price = `$${pricing.monthly}`;
/** `$100` — the founding price, formatted for prose and titles. */
export const foundingPrice = `$${pricing.founding.monthly}`;

/**
 * Site-wide metadata. Single source of truth for title, description,
 * canonical URL, social cards, pricing, and the author identity used
 * across the homepage, About page, contact form receipts, and SEO tags.
 */
export const site = {
	name: 'root.',
	title: 'root. — The dental web agency for solo practices',
	tagline: 'The dental web agency for solo practices',
	description: `Your website and Google presence, taken care of. Custom website, ongoing updates, Google Business Profile management, and articles reviewed by a dentist, for independent dental practices. ${price} a month, no setup fee, no contract.`,
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
		/**
		 * Where root is run from. Shown on About and in the Person schema.
		 * Keep every mention of place on the site tied to this value: AI
		 * assistants read the schema and the About copy to answer "where is
		 * root based?", and a stray place name elsewhere (even in an image
		 * alt) gets repeated as fact.
		 */
		location: 'Nebraska',
		/** Two-letter region code for the same place, for structured data. */
		region: 'NE',
		/** Public profile URLs for the same person. Empty until added. */
		sameAs: [] as readonly string[]
	},
	/**
	 * The company behind root. root. is a service, not an entity: Ook Studio
	 * LLC (Nebraska) owns it, invoices for it, and is the party named in the
	 * plugin's terms and privacy pages, the footer, and the Organization
	 * schema. Change it here and every legal mention follows.
	 */
	legal: {
		entity: 'Ook Studio LLC',
		url: 'https://ook.studio',
		/** Governing law for the plugin terms. */
		state: 'Nebraska'
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
	/**
	 * Optional hero portrait: a small, casual photo beside the first-person
	 * intro on the homepage. Leave `src` undefined and the hero renders text
	 * only. Use a different photo from the About page; a square crop of at
	 * least 160×160, under 20 KB, is plenty for the 72px frame.
	 */
	hero: {
		photo: {
			src: undefined as string | undefined,
			alt: 'Platte Gruber'
		}
	},
	about: {
		photo: {
			src: '/about-photo.jpg' as string | undefined,
			alt: 'Platte and his wife, outdoors on a hike.'
		}
	}
} as const;

export const nav = [
	{ label: 'Home', href: '/', id: 'home' },
	{ label: 'Demos', href: '/demos', id: 'demos' },
	{ label: 'About', href: '/about', id: 'about' },
	{ label: 'What’s included', href: '/whats-included', id: 'included' },
	{ label: 'Writing', href: '/writing', id: 'writing' }
] as const;

export type NavId = (typeof nav)[number]['id'];
