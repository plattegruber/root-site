import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { chromium } from 'playwright';
import { createApp } from '../src/server.js';
import { createMcpServer } from '../src/mcp.js';
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
test('inspect_rendered_pages over MCP measures phone views, rendered forms and requested hosts', async () => {
	const server = createMcpServer(root, {
		fixture: true,
		fetcher: fixtureFetcher(),
		browserEnabled: true
	});
	const client = new Client({ name: 'doctor-test', version: '1.0' });
	const [a, b] = InMemoryTransport.createLinkedPair();
	await server.connect(a);
	await client.connect(b);
	try {
		// Listing first makes the client validate results against the declared output schemas.
		await client.listTools();
		const result = await client.callTool({
			name: 'inspect_rendered_pages',
			arguments: { urls: ['https://maple-grove.example/', 'https://maple-grove.example/contact'] }
		});
		const { rendered } = result.structuredContent as { rendered: Report['browser'] };
		assert.equal(rendered.status, 'completed', JSON.stringify(rendered.errors));
		assert.deepEqual(
			rendered.views.map((v) => `${new URL(v.url).pathname}@${v.width}`),
			['/@360', '/@390', '/@1440', '/contact@390']
		);
		const contact = rendered.views.find((v) => v.url.endsWith('/contact'))!;
		assert.ok(contact.forms?.[0]?.fields.length, 'rendered form fields are captured');
		assert.ok(rendered.views.every((v) => Array.isArray(v.thirdPartyRequests)));
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
			.getByRole('heading', { name: 'Bright Smiles Family Dentistry', exact: true })
			.waitFor();
		await page.locator('#report').getByRole('heading', { name: 'Start here' }).waitFor();
		assert.ok(
			(await page.locator('#report .badge.subjective').count()) > 0,
			'opinion badges render'
		);
		assert.ok((await page.locator('#report .badge.dental').count()) > 0, 'dental badges render');
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
		// The ChatGPT assessment view: untrusted strings stay text, and dark theme is readable.
		await page.evaluate(async () => {
			document.querySelectorAll('link[rel="stylesheet"],style').forEach((n) => n.remove());
			const css = document.createElement('link');
			css.rel = 'stylesheet';
			css.href = '/widget.css';
			document.head.append(css);
			await new Promise((r) => css.addEventListener('load', r));
			document.documentElement.dataset.theme = 'dark';
			const { renderAssessment } = await import('/assessment.js');
			renderAssessment(
				{
					practiceName: '<img src=x onerror="window.owned=true">',
					websiteUrl: 'javascript:alert(1)',
					fixture: true,
					verdict: 'Verdict',
					doFirst: ['One'],
					journeys: [
						{
							name: '<script>window.owned=true</script>',
							verdict: 'friction',
							walkthrough: 'Walk',
							findings: [
								{
									title: 'Finding',
									priority: 'fix_first',
									basis: 'observed',
									observation: '<b>bold</b>',
									forPractice: 'p',
									forDeveloper: 'd',
									evidence: [{ url: 'https://example.com/', detail: 'quote' }]
								}
							]
						}
					],
					technical: [],
					googleProfile: {
						status: 'partial',
						summary: 'Summary',
						source: 'javascript:alert(2)',
						findings: []
					},
					strengths: ['Works'],
					notChecked: []
				},
				document.querySelector('#report')
			);
		});
		assert.equal(
			await page.evaluate(() => (window as unknown as { owned?: boolean }).owned),
			undefined
		);
		assert.equal(await page.locator('#report img, #report b, #report script').count(), 0);
		assert.equal(await page.locator('#report a[href^="javascript"]').count(), 0);
		const colors = await page.evaluate(() => {
			const card = getComputedStyle(document.querySelector('.finding')!);
			return { bg: card.backgroundColor, ink: card.color };
		});
		const luminance = (rgb: string) =>
			(rgb.match(/\d+/g) ?? []).slice(0, 3).reduce((n, v) => n + Number(v), 0) / 3;
		assert.ok(luminance(colors.bg) < 80, `dark card background, got ${colors.bg}`);
		assert.ok(luminance(colors.ink) > 180, `light text on dark, got ${colors.ink}`);
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
		// fetch() silently drops a forbidden Host header, so use http.request to send one.
		const hostStatus = await new Promise<number>((resolve, reject) =>
			http
				.get(origin + '/', { headers: { Host: 'evil.example' } }, (res) => {
					res.resume();
					resolve(res.statusCode ?? 0);
				})
				.on('error', reject)
		);
		assert.equal(hostStatus, 403);
		const client = new Client({ name: 'http-test', version: '1.0' });
		await client.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp')));
		const tools = await client.listTools();
		assert.equal(tools.tools.length, 7);
		await client.close();
	} finally {
		await browser.close();
		await new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())));
	}
});
