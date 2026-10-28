import { breadcrumbSchema } from '$lib/seo';
import { site } from '$lib/config/site';

export const prerender = true;

export const load = () => ({
	title: 'Dental Website Review privacy policy — root.',
	description:
		'What the Dental Website Review plugin for ChatGPT receives, what it keeps, who it shares data with, and how to contact us.',
	canonical: `${site.url}/dental-website-review/privacy`,
	jsonld: [
		breadcrumbSchema([
			{ name: 'Dental Website Review', path: '/dental-website-review' },
			{ name: 'Privacy', path: '/dental-website-review/privacy' }
		])
	]
});
