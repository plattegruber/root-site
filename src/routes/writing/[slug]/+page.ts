import { error } from '@sveltejs/kit';
import { posts } from '$lib/config/blog';
import { site } from '$lib/config/site';
import { articleSchema, breadcrumbSchema } from '$lib/seo';
import type { PageLoad } from './$types';

export const prerender = true;

/** Tell the prerenderer every slug so each post page generates at build time. */
export const entries = () => posts.map((p) => ({ slug: p.slug }));

export const load: PageLoad = async ({ params }) => {
	const post = posts.find((p) => p.slug === params.slug);
	if (!post) error(404, 'Post not found');

	const mod = await import(`$lib/content/writing/${post.slug}.md`);

	return {
		title: `${post.title} — root.`,
		description: post.excerpt,
		canonical: `${site.url}/writing/${post.slug}`,
		// Mark this as an article so the layout emits og:type=article with
		// published-time/author, plus Article + breadcrumb JSON-LD.
		ogType: 'article',
		publishedTime: post.date,
		ogImageAlt: post.title,
		jsonld: [
			articleSchema(post),
			breadcrumbSchema([
				{ name: 'Writing', path: '/writing' },
				{ name: post.title, path: `/writing/${post.slug}` }
			])
		],
		post,
		Body: mod.default as typeof mod.default
	};
};
