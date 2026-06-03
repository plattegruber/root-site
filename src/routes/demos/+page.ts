import { demos } from '$lib/config/demos';

export const prerender = true;

export const load = () => ({
	title: 'Demos — root.',
	description:
		'Example dental practice sites, built end to end. Click around and see what a root. site feels like.',
	demos
});
