/**
 * Guide delivery — the business logic behind /api/guide.
 *
 * Someone types an email address, and the guide PDF arrives in their
 * inbox as an attachment, with a plain note from Platte. root gets a
 * one-line notification so the address lands in the inbox too. Same
 * shape as src/lib/server/contact.ts: validation here, HTTP in the
 * route, Resend as the transport.
 */
import { guide } from '$lib/config/guide';
import { site } from '$lib/config/site';
import type { GuidePlacement } from '$lib/config/guide';

export type GuideRequest = { email: string; placement: GuidePlacement };

export type GuideValidation =
	| { ok: true; value: GuideRequest }
	| { ok: false; errors: { email?: string } };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;
const PLACEMENTS: GuidePlacement[] = ['homepage', 'free_resources', 'post'];

export function validateGuideRequest(input: Partial<Record<string, unknown>>): GuideValidation {
	const email = String(input.email ?? '').trim();
	const rawPlacement = String(input.placement ?? '');
	const placement = PLACEMENTS.includes(rawPlacement as GuidePlacement)
		? (rawPlacement as GuidePlacement)
		: 'post';

	if (!email) return { ok: false, errors: { email: 'Email is required' } };
	if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
		return { ok: false, errors: { email: 'Enter a valid email' } };
	}
	return { ok: true, value: { email, placement } };
}

export type GuideEnv = {
	RESEND_API_KEY?: string;
	CONTACT_TO?: string;
	CONTACT_FROM?: string;
};

/** Base64 for a Worker: no Buffer, so chunk through btoa. */
export function toBase64(bytes: Uint8Array): string {
	let binary = '';
	const CHUNK = 0x8000;
	for (let i = 0; i < bytes.length; i += CHUNK) {
		binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
	}
	return btoa(binary);
}

/** The note that travels with the PDF. Plain text and a matching, equally plain HTML. */
export function guideEmail(pdfUrl: string): { subject: string; text: string; html: string } {
	const subject = `Your copy of “${guide.title}”`;
	const paragraphs = [
		'Hi,',
		`Here’s the guide, attached as a PDF (${guide.pages} pages). If the attachment didn’t come through, this link opens the same file: ${pdfUrl}`,
		'The ten-minute version is on page 2: five checks you can run on your phone right now. The rest is there for when you want to go deeper, including a worked example on a real site and a worksheet for the one fix you decide to make.',
		'If you’d like a second pair of eyes, reply to this email with your website address. I’ll go through the public patient journey myself and send back three findings, with screenshots, within two business days. No charge, no obligation.',
		'Platte',
		`root. · ${site.url.replace('https://', '')}`
	];
	const text = paragraphs.join('\n\n');
	const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const html = `<!doctype html><html><body style="margin:0;padding:32px 24px;background:#f7f4ef;color:#2a2522;font-family:Karla,system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6">
<div style="max-width:560px;margin:0 auto">
<p style="margin:0 0 28px;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#1a1715">root.</p>
${paragraphs
	.slice(0, 1)
	.map((p) => `<p style="margin:0 0 18px">${esc(p)}</p>`)
	.join('')}
<p style="margin:0 0 18px">Here’s the guide, attached as a PDF (${guide.pages} pages). If the attachment didn’t come through, <a href="${pdfUrl}" style="color:#7c5e44">this link opens the same file</a>.</p>
${paragraphs
	.slice(2, 4)
	.map((p) => `<p style="margin:0 0 18px">${esc(p)}</p>`)
	.join('')}
<p style="margin:28px 0 0">Platte</p>
<p style="margin:4px 0 0;color:#6b6560;font-size:14px">root. · <a href="${site.url}" style="color:#7c5e44">${esc(site.url.replace('https://', ''))}</a></p>
</div></body></html>`;
	return { subject, text, html };
}

async function resend(apiKey: string, body: Record<string, unknown>): Promise<void> {
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
}

/**
 * Send the guide to the person, then tell root about it. The first send
 * is the one that must succeed; the notification is best effort.
 *
 * `pdf` is the file's bytes (fetched by the route from the deployed
 * assets); `pdfUrl` is its public address, used as the fallback link in
 * the note. With no Resend key (local dev) the request is logged and
 * treated as sent.
 */
export async function deliverGuide(
	request: GuideRequest,
	env: GuideEnv,
	pdf: Uint8Array,
	pdfUrl: string
): Promise<void> {
	const from = env.CONTACT_FROM ?? 'root. <hello@root.site>';
	const { subject, text, html } = guideEmail(pdfUrl);

	if (!env.RESEND_API_KEY) {
		console.log('[guide] request received (no backend configured):', {
			email: request.email,
			placement: request.placement,
			pdfBytes: pdf.byteLength
		});
		return;
	}

	await resend(env.RESEND_API_KEY, {
		from,
		to: [request.email],
		reply_to: site.email,
		subject,
		text,
		html,
		attachments: [{ filename: guide.filename, content: toBase64(pdf) }]
	});

	if (!env.CONTACT_TO) return;
	try {
		await resend(env.RESEND_API_KEY, {
			from,
			to: env.CONTACT_TO.split(',').map((s) => s.trim()),
			reply_to: request.email,
			subject: `Guide requested — ${request.email}`,
			text: `${request.email} asked for the dental website guide from the ${request.placement.replace('_', ' ')} form. It was sent.`
		});
	} catch (err) {
		console.error('[guide] notification failed (ignored):', err);
	}
}
