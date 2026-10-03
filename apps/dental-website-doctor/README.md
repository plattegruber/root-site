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

## What it checks

Every finding carries four labels so a reader knows how to weigh it:

- **basis** — `objective` (something measured or directly observed: a 404, a missing
  page, an ad pixel on a form page) or `subjective` (an editorial judgement with a
  `rationale` and a `confidence`; the owner can disagree).
- **scope** — `dental` (would not appear in a generic website audit) or `general`.
- **impact** is written for the practice owner; **fix** is written for the developer.
- `report.topFindings` lists the three to five things to talk about first.

| Area                          | What a patient needs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Patient experience (dental)   | Tap-to-call in the header; a working booking route and whether it is real-time scheduling or a request form (vendor detection); new-patient page with accepting-new-patients, forms, what to bring, visit length; insurance clarity (named plans, in-network wording vs “we accept all insurance”, financing, membership plan, uninsured path); emergency page with after-hours routing and triage; a named dentist with a real biography; per-service pages that lead to a next step; hours in the footer; address, map, parking; verifiable reviews; one phone number; call/book visible on a phone without scrolling (browser). |
| Compliance and trust (dental) | Health/insurance fields in forms next to advertising or analytics trackers (HHS tracking bulletin); mailto/GET/http form transport; privacy policy and HIPAA Notice of Privacy Practices; advertising claims boards police (“painless”, “guaranteed”, “best”, “#1”); “specialist” wording for non-recognised specialties; testimonials and before/after photos needing authorization and disclaimers; self-serving review schema; Dentist schema completeness and phone/hours agreement.                                                                                                                                           |
| Copy and photos (opinion)     | Reading grade, template-filler phrase density, clinical jargon with patient-friendly replacements, practice-vs-patient pronoun balance, headline specificity, call-to-action clarity, homepage length, stock-photo filenames, stale dated content. Each quotes what it saw and states its confidence.                                                                                                                                                                                                                                                                                                                              |
| Technical (general)           | Status codes, HTTPS/mixed content, titles/descriptions/headings/canonicals, indexability, robots/sitemap, broken links, alt text, form labels, viewport, lang, copyright year, city in the homepage title, third-party inventory, script counts; guarded Chromium checks for overflow, tap targets, axe, keyboard, oversized images.                                                                                                                                                                                                                                                                                               |
| Google                        | Website NAP/hours readiness; bounded public Maps request; optional Places search with strict domain/street/locality/phone matching. Ambiguity withholds listing facts; owner-only fields stay explicit.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Performance                   | Optional PageSpeed mobile/desktop Lighthouse plus separate CrUX field data; browser navigation timings labelled as such.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Content drafts                | Three conservative drafts using only observed facts; bracketed placeholders need owner confirmation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

The crawl fetches up to 12 pages, seeded from the sitemap in patient-priority order
(contact, new patients, emergency, insurance, team, services), then follows links. A
“not found” finding means not found in those pages; the evidence names any sitemap URL
that suggests the page exists elsewhere. Booking links are HTTP-tested; appointment
submission, conditional forms and live calls are **not** automated.

Compliance findings are patterns regulators and state dental boards have acted on; they
are not legal advice and rules vary by state.

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

Three MCP tools at `/mcp`: `audit_dental_website`, `sample_dental_report` (the fictional
Bright Smiles template-heavy practice), and `render_dental_report`. The render tool supplies a self-contained MCP Apps
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
