import { writeFileSync } from 'node:fs';
import { auditWebsite, reportMarkdown } from '../src/audit/engine.js';
import { fixtureFetcher, fixturePlaces, root } from '../tests/helpers.js';
import { resolve } from 'node:path';
const browser = process.argv.includes('--browser');
const report = await auditWebsite(
	{ websiteUrl: 'https://maple-grove.example/' },
	{
		fixture: true,
		fetcher: fixtureFetcher(),
		places: fixturePlaces,
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
