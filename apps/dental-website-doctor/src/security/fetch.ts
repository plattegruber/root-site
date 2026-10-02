import http from 'node:http';
import https from 'node:https';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { FetchError, normalizeUrl, resolvePublic, type Lookup } from './url.js';

export type FetchResult = {
	url: string;
	status: number;
	headers: Record<string, string>;
	body: Buffer;
	fetchedAt: string;
	redirects: string[];
};
export type FetchOptions = {
	maxBytes?: number;
	timeoutMs?: number;
	maxRedirects?: number;
	method?: 'GET' | 'HEAD' | 'POST';
	body?: string;
	headers?: Record<string, string>;
	signal?: AbortSignal;
	preserveQuery?: boolean;
};
export type SafeFetcher = (url: string, options?: FetchOptions) => Promise<FetchResult>;
type Transport = (
	url: URL,
	pin: { address: string; family: number },
	options: FetchOptions
) => Promise<Omit<FetchResult, 'redirects'>>;
export type FetchDependencies = { lookup?: Lookup; transport?: Transport };

// The CONNECT endpoint is an already-validated IP. SNI and Host stay the original
// hostname. This pins DNS for the socket, even behind an inherited egress proxy.
class PinnedProxyAgent extends HttpsProxyAgent<string> {
	constructor(
		proxy: string,
		private pin: { address: string; family: number },
		private originalHost: string
	) {
		super(proxy);
	}
	override connect(
		req: http.ClientRequest,
		options: Parameters<HttpsProxyAgent<string>['connect']>[1]
	) {
		const pinned = {
			...options,
			host: this.pin.address,
			servername: this.originalHost,
			family: this.pin.family
		};
		return super.connect(req, pinned);
	}
}

export const nativeTransport: Transport = async (url, pin, options) => {
	const maxBytes = options.maxBytes ?? 2_000_000;
	const timeoutMs = options.timeoutMs ?? 12_000;
	const host = url.hostname.replace(/^\[|\]$/g, '');
	const proxy =
		url.protocol === 'https:'
			? (process.env.HTTPS_PROXY ?? process.env.https_proxy)
			: (process.env.HTTP_PROXY ?? process.env.http_proxy);
	const headers = {
		'User-Agent': 'DentalWebsiteDoctor/0.1 (+public, bounded website assessment; root.site)',
		Accept:
			'text/html,application/xhtml+xml,application/xml,text/plain,application/json,image/*;q=0.5',
		Host: url.host,
		...options.headers
	};
	let requestUrl: URL = url;
	const requestOptions: https.RequestOptions = {
		method: options.method ?? 'GET',
		headers,
		lookup: (_hostname, _opts, cb) => cb(null, pin.address, pin.family),
		servername: host,
		rejectUnauthorized: true
	};
	if (proxy && url.protocol === 'https:')
		requestOptions.agent = new PinnedProxyAgent(proxy, pin, host);
	if (proxy && url.protocol === 'http:') {
		requestUrl = new URL(proxy);
		const targetHost = pin.family === 6 ? `[${pin.address}]` : pin.address;
		requestOptions.path = `http://${targetHost}${url.port ? `:${url.port}` : ''}${url.pathname}${url.search}`;
		delete requestOptions.lookup;
	}
	return new Promise((resolve, reject) => {
		let settled = false;
		const done = (error: Error) => {
			if (!settled) {
				settled = true;
				reject(error);
			}
		};
		const request = (requestUrl.protocol === 'https:' ? https : http).request(
			requestUrl,
			requestOptions,
			(response) => {
				const length = Number(response.headers['content-length'] ?? 0);
				if (length > maxBytes && options.method !== 'HEAD') {
					response.destroy();
					done(new FetchError('too_large', `Response exceeds ${maxBytes} bytes.`));
					return;
				}
				if (
					response.headers['content-encoding'] &&
					response.headers['content-encoding'] !== 'identity'
				) {
					response.destroy();
					done(
						new FetchError(
							'encoding',
							'Unexpected compressed response; bounded fetch requires identity encoding.'
						)
					);
					return;
				}
				const chunks: Buffer[] = [];
				let size = 0;
				response.on('data', (chunk: Buffer) => {
					size += chunk.length;
					if (size > maxBytes) {
						response.destroy();
						done(new FetchError('too_large', `Response exceeds ${maxBytes} bytes.`));
					} else chunks.push(chunk);
				});
				response.on('error', () =>
					done(new FetchError('network', 'The public server connection failed.'))
				);
				response.on('end', () => {
					if (settled) return;
					settled = true;
					const safeHeaders: Record<string, string> = {};
					for (const name of [
						'content-type',
						'content-length',
						'location',
						'x-robots-tag',
						'strict-transport-security'
					]) {
						const v = response.headers[name];
						if (v) safeHeaders[name] = Array.isArray(v) ? v.join(', ') : v;
					}
					resolve({
						url: url.href,
						status: response.statusCode ?? 0,
						headers: safeHeaders,
						body: Buffer.concat(chunks),
						fetchedAt: new Date().toISOString()
					});
				});
			}
		);
		request.setHeader('Accept-Encoding', 'identity');
		const timer = setTimeout(() => {
			request.destroy();
			done(new FetchError('timeout', `Request exceeded ${timeoutMs} ms.`));
		}, timeoutMs);
		timer.unref();
		const abort = () => {
			request.destroy();
			done(new FetchError('aborted', 'Audit time budget reached.'));
		};
		options.signal?.addEventListener('abort', abort, { once: true });
		request.on('close', () => {
			clearTimeout(timer);
			options.signal?.removeEventListener('abort', abort);
		});
		request.on('error', () =>
			done(new FetchError('network', 'The public server could not be reached securely.'))
		);
		if (options.signal?.aborted) {
			abort();
			return;
		}
		request.end(options.body);
	});
};

export function createSafeFetcher(dependencies: FetchDependencies = {}): SafeFetcher {
	return async (raw, options = {}) => {
		let url = normalizeUrl(raw);
		if (options.preserveQuery) url.search = new URL(raw).search;
		if (
			(options.method === 'POST' || options.headers || options.body) &&
			url.hostname !== 'places.googleapis.com'
		)
			throw new FetchError(
				'provider_boundary',
				'Credentialed POST requests are limited to the configured Places API endpoint.'
			);
		const redirects: string[] = [];
		for (let step = 0; step <= (options.maxRedirects ?? 4); step++) {
			if (options.signal?.aborted) throw new FetchError('aborted', 'Audit time budget reached.');
			const pin = await resolvePublic(url, dependencies.lookup);
			const result = await (dependencies.transport ?? nativeTransport)(url, pin, options);
			if ([301, 302, 303, 307, 308].includes(result.status) && result.headers.location) {
				if (step === (options.maxRedirects ?? 4))
					throw new FetchError('redirect_limit', 'Too many redirects.');
				const target = new URL(result.headers.location, url);
				if (options.headers || options.method === 'POST')
					throw new FetchError('provider_redirect', 'Credentialed provider redirects are blocked.');
				if (target.username || target.password)
					throw new FetchError('credentials', 'Redirect credentials are blocked.');
				const normalized = normalizeUrl(target.href);
				if (options.preserveQuery) normalized.search = target.search;
				redirects.push(url.href);
				url = normalized;
				continue;
			}
			return { ...result, redirects };
		}
		throw new FetchError('redirect_limit', 'Too many redirects.');
	};
}
export const safeFetch = createSafeFetcher();
export function safeError(error: unknown): string {
	return error instanceof FetchError
		? `${error.code}: ${error.message}`
		: 'Provider failed; completed checks have been preserved.';
}
