import { breadcrumbSchema } from '$lib/seo';
import { site } from '$lib/config/site';

export const prerender = true;

export const load = () => ({
	title: 'Dental Website Review for ChatGPT — root.',
	description:
		'A ChatGPT plugin from root. that reviews a dental practice website the way patients use it: calling, booking, cost, emergencies and the dentist, on a real phone.',
	canonical: `${site.url}/dental-website-review`,
	jsonld: [breadcrumbSchema([{ name: 'Dental Website Review', path: '/dental-website-review' }])]
});
