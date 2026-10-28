/**
 * Server hooks.
 *
 * Every page on this site is prerendered and served straight from the
 * assets binding, so the Worker only sees requests that are not static
 * files: /api/*, 404s, and the /ingest path handled here.
 *
 * /ingest is a first-party reverse proxy for PostHog. The browser SDK
 * posts events and lazy-loads its extra bundles (session replay, surveys)
 * from this path, and we forward each request to PostHog's ingestion or
 * asset host for the project's region. Requests to our own domain are not
 * on content-blocker lists, so far fewer visitors go missing than when
 * the browser talks to *.posthog.com directly.
 */
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { INGEST_PATH, POSTHOG_HOST, captureServerEvent, clientAddress } from '$lib/server/posthog';

/** Static bundles live on the `<region>-assets` host, everything else on the ingestion host. */
function upstreamFor(pathname: string): string {
	const isAsset = pathname.startsWith('/static/') || pathname.startsWith('/array/');
	return isAsset
		? POSTHOG_HOST.replace(/^https:\/\/(us|eu)\.i\./, 'https://$1-assets.i.')
		: POSTHOG_HOST;
}

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	if (pathname !== INGEST_PATH && !pathname.startsWith(`${INGEST_PATH}/`)) {
		return resolve(event);
	}

	// Read the query string only here: SvelteKit refuses `url.search` while
	// prerendering, and every page goes through this hook at build time.
	const upstreamPath = pathname.slice(INGEST_PATH.length) || '/';
	const target = new URL(upstreamPath + event.url.search, upstreamFor(upstreamPath));

	const headers = new Headers(event.request.headers);
	headers.delete('host');
	headers.delete('cookie');
	// Ask for an identity-encoded body so the response can be passed
	// through without re-encoding, in the Worker and in `vite dev` alike.
	headers.delete('accept-encoding');
	// PostHog reads the visitor's IP from this header for GeoIP.
	const clientIp = clientAddress(event) ?? event.request.headers.get('x-forwarded-for');
	if (clientIp) headers.set('x-forwarded-for', clientIp);

	const method = event.request.method;
	const hasBody = method !== 'GET' && method !== 'HEAD';
	const upstream = await fetch(target, {
		method,
		headers,
		body: hasBody ? await event.request.arrayBuffer() : undefined,
		redirect: 'manual'
	});

	// The runtime already decoded the body; drop the headers that
	// described the encoded one so the client does not try to decode it again.
	const responseHeaders = new Headers(upstream.headers);
	responseHeaders.delete('content-encoding');
	responseHeaders.delete('content-length');

	return new Response(upstream.body, {
		status: upstream.status,
		statusText: upstream.statusText,
		headers: responseHeaders
	});
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	// Keep SvelteKit's default behaviour of logging the real error; the
	// client only ever sees `message`.
	console.error(error);
	await captureServerEvent(event, {
		event: 'server_error',
		properties: {
			path: event.url.pathname,
			method: event.request.method,
			status,
			message,
			error: error instanceof Error ? error.message : String(error)
		},
		processPerson: false
	});
	return { message, status };
};
