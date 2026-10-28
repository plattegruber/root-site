/**
 * PostHog, client side.
 *
 * One place that knows whether analytics is on. Every component goes
 * through these helpers rather than importing posthog-js directly, so a
 * missing key (local dev, a build without .env) turns the whole thing
 * into a no-op instead of a console full of "not initialized" warnings.
 *
 * What is captured without any code below: pageviews and pageleaves
 * (including client-side navigations), autocaptured clicks on links and
 * buttons, rage clicks, heatmap data, session replay and uncaught
 * exceptions, all configured in src/hooks.client.ts. The helpers here add
 * the handful of named events that matter for a lead-generation site: the
 * contact form funnel, demo visits, and the free tools.
 *
 * Event names are snake_case, past tense, object_verb: `contact_form_submitted`,
 * `demo_opened`. Keep new ones in that shape so insights stay tidy.
 */
import posthog from 'posthog-js';
import type { Action } from 'svelte/action';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

/** PostHog project key. Public by design; it only ever lets you write events. */
export const POSTHOG_KEY = env.PUBLIC_POSTHOG_KEY;

/** Ingestion host for the region the project lives in. Defaults to US Cloud. */
export const POSTHOG_HOST = env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

/**
 * Same-origin path the browser sends events to. src/hooks.server.ts
 * forwards it to PostHog, so requests are first-party and survive most
 * content blockers.
 */
export const INGEST_PATH = '/ingest';

/** True when PostHog is configured and we are in a browser. */
export const analyticsEnabled = browser && Boolean(POSTHOG_KEY);

/** Property every custom event carries, so the two forms can be told apart. */
export type ContactFormId = 'homepage' | 'free_resources';

type Properties = Record<string, string | number | boolean | null | undefined>;

/** Capture a named event. No-op when PostHog is not configured. */
export function track(event: string, properties?: Properties): void {
	if (!analyticsEnabled) return;
	posthog.capture(event, properties);
}

/**
 * Tie the anonymous visitor to the lead they just became. Email is the only
 * stable key a contact form has; the rest become person properties so the
 * person page in PostHog reads like the enquiry did.
 */
export function identifyLead(lead: {
	email: string;
	name?: string;
	practice?: string;
	website?: string;
}): void {
	if (!analyticsEnabled) return;
	const email = lead.email.trim().toLowerCase();
	if (!email) return;
	const set: Properties = { email };
	if (lead.name?.trim()) set.name = lead.name.trim();
	if (lead.practice?.trim()) set.practice = lead.practice.trim();
	if (lead.website?.trim()) set.website = lead.website.trim();
	posthog.identify(email, set);
}

/**
 * Headers that let the Worker attribute its own events (see
 * src/lib/server/posthog.ts) to the same person and session replay as the
 * browser. Spread into the fetch() that posts the contact form.
 */
export function tracingHeaders(): Record<string, string> {
	if (!analyticsEnabled) return {};
	const headers: Record<string, string> = {};
	const distinctId = posthog.get_distinct_id();
	const sessionId = posthog.get_session_id();
	if (distinctId) headers['X-POSTHOG-DISTINCT-ID'] = distinctId;
	if (sessionId) headers['X-POSTHOG-SESSION-ID'] = sessionId;
	return headers;
}

/**
 * `use:trackClick={{ event, properties }}` on a link or button captures a
 * named event when it is clicked. Autocapture already records the click
 * itself; this gives the ones worth charting a stable name.
 */
export const trackClick: Action<HTMLElement, { event: string; properties?: Properties }> = (
	node,
	params
) => {
	let current = params;
	const onClick = () => track(current.event, current.properties);
	node.addEventListener('click', onClick);
	return {
		update(next) {
			current = next;
		},
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
};
