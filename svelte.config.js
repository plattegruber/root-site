import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';

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
		 * Content-Security-Policy. Managed here rather than in `_headers`
		 * because SvelteKit boots each page from an inline <script> and needs
		 * to add that script's hash to script-src; a static header can't know
		 * it. On prerendered pages (all of them) the policy is emitted as a
		 * <meta> tag. `frame-ancestors` can't go in a <meta> tag, so it stays
		 * in `_headers`.
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
					'https://*.leadsy.ai'
				],
				'connect-src': ['self', 'https://cloudflareinsights.com', 'https://*.leadsy.ai'],
				'form-action': ['self'],
				'base-uri': ['self'],
				'upgrade-insecure-requests': true
			}
		}
	},
	preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
