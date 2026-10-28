/**
 * Client hooks: start PostHog once per page load, and hand it any error
 * SvelteKit catches on the client.
 *
 * `init` runs before the first page renders, so the pageview for the
 * landing page is captured along with everything after it. With
 * `defaults` set, posthog-js also captures client-side navigations as
 * pageviews, pageleaves, autocaptured clicks, rage clicks and heatmap
 * data; session replay is switched on from the project settings in
 * PostHog rather than here.
 *
 * Events go to the same-origin /ingest path and are forwarded by
 * src/hooks.server.ts, so they are first-party and not blocked by the
 * common content blockers.
 */
import posthog from 'posthog-js';
import type { HandleClientError } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { INGEST_PATH, POSTHOG_HOST, POSTHOG_KEY, analyticsEnabled } from '$lib/analytics';

export function init(): void {
	if (!POSTHOG_KEY) {
		if (dev) {
			console.error(
				'PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_KEY is configured'
			);
		}
		return;
	}

	posthog.init(POSTHOG_KEY, {
		api_host: INGEST_PATH,
		// The app UI for the region, used by the toolbar and heatmap overlay.
		ui_host: POSTHOG_HOST.replace('.i.posthog.com', '.posthog.com'),
		defaults: '2026-08-30',
		capture_exceptions: true,
		// Anonymous visitors stay events-only; a person profile is created
		// the moment someone sends the contact form and gets identified.
		person_profiles: 'identified_only'
	});
}

export const handleError: HandleClientError = ({ error, status, message }) => {
	if (analyticsEnabled) posthog.captureException(error);
	return { message, status };
};
