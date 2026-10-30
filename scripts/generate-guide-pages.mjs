#!/usr/bin/env node
/**
 * Renders pages of the dental website guide (the HTML source in
 * scripts/guide/) into static/guides/pages/<id>.webp, so the blog post,
 * the free-resources mockup and the homepage can show real spreads of
 * the thing people are asked for their email for.
 *
 * The guide HTML lays itself out as 21 US-Letter `.sheet` sections
 * (816×1056 CSS px) and scales them to fit the window on screen; we pin
 * the scale to 1, screenshot each sheet at 2×, and let sharp write a WebP
 * at the widths the site uses. Fonts are embedded in the HTML as data
 * URIs, so Chromium renders Instrument Serif, Karla and Plex Mono exactly
 * as the PDF does.
 *
 * Run: pnpm run gen:guide-pages
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { chromium } from '../apps/dental-website-review/node_modules/playwright/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(__dirname, 'guide', 'root-dental-website-guide.html');
const out = path.resolve(__dirname, '../static/guides/pages');
mkdirSync(out, { recursive: true });

/** Sheet ids to render, and the output widths (px) each should be written at. */
const PAGES = {
	cover: [1224, 560],
	'quick-check': [1224],
	contents: [1224],
	'night-story': [1224],
	'stillwater-start': [1224],
	'stillwater-finish': [1224],
	'stillwater-recheck': [1224],
	'useful-answers': [1224],
	'clear-words': [1224],
	mobile: [1224],
	money: [1224],
	'provider-evidence': [1224],
	priorities: [1224],
	worksheet: [1224],
	handoff: [1224],
	'next-step': [1224]
};

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: 900, height: 1200 },
	deviceScaleFactor: 2
});

await page.goto(pathToFileURL(source).href);
await page.addStyleTag({
	content: `
		.sheet { transform: none !important; box-shadow: none !important; }
		.page-wrap { margin: 0 auto 36px !important; }
	`
});
await page.evaluate(() => document.fonts.ready);

for (const [id, widths] of Object.entries(PAGES)) {
	const sheet = page.locator(`#${id}`);
	await sheet.scrollIntoViewIfNeeded();
	const png = await sheet.screenshot({ type: 'png' });
	for (const width of widths) {
		const suffix = width === widths[0] ? '' : `-${width}`;
		const target = path.join(out, `${id}${suffix}.webp`);
		await sharp(png).resize({ width }).webp({ quality: 84 }).toFile(target);
		console.log(`wrote ${target}`);
	}
}

await browser.close();
