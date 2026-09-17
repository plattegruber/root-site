import { breadcrumbSchema } from '$lib/seo';

export const prerender = true;

export const load = () => ({
	title: 'What’s included — root.',
	description:
		'Everything that comes with root: a custom website, hosting and maintenance, updates handled for you, Google Business Profile management, and local search fundamentals. One monthly price, no setup fee, no contract.',
	jsonld: [breadcrumbSchema([{ name: 'What’s included', path: '/whats-included' }])]
});
