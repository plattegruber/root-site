/**
 * PostHog, Worker side.
 *
 * The browser SDK sees a form being sent; only the Worker knows whether the
 * message was actually delivered, whether a bot tripped the honeypot, or
 * that a no-JS submission happened at all. Those are the events captured
 * from here.
 *
 * There is no SDK dependency: a server event is one small POST to the
 * capture endpoint, and the Node SDK's batching and background flushing
 * do not fit a Worker that is torn down after each request. The POST is
 * handed to `ctx.waitUntil` when the platform offers it, so the visitor's
 * response is never held up by analytics.
 *
 * Attribution: the forms send `X-POSTHOG-DISTINCT-ID` and
 * `X-POSTHOG-SESSION-ID` (see tracingHeaders() in src/lib/analytics.ts).
 * Reusing them here puts the server event on the same person and in the
 * same session replay as the clicks that led to it.
 */
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const POSTHOG_KEY = env.PUBLIC_POSTHOG_KEY;
export const POSTHOG_HOST = env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
export const INGEST_PATH = '/ingest';

type Properties = Record<string, string | number | boolean | null | undefined>;

export type ServerEvent = {
	event: string;
	properties?: Properties;
	/**
	 * Distinct ID to attribute the event to. Defaults to the one the
	 * browser SDK sent in its header, then to a throwaway UUID.
	 */
	distinctId?: string;
	/**
	 * False for events that should never create or touch a person profile
	 * (bots, server errors). Defaults to true.
	 */
	processPerson?: boolean;
};

/** The distinct ID the browser SDK attached to this request, if any. */
export function requestDistinctId(event: RequestEvent): string | null {
	return event.request.headers.get('x-posthog-distinct-id');
}

/** The visitor's IP, or null where the platform cannot say (prerendering, some dev setups). */
export function clientAddress(event: RequestEvent): string | null {
	try {
		return event.getClientAddress();
	} catch {
		return null;
	}
}

/**
 * Capture one event from the Worker. Resolves immediately when PostHog is
 * not configured. Never throws: analytics must not break the contact form.
 */
export async function captureServerEvent(event: RequestEvent, input: ServerEvent): Promise<void> {
	if (!POSTHOG_KEY) return;

	const sessionId = event.request.headers.get('x-posthog-session-id');
	const distinctId = input.distinctId ?? requestDistinctId(event) ?? crypto.randomUUID();
	const ip = clientAddress(event);

	const body = JSON.stringify({
		api_key: POSTHOG_KEY,
		event: input.event,
		distinct_id: distinctId,
		timestamp: new Date().toISOString(),
		properties: {
			$lib: 'root-site-worker',
			$process_person_profile: input.processPerson ?? true,
			...(sessionId ? { $session_id: sessionId } : {}),
			...(ip ? { $ip: ip } : {}),
			$current_url: event.url.href,
			...input.properties
		}
	});

	const send = fetch(`${POSTHOG_HOST}/i/v0/e/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body
	})
		.then((res) => {
			if (!res.ok) console.error(`[posthog] capture failed: ${res.status}`);
		})
		.catch((err) => console.error('[posthog] capture failed:', err));

	const ctx = event.platform?.ctx;
	if (ctx?.waitUntil) {
		ctx.waitUntil(send);
	} else {
		await send;
	}
}
