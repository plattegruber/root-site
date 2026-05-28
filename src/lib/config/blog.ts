import type { Component } from 'svelte';

/**
 * Editorial posts for /writing — backed by Markdown via mdsvex.
 *
 * Files live in src/lib/content/writing/<slug>.md. Each must have YAML
 * frontmatter:
 *   ---
 *   title: ...
 *   date: YYYY-MM-DD
 *   excerpt: ...
 *   draft: true   # optional — hides from production builds
 *   ---
 *
 * We resolve the glob at module load time, parse the metadata, and
 * expose a stable, date-sorted list. Adding a new post is one
 * file — no manual index, no slug list.
 */

/**
 * YAML may parse `date: 2026-05-15` as a Date object instead of a string;
 * we accept either and normalize when reading.
 */
export type PostMetadata = {
	title: string;
	date: string | Date;
	excerpt: string;
	draft?: boolean;
};

export type PostModule = {
	default: Component;
	metadata: PostMetadata;
};

export type PostSummary = Omit<PostMetadata, 'date'> & {
	slug: string;
	date: string;
	dateDisplay: string;
};

/**
 * Eager glob — bundles the metadata directly into the dependent module
 * (the writing index page). The post body is lazy-loaded per-route by
 * the [slug] page so the index doesn't ship every post's full HTML.
 */
const modules = import.meta.glob<PostModule>('$lib/content/writing/*.md', { eager: true });

function slugFromPath(path: string): string {
	const match = path.match(/\/([^/]+)\.md$/);
	if (!match) throw new Error(`Unexpected post path: ${path}`);
	return match[1];
}

const DATE_FMT = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric'
});

function toIsoDate(input: string | Date): string {
	if (input instanceof Date) return input.toISOString().slice(0, 10);
	// String can be either YYYY-MM-DD or a full ISO timestamp.
	return input.length > 10 ? input.slice(0, 10) : input;
}

function formatDate(isoDay: string): string {
	// Parse as UTC noon so timezone never shifts the displayed day.
	const d = new Date(`${isoDay}T12:00:00Z`);
	return DATE_FMT.format(d);
}

export const posts: PostSummary[] = Object.entries(modules)
	.map(([path, mod]) => {
		const date = toIsoDate(mod.metadata.date);
		return {
			...mod.metadata,
			slug: slugFromPath(path),
			date,
			dateDisplay: formatDate(date)
		};
	})
	.filter((p) => !p.draft || import.meta.env.DEV)
	.sort((a, b) => (a.date < b.date ? 1 : -1));

export const postSlugs = posts.map((p) => p.slug);
