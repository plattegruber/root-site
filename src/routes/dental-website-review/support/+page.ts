import { breadcrumbSchema } from '$lib/seo';
import { site } from '$lib/config/site';

export const prerender = true;

export const load = () => ({
	title: 'Dental Website Review support — root.',
	description: 'Help with the Dental Website Review plugin for ChatGPT, and how to contact root.',
	canonical: `${site.url}/dental-website-review/support`,
	jsonld: [
		breadcrumbSchema([
			{ name: 'Dental Website Review', path: '/dental-website-review' },
			{ name: 'Support', path: '/dental-website-review/support' }
		])
	]
});
