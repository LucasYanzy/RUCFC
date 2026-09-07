---
version: 1
name: RUCFC-design-system
description: "A near-black institutional canvas (#060608) carrying Rutgers scarlet as its single brand colour, with one luminous exception: a slow aurora field behind the hero and the closing CTA. Structure, surfaces and typography follow the quiet-luxury dark pattern -- a four-step surface ladder, 1px hairline borders instead of shadows, display type at weight 600 with hard negative tracking. Motion is the other half of the system: Lenis inertial scrolling on a shared GSAP ticker, masked line reveals, scrubbed parallax, and a pointer spotlight on every card. Scarlet appears on the brand mark, the single primary CTA per screen, and focus rings -- never as a section fill."

colors:
  brand: "#cc0033"
  brand-hover: "#e30a3d"
  brand-ink: "#ff3d63"
  on-brand: "#ffffff"
  gold: "#e2b45c"
  canvas: "#060608"
  surface-1: "#0e0e12"
  surface-2: "#141419"
  surface-3: "#1b1b21"
  surface-inset: "#08080a"
  ink: "#f4f4f6"
  ink-muted: "#c3c3cd"
  ink-subtle: "#8a8a97"
  ink-tertiary: "#7a7a86"
  hairline: "rgba(255,255,255,0.07)"
  hairline-strong: "rgba(255,255,255,0.13)"
  hairline-bright: "rgba(255,255,255,0.24)"

typography:
  display:
    fontFamily: Inter
    fontSize: clamp(44px, 7.2vw, 84px)
    fontWeight: 600
    lineHeight: 1.03
    letterSpacing: -0.038em
  section-title:
    fontFamily: Inter
    fontSize: clamp(32px, 4.4vw, 52px)
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.03em
  card-title:
    fontFamily: Inter
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.02em
  lead:
    fontFamily: Inter
    fontSize: clamp(17px, 1.6vw, 20px)
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.011em
  body-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  eyebrow:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 500
    letterSpacing: 0.16em
    textTransform: uppercase
  button:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 500
    letterSpacing: -0.01em

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  pill: 999px

spacing:
  s-1: 4px
  s-2: 8px
  s-3: 12px
  s-4: 16px
  s-5: 24px
  s-6: 32px
  s-7: 48px
  s-8: 64px
  s-9: 96px
  section: clamp(80px, 10vw, 148px)

motion:
  ease-out: cubic-bezier(0.16, 1, 0.3, 1)
  ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)
  ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1)
  dur-1: 140ms
  dur-2: 260ms
  dur-3: 420ms
  dur-4: 720ms
  scroll: "Lenis, duration 1.05s, expo-out"
---

## Overview

The canvas is `{colors.canvas}` #060608 — near-black with a faint cool tint, never `#000000`. Hierarchy comes from a four-step surface ladder (canvas → surface-1 → surface-2 → surface-3) and 1px hairline borders drawn as `inset` box-shadows, not from drop shadows.

**Rutgers scarlet `{colors.brand}` #cc0033 is the only brand colour.** It appears on the brand mark, the one primary CTA per screen, focus rings, and the hairline that fills under a hovered card. It is never a section background and never a card fill. On the dark canvas scarlet only reaches 3.5:1, so text and icons use `{colors.brand-ink}` #ff3d63 (5.9:1) instead; #cc0033 is a fill colour behind white text (5.8:1).

`{colors.gold}` #e2b45c is the single secondary accent — the eastern-market nod. It appears in the headline gradient, the timeline spine, and success states. Nowhere else.

The one place the system borrows a luminous gradient field is the **aurora**: three blurred colour bodies drifting on independent 26–38s loops behind the hero and the closing CTA panel, under a fine grain layer and a hairline grid. Everywhere else the dark canvas is left flat.

**Key characteristics**

- Near-black canvas, four-step surface ladder, hairline borders, no drop shadows on cards.
- One brand colour, used scarcely; one secondary accent; no third.
- Display type at weight 600 with -0.038em tracking; eyebrows run mono at +0.16em, so taxonomy reads against the negative-tracked display.
- Aurora is a hero-and-closing device, not a page-wide wallpaper.
- Motion is part of the system, not decoration on top of it — see **Motion** below.

## Colors

### Brand
- **Scarlet** (`{colors.brand}`): primary CTA fill, brand mark, card hover rule, focus tint.
- **Scarlet Hover** (`{colors.brand-hover}`): hovered primary CTA.
- **Scarlet Ink** (`{colors.brand-ink}`): scarlet as *text* on dark — links, active indices, the headline gradient's warm end.
- **Gold** (`{colors.gold}`): headline gradient's cool end, timeline spine, subscribe-success state.

### Surface
- **Canvas** — page background.
- **Surface 1** — cards, panels, the newsletter block, secondary buttons.
- **Surface 2** — hovered cards, badges, icon wells.
- **Surface 3** — nested wells inside an already-lifted surface.
- **Surface Inset** — form fields, which sit *below* the canvas rather than above it.
- **Hairline / Strong / Bright** — 1px borders, at rest, on hover, and on focus.

### Text
- **Ink** — headlines and emphasised body.
- **Ink Muted** — hero lead, long-form body.
- **Ink Subtle** — card body, section leads, footer links.
- **Ink Tertiary** — dates, notes, copyright, index numbers. The floor: it holds 4.75:1 on canvas, which is where the value was set.

### Light theme

The same ladder inverted — paper, not glare. Every token is redefined under `[data-theme="light"]`; nothing in the component layer branches on theme. The aurora's opacity drops and its blobs switch from `screen` to `multiply` blending, which is the only theme-conditional rule in the system.

