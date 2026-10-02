import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const bundle = await build({
	entryPoints: ['web/widget.js'],
	bundle: true,
	write: false,
	format: 'iife',
	platform: 'browser',
	minify: true
});
const css = await readFile('web/styles.css', 'utf8');
const js = bundle.outputFiles[0].text.replaceAll('</script', '<\\/script');
await mkdir('dist', { recursive: true });
await writeFile(
	'dist/widget.html',
	`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dental assessment</title><style>${css}</style></head><body><main class="widget"><div id="report" role="region" aria-label="Dental website assessment"><p>Loading the assessment…</p></div></main><script>${js}</script></body></html>`
);
