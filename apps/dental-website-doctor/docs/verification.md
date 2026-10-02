# Verification results

Verified in the managed workspace on **2026-10-01** with Node 24.19.0.
No public deployment, Google account connection or ChatGPT directory submission
was performed. The implementation is prepared as a draft PR for review.

## Passed

- Core end-to-end fictional audit: four areas, bounded crawl, evidence, urgent
  broken booking, proportional findings, three factual drafts, generation brief.
- SSRF tests: private/special IPs, numeric IPv4, IPv6/mapped forms, mixed DNS,
  DNS rebinding, private redirects, loops, credential boundaries and Maps domains.
- Partial failures/robots: completed pages retained; denied crawl avoids analysis;
  unknown Google fields remain unknown, missing browser/PSI stays not tested.
- Data integrity: hidden/schema-only claims excluded; negative service wording;
  no invented insurance, credentials, outcome or availability claims in drafts.
- Providers: unique office match/conflicting ID and ambiguity; public Places types
  versus owner GBP fields; lab/field and URL/origin scope; unavailable CrUX and CLS
  scaling; fixed credentialed Places endpoint/limited request fields.
- Official MCP SDK in-memory initialize/list/call/render/resource round trip.
- Strict service TypeScript build and self-contained MCP Apps UI bundling.
- Fictional report generation and draft plugin ZIP creation.

**19 core/MCP tests passed.** Repository ESLint and formatting of changed files
passed; service TypeScript/UI build passed. Svelte checking reported zero errors
and a warning about absent generated Worker types. Full root formatting also
flags one unchanged pre-existing Markdown file. Wrangler runtime type generation
and the full marketing build are not verified: the sandbox blocks its localhost
listener (`listen EPERM`). The checked-in report is fictional. Its PageSpeed/Google observations are
**SIMULATED**, not live measurements. Browser is explicitly not tested in that
sample unless regenerated with `--browser` in a supported environment.

## Environment-limited / still required

Chromium in this managed process sandbox fails before navigation with
`setsockopt: Operation not permitted`. The browser/localhost suite exists at
`tests/browser.integration.ts` but no browser or HTTP UI pass is claimed here.
The command for an unrestricted local dev machine is:

```sh
pnpm --dir apps/dental-website-doctor exec playwright install chromium
pnpm --dir apps/dental-website-doctor test:browser
```

If using a system browser, set `CHROMIUM_EXECUTABLE_PATH`. This suite verifies
mobile overflow/axe/keyboard measurements against fixtures, report UI on desktop
and mobile, script-looking report text, Host/Origin safeguards and HTTP MCP.
Do not mistake the test definitions for successful execution.

Live public native-fetch transport, real Lighthouse/CrUX/Places data, provider
quota/auth failures in Google, complete booking flows, manual accessibility and
actual ChatGPT host rendering need verification in the selected staging network.
No Google keys were supplied. The report honestly marks these optional checks
unavailable. Exact setup/costs are in `providers.md`.

Before release: install/build from the frozen lockfile on the target platform,
run the browser suite, test actual practice URLs/office matching and provider
configuration, complete review cases in ChatGPT and verify privacy/terms/support.
The root-site marketing build is separate from this Node service; no deployment
command is necessary to test the audit.
