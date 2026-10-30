import { error } from '@sveltejs/kit';
import { posts, pillars } from '$lib/config/blog';
import type { PostCard } from '$lib/config/blog';
import { postFacts } from '$lib/server/reading-time';
import type { PageServerLoad } from './$types';

/**
 * The parts of a post page that need the Markdown source or the whole
 * post list: reading time, the h2 list for the contents box, and what to
 * read next. The universal load in +page.ts adds the rendered body.
 */
export const load: PageServerLoad = ({ params }) => {
	const post = posts.find((p) => p.slug === params.slug);
	if (!post) error(404, 'Post not found');

	const { minutes, headings } = postFacts(post.slug);

	// Keep reading: the author's picks, else the other pillar guides,
	// topped up with the newest posts. Never the post itself, never a repeat.
	const picks = (post.related ?? [])
		.map((slug) => posts.find((p) => p.slug === slug))
		.filter((p): p is (typeof posts)[number] => Boolean(p));
	const pool = [...picks, ...pillars, ...posts];
	const seen = new Set<string>([post.slug]);
	const related: PostCard[] = [];
	for (const p of pool) {
		if (seen.has(p.slug)) continue;
		seen.add(p.slug);
		related.push({ ...p, minutes: postFacts(p.slug).minutes });
		if (related.length === 3) break;
	}

	return { minutes, headings, related };
};
