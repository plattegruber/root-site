import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createMcpServer, REPORT_URI, type McpOptions } from '../src/mcp.js';
import { fixtureFetcher, root, siteFetcher } from './helpers.js';
import type { Assessment, PageEvidence, SiteMap } from '../src/evidence/model.js';
import type { Report } from '../src/model.js';

async function connect(options: McpOptions) {
	const server = createMcpServer(root, options);
	const client = new Client({ name: 'review-unit-test', version: '1.0' });
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

test('MCP exposes evidence tools with truthful annotations and no verdict tools', async () => {
	const { client, close } = await connect({ fixture: true, fetcher: siteFetcher('brightsmiles') });
	try {
		const { tools } = await client.listTools();
		assert.deepEqual(tools.map((t) => t.name).sort(), [
			'check_links',
			'get_assessment_guide',
			'inspect_rendered_pages',
			'map_site',
			'measure_performance',
			'read_pages',
			'render_assessment',
			'sample_site'
		]);
		for (const t of tools) {
			assert.equal(t.annotations?.readOnlyHint, true, t.name);
			assert.equal(t.annotations?.destructiveHint, false, t.name);
			assert.ok(t.outputSchema, t.name);
		}
		const network = [
			'map_site',
			'read_pages',
			'check_links',
			'inspect_rendered_pages',
			'measure_performance'
		];
		for (const t of tools)
			assert.equal(t.annotations?.openWorldHint, network.includes(t.name), t.name);
	} finally {
		await close();
	}
});

test('map_site and read_pages return observations a model can judge, not findings', async () => {
	const { client, close } = await connect({ fixture: true, fetcher: siteFetcher('brightsmiles') });
	try {
		await client.listTools();
		const mapped = await client.callTool({
			name: 'map_site',
			arguments: { websiteUrl: 'https://brightsmiles.example/' }
		});
		assert.equal(mapped.isError ?? false, false);
		const { site } = mapped.structuredContent as { site: SiteMap };
		assert.ok(!('findings' in site));
		assert.deepEqual(
			site.menu.map((l) => l.label),
			['Home', 'About Us', 'Services', 'Blog', 'Contact Us']
		);
		const home = site.homepage!;
		assert.equal(home.contact.phoneLinks.length, 0);
		assert.ok(home.contact.phoneNumbersInText.length > 0);
		assert.ok(home.thirdParty.inlineTags.includes('Meta Pixel'));

		const read = await client.callTool({
			name: 'read_pages',
			arguments: {
				urls: ['https://brightsmiles.example/contact', 'https://brightsmiles.example/about']
			}
		});
		const { pages } = read.structuredContent as { pages: PageEvidence[] };
		assert.deepEqual(
			pages.map((p) => p.url),
			['https://brightsmiles.example/contact', 'https://brightsmiles.example/about']
		);
		const form = pages[0]!.forms[0]!;
		assert.equal(form.submitsTo, 'mailto');
		assert.ok(form.fields.some((f) => /date of birth/i.test(f.label)));
		assert.ok(pages[0]!.thirdParty.advertising.includes('connect.facebook.net'));
		assert.ok(pages[0]!.thirdParty.sessionReplay.some((h) => h.includes('hotjar')));
	} finally {
		await close();
	}
});

test('sample, guide, rendered fallback, performance and render tools round-trip', async () => {
	const { client, close } = await connect({
		fixture: true,
		fetcher: fixtureFetcher(),
		browserEnabled: false,
		pagespeedEnabled: true
	});
	try {
		await client.listTools();
		const sample = await client.callTool({ name: 'sample_site', arguments: {} });
		const data = sample.structuredContent as { sample: { site: SiteMap; pages: PageEvidence[] } };
		assert.equal(data.sample.site.fixture, true);
		assert.match(data.sample.site.notes[0]!, /FICTIONAL/);
		assert.ok(data.sample.pages.length > 0);

		const guide = await client.callTool({ name: 'get_assessment_guide', arguments: {} });
		const text = (guide.structuredContent as { guide: string }).guide;
		assert.match(text, /## Your role/);
		assert.match(text, /## Patient Personas & Use-Cases/);
		assert.match(text, /Core Web Vitals/);
		assert.doesNotMatch(text, /^---/);

		const rendered = await client.callTool({
			name: 'inspect_rendered_pages',
			arguments: { urls: ['https://maple-grove.example/'] }
		});
		const { rendered: browser } = rendered.structuredContent as { rendered: Report['browser'] };
		assert.equal(browser.status, 'not_tested');

		const perf = await client.callTool({
			name: 'measure_performance',
			arguments: { url: 'https://maple-grove.example/' }
		});
		const { performance } = perf.structuredContent as { performance: Report['performance'] };
		assert.ok(performance.some((m) => m.status === 'completed'));

		const assessment: Assessment = {
			practiceName: 'Bright Smiles Family Dentistry',
			websiteUrl: 'https://brightsmiles.example/',
			fixture: true,
			verdict: 'Patients cannot tap to call.',
			doFirst: ['Make the header phone number a tel: link.'],
			journeys: [
				{
					name: 'I’m in pain and need help now',
					verdict: 'blocked',
					walkthrough: 'On a phone the number cannot be tapped.',
					findings: [
						{
							title: 'No tap-to-call link',
							priority: 'fix_first',
							basis: 'observed',
							observation: 'The phone number is plain text.',
							forPractice: 'Phone visitors cannot call with one tap.',
							forDeveloper: 'Wrap the header number in a tel: link.',
							evidence: [{ url: 'https://brightsmiles.example/', detail: '(555) 020-0456' }]
						}
					]
				}
			],
			technical: [],
			googleProfile: {
				status: 'not_checked',
				summary: 'Fictional practice; no listing.',
				findings: []
			},
			strengths: [],
			notChecked: ['Page speed']
		};
		const render = await client.callTool({ name: 'render_assessment', arguments: { assessment } });
		assert.deepEqual(
			(render.structuredContent as { assessment: Assessment }).assessment,
			assessment
		);
		const bad = await client.callTool({
			name: 'render_assessment',
			arguments: {
				assessment: { ...assessment, journeys: [{ name: 'x', verdict: 'great', findings: [] }] }
			}
		});
		assert.equal(bad.isError, true);

		const resource = await client.readResource({ uri: REPORT_URI });
		assert.equal(resource.contents[0]?.mimeType, 'text/html;profile=mcp-app');
		assert.ok(
			'text' in resource.contents[0]! &&
				resource.contents[0].text.includes('Dental website assessment')
		);
	} finally {
		await close();
	}
});
