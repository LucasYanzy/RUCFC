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
| Styling | Hand-written CSS — `app/globals.css`, ~1,100 lines. Custom properties define both themes. No UI library. |
| Motion | CSS animations and one SVG animation on the route map. No animation library. |
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
  page.tsx                Home page — the current version, wrapped in .site-v2
  classic/page.tsx        The previous home page, kept intact at /classic/
  globals.css             The entire design system — both themes, all animations
  icon.png                Favicon (Next file convention; picks up basePath automatically)
  lib/links.ts            JOIN_URL, DISCORD_INVITE, LINKEDIN_URL — the only copies
  lib/focus.ts            The four focus areas and their characters (金 智 交 链)
  lib/polarLand.ts        Generated land mask for the route map — do not edit
  components/
    ThemeProvider.tsx     Dark/light, persisted to localStorage
    LangProvider.tsx      EN/中文 dictionary and the `t()` helper — all UI copy lives here
    Navbar.tsx            Nav, theme toggle, language toggle
    HomeHero.tsx          Home hero: thesis, focus tags, CTAs, newsletter, route map
    RouteMap.tsx          Polar map with the New Brunswick–Shanghai route and live local times
    Seal.tsx              The red seal stamp (华人金融) after the headline
    Focus.tsx             The four focus areas, in scarlet-ruled columns
    Hero.tsx              The original hero, still used by /classic
    Programs.tsx          The original three program cards, still used by /classic
    Join.tsx              Membership form CTA plus Discord and LinkedIn cards
    Footer.tsx
    NewsletterForm.tsx    Posts to the newsletter API, or falls back to localStorage
    useScrollReveal.ts    IntersectionObserver reveal-on-scroll
scripts/
  generate-polar-land.mjs Rebuilds lib/polarLand.ts from Natural Earth data
server/
  newsletter-server.mjs   The newsletter API
public/
  logo.png  logo-white.png
```

The home page is **Hero → Focus → Join → Footer**.

### Two versions of the page

`/` is the current version, built around the club's focus on China: Chinese
finance, AI and innovation, exchange, and supply chains. `/classic/` is the page as
it was before, kept rather than deleted, with its original copy and design; each
footer links to the other. It is marked `noindex` so it does not compete with the
home page in search.

The two share `Navbar`, `Join` and `Footer`. `Navbar` and `Footer` take props for
the in-page links and the footer blurb, and `/classic/` uses the defaults. The home
page's palette and type live under `.site-v2` in `globals.css`, which only
`app/page.tsx` sets, so `/classic/` keeps the original design system. Home-page copy
uses its own `home.*`, `focus.*` and `route.*` keys, so editing it never changes
`/classic/`.

**Design.** Rutgers scarlet doubles as the vermilion of Chinese lacquer and seal
paste. It sits on lacquer black, or on xuan-paper white in the light theme, with
Song-style serif type for display (Source Serif 4 with Noto Serif SC). The Chinese
details are functional:
- the seal stamp reads 华人金融;
- each focus area is headed by one character: 金 finance, 智 intelligence,
  交 exchange, 链 chain;
- the focus columns are ruled in red like traditional Chinese letter paper.

**Route map.** It is a north-polar azimuthal equidistant projection, because the
shortest route from New Brunswick to Shanghai crosses the Arctic (11,872 km). Land
comes from a 112×112 mask generated from Natural Earth data. To regenerate it:

```bash
npm install --no-save world-atlas@2 topojson-client@3 d3-geo@3
node scripts/generate-polar-land.mjs
```

The map deliberately shows land only, with no country borders.

**Motion.** Nothing moves with the pointer or covers content:
- The hero fades in.
- The seal is stamped once.
- The route draws once, then a pulse travels it every 8 s.
- The focus characters sharpen in as they scroll into view.

`prefers-reduced-motion` shows everything at rest and hides the pulse.

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
The export also contains `classic/index.html`, so the no-cache rule has to cover it too.
A `*.html` matcher does; a rule that names only `/index.html` does not.

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
| The three program cards (`/classic/` only) | `app/components/Programs.tsx` — the `programs` array, plus the matching `programs.*` keys |
| The four focus areas | `focus.*` keys in `LangProvider.tsx`; the list and characters are in `app/lib/focus.ts` |
| Home hero copy | `home.*` keys in `LangProvider.tsx` |
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
