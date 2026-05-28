import { json, redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deliver, validate, type ContactEnv } from '$lib/server/contact';

/**
 * POST /api/contact
 *
 * Accepts either application/json (JS path, in-page enhancement) or
 * application/x-www-form-urlencoded / multipart (no-JS path, native
 * browser submit). The decision of which response to return mirrors
 * the incoming Accept header / content type.
 *
 * Defenses:
 *   - Honeypot field "company" — silent 200 if filled (bots fill all fields)
 *   - Field-level validation via shared validate()
 *   - try/catch around deliver() so backend outages don't leak details
 *
 * Rate limiting is intentionally not wired here — when traffic warrants,
 * add Cloudflare Rate Limiting Rules on the route in the Cloudflare
 * dashboard. That keeps the Worker zero-config and uses the platform's
 * built-in protection.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const contentType = request.headers.get('content-type') ?? '';
	const wantsJson =
		(request.headers.get('accept') ?? '').includes('application/json') ||
		contentType.includes('application/json');

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

	// Honeypot: bots typically fill every field. Real users never see this one.
	if (typeof payload.company === 'string' && payload.company.trim() !== '') {
		return wantsJson ? json({ ok: true }) : redirect(303, '/thanks');
	}

	const result = validate(payload);
	if (!result.ok) {
		if (wantsJson) {
			return json({ ok: false, errors: result.errors }, { status: 422 });
		}
		// No-JS path: bounce back to homepage contact section. A future
		// improvement is a server-rendered /contact route with field errors
		// inlined; for now, the JS-enhanced path covers the common case.
		redirect(303, '/#contact');
	}

	try {
		await deliver(result.value, (platform?.env ?? {}) as ContactEnv);
	} catch (err) {
		console.error('[contact] delivery failed:', err);
		if (wantsJson) {
			return json(
				{ ok: false, error: 'Could not send your message. Please email me directly.' },
				{ status: 502 }
			);
		}
		error(502, 'Could not send your message. Please email me directly.');
	}

	return wantsJson ? json({ ok: true }) : redirect(303, '/thanks');
};
