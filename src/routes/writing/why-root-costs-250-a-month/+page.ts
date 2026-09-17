import { redirect } from '@sveltejs/kit';

/**
 * The pricing post used to carry the price in its slug. It moved to the
 * evergreen /writing/what-root-costs so a price change never strands the
 * URL again. Static routes win over `[slug]`, so this shadows the dynamic
 * post route for exactly this path.
 *
 * Prerendering the redirect makes adapter-cloudflare write it into
 * `_redirects`, so the asset layer serves the 301 without a Worker.
 */
export const prerender = true;

export const load = () => {
	redirect(301, '/writing/what-root-costs');
};
