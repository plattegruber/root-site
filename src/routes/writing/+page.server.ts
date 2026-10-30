import { posts, pillars } from '$lib/config/blog';
import type { PostCard } from '$lib/config/blog';
import { postFacts } from '$lib/server/reading-time';
import { breadcrumbSchema } from '$lib/seo';

export const prerender = true;

const withMinutes = (list: typeof posts): PostCard[] =>
	list.map((p) => ({ ...p, minutes: postFacts(p.slug).minutes }));

/**
 * Server load so the reading estimates (which need every post's source)
 * are computed once at prerender and never bundled for the browser.
 */
export const load = () => ({
	title: 'Writing — root.',
	description:
		'Long guides on dental websites and getting found on Google, kept current, and shorter notes on the web and running a one-person business.',
	jsonld: [breadcrumbSchema([{ name: 'Writing', path: '/writing' }])],
	pillars: withMinutes(pillars),
	posts: withMinutes(posts)
});
