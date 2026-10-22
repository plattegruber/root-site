import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { Allowlist, RateLimiter } from '../src/access.js';
import { createApp } from '../src/server.js';
import { root } from './helpers.js';

test('allowlist matches published ranges, maps IPv4-in-IPv6 and fails closed', async () => {
	const list = new Allowlist(async () => [
		'100.31.168.162/32',
		'104.192.219.204/30',
		'2001:db8::/32'
	]);
	assert.equal(list.allows('100.31.168.162'), false, 'nothing allowed before the first load');
	await list.refresh();
	assert.equal(list.allows('100.31.168.162'), true);
	assert.equal(list.allows('::ffff:104.192.219.206'), true);
	assert.equal(list.allows('2001:db8::1'), true);
	assert.equal(list.allows('8.8.8.8'), false);
	assert.equal(list.allows('not-an-ip'), false);
	const broken = new Allowlist(async () => {
		throw new Error('offline');
	});
	await broken.refresh();
	assert.equal(broken.allows('100.31.168.162'), false);
});

test('rate limiter enforces a per-caller window and a daily cap', () => {
	const limiter = new RateLimiter({ limit: 2, windowMs: 1_000 }, 3);
	assert.equal(limiter.take('a', 0), 'ok');
	assert.equal(limiter.take('a', 1), 'ok');
	assert.equal(limiter.take('a', 2), 'caller');
	assert.equal(limiter.take('a', 1_001), 'ok');
	assert.equal(limiter.take('b', 1_002), 'daily');
	assert.equal(limiter.take('b', 86_400_001), 'ok');
});

test('public mode admits allowlisted clients or the token, keeps the API closed and limits calls', async () => {
	const allowlist = new Allowlist(async () => ['203.0.113.0/24']);
	await allowlist.refresh();
	const server = createApp({
		root,
		origin: 'http://127.0.0.1:3197',
		token: 'test-token',
		publicMcp: true,
		allowlist,
		clientIpHeader: 'x-test-client-ip',
		limiter: new RateLimiter({ limit: 1, windowMs: 60_000 }, 100),
		challenge: 'challenge-token-123'
	}).listen(3197, '127.0.0.1');
	await new Promise<void>((r) => server.once('listening', r));
	const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
	const call = (ip: string, body: unknown, auth?: string) =>
		fetch(`${base}/mcp`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json, text/event-stream',
				'x-test-client-ip': ip,
				...(auth ? { authorization: `Bearer ${auth}` } : {})
			},
			body: JSON.stringify(body)
		});
	const list = { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} };
	try {
		assert.equal((await call('198.51.100.7', list)).status, 403);
		assert.equal((await call('203.0.113.9', list)).status, 200);
		assert.equal((await call('198.51.100.7', list, 'test-token')).status, 200);
		assert.equal((await call('198.51.100.7', list, 'wrong')).status, 403);

		const tool = (id: number) => ({
			jsonrpc: '2.0',
			id,
			method: 'tools/call',
			params: { name: 'get_assessment_guide', arguments: {}, _meta: { 'openai/subject': 'u1' } }
		});
		await call('203.0.113.9', tool(2));
		const limited = await call('203.0.113.9', tool(3));
		const refusal = (await limited.json()) as { id: number; result: { isError: boolean } };
		assert.equal(refusal.id, 3);
		assert.equal(refusal.result.isError, true);

		assert.equal((await fetch(`${base}/api/sample`)).status, 401);
		const challenge = await fetch(`${base}/.well-known/openai-apps-challenge`);
		assert.equal(await challenge.text(), 'challenge-token-123');
		assert.match(await (await fetch(`${base}/`)).text(), /MCP endpoint/);
	} finally {
		await new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())));
	}
});
