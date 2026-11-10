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

## Response minimization

The first submission (0.3.0) was rejected on 2026-11-09: "A plugin call returns personal
identifiers that isn't required for the user's request." The review FAQ
(https://developers.openai.com/plugins/deploy/app-review) asks that tool responses carry
only what the request needs, naming personal identifiers and "telemetry/internal
identifiers (for example, session, trace, or request IDs; timestamps …)". Running the
test-case sites through the tools showed staff and office email addresses, every phone
number on the site, and `fetchedAt`/`collectedAt`/`measuredAt` on each page and view.

Since 0.3.1 every tool response passes through `redactIdentifiers` (collect.ts): phone
numbers keep their last four digits, email addresses their domain, and the timestamps are
gone from the output schemas. Redirect targets from `check_links` lose their tracking
parameters. The skill tells ChatGPT to answer narrow questions narrowly and not to
reproduce contact details. The privacy policy says what responses contain.

0.3.2 (2026-11-10) closed three gaps found by running the tools against the test-case
sites: phone numbers glued to the words around them in footers (`...dental.com402-483-1101Fax:`)
escaped the word-boundary regex; testimonial signatures ("Shirley P.") are now "[name]";
form actions lose their query strings, which carry vendor account and form identifiers.
Form fields never carried values. Tracker hosts are reported as hostnames only.

0.3.3 (2026-11-10) removes testimonials structurally rather than by recognising names: the
HTML extractor (pages.ts) replaces blockquotes, schema.org Review nodes, elements whose class
or id names testimonials or reviews, and dash-signed quotation paragraphs with
"[patient testimonial]" before any text is read. A patient signed with a full name no longer
reaches the response.

## Submission checklist

Rechecked against the submission page on 2026-10-27.

1. Verify the publisher identity (Ook Studio) in OpenAI Platform organization settings.
2. Publish the four listing pages on root.site (`/dental-website-review`, `/support`,
   `/privacy`, `/terms`); they must identify the same publisher.
3. `pnpm package:plugin`, then upload the ZIP and connect the MCP server; resolve scan
   findings.
4. Set the portal's domain challenge as the `OPENAI_APPS_CHALLENGE` Fly secret; it is
   served at `https://website-review.root.site/.well-known/openai-apps-challenge`.
5. Run the [review cases](review-cases.md) in ChatGPT, record the walkthrough video,
   add release notes, submit, then publish once approved.
