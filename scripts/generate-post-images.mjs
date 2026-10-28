#!/usr/bin/env node
/**
 * Renders the header images for posts that have one, from the HTML cards in
 * scripts/post-images/, into static/writing/<name>.png at 1200×630 (so the
 * same file serves as the post's og:image).
 *
 * Why HTML + Chromium rather than the SVG + sharp route generate-og.mjs
 * takes: librsvg can't load our self-hosted web fonts, so an SVG card falls
 * back to Georgia. Chromium honours the @font-face rules, so the cards use
 * Instrument Serif, Karla and Plex Mono exactly as the site does. Chromium
 * comes from the review service's Playwright install (pnpm install, then
 * `npx playwright install chromium` inside apps/dental-website-review).
 *
 * Run: pnpm run gen:post-images
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { readdirSync } from 'node:fs';
import { chromium } from '../apps/dental-website-review/node_modules/playwright/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cards = path.join(__dirname, 'post-images');
const out = path.resolve(__dirname, '../static/writing');

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: 1200, height: 630 },
	deviceScaleFactor: 1
});

for (const file of readdirSync(cards).filter((f) => f.endsWith('.html'))) {
	await page.goto(pathToFileURL(path.join(cards, file)).href);
	await page.evaluate(() => document.fonts.ready);
	const target = path.join(out, file.replace(/\.html$/, '.png'));
	await page.screenshot({ path: target, type: 'png' });
	console.log(`wrote ${target}`);
}

await browser.close();
