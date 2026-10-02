import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createApp } from '../src/server.js';
import { createMcpServer, REPORT_URI } from '../src/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { auditWebsite } from '../src/audit/engine.js';
import { fixtureFetcher, fixturePlaces, root } from './helpers.js';
import type { Report } from '../src/model.js';

test('actual Chromium fixture audit finds mobile overflow, contrast/label issues and keyboard observations', async () => {
	const report = await auditWebsite(
		{ websiteUrl: 'https://maple-grove.example/' },
		{
			fixture: true,
			fetcher: fixtureFetcher(),
			places: fixturePlaces,
			browserEnabled: true,
			pagespeedEnabled: true
		}
	);
	assert.equal(report.browser.status, 'completed', JSON.stringify(report.browser.errors));
	assert.ok(report.browser.views.some((v) => v.width === 360 && v.horizontalOverflow));
	assert.ok(
		report.browser.views.some(
			(v) =>
				v.width === 390 &&
				v.url.endsWith('/contact') &&
				v.axeViolations.some((x) => x.id === 'label')
		)
	);
	assert.ok(
		report.browser.views.some((v) => v.axeViolations.some((x) => x.id === 'color-contrast'))
	);
	assert.ok(report.browser.views.every((v) => v.keyboard.reached > 0));
	assert.ok(
		report.performance.some((m) => m.source === 'browser_navigation' && m.status === 'completed')
	);
});
test('MCP tools expose truthful annotations, typed report, and a self-contained MCP Apps resource', async () => {
	const server = createMcpServer(root, {
		fixture: true,
		fetcher: fixtureFetcher(),
		places: fixturePlaces,
		browserEnabled: false,
		pagespeedEnabled: true
	});
	const client = new Client({ name: 'doctor-test', version: '1.0' });
	const [a, b] = InMemoryTransport.createLinkedPair();
	await server.connect(a);
	await client.connect(b);
	try {
		const listed = await client.listTools();
		assert.equal(listed.tools.length, 3);
		const audit = listed.tools.find((t) => t.name === 'audit_dental_website')!;
		assert.equal(audit.annotations?.openWorldHint, true);
		assert.equal(audit.annotations?.readOnlyHint, true);
		const result = await client.callTool({
			name: 'audit_dental_website',
			arguments: { websiteUrl: 'https://maple-grove.example/' }
		});
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
test('standalone UI works on desktop/mobile, renders text safely, and the HTTP MCP round trip works', async () => {
	const origin = 'http://127.0.0.1:3198';
	const server = createApp({
		root,
		origin,
		auditOptions: {
			fixture: true,
			fetcher: fixtureFetcher(),
			places: fixturePlaces,
			browserEnabled: false,
			pagespeedEnabled: true
		}
	}).listen(3198, '127.0.0.1');
	await new Promise<void>((r) => server.once('listening', r));
	const browser = await chromium.launch({
		headless: true,
		executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined
	});
	try {
		const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
		await page.goto(origin);
		await page.getByRole('button', { name: 'Explore the fictional sample' }).click();
		await page
			.locator('#report')
			.getByRole('heading', { name: 'Maple Grove Dental', exact: true })
			.waitFor();
		assert.ok(
			await page
				.locator('#report')
				.textContent()
				.then((t) => t?.includes('SIMULATED') || t?.includes('simulated'))
		);
		await page.setViewportSize({ width: 390, height: 844 });
		assert.equal(
			await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2),
			false
		);
		await page.goto(origin);
		await page.getByLabel('Public website URL').fill('https://maple-grove.example/');
		await page.getByRole('button', { name: 'Assess this practice' }).click();
		await page
			.locator('#report')
			.getByRole('heading', { name: 'Maple Grove Dental', exact: true })
			.waitFor();
		// Exercise the actual DOM renderer against an injected HTML-looking practice name.
		await page.evaluate(async () => {
			const { renderReport } = await import('/report.js');
			const r = await fetch('/api/sample').then((x) => x.json());
			r.practice.name = '<img src=x onerror="window.owned=true">';
			renderReport(r, document.querySelector('#report'));
		});
		assert.equal(
			await page.evaluate(() => (window as unknown as { owned?: boolean }).owned),
			undefined
		);
		assert.equal(await page.locator('#report img').count(), 0);
		assert.equal(
			(
				await fetch(origin + '/api/audits', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
					body: '{}'
				})
			).status,
			403
		);
		assert.equal(
			(await fetch(origin + '/health', { headers: { Host: 'evil.example' } })).status,
			403
		);
		const client = new Client({ name: 'http-test', version: '1.0' });
		await client.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp')));
		const tools = await client.listTools();
		assert.equal(tools.tools.length, 3);
		await client.close();
	} finally {
		await browser.close();
		await new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())));
	}
});
