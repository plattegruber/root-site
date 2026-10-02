# Verification

## 2026-10-02 (this change)

Run on Node 24.21 / pnpm 12.8 in a sandboxed Linux container with Playwright Chromium
1194 from `/opt/pw-browsers`.

**Found and fixed before any new checks were added**

- The browser provider failed on every page under `pnpm dev` / `pnpm test:browser`
  with `ReferenceError: __name is not defined`: tsx/esbuild `keepNames` rewrites the
  functions passed to `page.evaluate` to call a Node-side helper that does not exist in
  the page. An init script now shims it. Browser errors now carry the error class and
  first line instead of a generic “provider failed”.
- The UI/HTTP integration test asserted a 403 for a spoofed `Host` header using
  `fetch()`, which silently drops that header; the test now uses `http.request`.

**Passing in this environment**

- `pnpm typecheck`, `pnpm build`, `pnpm test` (unit, MCP, security, providers, and the
  new `tests/dental.test.ts` which audits two multi-page fictional sites: a
  template-heavy practice that should trip the dental checks and a well-run practice
  that should not).
- `pnpm test:browser` with `CHROMIUM_EXECUTABLE_PATH` set: rendered mobile overflow,
  axe and keyboard checks on the fixture, the MCP Apps resource, the standalone UI on
  desktop and mobile, XSS-safe rendering, Host/Origin safeguards, HTTP MCP round trip.

**Not verifiable from this environment**

- Live audits of real practice websites: the container’s egress policy returns 403 for
  arbitrary public hosts (only package registries and a few Google APIs are allowed),
  so `pnpm audit https://…` cannot reach any dental website here. The unkeyed PageSpeed
  endpoint was reachable but quota-exhausted; Places needs a key. Run
  `pnpm audit <url>` from an unrestricted machine before trusting any live result, and
  expect to tune thresholds (cliché list, readability bands, PHI field words) against
  real sites.
- ChatGPT host rendering, plugin submission, publisher verification: unchanged, not
  attempted.

## 2026-10-01 (initial V0)

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
