/**
 * Site-wide metadata. Single source of truth for title, description,
 * canonical URL, social cards, and the author identity used across
 * the homepage, About page, contact form receipts, and SEO tags.
 */
export const site = {
	name: 'root.',
	title: 'root. — Websites for dental practices',
	tagline: 'Websites for dental practices',
	description:
		'Custom-built websites for dental practices. One person, doing one thing well. $250 a month, everything included.',
	url: 'https://root.site',
	email: 'platte@root.site',
	emailDisplay: 'platte@root.site',
	author: 'Platte',
	twitter: undefined,
	locale: 'en_US',
	year: new Date().getFullYear()
} as const;

export const nav = [
	{ label: 'Home', href: '/', id: 'home' },
	{ label: 'About', href: '/about', id: 'about' },
	{ label: 'Writing', href: '/writing', id: 'writing' }
] as const;

export type NavId = (typeof nav)[number]['id'];
