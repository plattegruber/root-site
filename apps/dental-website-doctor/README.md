# Dental Website Doctor

A local end-to-end V0 under **root.site’s proposed plugin identity**. This code
does not submit or publish a plugin. Enter a public dental website and optionally
its Google Maps place link, then get patient journeys, public listing evidence,
technical observations and three content drafts. Findings include status, source
URL/time, patient impact, recommended fix and effort. There is no overall score,
lead form, sales flow, patient portal connection or clinical advice.

## Run

Prerequisites: Node **24** (`--test-isolation=none`), pnpm **11**, and a machine
capable of running Playwright Chromium. From the repository root:

```sh
pnpm install
pnpm doctor:build
pnpm doctor:sample
pnpm doctor:test
pnpm doctor:dev
```

Open `http://127.0.0.1:3000`. The fictional sample needs no network or account.
Its practice and Google/PageSpeed data are explicitly simulated. For actual
rendered checks:

```sh
cd apps/dental-website-doctor
pnpm exec playwright install chromium
# On Linux, install documented system libraries if necessary:
pnpm exec playwright install-deps chromium
pnpm test:browser
pnpm sample --browser
```

`CHROMIUM_EXECUTABLE_PATH=/path/to/chromium` selects an existing compatible
browser. Run in an isolated unprivileged container/VM with the browser’s required
process and local socket permissions. Missing/blocked Chromium yields
`not_tested`, preserving HTML checks. No Docker deployment is included.

Copy `.env.example` to `.env`, then start with
`node --env-file=.env --import tsx src/server.ts` or the built `dist/server.js`.
The dev script does not silently load `.env`. Defaults bind loopback; incoming
Host/Origin are checked. Non-loopback staging APIs require `AUDIT_API_TOKEN` or a
separately implemented authenticated gateway. The token is a staging safeguard,
**not** the OAuth layer needed for owner connections. The UI does not collect
tokens; use a local or authenticated reverse proxy for staging.

```sh
pnpm audit https://your-practice.example
pnpm audit https://your-practice.example 'https://www.google.com/maps/…'
# Output: gitignored artifacts/audit.{json,md}
```

## Scope

| Area               | Working V0 behavior                                                                                                                                                                                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Patient experience | First impression, dentist/credential wording, services, insurance/payment, first-visit guidance, urgent contact, phone/directions and booking destinations. Three page-specific journeys; conservative static signals and confirmation states.                                                     |
| Google             | Website name/address/phone/hours and directions readiness without account connection; bounded public Maps request; optional Places search and unique domain/street/locality/phone match. Ambiguity withholds listing facts. Owner-only categories/replies/actions/private metrics remain explicit. |
| Technical          | HTTP status, HTTPS/mixed references, headings/titles/descriptions/canonicals, robots/sitemap, bounded links, static alt/label checks, schema consistency, image/script/font signals. Guarded Chromium inspects mobile/desktop overflow, tap geometry, axe and a limited keyboard sample.           |
| Performance        | Optional PageSpeed mobile/desktop Lighthouse and separate URL/origin CrUX field data. Browser navigation timings are separately labeled, unthrottled and never called Lighthouse or real-user data.                                                                                                |
| Content            | Three prioritized conservative drafts using observed facts and source evidence. Owner/clinical review required. Missing facts become confirmation instructions, never invented services, insurance, credentials, reviews or clinical claims.                                                       |

Booking links are HTTP-tested and their context explained. Appointment submission,
conditional form behavior, slot selection and live calls are **not automated**;
the report includes the manual verification task. A positive static signal does
not prove an entire journey works. Crawl and anti-bot limits are reported;
unavailable Google fields are never called missing.

## Integration and remaining setup

Official docs were fetched on October 1, 2026. Older Apps SDK paths redirect to
current plugin docs. Read [architecture/policies/distribution](docs/openai-integration.md),
[providers/credentials/costs](docs/providers.md), [security](docs/security.md),
and [verification results](docs/verification.md).

The deterministic core uses no paid LLM API. ChatGPT can explain typed results;
the server does not ask another model to obey scraped instructions. Optional
PageSpeed/Places keys are listed in `.env.example`; **none were available**.
Owner-authorized Business Profile/OAuth is a documented extension path, not a
working account connector in V0.

Three MCP tools at `/mcp`: `audit_dental_website`, `sample_dental_report`, and
`render_dental_report`. The render tool supplies a self-contained MCP Apps
resource with expandable detail. All return structured results usable without
UI. MCP audits compute synchronously; local UI jobs use ephemeral process memory.

`pnpm package:plugin` creates a **DRAFT** ZIP. All manifest/MCP URLs are **planned**,
not live. Before submission: separately authorize hosting, configure HTTPS,
verify root.site’s publisher/domain, publish accurate support/privacy/terms,
supply cases/video and test in ChatGPT. Do not submit the draft unchanged. No
production route or Cloudflare configuration is changed by this service.

This is a strict-TypeScript pnpm workspace package, inheriting root-site’s
Prettier/ESLint conventions. Node/browser code stays outside the Worker’s `src/`.
Root commands are prefixed `doctor:`.

## Future redesign contract

`Report.generationBrief` is versioned JSON: observed facts with provenance,
proposed sections, recommended structure and confirmation items.
`publicationAllowed` is always false. A future root.site-subdomain generator
must obtain owner-verified facts and clinical/copy approval, and must not publish
scraped instructions or placeholders. Preview hosting is outside V0.
