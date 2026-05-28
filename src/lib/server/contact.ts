/**
 * Contact-form business logic.
 *
 * The transport (Cloudflare Worker endpoint) lives in
 * src/routes/api/contact/+server.ts and only handles HTTP — request
 * parsing, response shaping. Everything below is reusable and easy to
 * unit-test in isolation: validation, normalization, and the
 * pluggable `deliver()` seam that decides where messages actually go.
 *
 * To wire a real backend, implement one of the deliverer functions
 * below — Airtable, Resend/SendGrid, Postmark, Discord, whatever.
 */

export type ContactSubmission = {
	name: string;
	email: string;
	message: string;
};

export type ValidationResult =
	| { ok: true; value: ContactSubmission }
	| { ok: false; errors: Partial<Record<keyof ContactSubmission, string>> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4000;

export function validate(input: Partial<Record<string, unknown>>): ValidationResult {
	const errors: Partial<Record<keyof ContactSubmission, string>> = {};

	const name = String(input.name ?? '').trim();
	const email = String(input.email ?? '').trim();
	const message = String(input.message ?? '').trim();

	if (!name) errors.name = 'Name is required';
	else if (name.length > MAX_NAME) errors.name = 'Name is too long';

	if (!email) errors.email = 'Email is required';
	else if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
		errors.email = 'Enter a valid email';
	}

	if (message.length > MAX_MESSAGE) errors.message = 'Message is too long';

	if (Object.keys(errors).length > 0) return { ok: false, errors };
	return { ok: true, value: { name, email, message } };
}

/**
 * Pluggable delivery seam. The default does nothing — pick a backend
 * (Airtable, an email API, a webhook) and wire it here.
 *
 * Why a seam: keeps the HTTP layer thin and lets us swap providers
 * without touching the form. Also lets local dev no-op cleanly.
 */
export type Deliverer = (
	submission: ContactSubmission,
	env: ContactEnv
) => Promise<void>;

export type ContactEnv = {
	/** Airtable PAT (Bearer token), if Airtable wiring is chosen. */
	AIRTABLE_TOKEN?: string;
	AIRTABLE_BASE_ID?: string;
	AIRTABLE_TABLE_NAME?: string;
	/** Resend API key, if email wiring is chosen. */
	RESEND_API_KEY?: string;
	/** Slack / Discord / generic webhook receiver. */
	WEBHOOK_URL?: string;
	/** Comma-separated list of recipient addresses. */
	CONTACT_TO?: string;
	/** Optional from address override. */
	CONTACT_FROM?: string;
};

/** Default no-op deliverer — logs to the Worker console and returns. */
export const noopDeliverer: Deliverer = async (submission) => {
	console.log('[contact] submission received (no backend configured):', {
		name: submission.name,
		email: submission.email,
		hasMessage: submission.message.length > 0,
		messageLength: submission.message.length
	});
};

/**
 * Airtable deliverer — appends a row to the configured base/table.
 * Field names default to "Name", "Email", "Message", "Received" so they
 * line up with a typical Airtable base; adjust if your schema differs.
 *
 * Activate by setting AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME
 * via `wrangler secret put` and picking this deliverer in +server.ts.
 */
export const airtableDeliverer: Deliverer = async (submission, env) => {
	const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = env;
	if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
		throw new Error('Airtable env vars missing');
	}

	const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${AIRTABLE_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fields: {
				Name: submission.name,
				Email: submission.email,
				Message: submission.message,
				Received: new Date().toISOString()
			}
		})
	});

	if (!res.ok) {
		throw new Error(`Airtable error ${res.status}: ${await res.text()}`);
	}
};

/**
 * Resend deliverer — sends the submission as an email to CONTACT_TO.
 * Reply-To is set to the submitter so a one-tap reply works in any
 * mail client.
 */
export const resendDeliverer: Deliverer = async (submission, env) => {
	const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = env;
	if (!RESEND_API_KEY || !CONTACT_TO) {
		throw new Error('Resend env vars missing');
	}

	const text = [
		`Name: ${submission.name}`,
		`Email: ${submission.email}`,
		'',
		submission.message || '(no message)'
	].join('\n');

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: CONTACT_FROM ?? 'root. <hello@root.site>',
			to: CONTACT_TO.split(',').map((s) => s.trim()),
			reply_to: submission.email,
			subject: `Contact form — ${submission.name}`,
			text
		})
	});

	if (!res.ok) {
		throw new Error(`Resend error ${res.status}: ${await res.text()}`);
	}
};

/** Active deliverer — change this one line to switch backends. */
export const deliver: Deliverer = noopDeliverer;
