import { posts } from '$lib/config/blog';
import { breadcrumbSchema } from '$lib/seo';

export const prerender = true;

export const load = () => ({
	title: 'Writing — root.',
	description: 'Notes on dental websites, the web, and running a one-person business.',
	jsonld: [breadcrumbSchema([{ name: 'Writing', path: '/writing' }])],
	posts
});
