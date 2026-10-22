import express from 'express';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp.js';
import { inputSchema, reportSchema, type Report } from './model.js';
import { auditWebsite, type AuditOptions } from './audit/engine.js';
import { safeError } from './security/fetch.js';
import { Allowlist, RateLimiter, equalSecret } from './access.js';
import { hashSubject } from './telemetry.js';

type Job = {
	created: number;
	stage: string;
	report?: Report;
	error?: string;
	status: 'running' | 'completed' | 'failed';
};
export type ServerOptions = {
	root?: string;
	origin?: string;
	token?: string;
	maxConcurrent?: number;
	auditOptions?: AuditOptions;
	/** Public mode: /mcp is open to ChatGPT's published IP ranges without a token. */
	publicMcp?: boolean;
	allowlist?: Allowlist;
	/** Additional accepted Host headers, e.g. the platform hostname. */
	extraHosts?: string[];
	/** Header carrying the client IP set by the platform proxy (Fly: fly-client-ip). */
	clientIpHeader?: string;
	limiter?: RateLimiter;
	/** OpenAI domain-verification token served at /.well-known/openai-apps-challenge. */
	challenge?: string;
};
const env = process.env;
// A tool error in JSON-RPC form, so ChatGPT shows the reason instead of a transport failure.
const toolRefusal = (id: unknown, text: string) => ({
	jsonrpc: '2.0',
	id: id ?? null,
	result: { isError: true, content: [{ type: 'text', text }] }
});
export function createApp(options: ServerOptions = {}) {
	const app = express();
	app.disable('x-powered-by');
	app.set('trust proxy', false);
	const root = options.root ?? fileURLToPath(new URL('../', import.meta.url));
	const publicOrigin = options.origin ?? process.env.PUBLIC_ORIGIN ?? 'http://127.0.0.1:3000';
	const origin = new URL(publicOrigin);
	const token = options.token ?? env.AUDIT_API_TOKEN;
	const local = ['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname);
	const publicMcp = options.publicMcp ?? env.PUBLIC_MCP === 'true';
	const allowlist = options.allowlist ?? (publicMcp ? new Allowlist().start() : undefined);
	const extraHosts =
		options.extraHosts ??
		(env.EXTRA_HOSTS ?? '')
			.split(',')
			.map((h) => h.trim())
			.filter(Boolean);
	const ipHeader = options.clientIpHeader ?? env.CLIENT_IP_HEADER;
	const clientIp = (req: express.Request) =>
		(ipHeader && req.get(ipHeader)) || req.socket.remoteAddress || '';
	const limiter =
		options.limiter ??
		new RateLimiter(
			{ limit: Number(env.CALLER_LIMIT ?? 40), windowMs: 10 * 60 * 1000 },
			Number(env.DAILY_TOOL_CALL_LIMIT ?? 1500)
		);
	const challenge = options.challenge ?? env.OPENAI_APPS_CHALLENGE;
	const jobs = new Map<string, Job>();
	let running = 0;
	const max = Math.max(
		1,
		Math.min(4, options.maxConcurrent ?? Number(process.env.MAX_CONCURRENT_AUDITS ?? 2))
	);
	app.use((req, res, next) => {
		res.set({
			'X-Content-Type-Options': 'nosniff',
			'Referrer-Policy': 'no-referrer',
			'Cache-Control': 'no-store',
			'Content-Security-Policy':
				"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
		});
		const allowed = new Set([
			origin.host,
			...extraHosts,
			...(local ? [`localhost:${origin.port}`, `127.0.0.1:${origin.port}`] : [])
		]);
		// Platform health checks reach the machine by address, not by public hostname.
		if (!allowed.has(req.get('host') ?? '') && req.path !== '/health') {
			res.status(403).json({ error: 'Unexpected Host header.' });
			return;
		}
		if (req.get('origin') && req.get('origin') !== origin.origin) {
			res.status(403).json({ error: 'Cross-origin requests are not accepted.' });
			return;
		}
		const hasToken = Boolean(
			token && equalSecret(req.get('authorization')?.replace(/^Bearer /, '') ?? '', token)
		);
		if (req.path === '/mcp') {
			if (hasToken || (!publicMcp && !token && local)) return next();
			if (publicMcp && allowlist?.allows(clientIp(req))) return next();
			res
				.status(publicMcp ? 403 : token ? 401 : 503)
				.json({ error: publicMcp ? 'Not an allowed client.' : 'Staging API token required.' });
			return;
		}
		if (req.path.startsWith('/api/')) {
			if (hasToken || (!token && local && !publicMcp)) return next();
			res
				.status(token ? 401 : 503)
				.json({ error: 'The assessment API requires a token on this deployment.' });
			return;
		}
		next();
	});
	app.use(express.json({ limit: '768kb' }));
	app.get('/.well-known/openai-apps-challenge', (_req, res) => {
		if (!challenge) {
			res.status(404).type('text/plain').send('Not configured.');
			return;
		}
		res.type('text/plain').send(challenge);
	});
	app.get('/health', (_req, res) =>
		res.json({ ok: true, service: 'dental-website-review', version: '0.2.0' })
	);
	app.get('/api/sample', (_req, res) => {
		try {
			res.json(
				reportSchema.parse(JSON.parse(readFileSync(resolve(root, 'samples/report.json'), 'utf8')))
			);
		} catch {
			res.status(503).json({ error: 'Generate the fixture report with pnpm sample.' });
		}
	});
	app.post('/api/audits', (req, res) => {
		const parsed = inputSchema.safeParse(req.body);
		if (!parsed.success) {
			res
				.status(400)
				.json({ error: 'Provide a public website URL and optional Google Maps link only.' });
			return;
		}
		for (const [key, job] of jobs) if (Date.now() - job.created > 30 * 60 * 1000) jobs.delete(key);
		if (running >= max || jobs.size >= 30) {
			res
				.status(429)
				.set('Retry-After', '60')
				.json({ error: 'Audit capacity is busy. Please retry shortly.' });
			return;
		}
		const id = randomUUID();
		const job: Job = { created: Date.now(), stage: 'Starting assessment', status: 'running' };
		jobs.set(id, job);
		setTimeout(() => jobs.delete(id), 30 * 60 * 1000).unref();
		running++;
		// This job exists only in local process memory. The unguessable ID is a capability.
		void auditWebsite(parsed.data, {
			...options.auditOptions,
			onProgress: (stage) => {
				job.stage = stage;
			}
		})
			.then(
				(report) => {
					job.report = report;
					job.status = 'completed';
				},
				(error) => {
					job.error = safeError(error);
					job.status = 'failed';
				}
			)
			.finally(() => {
				running--;
			});
		res.status(202).json({ id, stage: job.stage });
	});
	app.get('/api/audits/:id', (req, res) => {
		const job = jobs.get(req.params.id);
		if (!job || Date.now() - job.created > 30 * 60 * 1000) {
			if (job) jobs.delete(req.params.id);
			res.status(404).json({ error: 'Report not found or expired.' });
			return;
		}
		res.json({ status: job.status, stage: job.stage, report: job.report, error: job.error });
	});
	app.delete('/api/audits/:id', (req, res) => {
		jobs.delete(req.params.id);
		res.status(204).end();
	});
	app.post('/mcp', async (req, res) => {
		// Only tool calls do network work; discovery and initialization must never queue behind them.
		const body = req.body as
			| { id?: unknown; method?: unknown; params?: { _meta?: Record<string, unknown> } }
			| undefined;
		const costly = body?.method === 'tools/call';
		if (costly) {
			const caller = hashSubject(body?.params?._meta?.['openai/subject']) ?? clientIp(req);
			const verdict = limiter.take(caller);
			if (verdict !== 'ok') {
				res.json(
					toolRefusal(
						body?.id,
						verdict === 'daily'
							? 'Dental Website Review has reached its daily assessment limit. Please try again tomorrow.'
							: 'Too many requests in a short time. Please wait a few minutes and try again.'
					)
				);
				return;
			}
			if (running >= max) {
				res.json(
					toolRefusal(body?.id, 'All assessment slots are busy. Please try again in a minute.')
				);
				return;
			}
		}
		if (costly) running++;
		const server = createMcpServer(root, options.auditOptions);
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
			enableJsonResponse: true
		});
		res.on('close', () => {
			void transport.close();
			void server.close();
		});
		try {
			await server.connect(transport);
			await transport.handleRequest(req, res, req.body);
		} catch {
			if (!res.headersSent) res.status(500).json({ error: 'MCP request could not be completed.' });
		} finally {
			if (costly) running--;
		}
	});
	app.all('/mcp', (_req, res) => res.status(405).set('Allow', 'POST').end());
	// The standalone page needs the token-gated API, so a public deployment serves only MCP.
	if (publicMcp)
		app.get('/', (_req, res) =>
			res
				.type('text/plain')
				.send('Dental Website Review by root.site. MCP endpoint for ChatGPT: /mcp')
		);
	else app.use(express.static(resolve(root, 'web'), { index: 'index.html' }));
	app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));
	app.use(
		(error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
			void error;
			void _next;
			res.status(400).json({ error: 'Request body could not be processed.' });
		}
	);
	return app;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
	const port = Number(process.env.PORT ?? 3000),
		host = process.env.HOST ?? '127.0.0.1';
	const publicMcp = process.env.PUBLIC_MCP === 'true';
	// A cold start must not answer ChatGPT before the allowlist has loaded.
	const allowlist = publicMcp ? new Allowlist() : undefined;
	if (allowlist) {
		await Promise.race([allowlist.refresh(), new Promise((r) => setTimeout(r, 10_000))]);
		allowlist.start();
		console.log(JSON.stringify({ type: 'allowlist_loaded', ranges: allowlist.size }));
	}
	createApp({ allowlist }).listen(port, host, () =>
		console.log(
			`Dental Website Review by root.site: http://${host}:${port} (${publicMcp ? 'public MCP' : 'local'})`
		)
	);
}
