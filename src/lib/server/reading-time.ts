/**
 * Build-time facts about each post that need the Markdown source:
 * a reading-time estimate and the list of h2 headings. Server-only, so
 * the raw text of every post is read once at prerender and never shipped
 * to the browser. The slugs match the ids the rehype plugin in
 * svelte.config.js puts on the rendered headings.
 */
import { slugify } from '$lib/slug.js';

const sources = import.meta.glob<string>('$lib/content/writing/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

export type Heading = { text: string; id: string };
export type PostFacts = { minutes: number; headings: Heading[] };

const WORDS_PER_MINUTE = 230;

function stripFrontmatter(src: string): string {
	return src.replace(/^---[\s\S]*?\n---\s*/, '');
}

/** Inline Markdown → plain words, close enough for a count and a contents list. */
function plain(md: string): string {
	return md
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[`*_>#]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function facts(src: string): PostFacts {
	const body = stripFrontmatter(src);
	const words = plain(body).split(' ').filter(Boolean).length;
	const headings: Heading[] = [];
	for (const line of body.split('\n')) {
		const m = line.match(/^##\s+(.+?)\s*$/);
		if (m) {
			const text = plain(m[1]);
			headings.push({ text, id: slugify(text) });
		}
	}
	return { minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)), headings };
}

const bySlug = new Map<string, PostFacts>(
	Object.entries(sources).map(([path, src]) => {
		const slug = path.match(/\/([^/]+)\.md$/)?.[1] ?? path;
		return [slug, facts(src)];
	})
);

export function postFacts(slug: string): PostFacts {
	return bySlug.get(slug) ?? { minutes: 1, headings: [] };
}
