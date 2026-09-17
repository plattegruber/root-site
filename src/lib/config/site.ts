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
	author: 'Platte',
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

export const nav = [
	{ label: 'Home', href: '/', id: 'home' },
	{ label: 'Demos', href: '/demos', id: 'demos' },
	{ label: 'About', href: '/about', id: 'about' },
	{ label: 'What’s included', href: '/whats-included', id: 'included' },
	{ label: 'Writing', href: '/writing', id: 'writing' }
] as const;

export type NavId = (typeof nav)[number]['id'];
