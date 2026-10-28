import { readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// Checks OpenAI's directory submission rules
// (https://developers.openai.com/plugins/deploy/submission), then zips plugin/.
const manifest = JSON.parse(readFileSync('plugin/plugin.json', 'utf8'));
const mcp = JSON.parse(readFileSync('plugin/mcp.json', 'utf8'));
const ui = manifest.extensions['com.openai'].interface;
const problems = [];

for (const p of [
	'plugin/skills/audit-practice/SKILL.md',
	'plugin/assets/icon.png',
	'plugin/assets/logo.png'
])
	if (!existsSync(p)) problems.push(`Missing package resource: ${p}`);
const servers = Object.values(mcp.mcpServers);
if (servers.length !== 1) problems.push('Directory submission supports one connected MCP server.');
for (const s of servers) {
	if (!String(s.url).startsWith('https://')) problems.push(`MCP URL must be HTTPS: ${s.url}`);
	if (s.headers && Object.keys(s.headers).length) problems.push('MCP headers must be empty.');
	if (s.clientSecret) problems.push('mcp.json must not contain a clientSecret.');
}
if (ui.displayName.length > 30) problems.push('displayName is over 30 characters.');
if (ui.shortDescription.length > 30) problems.push('shortDescription is over 30 characters.');
if (ui.longDescription.length > 4000) problems.push('longDescription is over 4000 characters.');
for (const key of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL'])
	if (!String(ui[key] ?? '').startsWith('https://')) problems.push(`${key} must be an HTTPS URL.`);
if (problems.length) {
	console.error(problems.map((p) => `- ${p}`).join('\n'));
	process.exit(1);
}

mkdirSync('artifacts', { recursive: true });
const output = `artifacts/${manifest.name}-${manifest.version}.zip`;
// zip appends to an existing archive, so start fresh.
rmSync(output, { force: true });
const result = spawnSync(
	'zip',
	['-qr', `../${output}`, 'plugin.json', 'mcp.json', 'skills', 'assets', '-x', '*.DS_Store'],
	{ cwd: 'plugin', stdio: 'inherit' }
);
if (result.status !== 0) throw new Error('ZIP creation failed (install the zip command).');
console.log(`Created ${output}. Upload it in the OpenAI Platform plugin dashboard.`);
