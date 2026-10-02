import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditWebsite, reportMarkdown } from '../src/audit/engine.js';
import { fixture, root, siteFetcher } from '../tests/helpers.js';
import type { Place } from '../src/providers/google.js';
// The sample is the fictional "Bright Smiles" template-heavy practice: it exercises most
// dental-specific checks, so a reviewer sees what the tool actually finds.
const browser = process.argv.includes('--browser');
const report = await auditWebsite(
	{ websiteUrl: 'https://brightsmiles.example/' },
	{
		fixture: true,
		fetcher: siteFetcher('brightsmiles'),
		places: {
			async search() {
				return [JSON.parse(fixture('google-brightsmiles.json')) as Place];
			}
		},
		pagespeedEnabled: true,
		browserEnabled: browser,
		onProgress: (stage) => console.log(stage)
	}
);
writeFileSync(resolve(root, 'samples/report.json'), JSON.stringify(report, null, 2) + '\n');
writeFileSync(resolve(root, 'samples/report.md'), reportMarkdown(report) + '\n');
console.log(
	`Fictional report generated: ${report.findings.length} checks; ${report.rewrites.length} drafts. ${browser ? 'Browser observations, if completed, measure the fixture.' : 'Browser checks not run.'}`
);
