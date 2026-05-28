import adapter from '@sveltejs/adapter-cloudflare';

/**
 * @type {import('@sveltejs/kit').Config}
 *
 * Notes:
 *  - `adapter-cloudflare` ships a single Worker that serves static assets
 *    via the assets binding and routes the rest (e.g. /api/contact) to
 *    Worker functions. We mark every page route as `prerender = true`
 *    so the static path takes priority.
 *  - `handleHttpError: 'warn'` lets us ship the Writing index without
 *    the placeholder post-detail pages existing yet. When real posts
 *    land we drop them under /writing/<slug>/+page.svelte and the
 *    prerenderer will pick them up automatically.
 */
const config = {
	compilerOptions: {
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Allow placeholder /writing/<slug> links to be 404s during
				// prerender — they're real URLs that will be filled later.
				if (path.startsWith('/writing/')) {
					console.warn(`[prerender] skipping ${path} (linked from ${referrer})`);
					return;
				}
				throw new Error(message);
			}
		},
		alias: {
			$config: 'src/lib/config',
			$server: 'src/lib/server'
		}
	}
};

export default config;
