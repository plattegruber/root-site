# Add Dental Website Doctor V0 audit service and ChatGPT plugin

Dental owners need a substantial, evidence-grounded assessment without sharing
patient data or connecting Google accounts. This change adds a separate Node
workspace package alongside the Cloudflare marketing site, with bounded public
crawling, three patient journeys, public Google identity checks and optional
Places/PageSpeed integrations, technical checks, prioritized fixes and three
factual content drafts.

The local report UI expands sources/technical detail, explicitly distinguishes
lab/field data and unavailable owner-only fields, and exports a future redesign
brief with publication disabled. The official MCP SDK exposes independently
usable typed audit/sample/render tools and an MCP Apps UI resource. The portable
plugin package is a draft with planned URLs, not a submission or deployed app.

Official OpenAI guidance was fetched and reviewed on October 1, 2026. Current
docs redirect older Apps SDK paths to plugins; verified commercial restrictions
informed a standalone assessment with no sales flow or lead form. Credentials,
costs, owner-access extension path, privacy draft and review cases are documented.

Validation: 19 core/MCP tests pass; strict service TypeScript/UI build, ESLint,
changed-file Prettier, sample generation and draft ZIP creation pass. Svelte check
has zero errors and one missing-generated-types warning. The sandbox prevents
Chromium/localhost and Wrangler runtime type verification; the browser/HTTP suite
is supplied for a supported local machine. Live Google calls and actual ChatGPT
host rendering remain unverified because credentials/hosting were unavailable.

No deployment, production route/configuration change, DNS modification or plugin
submission/publication was performed.
