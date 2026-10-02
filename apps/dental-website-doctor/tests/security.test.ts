import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, publicAddress, resolvePublic, mapsUrl } from '../src/security/url.js';
import { createSafeFetcher } from '../src/security/fetch.js';
import { response } from './helpers.js';

test('blocks SSRF URL forms and special-use networks', () => {
	for (const url of [
		'http://localhost',
		'http://127.0.0.1',
		'http://2130706433',
		'http://0x7f000001',
		'http://169.254.169.254/latest/meta-data',
		'http://10.1.2.3',
		'http://[::1]',
		'http://[::ffff:127.0.0.1]',
		'http://[fe80::1]',
		'http://192.0.2.1',
		'ftp://practice.com',
		'https://user:secret@practice.com',
		'https://practice.com:8080',
		'http://practice.internal'
	])
		assert.throws(() => normalizeUrl(url), url);
	for (const ip of [
		'100.64.0.1',
		'172.16.0.1',
		'192.168.1.1',
		'0.0.0.0',
		'224.0.0.1',
		'255.255.255.255',
		'2001:db8::1',
		'64:ff9b::a00:1',
		'2002:7f00:1::',
		'fc00::1',
		'::'
	])
		assert.equal(publicAddress(ip), false, ip);
	assert.equal(publicAddress('1.1.1.1'), true);
	assert.equal(publicAddress('2606:4700:4700::1111'), true);
});
test('normalizes URLs and removes potential patient/tracking query values', () => {
	assert.equal(
		normalizeUrl('practice.com/contact?patient_id=secret#records').href,
		'https://practice.com/contact'
	);
});
test('blocks a mixed public/private DNS answer', async () => {
	await assert.rejects(
		resolvePublic(new URL('https://practice.com'), async () => [
			{ address: '1.1.1.1', family: 4 },
			{ address: '10.0.0.1', family: 4 }
		]),
		/private/
	);
});
test('pins a public IP once per hop and blocks private redirects', async () => {
	const pins: string[] = [];
	let lookups = 0;
	const fetcher = createSafeFetcher({
		lookup: async () => {
			lookups++;
			return [{ address: '1.1.1.1', family: 4 }];
		},
		transport: async (url, pin) => {
			pins.push(pin.address);
			return response(url.href, '', 302, { location: 'http://169.254.169.254/' });
		}
	});
	await assert.rejects(fetcher('https://practice.com'), /Private|special-use/);
	assert.deepEqual(pins, ['1.1.1.1']);
	assert.equal(lookups, 1);
});
test('validates DNS again on redirects and does not trust a hostname after rebinding', async () => {
	let calls = 0;
	let connects = 0;
	const fetcher = createSafeFetcher({
		lookup: async () => [{ address: ++calls === 1 ? '1.1.1.1' : '127.0.0.1', family: 4 }],
		transport: async (url) => {
			connects++;
			return response(url.href, '', 302, { location: '/second' });
		}
	});
	await assert.rejects(fetcher('https://practice.com'), /private/);
	assert.equal(connects, 1);
});
test('redirect loops are bounded and credentials are never forwarded', async () => {
	const fetcher = createSafeFetcher({
		lookup: async () => [{ address: '1.1.1.1', family: 4 }],
		transport: async (url) => response(url.href, '', 302, { location: url.href })
	});
	await assert.rejects(fetcher('https://practice.com', { maxRedirects: 2 }), /Too many/);
	await assert.rejects(
		fetcher('https://practice.com', { headers: { Authorization: 'secret' } }),
		/limited/
	);
});
test('restricts Maps links to allowed Google paths and preserves place IDs', () => {
	assert.equal(
		mapsUrl('https://www.google.com/maps/search/?query_place_id=abc').searchParams.get(
			'query_place_id'
		),
		'abc'
	);
	for (const url of [
		'https://google.com.evil.com/maps',
		'https://www.google.com/url?q=https://evil.com',
		'https://goo.gl/x',
		'http://maps.google.com',
		'https://maps.app.goo.gl:444/x'
	])
		assert.throws(() => mapsUrl(url));
});
