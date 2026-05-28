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
  hooks.server.ts        www → apex redirect at the Worker layer
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
    server/              Worker-only modules (contact backends)
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
