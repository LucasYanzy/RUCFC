# RUCFC Website

The website for the **Rutgers Chinese Finance Club** — a bilingual (EN/中文) single-page
site with a dark/light theme and an email newsletter signup.

**Live:** https://rucfc.gotclass.xyz and https://lucasyanzy.github.io/RUCFC/ — the same
site, deployed twice. See [Deployment](#deployment).

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript |
| Styling | Hand-written CSS — `app/globals.css`, ~740 lines. 34 custom properties define both themes. No UI library. |
| Hosting | Static export, served from GitHub Pages and from a Caddy VPS |
| Newsletter API | Standalone Node HTTP server on the VPS, storing to Resend |

---

## Local development

```bash
npm install
npm run dev
```

Then open **http://localhost:3000/RUCFC** — note the path. The site sets a `basePath` so
it can be served from a GitHub Pages project URL, and that applies in dev too, so plain
`http://localhost:3000/` returns a 404.

To produce the static export that Pages deploys:

```bash
npm run build
```

Output lands in `out/`.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next dev server |
| `npm run build` | Static-exports to `out/` |
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
  lib/links.ts            JOIN_URL, DISCORD_INVITE, LINKEDIN_URL — the only copies
  components/
    ThemeProvider.tsx     Dark/light, persisted to localStorage
    LangProvider.tsx      EN/中文 dictionary and the `t()` helper — all UI copy lives here
    Navbar.tsx            Nav, theme toggle, language toggle
    Hero.tsx              Headline, the two CTAs, and the newsletter signup
    Programs.tsx          The three things the club runs
    Join.tsx              Membership form CTA plus Discord and LinkedIn cards
    Footer.tsx
    NewsletterForm.tsx    Posts to the newsletter API, or falls back to localStorage
    useScrollReveal.ts    IntersectionObserver reveal-on-scroll
server/
  newsletter-server.mjs   The newsletter API
public/
  logo.png  logo-white.png
```

The page is four sections: **Hero → Programs → Join → Footer**.

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

Caddy serves `/root/rucfc-site` and reverse-proxies `/api/newsletter` to the newsletter
server on `127.0.0.1:3003`, which runs under systemd as `rucfc-newsletter`.

### Caching

Next gives every JS and CSS asset a content hash in its filename, so those are safe to
cache forever. `index.html` is not hashed — it is the file that points at the new hashed
assets — so Caddy serves it with `Cache-Control: no-cache`. Without that, Cloudflare or a
browser can pin an old shell that requests assets a deploy has already replaced.

### If the repository is ever renamed

`basePath` in [`next.config.ts`](next.config.ts) **must** match the repository name, because
GitHub Pages serves the site at `https://<owner>.github.io/<repo>/`:

```ts
nextConfig.basePath = "/RUCFC";
```

If the two drift apart, every CSS and JS asset 404s and the site renders as unstyled HTML
— no styling, no interactivity, and no error message pointing at the cause. This has
happened once already, when the repo was renamed from `RUCF` to `RUCFC`.

Two things make this safer than it used to be:

- Reference assets in `public/` with **relative** paths (`logo.png`, not `/logo.png`), so
  they resolve against the base path.
- Use Next's file conventions for metadata assets. `metadata.icons` does **not** get a
  `basePath` prefix, which is why the favicon lives at `app/icon.png` instead.

### Railway (unused)

`railway.json` deploys **only** the newsletter API — it never builds the Next site.
`next.config.ts` detects Railway and disables static export there. Nothing is deployed
there now; the newsletter API runs on the VPS instead.

---

## Newsletter

The site is a static export and cannot accept form posts, so `NewsletterForm` submits to
[`server/newsletter-server.mjs`](server/newsletter-server.mjs) at
`https://rucfc.gotclass.xyz/api/newsletter`. Both deployments post to that one endpoint;
its CORS allowlist names both origins.

Addresses go to the **Resend** audience, and to a file on the server as a backup. Every
configured backend runs on each signup, so a signup is lost only if all of them fail.

The server **collects addresses only** — it has no send path. Sending would additionally
require a verified sending domain in Resend, which does not exist yet.

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
| The three program cards | `app/components/Programs.tsx` — the `programs` array, plus the matching `programs.*` keys |
| Membership form, Discord, or LinkedIn URL | `app/lib/links.ts` — every component reads from there |

---

## Known gaps

- The newsletter endpoint has no rate limiting, and its CORS origin check passes any
  request that sends no `Origin` header — so a browser on another site cannot post, but
  curl can.
- Deploying to the VPS is a manual `npx next build` + `rsync`; only GitHub Pages
  redeploys on push.
- `npm run lint` is declared but ESLint is not installed or configured.
- `public/2.png` is not referenced by any component.
