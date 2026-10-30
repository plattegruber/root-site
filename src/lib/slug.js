/**
 * Heading text → anchor id. Plain JS with no imports so both
 * svelte.config.js (the rehype plugin that puts ids on rendered
 * headings) and src/lib/server/reading-time.ts (the table of contents
 * built from the Markdown source) can share the one function, and a
 * link in the contents always lands on its heading.
 */
/** @param {string} text */
export function slugify(text) {
	return String(text)
		.toLowerCase()
		.replace(/[’'"“”]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
