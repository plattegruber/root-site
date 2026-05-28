import { redirect, type Handle } from '@sveltejs/kit';

/**
 * Server-side request hooks.
 *
 * `www.root.site` is attached as a Worker custom domain so the SvelteKit
 * runtime sees the request. With `assets.run_worker_first: true` in
 * wrangler.jsonc, the hook runs before the assets binding, lets us
 * 301-redirect www → apex, then falls through to the static asset for
 * non-www hosts. The apex stays the single canonical hostname for SEO.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const host = event.url.host;
	if (host.startsWith('www.')) {
		const apexUrl = new URL(event.url);
		apexUrl.host = host.slice(4);
		redirect(301, apexUrl.toString());
	}
	return resolve(event);
};
