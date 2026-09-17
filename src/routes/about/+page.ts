import { breadcrumbSchema } from '$lib/seo';

export const prerender = true;

export const load = () => ({
	title: 'About — root.',
	description:
		'The person behind root, the dental web agency for solo practices. Custom websites and Google presence, taken care of, with no agency middlemen.',
	jsonld: [breadcrumbSchema([{ name: 'About', path: '/about' }])]
});
