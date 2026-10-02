import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createMcpServer, REPORT_URI } from '../src/mcp.js';
import { fixtureFetcher, fixturePlaces, root } from './helpers.js';
import type { Report } from '../src/model.js';

test('official MCP protocol exposes annotated tools and returns a typed, renderable report', async () => {
	const server = createMcpServer(root, {
		fixture: true,
		fetcher: fixtureFetcher(),
		places: fixturePlaces,
		browserEnabled: false,
		pagespeedEnabled: true
	});
	const client = new Client({ name: 'doctor-unit-test', version: '1.0' });
	const [a, b] = InMemoryTransport.createLinkedPair();
	await server.connect(a);
	await client.connect(b);
	try {
		const listed = await client.listTools();
		assert.equal(listed.tools.length, 3);
		const audit = listed.tools.find((t) => t.name === 'audit_dental_website')!;
		assert.deepEqual(audit.annotations, {
			readOnlyHint: true,
			destructiveHint: false,
			openWorldHint: true
		});
		const result = await client.callTool({
			name: 'audit_dental_website',
			arguments: { websiteUrl: 'https://maple-grove.example/' }
		});
		assert.equal(result.isError ?? false, false);
		const report = (result.structuredContent as { report: Report }).report;
		assert.equal(report.rewrites.length, 3);
		const render = await client.callTool({ name: 'render_dental_report', arguments: { report } });
		assert.equal((render.structuredContent as { report: Report }).report.fixture, true);
		const resource = await client.readResource({ uri: REPORT_URI });
		assert.equal(resource.contents[0]?.mimeType, 'text/html;profile=mcp-app');
		assert.ok(
			'text' in resource.contents[0]! && resource.contents[0].text.includes('Dental assessment')
		);
	} finally {
		await client.close();
		await server.close();
	}
});
