# root.site

The marketing site for [root.](https://root.site) — websites for dental
practices.

## Stack

- **SvelteKit 2** (Svelte 5, runes mode) — every page route is statically prerendered
- **Tailwind v4** — CSS-first config, design tokens live in `src/app.css`
- **Self-hosted fonts** — Karla Variable, Instrument Serif, IBM Plex Mono
  via Fontsource (no Google Fonts CDN)
- **Cloudflare Workers** — single Worker with static assets binding;
  `/api/contact` runs as a Worker function, www → apex redirect via
  `hooks.server.ts` with `run_worker_first`
- **mdsvex** — blog posts authored as Markdown with YAML frontmatter
- **TypeScript everywhere** — `pnpm run check` is zero-error

## Develop

```sh
pnpm install
pnpm run dev          # vite dev server (no Worker, no asset binding)
pnpm run preview      # wrangler dev — Worker + static assets, like prod
pnpm run check        # type-check (wipes .svelte-kit/cloudflare first)
pnpm run lint         # prettier + eslint
pnpm run format       # rewrite with prettier
pnpm run gen:og       # regenerate static/og.png (run when copy/tagline changes)
```

## Deploy

```sh
pnpm run build
wrangler deploy
```

Custom domains (`root.site` apex + `www.root.site`) are declared in
`wrangler.jsonc`; Cloudflare provisions DNS + TLS automatically when
the zone lives on the same account. The Worker handles every request
(thanks to `assets.run_worker_first`), 301-redirects www → apex via
`src/hooks.server.ts`, and falls through to the static asset binding
for everything else.

## Dental Website Review (local V0)

The dental-specific ChatGPT plugin, audit API and report UI live in
[`apps/dental-website-review`](apps/dental-website-review/README.md). The audit
service runs in Node because Chromium and DNS-pinned outbound fetching require a
server runtime. It is separate from the existing Cloudflare marketing Worker.

```sh
pnpm install
pnpm review:build
pnpm review:sample     # explicitly fictional, simulated provider evidence
pnpm review:test
pnpm review:dev       # http://127.0.0.1:3000; MCP at /mcp
```

See the service README for Chromium setup, optional Google providers, costs,
limitations and the draft plugin submission package. No public endpoint, plugin
submission, DNS change or production deployment is part of this V0 change.

## Contact form

The form posts to `/api/contact`, which runs as a Worker function. The
default `deliver()` chains two backends:

1. **Resend** → email to the address in `CONTACT_TO` (primary; must succeed)
2. **Airtable** → row append to `AIRTABLE_TABLE_NAME` (best-effort; failures logged)

Each backend no-ops cleanly when its env vars are missing, so local
dev and pre-secret deploys stay quiet. Configure secrets:

- Local: copy `.dev.vars.example` → `.dev.vars` and fill in
- Prod: `wrangler secret put <NAME>` for each

See `src/lib/server/contact.ts` for the deliverers and the
`chainStrict` / `chainSoft` helpers for alternative policies.

## Analytics (PostHog)

PostHog captures pageviews (including client-side navigations),
autocaptured clicks, rage clicks, heatmaps, session replay and uncaught
errors, plus a few named events:

| Event                                                     | Where                         |
| --------------------------------------------------------- | ----------------------------- |
| `contact_form_started` / `_submitted` / `_failed`         | both contact forms (browser)  |
| `contact_submission_received` / `contact_delivery_failed` | `/api/contact` (Worker)       |
| `contact_form_bot_blocked`                                | `/api/contact`, honeypot hit  |
| `email_link_clicked`                                      | the mailto links by the forms |
| `demo_opened`                                             | links to `*.demo.root.site`   |
| `resource_opened`                                         | free-resources CTA buttons    |
| `server_error`                                            | SvelteKit `handleError`       |

A successful form submit also identifies the visitor by email, so the
person page in PostHog shows the enquiry fields and everything they did
before sending it.

Events travel through the same-origin `/ingest` path, which
`src/hooks.server.ts` forwards to PostHog, so content blockers don't eat
them. Session replay is switched on in the PostHog project settings, not
in code.

Configuration is one value, `PUBLIC_POSTHOG_KEY` (the public, write-only
project key), plus `PUBLIC_POSTHOG_HOST` if the project is not on US Cloud:

- Production: `vars` in `wrangler.jsonc`, or `wrangler secret put
PUBLIC_POSTHOG_KEY` (takes effect without a redeploy). SvelteKit serves
  `PUBLIC_*` vars to the prerendered pages at runtime through
  `/_app/env.js`, which this Worker answers, so nothing is baked in at
  build time.
- `pnpm run preview`: `.dev.vars` (see `.dev.vars.example`).
- `pnpm run dev`: `.env` (see `.env.example`).

Without the key everything is a no-op; `pnpm run dev` logs one console
error saying so. The browser-side helpers live in `src/lib/analytics.ts`,
the Worker-side one in `src/lib/server/posthog.ts`.

## Cloudflare Web Analytics

The beacon snippet is included only when `PUBLIC_CF_ANALYTICS_TOKEN`
is set in env at build time. Paste the token from
Cloudflare → Analytics → Web Analytics → Add a site, redeploy.

## Project layout

```
src/
  app.css                Tailwind import + @theme design tokens
  app.html               Document shell
  app.d.ts               SvelteKit / Cloudflare ambient types
  hooks.client.ts        PostHog init + client error capture
  hooks.server.ts        /ingest → PostHog reverse proxy, server error capture
  routes/
    +layout.svelte       Shared <head>, OG/Twitter, beacon, skip link
    +page.svelte         Homepage
    about/               About page
    writing/             Writing index
    writing/[slug]/      Post detail (prerendered per .md file)
    thanks/              No-JS contact confirmation
    api/contact/         Form endpoint (Worker function)
    sitemap.xml/         Prerendered sitemap
  lib/
    components/
      ui/                Button, Container, Divider, FormField
      layout/            Header, Footer, NavLink
      sections/          Page-specific composable sections
    config/              site.ts, blog.ts (Markdown glob)
    content/writing/     Post Markdown files
    server/              Worker-only modules (contact backends, PostHog capture)
    analytics.ts         Browser-side PostHog helpers (track, identify, use:trackClick)
    utils.ts             cn() = clsx + tailwind-merge
scripts/
  generate-og.mjs        SVG → PNG OG card builder
static/
  favicon.svg
  og.png                 1200x630 social card (regenerable)
  robots.txt
_headers                 Security headers + cache rules
wrangler.jsonc           Cloudflare Worker config (routes, assets, observability)
```
