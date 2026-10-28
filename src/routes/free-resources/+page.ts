import { resources } from '$lib/config/resources';
import { breadcrumbSchema, softwareSchema } from '$lib/seo';

export const prerender = true;

export const load = () => ({
	title: 'Free resources — root.',
	description:
		'Tools root built for its own dental clients and released for anyone to use: ProofQL, which finds the right customer review for each page, and Dental Website Review, a ChatGPT plugin that reads a practice website the way patients do.',
	jsonld: [
		breadcrumbSchema([{ name: 'Free resources', path: '/free-resources' }]),
		...resources.map(softwareSchema)
	],
	resources
});