## Typography

**Inter** carries everything, self-hosted through `next/font`. **JetBrains Mono** carries eyebrows, indices, dates and tabular figures — the finance register, used only where a number or a label wants it.

Chinese runs a **system stack** (`PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC`) rather than a webfont, because the club has not chosen a Chinese face yet. `:root[lang="zh"]` zeroes the Latin tracking corrections, since the CJK stack has different metrics. When a face is picked, it is a one-line change in `app/styles/tokens.css`.

**Principles**

- Negative tracking scales with size: -0.038em on display, -0.011em on body.
- Eyebrows take *positive* tracking (+0.16em) and uppercase — deliberate contrast against the display.
- Weight range is 400–600. No 700+ display weights.
- `text-wrap: balance` on headings, `pretty` on paragraphs.

## Layout

- Base unit 4px; content max-width 1200px; gutter `clamp(20px, 5vw, 40px)`.
- Section rhythm `clamp(80px, 10vw, 148px)`; nav height 64px.
- Card grids 3-up → 2-up at 980px → 1-up at 640px.
- Card padding `{spacing.s-5}`–`{spacing.s-6}`; the closing CTA panel takes `clamp(32px, 5vw, 64px)`.

## Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No border, no shadow | Body copy, section heads, footer |
| 1 | `surface-1` + 1px `hairline` + a faint top-edge highlight | Cards, panels, secondary buttons |
| 2 | `surface-2` + 1px `hairline-strong` + `shadow-lift`, translateY(-3px) | Hovered cards |
| 3 | `surface-3` | Wells nested inside a lifted surface |
| focus | 2px `brand-ink` outline, 3px offset | Every focusable element |

Depth is surface + hairline. The one drop shadow in the system (`--shadow-lift`) exists only to sell the 3px hover lift.

## Motion

Motion is specified here because it carries as much of the brand as the colour does.

**Scroll** — Lenis (duration 1.05s, expo-out easing) driven off the GSAP ticker, so smooth scroll and every scroll-linked animation share one rAF loop and cannot tear against each other. `lagSmoothing(0)`, because letting the ticker skip time after a stall reads as the page jumping ahead of the wheel.

**Reveals** — `ScrollTrigger.batch` at `top 88%`, `once: true`, 0.085s stagger, `power3.out`. Hidden states live in CSS behind a `.js-motion` gate that an inline script sets before first paint, so a blocked bundle degrades to a plain readable page rather than a blank one.

**Masked headings** — each heading token sits in its own `overflow: hidden` box and rises from `yPercent: 110` on `power4.out`. English splits on whitespace; Chinese splits per character. A line carrying a `background-clip` gradient uses one mask for the whole line — a gradient cannot survive being cut into per-token clipping boxes.

**Scrubbed** — hero content drifts to `yPercent: -14` and fades as the section leaves; the aurora parallaxes to +18%; the progress rule and the timeline spine scrub 1:1 with scroll.

**Pointer** — one delegated `pointermove` listener writes `--mx/--my` on the nearest `.spotlight`; the highlight and the lit border edge are pseudo-element gradients, so tracking costs one composite and no layout. Disabled on coarse pointers.

**Reduced motion** — not "the same animations, faster". Lenis never starts, no scrubbed scene is built (`gsap.matchMedia` gates them at creation), ambient loops stop, and everything hidden is revealed immediately.

**The unhideable rule** — a hidden tab stops `requestAnimationFrame`, which stops the ticker, which stops ScrollTrigger. Anything on screen is therefore swept visible on a timeout, on `visibilitychange`, and on `pageshow`. Content must never be able to stay hidden.

## Do's and Don'ts

**Do**
- Keep scarlet scarce: brand mark, one primary CTA per screen, focus, hover rules.
- Use the surface ladder for hierarchy; do not skip a step.
- Give every new surface a 1px hairline instead of a shadow.
- Pair a mono eyebrow with a negative-tracked display heading.
- Gate every new scroll animation behind `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
- Add `data-reveal="up|fade|scale"` to opt a block into the page-wide reveal batch.

**Don't**
- Don't use `#000000`, and don't use scarlet as a background or card fill.
- Don't introduce a third accent colour.
- Don't pill-round buttons — 8px, always.
- Don't spread the aurora past the hero and the closing panel.
- Don't animate with `gsap.from()` in a component: React re-mounts it in development and `from()` re-records its end state, which can strand an element off-screen. Use `fromTo()`.
- Don't add a Chinese webfont until the club has chosen one.

## Responsive

| Width | Changes |
|---|---|
| 1440 | Default |
| 980 | Card grids 3-up → 2-up |
| 900 | About drops its sticky column |
| 860 | Nav links → sheet; the nav's duplicate join CTA is hidden |
| 720 | Join channels 1-up |
| 640 | All grids 1-up; timeline dates stack above titles |
| 520 | Newsletter field and button stack |

Tap targets hold ≥44px. Display type scales 84px → 44px.

## Files

```
app/styles/tokens.css      every variable in this document
app/styles/base.css        reset, document, type scale, layout primitives
app/styles/motion.css      aurora, reveal primitives, spotlight, reduced motion
app/styles/ui.css          buttons, panels, fields, navigation, newsletter
app/styles/sections.css    hero, programs, join, footer
app/styles/reserved.css    sections built but not yet switched on
app/components/motion/     Lenis + GSAP setup, MaskedText, Atmosphere
app/lib/site.ts            which reserved sections are live
```
