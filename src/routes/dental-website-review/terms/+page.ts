import { breadcrumbSchema } from '$lib/seo';
import { site } from '$lib/config/site';

export const prerender = true;

export const load = () => ({
	title: 'Dental Website Review terms of use — root.',
	description: 'The terms for using the Dental Website Review plugin for ChatGPT.',
	canonical: `${site.url}/dental-website-review/terms`,
	jsonld: [
		breadcrumbSchema([
			{ name: 'Dental Website Review', path: '/dental-website-review' },
			{ name: 'Terms', path: '/dental-website-review/terms' }
		])
	]
});
