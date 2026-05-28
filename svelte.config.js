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
		alias: { $config: 'src/lib/config', $server: 'src/lib/server' }
	},
	preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
