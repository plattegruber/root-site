import { json, redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { guide } from '$lib/config/guide';
import { deliverGuide, validateGuideRequest, type GuideEnv } from '$lib/server/guide';
import { captureServerEvent, requestDistinctId } from '$lib/server/posthog';

/**
 * POST /api/guide
 *
 * One field, one job: take an email address and send the guide PDF to
 * it. Accepts JSON (the in-page form) or a native form post (no JS),
 * mirroring /api/contact: same honeypot, same split between a JSON
 * reply and a redirect to a thanks page (/thanks/guide here).
 *
 * The PDF is read from the deployed assets through the ASSETS binding,
 * so the Worker never has to fetch its own public URL; in `vite dev`,
 * where there is no binding, SvelteKit's fetch serves static/ directly.
 *
 * Analytics: `guide_sent`, `guide_delivery_failed` and
 * `guide_form_bot_blocked`, each tagged with where the form was
 * (homepage, free_resources, post).
 */
export const POST: RequestHandler = async (event) => {
	const { request, platform, url } = event;
	const contentType = request.headers.get('content-type') ?? '';
	const wantsJson =
		(request.headers.get('accept') ?? '').includes('application/json') ||
		contentType.includes('application/json');
	const path = wantsJson ? 'js' : 'no_js';

	let payload: Record<string, unknown>;
	try {
		if (contentType.includes('application/json')) {
			payload = (await request.json()) as Record<string, unknown>;
		} else {
			const form = await request.formData();
			payload = Object.fromEntries(form.entries());
		}
	} catch {
		error(400, 'Could not parse request body');
	}

	if (typeof payload.company === 'string' && payload.company.trim() !== '') {
		await captureServerEvent(event, {
			event: 'guide_form_bot_blocked',
			properties: { path },
			processPerson: false
		});
		return wantsJson ? json({ ok: true }) : redirect(303, '/thanks/guide');
	}

	const result = validateGuideRequest(payload);
	if (!result.ok) {
		if (wantsJson) return json({ ok: false, errors: result.errors }, { status: 422 });
		redirect(303, guide.post);
	}

	const req = result.value;
	const distinctId = requestDistinctId(event) ?? req.email.toLowerCase();
	const props = { path, placement: req.placement };
	const pdfUrl = new URL(guide.pdf, url.origin).toString();

	try {
		const assets = platform?.env?.ASSETS;
		const res = assets ? await assets.fetch(new Request(pdfUrl)) : await event.fetch(guide.pdf);
		if (!res.ok) throw new Error(`PDF fetch returned ${res.status}`);
		const pdf = new Uint8Array(await res.arrayBuffer());
		await deliverGuide(req, (platform?.env ?? {}) as GuideEnv, pdf, pdfUrl);
	} catch (err) {
		console.error('[guide] delivery failed:', err);
		await captureServerEvent(event, {
			event: 'guide_delivery_failed',
			distinctId,
			properties: { ...props, error: err instanceof Error ? err.message : String(err) }
		});
		const message = 'Could not send the guide. Email platte@root.site and we’ll send it by hand.';
		if (wantsJson) return json({ ok: false, error: message }, { status: 502 });
		error(502, message);
	}

	await captureServerEvent(event, { event: 'guide_sent', distinctId, properties: props });
	return wantsJson ? json({ ok: true }) : redirect(303, '/thanks/guide');
};
