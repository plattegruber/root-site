# Official OpenAI verification and integration

Checked **2026-10-01** by fetching official pages, following redirects and reading
the documentation before implementing. Retrieval URLs/hashes are recorded in
`official-sources.json`. Recheck before submission: workflows and policies change.

## Architecture

[Plugins overview](https://developers.openai.com/plugins) describes reusable
skills and external-service connections shared by ChatGPT/Codex. The older
`/apps-sdk/` paths fetched for this review redirect to `/plugins`. This V0 uses
current plugin packaging, not historic `ai-plugin.json`/OpenAPI plugin assumptions.

[Build an MCP server](https://developers.openai.com/plugins/build/mcp-server)
supports official SDKs, typed tools, explicit safety annotations, structured
outputs and Streamable HTTP. V0 uses the TypeScript SDK, one stateless HTTP MCP
server and three focused tools.

[Add UI](https://developers.openai.com/plugins/build/chatgpt-ui) recommends **MCP
Apps** for new UI: `_meta.ui.resourceUri`, the JSON-RPC UI bridge and
`text/html;profile=mcp-app`. V0 uses `@modelcontextprotocol/ext-apps`, a bundled
resource, no network origins/third-party frames. Only the render tool has a UI
resource; data tools work without it. `window.openai` aliases are not required.

[Package plugins](https://developers.openai.com/plugins/build/plugins) defines
portable `plugin.json`, `mcp.json`, `skills/` and optional assets. Draft source
lives in `plugin/`, with planned HTTPS/public-policy URLs.

## Distribution and publisher

[Submit and publish](https://developers.openai.com/plugins/deploy/submission)
requires verified individual/business identity, ZIP upload, metadata/skill checks,
MCP connection/scanning and review. Only one MCP server connects per plugin.
Domain verification serves the portal’s exact plain-text challenge at
`/.well-known/openai-apps-challenge`. Once approved the publisher chooses when
to publish. Server scans and package metadata updates have separate workflows.
root.site’s verification and approval are **not established** by this code.

Current review requirements include **five positive cases, three negative cases
and a video walkthrough**; working reviewer credentials are required if sign-in
is used. `review-cases.md` is a draft inventory. This V0 has not been registered,
host-tested in ChatGPT, submitted or published.

## Commercial and health boundaries

The current [plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
say: “Currently, plugins may conduct commerce only for physical goods. Selling
digital products or services—including subscriptions, digital content, tokens,
or credits—is not allowed, whether offered directly or indirectly (for example,
through freemium upsells).” Plugins “must not exist primarily as an advertising
vehicle” and must deliver standalone utility. Existing paid-account access is
distinguished from initiating subscriptions or promoting upgrades.

These are verified point-in-time statements. Website management is a digital
service, so this assessment has no prices, plans, checkout, upgrades, promotional
CTAs or lead capture. root.site is identified as publisher; findings explain
expertise and effort without directing a sale.

Guidelines require a published privacy policy covering data, purposes, recipients,
retention and controls. V0 provides a draft; manifest policy/support/terms URLs
are not claimed live. [Security/privacy guidance](https://developers.openai.com/plugins/guides/security-privacy)
requires least privilege, validation, prompt-injection defenses and explicit
account/action authorization. This server accepts business URL references only,
treats fetched text as evidence, and offers no account/write tools.

[Usage Policies](https://openai.com/policies/usage-policies/) apply. This is
business/site assessment, not diagnosis/treatment. It requests no patient records,
adds no unverified clinical claims, and requires owner/clinical copy approval.
No accessibility certification, rankings or patient/clinical outcomes are promised.

## Remaining release setup (not authorized here)

1. Select an isolated staging host for Node/Chromium, egress, abuse limits, HTTPS
   and staging authentication. Do not change the production Worker.
2. Replace planned URLs with approved working publisher-controlled destinations;
   publish accurate support/privacy/terms only after hosting authorization.
3. Verify root.site’s publisher identity and endpoint domain in the OpenAI portal.
4. Register in developer mode, run desktop/mobile and all review cases in actual
   ChatGPT, and record a walkthrough.
5. Upload a corrected ZIP, resolve scans and submit only when separately
   authorized. Publishing requires separate authorization.

The user excludes public publishing/production changes. No deployment, DNS,
directory submission or public legal-page write is part of this change.
