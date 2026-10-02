import { writeFileSync } from 'node:fs';
import { auditWebsite, reportMarkdown } from '../src/audit/engine.js';
const url = process.argv[2];
if (!url) throw new Error('Usage: pnpm audit https://practice.example [Google Maps URL]');
const report = await auditWebsite(
	{ websiteUrl: url, ...(process.argv[3] ? { googleMapsUrl: process.argv[3] } : {}) },
	{ onProgress: (stage) => console.error(stage) }
);
const output = process.env.AUDIT_OUTPUT_PATH ?? 'artifacts/audit';
const { mkdirSync } = await import('node:fs');
const { dirname } = await import('node:path');
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output + '.json', JSON.stringify(report, null, 2) + '\n');
writeFileSync(output + '.md', reportMarkdown(report) + '\n');
console.log(report.summary);
console.log(`Reports written to ${output}.json and ${output}.md`);
