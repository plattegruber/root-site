import express from 'express';
import { timingSafeEqual, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp.js';
import { inputSchema, reportSchema, type Report } from './model.js';
import { auditWebsite, type AuditOptions } from './audit/engine.js';
import { safeError } from './security/fetch.js';

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
};
function equalSecret(a: string, b: string) {
	const aa = Buffer.from(a),
		bb = Buffer.from(b);
	return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export function createApp(options: ServerOptions = {}) {
	const app = express();
	app.disable('x-powered-by');
	app.set('trust proxy', false);
	const root = options.root ?? fileURLToPath(new URL('../', import.meta.url));
	const publicOrigin = options.origin ?? process.env.PUBLIC_ORIGIN ?? 'http://127.0.0.1:3000';
	const origin = new URL(publicOrigin);
	const token = options.token ?? process.env.AUDIT_API_TOKEN;
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
			...(origin.hostname === '127.0.0.1' || origin.hostname === 'localhost'
				? [`localhost:${origin.port}`, `127.0.0.1:${origin.port}`]
				: [])
		]);
		if (!allowed.has(req.get('host') ?? '')) {
			res.status(403).json({ error: 'Unexpected Host header.' });
			return;
		}
		if (req.get('origin') && req.get('origin') !== origin.origin) {
			res.status(403).json({ error: 'Cross-origin requests are not accepted.' });
			return;
		}
		if (req.path.startsWith('/api/') || req.path === '/mcp') {
			if (token && !equalSecret(req.get('authorization')?.replace(/^Bearer /, '') ?? '', token)) {
				res.status(401).json({ error: 'Staging API token required.' });
				return;
			}
			if (!token && !['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname)) {
				res.status(503).json({
					error:
						'Remote staging requires an authenticated gateway or AUDIT_API_TOKEN; public deployment is not enabled.'
				});
				return;
			}
		}
		next();
	});
	app.use(express.json({ limit: '768kb' }));
	app.get('/health', (_req, res) =>
		res.json({ ok: true, service: 'dental-website-doctor', version: '0.1.0' })
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
		if (running >= max) {
			res.status(429).json({ error: 'Audit capacity is busy.' });
			return;
		}
		running++;
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
			running--;
		}
	});
	app.all('/mcp', (_req, res) => res.status(405).set('Allow', 'POST').end());
	app.use(express.static(resolve(root, 'web'), { index: 'index.html' }));
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
	createApp().listen(port, host, () =>
		console.log(`Dental Website Doctor by root.site: http://${host}:${port} (local V0)`)
	);
}
