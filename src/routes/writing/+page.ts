import { posts } from '$lib/config/blog';

export const prerender = true;

export const load = () => ({
	title: 'Writing — root.',
	description:
		'Notes on dental websites, the web, and running a one-person business.',
	posts
});
