import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const manifest = JSON.parse(readFileSync('plugin/plugin.json', 'utf8'));
const mcp = JSON.parse(readFileSync('plugin/mcp.json', 'utf8'));
for (const p of [
	'plugin/skills/audit-practice/SKILL.md',
	'plugin/assets/icon.png',
	'plugin/assets/logo.png'
])
	if (!existsSync(p)) throw new Error(`Missing package resource: ${p}`);
if (Object.keys(mcp.mcpServers).length !== 1)
	throw new Error('Directory submission supports one connected MCP server.');
mkdirSync('artifacts', { recursive: true });
const output = `../artifacts/${manifest.name}-${manifest.version}-DRAFT.zip`;
const result = spawnSync('zip', ['-qr', output, 'plugin.json', 'mcp.json', 'skills', 'assets'], {
	cwd: 'plugin',
	stdio: 'inherit'
});
if (result.status !== 0) throw new Error('ZIP creation failed (install the zip command).');
console.log(
	`DRAFT package created. URLs in the manifest are planned destinations, not published endpoints. Before submission: deploy only with authorization, verify publisher/domain, publish real privacy/support/terms pages, supply review cases and video, test in ChatGPT. See docs/openai-integration.md.`
);
