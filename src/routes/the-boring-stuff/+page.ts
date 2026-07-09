import { redirect } from '@sveltejs/kit';

/**
 * The page moved to /whats-included. This route exists only to keep the old
 * URL alive — it was linked from the homepage and the nav for months.
 *
 * Prerendering a redirect makes SvelteKit record it in `builder.prerendered
 * .redirects`, which adapter-cloudflare writes into `_redirects`. Cloudflare's
 * asset layer serves it, so no Worker is invoked and the 301 survives even
 * though every page here is static.
 */
export const prerender = true;

export const load = () => {
	redirect(301, '/whats-included');
};
