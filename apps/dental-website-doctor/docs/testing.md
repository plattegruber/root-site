# Try the V0 locally

Use the `feat/dental-website-doctor-v0` branch in `plattegruber/root-site`.
Prerequisites are Node 24 and pnpm 11. These commands run development code only.

```sh
git fetch origin
git switch feat/dental-website-doctor-v0
pnpm install
pnpm doctor:build
pnpm doctor:sample
pnpm doctor:dev
```

Open **http://127.0.0.1:3000** and choose **Explore the fictional sample**. Check
the urgent broken booking, three patient journeys, Google availability table,
lab/field distinction, source evidence, three content drafts and downloadable
redesign brief. The sample’s practice and provider data are invented and labeled.

For a real site, enter its public URL, optionally a same-office Maps link, and
choose **Assess this practice**. Do not enter a patient portal or patient-specific
URL. No calls, forms or appointments are submitted. Some sites refuse automated
access; the report will preserve results and show unavailable checks.

To enable browser checks:

```sh
pnpm --dir apps/dental-website-doctor exec playwright install chromium
pnpm --dir apps/dental-website-doctor test:browser
```

On Linux install Playwright’s documented OS dependencies if needed. The hosted
implementation sandbox could not launch Chromium, so run this suite locally.

Core automated tests:

```sh
pnpm doctor:test
```

For real Lighthouse/CrUX, enable `PAGESPEED_ENABLED=true` and configure the
PageSpeed API; for richer public Maps data enable Places API (New)/billing and set
`GOOGLE_PLACES_API_KEY`. See `.env.example` and `providers.md`, including quotas,
costs, restrictions and explicitly unimplemented owner OAuth. Load `.env` with
`node --env-file=.env --import tsx src/server.ts` from the app directory.

The endpoint at `http://127.0.0.1:3000/mcp` works with local MCP clients. Actual
ChatGPT testing needs an approved HTTPS staging endpoint or supported secure MCP
tunnel; no ChatGPT installation/publication has been performed. The draft plugin
URLs are placeholders. Use `openai-integration.md` for that later setup.
