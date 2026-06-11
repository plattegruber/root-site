import { breadcrumbSchema } from '$lib/seo';

export const prerender = true;

export const load = () => ({
	title: 'The boring stuff — root.',
	description:
		'The technical stuff a dental website needs — SEO, mobile, speed, hosting, backups, security, accessibility, and domain ownership — handled for you and included in every plan.',
	jsonld: [breadcrumbSchema([{ name: 'The boring stuff', path: '/the-boring-stuff' }])]
});
