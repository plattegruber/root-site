import { breadcrumbSchema } from '$lib/seo';

export const prerender = true;

export const load = () => ({
	title: 'What’s included — root.',
	description:
		'Everything that comes with a root. dental website: custom design, coordinated photography, pages built around patient questions, local SEO, mobile, speed, hosting, backups, security, accessibility, and domain ownership. All in one flat fee.',
	jsonld: [breadcrumbSchema([{ name: 'What’s included', path: '/whats-included' }])]
});
