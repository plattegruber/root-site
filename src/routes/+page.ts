import { site } from '$lib/config/site';

/**
 * Statically prerender the homepage at build time. Cloudflare serves it
 * as a flat HTML file via the assets binding — no Worker invocation,
 * no cold start. The /api/contact endpoint still runs as a Worker
 * function for form submissions.
 */
export const prerender = true;

export const load = () => ({
	title: site.title,
	description: site.description
});
