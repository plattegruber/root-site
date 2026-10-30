import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { slugify } from './src/lib/slug.js';

/**
 * Rehype plugin: give every rendered h2 and h3 an id derived from its
 * text, so a post's headings can be deep-linked and the "In this guide"
 * contents on pillar posts (built from the same Markdown source with the
 * same slugify) lands on them. No dependency on rehype-slug: the hast
 * tree is small and the walk is ten lines.
 */
function headingIds() {
	const text = (node) =>
		node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');
	const walk = (node) => {
		if (node.type === 'element' && /^h[23]$/.test(node.tagName) && !node.properties?.id) {
			node.properties = { ...(node.properties ?? {}), id: slugify(text(node)) };
		}
		for (const child of node.children ?? []) walk(child);
	};
	return (tree) => walk(tree);
}

/**
 * @type {import('@sveltejs/kit').Config}
 *
 *  - `adapter-cloudflare` ships a single Worker that serves static assets
 *    via the assets binding and routes the rest (e.g. /api/contact) to
 *    Worker functions. Every page route is prerendered, so the static
 *    path takes priority.
 *  - `mdsvex` preprocesses .md files into Svelte components so the
 *    /writing/[slug] route can render Markdown post bodies with full
 *    component capabilities (and frontmatter-driven metadata).
 */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		alias: { $config: 'src/lib/config', $server: 'src/lib/server' },
		/*
		 * Absolute asset URLs (/_app/...) instead of the relative default
		 * (../_app/...). PostHog session replay records the DOM as served and
		 * plays it back from posthog.com, where relative URLs resolve to
		 * nothing; absolute ones still point at root.site. The site is only
		 * ever served from the root of its domain, so nothing else changes.
		 */
		paths: { relative: false },
		/*
		 * Content-Security-Policy. Managed here rather than in `_headers`
		 * because SvelteKit boots each page from an inline <script> and needs
		 * to add that script's hash to script-src; a static header can't know
		 * it. On prerendered pages (all of them) the policy is emitted as a
		 * <meta> tag. `frame-ancestors` can't go in a <meta> tag, so it stays
		 * in `_headers`.
		 *
		 * PostHog talks to our own /ingest path (covered by 'self'), but the
		 * toolbar and heatmap overlay load from *.posthog.com, and session
		 * replay runs its recorder in a blob: worker.
		 */
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'img-src': ['self', 'data:', 'https://*.leadsy.ai'],
				'style-src': ['self', 'unsafe-inline'],
				'font-src': ['self', 'data:'],
				'script-src': [
					'self',
					'https://static.cloudflareinsights.com',
					'https://r2.leadsy.ai',
					'https://*.leadsy.ai',
					'https://*.posthog.com'
				],
				'connect-src': [
					'self',
					'https://cloudflareinsights.com',
					'https://*.leadsy.ai',
					'https://*.posthog.com'
				],
				'worker-src': ['self', 'blob:'],
				'form-action': ['self'],
				'base-uri': ['self'],
				'upgrade-insecure-requests': true
			}
		}
	},
	preprocess: [mdsvex({ extensions: ['.svx', '.md'], rehypePlugins: [headingIds] })],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
