#!/usr/bin/env node
/**
 * Renders the mockups on the free-resources page from the HTML cards in
 * scripts/resource-images/, into static/resources/<name>.webp.
 *
 * Same approach as generate-post-images.mjs (Chromium honours our
 * self-hosted fonts; librsvg doesn't), with two differences: cards render
 * at 2× so they stay crisp in a 600px-wide frame on a retina screen, and
 * the result goes through sharp to WebP, since a 2400×1600 PNG of a mockup
 * is several hundred KB and the WebP is a fraction of that.
 *
 * Each card is 1200×800 (set in _fonts.css). Add a card, run this, point the
 * resource's `image` at the output.
 *
 * Run: pnpm run gen:resource-images
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { readdirSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { chromium } from '../apps/dental-website-review/node_modules/playwright/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cards = path.join(__dirname, 'resource-images');
const out = path.resolve(__dirname, '../static/resources');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: 1200, height: 800 },
	deviceScaleFactor: 2
});

for (const file of readdirSync(cards).filter((f) => f.endsWith('.html'))) {
	await page.goto(pathToFileURL(path.join(cards, file)).href);
	await page.evaluate(() => document.fonts.ready);
	const png = await page.screenshot({ type: 'png' });
	const target = path.join(out, file.replace(/\.html$/, '.webp'));
	await sharp(png).webp({ quality: 88 }).toFile(target);
	console.log(`wrote ${target}`);
}

await browser.close();
