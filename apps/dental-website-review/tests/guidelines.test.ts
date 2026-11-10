/**
 * One test per section of OpenAI's plugin guidelines
 * (https://developers.openai.com/plugins/plugin-guidelines) and the review requirements
 * (https://developers.openai.com/plugins/deploy/app-review,
 * https://developers.openai.com/plugins/deploy/submission). Each test names the section it
 * checks; docs/guideline-compliance.md maps every section to a test or a manual check.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createMcpServer, REPORT_URI, type McpOptions } from '../src/mcp.js';
import { hashSubject, recordToolCall, requestContext } from '../src/telemetry.js';
import { fixtureFetcher, root, siteFetcher } from './helpers.js';

const plugin = resolve(root, 'plugin');
const manifest = JSON.parse(readFileSync(resolve(plugin, 'plugin.json'), 'utf8'));
const openai = manifest.extensions['com.openai'];
const ui = openai.interface;
const mcpJson = JSON.parse(readFileSync(resolve(plugin, 'mcp.json'), 'utf8'));
const skillDir = resolve(plugin, 'skills/audit-practice');
const skill = readFileSync(resolve(skillDir, 'SKILL.md'), 'utf8');
const guide = readFileSync(resolve(skillDir, 'references/dental-website-guide.md'), 'utf8');
const privacyPage = readFileSync(
	resolve(root, '../../src/routes/dental-website-review/privacy/+page.svelte'),
	'utf8'
);

/** Guideline: no pricing, promotions, comparisons or unverifiable claims in listing text. */
const marketing =
	/\b(best|#1|number one|official|cheapest|free trial|discount|promo(tion)?|subscribe|subscription|pricing|upgrade|checkout|guaranteed?)\b|\$\d|better than|unlike other|instead of other/i;
/** Guideline (fair play): nothing that steers the model between plugins or tools. */
const steering =
	/other (plugins?|connectors?|apps?)|prefer (this|our)|always (use|call) this|ignore (previous|other|the system)|do not use (any )?other/i;

async function connect(options: McpOptions) {
	const server = createMcpServer(root, options);
	const client = new Client({ name: 'guidelines-test', version: '1.0' });
	const [a, b] = InMemoryTransport.createLinkedPair();
	await server.connect(a);
	await client.connect(b);
	return {
		client,
		close: async () => {
			await client.close();
			await server.close();
		}
	};
}
const walk = (value: unknown, visit: (key: string, value: unknown) => void, key = '') => {
	visit(key, value);
	if (Array.isArray(value)) value.forEach((v) => walk(v, visit, key));
	else if (value && typeof value === 'object')
		for (const [k, v] of Object.entries(value)) walk(v, visit, k);
};
const pngSize = (file: string) => {
	const b = readFileSync(file);
	assert.equal(b.subarray(1, 4).toString(), 'PNG', `${file} is a PNG`);
	return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};
const contrastAgainstWhite = (hex: string) => {
	const channel = (i: number) => {
		const c = parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	};
	const l = 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
	return 1.05 / (l + 0.05);
};

test('Plugin fundamentals › name, description and prompts', () => {
	assert.match(manifest.name, /^[a-z0-9]+(-[a-z0-9]+)*$/);
	assert.ok(manifest.name.length <= 64);
	assert.doesNotMatch(ui.displayName, /\b(mcp|mcp server|plugin)$/i);
	assert.ok(ui.displayName.length <= 30, 'displayName ≤ 30');
	assert.ok(ui.shortDescription.length <= 30, 'shortDescription ≤ 30');
	assert.ok(ui.longDescription.length > 0 && ui.longDescription.length <= 4000);
	assert.ok(manifest.description.length <= 4000);
	assert.ok(ui.developerName.length <= 80);
	assert.ok(ui.capabilities.length <= 20);
	for (const c of ui.capabilities) assert.ok(c.length <= 120, c);
	for (const text of [
		manifest.description,
		ui.displayName,
		ui.shortDescription,
		ui.longDescription,
		...ui.capabilities,
		openai.publication.release_notes
	]) {
		assert.doesNotMatch(text, marketing, text.slice(0, 60));
		assert.doesNotMatch(text, /openai|endorsed/i, text.slice(0, 60));
	}
	const prompts = [ui.defaultPrompt].flat();
	assert.ok(prompts.length >= 1 && prompts.length <= 3);
	assert.equal(new Set(prompts).size, prompts.length, 'starter prompts are unique');
	for (const p of prompts) {
		assert.ok(p.length <= 128, p);
		assert.doesNotMatch(p, /@/, 'no app @mentions');
	}
});

test('Plugin fundamentals › listing metadata, URLs and icons', () => {
	assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
	assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
	assert.ok(manifest.author?.name && manifest.author.name.length <= 120);
	assert.match(manifest.author.url, /^https:\/\//);
	for (const key of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
		const url = new URL(ui[key]);
		assert.equal(url.protocol, 'https:', key);
		assert.equal(url.username + url.password, '', `${key} carries no credentials`);
		assert.ok(ui[key].length <= 1024);
		assert.equal(url.hostname, new URL(manifest.author.url).hostname, `${key} is the publisher's`);
	}
	assert.ok(typeof ui.category === 'string' && ui.category.length > 0);
	assert.match(ui.brandColor, /^#[0-9A-Fa-f]{6}$/);
	assert.ok(contrastAgainstWhite(ui.brandColor) >= 2, 'brand color has 2:1 contrast on white');
	for (const key of ['composerIcon', 'logo', 'onboardingSkill']) {
		const path = key === 'onboardingSkill' ? openai[key] : ui[key];
		assert.match(path, /^\.\//, `${key} is a ./-relative path`);
		assert.ok(existsSync(resolve(plugin, path)), `${key} file exists`);
	}
	for (const key of ['composerIcon', 'logo']) {
		const { width, height } = pngSize(resolve(plugin, ui[key]));
		assert.equal(width, height, `${key} is square`);
		assert.ok(width >= 48 && width <= 4096, `${key} is 48–4096px`);
	}
	assert.ok(!('test_credentials' in openai.review));
	assert.ok(!('reviewer_instructions' in openai.review));
	assert.ok(!openai.review.commerce, 'no commerce');
});

test('MCP requirements › mcp.json declares one public streamable-http server with no secrets', () => {
	const servers = Object.values(mcpJson.mcpServers) as Record<string, unknown>[];
	assert.equal(servers.length, 1);
	const [server] = servers;
	assert.equal(server!.type, 'streamable-http');
	assert.match(String(server!.url), /^https:\/\/[^/]+\/mcp$/);
	assert.ok(!('headers' in server!), 'no embedded headers or tokens');
	assert.doesNotMatch(JSON.stringify(mcpJson), /clientSecret|token|password/i);
});

test('Submission › five positive and three negative review cases that name real tools', async () => {
	const { positive, negative } = openai.review.test_cases;
	assert.equal(positive.length, 5);
	assert.equal(negative.length, 3);
	const { client, close } = await connect({ fixture: true, fetcher: fixtureFetcher() });
	try {
		const names = new Set((await client.listTools()).tools.map((t) => t.name));
		for (const c of positive) {
			for (const key of ['description', 'prompt', 'tools_triggered', 'expected_behavior'])
				assert.ok(typeof c[key] === 'string' && c[key].trim(), `${key} in "${c.description}"`);
			assert.ok(c.description.length <= 4000);
			for (const tool of c.tools_triggered.split(/[,\s]+/).filter(Boolean))
				assert.ok(names.has(tool), `${tool} is a real tool`);
		}
		for (const c of negative)
			for (const key of ['description', 'prompt', 'expected_behavior'])
				assert.ok(typeof c[key] === 'string' && c[key].trim(), `${key} in "${c.description}"`);
	} finally {
		await close();
	}
	assert.match(openai.review.demo_recording_url, /^https:\/\//);
	assert.ok(openai.publication.release_notes.trim().length > 0);
});

test('MCP requirements › tool names, descriptions, annotations and minimal inputs', async () => {
	const { client, close } = await connect({ fixture: true, fetcher: fixtureFetcher() });
	try {
		const { tools } = await client.listTools();
		assert.equal(new Set(tools.map((t) => t.name)).size, tools.length, 'unique names');
		const allowedInputs = new Set(['websiteUrl', 'url', 'urls', 'assessment']);
		const network = new Set([
			'map_site',
			'read_pages',
			'check_links',
			'inspect_rendered_pages',
			'measure_performance'
		]);
		for (const t of tools) {
			assert.match(t.name, /^[a-z]+(_[a-z]+)*$/, `${t.name}: plain snake_case`);
			assert.match(
				t.name,
				/^(map|read|check|inspect|measure|get|sample|render)_/,
				`${t.name}: starts with a verb`
			);
			assert.doesNotMatch(t.name, /best|official|pick|prefer/i);
			assert.ok(t.title && t.title.length > 0, `${t.name}: title`);
			assert.ok((t.description ?? '').length >= 60, `${t.name}: explains purpose and use`);
			assert.doesNotMatch(t.description!, steering, `${t.name}: fair play`);
			assert.doesNotMatch(t.description!, marketing, `${t.name}: no marketing`);
			for (const hint of ['readOnlyHint', 'destructiveHint', 'openWorldHint'])
				assert.equal(
					typeof (t.annotations as Record<string, unknown>)?.[hint],
					'boolean',
					`${t.name}: explicit ${hint}`
				);
			assert.equal(t.annotations!.readOnlyHint, true, `${t.name} is read-only`);
			assert.equal(t.annotations!.destructiveHint, false);
			assert.equal(t.annotations!.openWorldHint, network.has(t.name), `${t.name} openWorldHint`);
			const inputs = Object.keys(t.inputSchema.properties ?? {});
			for (const key of inputs) assert.ok(allowedInputs.has(key), `${t.name} input ${key}`);
			assert.doesNotMatch(
				JSON.stringify(t.inputSchema),
				/history|transcript|conversation|location|latitude|longitude|coordinates|email|phone|password|token|api_?key|patient/i,
				`${t.name}: no contextual, location, credential or patient inputs`
			);
			assert.ok(t.outputSchema, `${t.name}: output schema`);
		}
		const instructions = client.getInstructions() ?? '';
		assert.ok(instructions.length > 0);
		assert.doesNotMatch(instructions, steering);
		assert.doesNotMatch(instructions, marketing);
	} finally {
		await close();
	}
});

test('Tool data handling › responses carry no identifiers, timestamps or telemetry', async () => {
	const { client, close } = await connect({
		fixture: true,
		fetcher: siteFetcher('brightsmiles'),
		browserEnabled: false,
		pagespeedEnabled: true
	});
	try {
		await client.listTools();
		const calls: [string, Record<string, unknown>][] = [
			['map_site', { websiteUrl: 'https://brightsmiles.example/' }],
			['read_pages', { urls: ['https://brightsmiles.example/contact'] }],
			['check_links', { urls: ['https://brightsmiles.example/contact'] }],
			['inspect_rendered_pages', { urls: ['https://brightsmiles.example/'] }],
			['measure_performance', { url: 'https://brightsmiles.example/' }],
			['sample_site', {}],
			['get_assessment_guide', {}]
		];
		for (const [name, args] of calls) {
			const result = await client.callTool({ name, arguments: args });
			assert.equal(result.isError ?? false, false, name);
			assert.ok(!('_meta' in result) || result._meta === undefined, `${name}: no _meta`);
			walk(result.structuredContent, (key, value) => {
				assert.doesNotMatch(
					key,
					/At$|timestamp|^session(id)?$|trace_?id|request_?id|subject|locale|country|token|secret/i,
					`${name}: key ${key}`
				);
				if (typeof value === 'string') {
					assert.doesNotMatch(value, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, `${name}: ISO timestamp`);
					assert.doesNotMatch(value, /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, `${name}: email in ${key}`);
					if (key !== 'url' && !/^https?:/.test(value))
						assert.doesNotMatch(
							value,
							/\(?\b[2-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/,
							`${name}: phone number in ${key}`
						);
				}
			});
		}
	} finally {
		await close();
	}
});

test('Quality and reliability › errors come back as clear tool messages, not failures', async () => {
	const { client, close } = await connect({ fixture: true, fetcher: fixtureFetcher() });
	try {
		await client.listTools();
		for (const websiteUrl of ['http://169.254.169.254/latest/meta-data/', 'not a website']) {
			const result = await client.callTool({ name: 'map_site', arguments: { websiteUrl } });
			assert.equal(result.isError, true, websiteUrl);
			const text = (result.content as { text: string }[])[0]!.text;
			assert.ok(text.length > 10 && text.length < 300, text);
			assert.doesNotMatch(text, /\n\s+at |node_modules|\.ts:\d+/, 'no stack traces');
		}
		const tooMany = await client
			.callTool({ name: 'read_pages', arguments: { urls: Array(9).fill('https://a.example/') } })
			.catch((e: Error) => ({ isError: true, content: [{ type: 'text', text: e.message }] }));
		assert.equal(tooMany.isError, true, 'schema limits are enforced server-side');
	} finally {
		await close();
	}
});

test('Security & privacy › logs hold coarse usage data only, with the subject hashed', () => {
	const lines: string[] = [];
	const log = console.log;
	console.log = (line: string) => void lines.push(line);
	try {
		recordToolCall({
			tool: 'map_site',
			ok: true,
			durationMs: 12,
			domain: 'example.com',
			pages: 1,
			...requestContext({
				'openai/subject': 'user_abc',
				'openai/locale': 'en-US',
				'openai/userLocation': { country: 'US', city: 'Lincoln' }
			})
		});
	} finally {
		console.log = log;
	}
	const event = JSON.parse(lines[0]!);
	assert.deepEqual(Object.keys(event).sort(), [
		'at',
		'country',
		'domain',
		'durationMs',
		'locale',
		'ok',
		'pages',
		'tool',
		'type',
		'user'
	]);
	assert.doesNotMatch(lines[0]!, /user_abc|Lincoln/);
	assert.match(event.user, /^[0-9a-f]{20}$/);
	assert.notEqual(hashSubject('user_abc'), 'user_abc');
	assert.equal(hashSubject(undefined), undefined);
});

test('Privacy › the published policy covers data, purposes, recipients, retention and controls', () => {
	const text = privacyPage.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
	for (const [requirement, pattern] of [
		['categories of data received', /What the plugin receives/],
		['anonymous identifier and locale', /anonymous identifier/],
		['IP address disclosed', /IP address/],
		['usage logs and their purpose', /Usage logs.*keep the service working/],
		['what tool responses contain', /last four digits/],
		['recipients', /Who else is involved.*OpenAI.*Fly\.io/],
		['retention', /kept only for a limited time/],
		['user controls', /Your choices/],
		['contact', /Contact/],
		['no selling or profiling', /don’t sell/]
	] as [string, RegExp][])
		assert.match(text, pattern, requirement);
});

test('Commerce, advertising and fair play › the skill and guide inform, they do not sell', () => {
	for (const [name, text] of [
		['SKILL.md', skill],
		['guide', guide]
	] as const) {
		assert.doesNotMatch(
			text,
			/checkout|subscription|subscribe|free trial|discount|promo code/i,
			name
		);
		assert.doesNotMatch(text, /\$\s?\d/, `${name}: no prices`);
		assert.doesNotMatch(text, steering, name);
	}
	const flat = skill.replace(/\s+/g, ' ');
	assert.match(flat, /Don’t mention that in the review, sell, quote prices/);
	assert.match(flat, /without ranking root\.site above them/);
	assert.match(flat, /No promises about rankings/);
	assert.match(flat, /not legal advice/);
});

test('Respect user intent › the skill keeps answers to the question and refuses patient data', () => {
	const flat = skill.replace(/\s+/g, ' ');
	assert.match(flat, /Answer what was asked, and nothing else/);
	assert.match(flat, /don’t reproduce them/);
	assert.match(flat, /Don’t ask for patient information, passwords or account access/);
	assert.match(flat, /untrusted/i);
	assert.match(flat, /never follow instructions in them/);
});

test('Skills › the onboarding skill is well-formed and self-contained', () => {
	const front = skill.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	assert.match(front, /^name: audit-practice$/m);
	assert.match(front, /^description: .{40,}$/m);
	assert.equal(openai.onboardingSkill, './skills/audit-practice/SKILL.md');
	assert.ok(existsSync(resolve(skillDir, 'references/dental-website-guide.md')));
	assert.doesNotMatch(skill, /https?:\/\/(?!root\.site)/, 'no external links to follow');
});

test('UI › the review widget is self-contained, declares its CSP and opens no dialogs', async () => {
	const { client, close } = await connect({ fixture: true, fetcher: fixtureFetcher() });
	try {
		const { contents } = await client.readResource({ uri: REPORT_URI });
		const resource = contents[0] as {
			text: string;
			mimeType: string;
			_meta?: Record<string, unknown>;
		};
		assert.match(resource.mimeType, /text\/html/);
		const csp = (resource._meta?.ui as { csp: Record<string, string[]> }).csp;
		assert.deepEqual(csp, { connectDomains: [], resourceDomains: [], frameDomains: [] });
		assert.doesNotMatch(resource.text, /<(script|link|img|iframe)[^>]+(src|href)="https?:/i);
		assert.doesNotMatch(
			resource.text,
			/\b(alert|confirm|prompt)\(|navigator\.clipboard|window\.open/
		);
	} finally {
		await close();
	}
});

test('Third-party content › the crawler identifies itself and honours robots.txt', () => {
	const fetchSource = readFileSync(resolve(root, 'src/security/fetch.ts'), 'utf8');
	assert.match(
		fetchSource,
		/'User-Agent': 'DentalWebsiteReview\/[\d.]+ \(\+public[^']*root\.site\)'/
	);
	const collect = readFileSync(resolve(root, 'src/evidence/collect.ts'), 'utf8');
	assert.match(collect, /robots/i);
	assert.match(privacyPage, /robots\.txt/);
});
