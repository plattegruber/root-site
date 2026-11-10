// Live checks for an OpenAI plugin submission: the four listing pages, the walkthrough
// video, the domain-verification challenge, and the deployed MCP server's version and
// tools against plugin/plugin.json. Run before uploading a ZIP or resubmitting:
//   pnpm check:listing
// The bearer test token (never printed) is read from ~/.config/dental-website-review/fly-token
// so the MCP checks pass from outside OpenAI's IP ranges.
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const manifest = JSON.parse(readFileSync(resolve(root, 'plugin/plugin.json'), 'utf8'));
const openai = manifest.extensions['com.openai'];
const ui = openai.interface;
const mcp = Object.values(
	JSON.parse(readFileSync(resolve(root, 'plugin/mcp.json'), 'utf8')).mcpServers
)[0];
const publisher = manifest.author.name;
const tokenFile = resolve(homedir(), '.config/dental-website-review/fly-token');
const token = existsSync(tokenFile) ? readFileSync(tokenFile, 'utf8').trim() : '';

let failures = 0;
const report = (ok, label, detail = '') => {
	if (!ok) failures++;
	console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? `  (${detail})` : ''}`);
};
const get = (url, init) =>
	fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30_000), ...init });

for (const key of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
	try {
		const r = await get(ui[key]);
		const html = await r.text();
		const text = html.replace(/<[^>]+>/g, ' ');
		report(r.ok, `${key} responds`, `${r.status} ${ui[key]}`);
		report(
			text.includes(publisher) || text.includes(ui.developerName),
			`${key} identifies the publisher`,
			publisher
		);
		if (key === 'supportURL') report(/mailto:/.test(html), 'support page has a contact email');
		if (key === 'privacyPolicyURL')
			report(/last four digits/.test(text), 'privacy policy describes tool responses');
	} catch (e) {
		report(false, `${key} responds`, String(e));
	}
}

try {
	const r = await get(openai.review.demo_recording_url, { method: 'HEAD' });
	report(
		r.ok && /video\//.test(r.headers.get('content-type') ?? ''),
		'demo recording is reachable video',
		`${r.status} ${r.headers.get('content-type')}`
	);
} catch (e) {
	report(false, 'demo recording is reachable', String(e));
}

const origin = new URL(mcp.url).origin;
try {
	const r = await get(`${origin}/.well-known/openai-apps-challenge`);
	const body = await r.text();
	report(
		r.ok && /^text\/plain/.test(r.headers.get('content-type') ?? ''),
		'domain challenge served as text/plain',
		String(r.status)
	);
	report(
		body.trim().length > 0 && !body.includes('\n') && !body.trim().startsWith('{'),
		'domain challenge is one bare token'
	);
} catch (e) {
	report(false, 'domain challenge served', String(e));
}

try {
	const r = await get(`${origin}/health`);
	const health = await r.json();
	report(
		health.version === manifest.version,
		'deployed server version matches the manifest',
		`server ${health.version}, manifest ${manifest.version}`
	);
} catch (e) {
	report(false, 'health endpoint', String(e));
}

const rpc = async (method, params, id, session) => {
	const r = await get(mcp.url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			accept: 'application/json, text/event-stream',
			...(token ? { authorization: `Bearer ${token}` } : {}),
			...(session ? { 'mcp-session-id': session } : {})
		},
		body: JSON.stringify({ jsonrpc: '2.0', id, method, params })
	});
	const text = await r.text();
	const json =
		text.startsWith('event:') || text.startsWith('data:')
			? JSON.parse(
					text
						.split('\n')
						.find((l) => l.startsWith('data:'))
						.slice(5)
				)
			: JSON.parse(text);
	return { status: r.status, session: r.headers.get('mcp-session-id'), json };
};
if (!token) report(false, 'MCP checks need the test token', tokenFile);
else
	try {
		const init = await rpc(
			'initialize',
			{
				protocolVersion: '2025-06-18',
				capabilities: {},
				clientInfo: { name: 'check-listing', version: '1' }
			},
			1
		);
		report(init.status === 200, 'MCP initialize', String(init.status));
		report(
			init.json.result?.serverInfo?.version === manifest.version,
			'MCP server version matches the manifest',
			init.json.result?.serverInfo?.version
		);
		const list = await rpc('tools/list', {}, 2, init.session);
		const tools = list.json.result?.tools ?? [];
		const names = new Set(tools.map((t) => t.name));
		const expected = new Set(
			openai.review.test_cases.positive.flatMap((c) =>
				c.tools_triggered.split(/[,\s]+/).filter(Boolean)
			)
		);
		for (const name of expected) report(names.has(name), `live server exposes ${name}`);
		for (const t of tools)
			report(
				['readOnlyHint', 'destructiveHint', 'openWorldHint'].every(
					(h) => typeof t.annotations?.[h] === 'boolean'
				),
				`${t.name} has explicit annotations`
			);
	} catch (e) {
		report(false, 'MCP checks', String(e));
	}

console.log(failures ? `\n${failures} check(s) failed.` : '\nAll listing checks passed.');
process.exit(failures ? 1 : 0);
