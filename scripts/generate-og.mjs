#!/usr/bin/env node
/**
 * Generates static/og.png — the 1200×630 social-card image used in
 * og:image and twitter:image meta tags.
 *
 * Why a script: Twitter/Slack/Facebook crawlers want PNG/JPG, not SVG.
 * We compose the card as SVG (so the design lives in the same vector
 * source as the rest of the design system) then rasterize via sharp.
 *
 * Run manually:   pnpm run gen:og
 * Re-run anytime: when the tagline, fonts, or brand colors change.
 */

import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(__dirname, '../static/og.png');

const WIDTH = 1200;
const HEIGHT = 630;

const CREAM = '#F7F4EF';
const INK = '#1A1715';
const CHARCOAL = '#2A2522';
const CLAY = '#6B6560';
const ROOT_LIGHT = '#A68B70';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
	<rect width="${WIDTH}" height="${HEIGHT}" fill="${CREAM}" />

	<!-- subtle warm accent line, mirrors the ink hero band -->
	<rect y="0" width="${WIDTH}" height="6" fill="${ROOT_LIGHT}" opacity="0.45" />

	<g transform="translate(96, 152)">
		<text
			font-family="Instrument Serif, Georgia, serif"
			font-size="92"
			fill="${INK}"
			letter-spacing="-2"
		>root.</text>

		<text
			y="180"
			font-family="Instrument Serif, Georgia, serif"
			font-size="64"
			fill="${CHARCOAL}"
			letter-spacing="-1"
		>Websites for dental practices.</text>

		<text
			y="280"
			font-family="-apple-system, system-ui, sans-serif"
			font-size="28"
			fill="${CLAY}"
		>$250 a month. Everything included.</text>
	</g>

	<text
		x="${WIDTH - 96}"
		y="${HEIGHT - 64}"
		text-anchor="end"
		font-family="IBM Plex Mono, monospace"
		font-size="22"
		fill="${CLAY}"
		letter-spacing="0.5"
	>root.site</text>
</svg>
`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);

console.log(`wrote ${out}`);
