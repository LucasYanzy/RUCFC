# RUCFC Website

The website for the **Rutgers Chinese Finance Club** — a bilingual (EN/中文) single-page site with a dark/light theme, build-time market news, and an email newsletter signup.

**Live:** https://rucfc.gotclass.xyz and https://lucasyanzy.github.io/RUCFC/ — the same
site, deployed twice. See [Deployment](#deployment).

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript |
| Styling | Hand-written CSS — `app/globals.css`, ~2,000 lines. 36 custom properties define both themes. No UI library. |
| Hosting | Static export, served from GitHub Pages and from a Caddy VPS |
| Newsletter API | Standalone Node HTTP server on the VPS, storing to Resend |
| News data | Finnhub, fetched at build time |

---

## Local development

```bash
npm install
npm run dev
```

Then open **http://localhost:3000/RUCFC** — note the path. The site sets a `basePath` so it can be served from a GitHub Pages project URL, and that applies in dev too, so plain `http://localhost:3000/` returns a 404.

To produce the static export that Pages deploys:

```bash
npm run build
```

Output lands in `out/`. `npm run build` runs the `prebuild` hook first, which refreshes `public/data/market-news.json` — see [Market news](#market-news). To build without touching that file, run `npx next build` directly.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next dev server |
| `npm run build` | Fetches news, then static-exports to `out/` |
| `npm run newsletter:server` | Runs the newsletter API locally |
| `npm run lint` | Declared, but ESLint is not installed or configured yet |

---

## Project structure

```
app/
  layout.tsx              Root layout; inline script applies the saved theme before paint
  page.tsx                Composes every section in order
  globals.css             The entire design system — both themes, all animations
  icon.png                Favicon (Next file convention; picks up basePath automatically)
  components/
    ThemeProvider.tsx     Dark/light, persisted to localStorage
    LangProvider.tsx      EN/中文 dictionary and the `t()` helper — all UI copy lives here
    Navbar.tsx  Hero.tsx  StatsBar.tsx  Programs.tsx
    Discord.tsx           Copy + a mocked-up Discord client
    LinkedIn.tsx          Copy + a mocked-up LinkedIn page
    Insights.tsx          Market news feed with region filter
    CTA.tsx  Board.tsx  Footer.tsx
    NewsletterForm.tsx    Posts to the newsletter API, or falls back to localStorage
    useScrollReveal.ts    IntersectionObserver reveal-on-scroll
    useInteractiveTilt.ts Pointer + gyroscope tilt for the mockups
scripts/
  fetch-finnhub-news.mjs  Build-time news fetch, ranking, and region classification
server/
  newsletter-server.mjs   The Railway newsletter API
public/
  logo.png  logo-white.png
  data/market-news.json   Generated — do not edit by hand
```

---

## Deployment

The site is deployed twice from one codebase. `basePath` is what differs, so it is
read from `SITE_BASE_PATH` — see [`next.config.ts`](next.config.ts).

**GitHub Pages** — automatic. Every push to `main` triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds on Node 20
and publishes `out/` to Pages. A deploy takes about a minute. The workflow leaves
`SITE_BASE_PATH` unset, so the build picks up the default `/RUCFC`.

**VPS** (`rucfc.gotclass.xyz`) — manual, and served at a domain root, so it needs an
empty base path:

```bash
SITE_BASE_PATH="" NEXT_PUBLIC_NEWSLETTER_ENDPOINT="https://rucfc.gotclass.xyz/api/newsletter" npx next build
rsync -az --delete out/ vps:/root/rucfc-site/
```

Use `npx next build` rather than `npm run build` unless `FINNHUB_API_KEY` is set
locally — the `prebuild` hook would otherwise overwrite `public/data/market-news.json`
with placeholders. Caddy serves `/root/rucfc-site` and reverse-proxies
`/api/newsletter` to the newsletter server on `127.0.0.1:3003`, which runs under
systemd as `rucfc-newsletter`.

### ⚠️ If the repository is ever renamed

`basePath` in [`next.config.ts`](next.config.ts) **must** match the repository name, because GitHub Pages serves the site at `https://<owner>.github.io/<repo>/`:

```ts
nextConfig.basePath = "/RUCFC";
```

If the two drift apart, every CSS and JS asset 404s and the site renders as unstyled HTML — no styling, no interactivity, and no error message pointing at the cause. This has happened once already, when the repo was renamed from `RUCF` to `RUCFC`.

Two things make this safer than it used to be:

- Reference assets in `public/` with **relative** paths (`data/market-news.json`, not `/data/market-news.json`), so they resolve against the base path.
- Use Next's file conventions for metadata assets. `metadata.icons` does **not** get a `basePath` prefix, which is why the favicon lives at `app/icon.png` instead.

### Railway (unused)

`railway.json` deploys **only** the newsletter API — it never builds the Next site.
`next.config.ts` detects Railway and disables static export there. Nothing is deployed
there now; the newsletter API runs on the VPS instead.

---

## Market news

`scripts/fetch-finnhub-news.mjs` runs during `prebuild`. It pulls Finnhub's general market feed plus company news for a set of China- and US-listed tickers, scores each article against finance/China/US keyword lists, classifies it by region, and writes the top three per region to `public/data/market-news.json`.

`Insights.tsx` reads that static file at runtime, so **news only updates when the site is redeployed** — it is not a live feed. Without `FINNHUB_API_KEY`, the script logs a warning and writes three hand-written placeholder items instead.

---

## Newsletter

The site is a static export and cannot accept form posts, so `NewsletterForm` submits to
[`server/newsletter-server.mjs`](server/newsletter-server.mjs) at
`https://rucfc.gotclass.xyz/api/newsletter`. Both deployments post to that one endpoint;
its CORS allowlist names both origins.

Addresses go to the **Resend** audience, and to a file on the server as a backup. Every
configured backend runs on each signup, so a signup is lost only if all of them fail.

> `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` is baked in **at build time**. With it unset, the form
> silently falls back to the visitor's own `localStorage` and no signup ever reaches a
> server — which is what both deployments did until it was set. If signups stop arriving,
> check that variable first.

Storage backends, CORS, and setup are documented in
[NEWSLETTER_BACKEND.md](NEWSLETTER_BACKEND.md).

---

## Environment variables

Copy `.env.example` to `.env.local` for local work.

**Build (set as GitHub Actions secrets/variables):**

| Name | Where | Purpose |
|---|---|---|
| `FINNHUB_API_KEY` | Actions *secret* | Market news fetch. Without it, placeholders are used. |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | Actions *variable* | Newsletter API URL. Without it, signups go to localStorage. |
| `SITE_BASE_PATH` | build env | Base path. Unset means `/RUCFC`; set it to `""` to serve from a domain root. |

**Newsletter server** (in `/root/rucfc-newsletter/.env` on the VPS, mode 600):
`NEWSLETTER_ALLOWED_ORIGINS`, `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, and
`NEWSLETTER_LOCAL_FILE`. See [NEWSLETTER_BACKEND.md](NEWSLETTER_BACKEND.md).

> Subscriber emails and the Resend key live on the server only. Never commit either, and
> never store subscriber emails in this public repository.

---

## Editing content

Most updates do not require touching layout or CSS.

| To change | Edit |
|---|---|
| Any UI text, in either language | `app/components/LangProvider.tsx` — one `translations` object keyed by string id |
| Executive board and co-founders | `app/components/Board.tsx` — the `executives` and `cofounders` arrays |
| Stat counters (members, workshops, …) | `app/components/StatsBar.tsx` — the `end` props |
| Membership form link | `JOIN_URL`, duplicated in `Navbar.tsx`, `Hero.tsx`, and `CTA.tsx` — update all three |
| Discord invite | `DISCORD_INVITE` in `Discord.tsx` |
| LinkedIn URL | `LINKEDIN_URL` in `LinkedIn.tsx` |

Some copy in `Discord.tsx` and `LinkedIn.tsx` is inlined as `lang === "en" ? ... : ...` rather than going through `LangProvider`. Both spellings work; the inline form just keeps long mockup strings next to the markup they belong to.

---

## Known gaps

- The follower counts, likes, and Connect buttons in the Discord and LinkedIn sections are **mockups** — local React state, not live data.
- `Insights.tsx` builds its fallback payload with `new Date()` at module scope and formats dates with `Intl`, so the prerendered HTML and the client's first render can disagree. This shows up as React hydration warning #418 in the console.
- The newsletter endpoint has no rate limiting, and its CORS origin check passes any request that sends no `Origin` header — so a browser on another site cannot post, but curl can.
- Deploying to the VPS is a manual `npx next build` + `rsync`; only GitHub Pages redeploys on push.
- `npm run lint` is declared but ESLint is not installed or configured.
