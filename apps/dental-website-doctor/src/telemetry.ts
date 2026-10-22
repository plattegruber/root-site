import { createHash } from 'node:crypto';

/**
 * One event per tool call: which tool, how long, whether it worked, which public business
 * domain was assessed, and coarse request metadata ChatGPT sends (an anonymized subject,
 * locale, country). Never page text, prompts or answers. Written to stdout as JSON; also
 * sent to PostHog when POSTHOG_API_KEY is set.
 */
export type ToolEvent = {
	tool: string;
	ok: boolean;
	durationMs: number;
	error?: string;
	domain?: string;
	pages?: number;
	views?: number;
	user?: string;
	locale?: string;
	country?: string;
};

const salt = process.env.ANALYTICS_SALT ?? '';
export const hashSubject = (subject: unknown) =>
	typeof subject === 'string' && subject
		? createHash('sha256').update(`${salt}:${subject}`).digest('hex').slice(0, 20)
		: undefined;

export function domainOf(input: Record<string, unknown>): string | undefined {
	const raw =
		input.websiteUrl ?? input.url ?? (Array.isArray(input.urls) ? input.urls[0] : undefined);
	if (typeof raw !== 'string') return undefined;
	try {
		return new URL(raw.includes('://') ? raw : `https://${raw}`).hostname.replace(/^www\./, '');
	} catch {
		return undefined;
	}
}

export function requestContext(meta: Record<string, unknown> | undefined) {
	const location = meta?.['openai/userLocation'] as { country?: unknown } | undefined;
	return {
		user: hashSubject(meta?.['openai/subject']),
		locale:
			typeof meta?.['openai/locale'] === 'string' ? (meta['openai/locale'] as string) : undefined,
		country: typeof location?.country === 'string' ? location.country : undefined
	};
}

export function recordToolCall(event: ToolEvent) {
	console.log(JSON.stringify({ type: 'tool_call', at: new Date().toISOString(), ...event }));
	const key = process.env.POSTHOG_API_KEY;
	if (!key) return;
	const host = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com';
	const { user, ...properties } = event;
	void fetch(`${host}/i/v0/e/`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			api_key: key,
			event: 'dwd_tool_call',
			distinct_id: user ?? 'anonymous',
			properties: { ...properties, $process_person_profile: Boolean(user) }
		}),
		signal: AbortSignal.timeout(5_000)
	}).catch(() => {});
}
