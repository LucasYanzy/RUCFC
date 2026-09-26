"use client";

import { CSSProperties, Fragment, MutableRefObject, useEffect, useRef } from "react";
import { useLang } from "./LangProvider";
import { useTheme } from "./ThemeProvider";
import NewsletterForm from "./NewsletterForm";
import { JOIN_URL } from "@/app/lib/links";

// The dynamic hero used on the home page. The original, calmer Hero.tsx is still
// in use on /classic -- this is an addition, not a replacement.

type Pointer = { x: number; y: number; active: boolean };

const TAU = Math.PI * 2;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Canvas: a pointer-reactive constellation over two braided "market" lines ──
   The crimson and gold lines are East and West: they weave through each other,
   each carrying a pulse that travels the opposite way. Nothing here is data --
   it is decoration, so there are no axes, prices or labels to mistake for it. */
function MarketField({ pointer }: { pointer: MutableRefObject<Pointer> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const redrawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    redrawRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    const start = performance.now();

    type Node = { x: number; y: number; vx: number; vy: number };
    const nodes: Node[] = [];
    // Smoothed pointer, so the field eases toward the cursor instead of snapping.
    const sp = { x: 0, y: 0, a: 0 };

    const ribbons = [
      { tone: "red", base: 0.7, amp: 0.085, freq: 1.15, speed: 0.00032, phase: 0, width: 1.8, alpha: 0.85, fill: true },
      { tone: "gold", base: 0.71, amp: 0.075, freq: 0.95, speed: -0.00026, phase: 2.4, width: 1.4, alpha: 0.7, fill: false },
      { tone: "ink", base: 0.76, amp: 0.05, freq: 1.8, speed: 0.00018, phase: 4.1, width: 1, alpha: 0.18, fill: false },
    ] as const;

    const palette = () =>
      themeRef.current === "light"
        ? { ink: "17, 17, 32", red: "204, 0, 51", gold: "196, 136, 0", link: 0.09, node: 0.28 }
        : { ink: "255, 255, 255", red: "255, 26, 77", gold: "245, 197, 66", link: 0.11, node: 0.32 };

    const targetCount = () =>
      Math.round(Math.min(72, Math.max(22, (w * h) / 21000)));

    const addNode = () =>
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });

    const resize = () => {
      const oldW = w;
      const oldH = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      if (!w || !h) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rescale rather than reseed, so a mobile URL bar collapsing does not
      // make the whole field jump.
      if (oldW && oldH) {
        for (const n of nodes) {
          n.x *= w / oldW;
          n.y *= h / oldH;
        }
      }
      const target = targetCount();
      while (nodes.length < target) addNode();
      nodes.length = Math.min(nodes.length, target);

      if (!running) draw(start + 5200);
    };

    const ribbonY = (r: (typeof ribbons)[number], x: number, t: number) => {
      const k = TAU * r.freq * (x / w);
      // A phone's hero is tall and narrow, so the same relative swing would
      // turn the lines into spikes; flatten them as the width shrinks.
      const flatten = Math.min(1, 0.4 + w / 1800);
      return (
        h * r.base +
        h *
          r.amp *
          flatten *
          (Math.sin(k + t * r.speed + r.phase) * 0.62 +
            Math.sin(k * 2.3 - t * r.speed * 1.6 + r.phase * 1.7) * 0.26 +
            Math.sin(k * 5.2 + t * r.speed * 2.4) * 0.12)
      );
    };

    // Lines lean toward the cursor, within a soft horizontal window around it.
    const bend = (x: number, y: number) => {
      if (sp.a < 0.01) return y;
      const dx = x - sp.x;
      const g = Math.exp(-(dx * dx) / (2 * 170 * 170));
      const pull = Math.max(-130, Math.min(130, sp.y - y));
      return y + pull * 0.4 * g * sp.a;
    };

    const draw = (now: number) => {
      if (!w || !h) return;
      const t = now - start;
      const dt = last ? Math.min(3, (now - last) / 16.67) : 1;
      last = now;
      const pal = palette();
      const p = pointer.current;

      const ease = reduced ? 1 : 0.08 * dt;
      if (p.active) {
        if (sp.a < 0.01) {
          sp.x = p.x;
          sp.y = p.y;
        }
        sp.x += (p.x - sp.x) * Math.min(1, ease * 1.6);
        sp.y += (p.y - sp.y) * Math.min(1, ease * 1.6);
      }
      sp.a += ((p.active ? 1 : 0) - sp.a) * Math.min(1, ease);

      ctx.clearRect(0, 0, w, h);

      /* Constellation */
      const R = 150;
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;
        }
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;

        if (sp.a > 0.01) {
          const dx = n.x - sp.x;
          const dy = n.y - sp.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * 1.6 * sp.a * dt;
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }
      }

      const L = 140;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > L * L) continue;
          const alpha = (1 - Math.sqrt(d2) / L) * pal.link;
          ctx.strokeStyle = `rgba(${pal.ink}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (sp.a > 0.01) {
        const PL = 190;
        for (const n of nodes) {
          const dx = n.x - sp.x;
          const dy = n.y - sp.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > PL) continue;
          ctx.strokeStyle = `rgba(${pal.red}, ${((1 - d / PL) * 0.45 * sp.a).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(sp.x, sp.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${pal.ink}, ${pal.node})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.3, 0, TAU);
        ctx.fill();
      }

      /* Ribbons */
      const step = w < 700 ? 10 : 7;
      for (const r of ribbons) {
        const c = pal[r.tone];
        const pts: number[] = [];
        for (let x = -24; x <= w + 24; x += step) pts.push(x, bend(x, ribbonY(r, x, t)));

        const trace = () => {
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
        };

        if (r.fill) {
          trace();
          ctx.lineTo(w + 24, h);
          ctx.lineTo(-24, h);
          ctx.closePath();
          const fg = ctx.createLinearGradient(0, h * (r.base - r.amp), 0, h);
          fg.addColorStop(0, `rgba(${c}, 0.12)`);
          fg.addColorStop(1, `rgba(${c}, 0)`);
          ctx.fillStyle = fg;
          ctx.fill();
        }

        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `rgba(${c}, 0)`);
        grad.addColorStop(0.16, `rgba(${c}, ${r.alpha})`);
        grad.addColorStop(0.84, `rgba(${c}, ${r.alpha})`);
        grad.addColorStop(1, `rgba(${c}, 0)`);
        ctx.strokeStyle = grad;

        trace();
        ctx.globalAlpha = 0.14;
        ctx.lineWidth = r.width * 6;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineWidth = r.width;
        ctx.stroke();
      }

      /* Pulses: East travels right, West travels left */
      const pulse = (r: (typeof ribbons)[number], progress: number, tone: string) => {
        const x = -40 + progress * (w + 80);
        const y = bend(x, ribbonY(r, x, t));
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 28);
        halo.addColorStop(0, `rgba(${tone}, 0.5)`);
        halo.addColorStop(1, `rgba(${tone}, 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, TAU);
        ctx.fill();

        ctx.strokeStyle = `rgba(${tone}, 0.22)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = `rgba(${pal.ink}, 0.95)`;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, TAU);
        ctx.fill();
      };
      const period = 11000;
      pulse(ribbons[0], (t % period) / period, pal.red);
      pulse(ribbons[1], 1 - ((t + period / 2) % period) / period, pal.gold);
    };

    const frame = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(frame);
    };
    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    // Only animate while the hero is on screen and the tab is visible.
    const sync = () => (visible && !document.hidden ? startLoop() : stopLoop());

    redrawRef.current = () => {
      if (!running) draw(start + 5200);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    resize();
    sync();

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      redrawRef.current = null;
    };
  }, [pointer]);

  return <canvas ref={canvasRef} className="hero-x-canvas" />;
}

/* ── Headline words that rise out of a mask, one after another ──
   English splits on spaces; Chinese has none, so it splits per character. */
function SplitWords({ text, delay, step }: { text: string; delay: number; step: number }) {
  const trimmed = text.trim();
  const spaced = /\s/.test(trimmed);
  const parts = spaced ? trimmed.split(/\s+/) : Array.from(trimmed);

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {spaced && i > 0 ? " " : null}
          <span className="split-word">
            <span className="split-inner" style={{ animationDelay: `${delay + i * step}s` }}>
              {part}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

function Sparkline() {
  return (
    <svg className="hero-x-spark" width="38" height="14" viewBox="0 0 38 14" aria-hidden="true">
      <path d="M1 11 L7 8 L12 10 L18 4 L23 7 L29 3 L37 5" pathLength="1" />
    </svg>
  );
}

// Every chip names something the program cards already promise.
const chips = [
  { key: "topic.bloomberg", depth: 26 },
  { key: "topic.esg", depth: 14 },
  { key: "topic.markets", depth: 34, spark: true },
  { key: "topic.ai", depth: 30 },
  { key: "topic.leaders", depth: 18 },
  { key: "topic.bridge", depth: 38 },
];

export default function HeroDynamic() {
  const { t, lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const cleanups: Array<() => void> = [];

    // Scroll: the content drifts up and fades while the backdrop lags behind.
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const progress = Math.min(1, Math.max(0, window.scrollY / (section.offsetHeight || 1)));
        section.style.setProperty("--hero-scroll", progress.toFixed(3));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
    });

    // Everything below needs a real hovering pointer; touch gets the rest.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return () => cleanups.forEach((fn) => fn());
    }

    // Pointer parallax, eased toward the target so layers glide.
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let parallaxRaf = 0;
    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      section.style.setProperty("--px", current.x.toFixed(4));
      section.style.setProperty("--py", current.y.toFixed(4));
      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      parallaxRaf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!parallaxRaf) parallaxRaf = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.current = { x, y, active: true };
      section.style.setProperty("--sx", `${x}px`);
      section.style.setProperty("--sy", `${y}px`);
      section.classList.add("is-pointing");
      target.x = (x / rect.width) * 2 - 1;
      target.y = (y / rect.height) * 2 - 1;
      kick();
    };
    const onPointerLeave = () => {
      pointer.current = { ...pointer.current, active: false };
      section.classList.remove("is-pointing");
      target.x = 0;
      target.y = 0;
      kick();
    };
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    cleanups.push(() => {
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(parallaxRaf);
    });

    // Magnetic buttons: they lean a little toward the cursor.
    section.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        el.style.setProperty("--mx", `${(dx * 0.18).toFixed(1)}px`);
        el.style.setProperty("--my", `${(dy * 0.3).toFixed(1)}px`);
      };
      const onLeave = () => {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const title1 = t("hero.title1");
  const title2 = t("hero.title2");
  const wordStep = lang === "zh" ? 0.07 : 0.1;

  return (
    <section className="hero hero-x" id="hero" ref={sectionRef}>
      <div className="hero-x-backdrop" aria-hidden="true">
        <div className="hero-x-aurora">
          <span />
          <span />
          <span />
        </div>
        <MarketField pointer={pointer} />
        <div className="hero-grid" />
      </div>
      <div className="hero-x-spotlight" aria-hidden="true" />

      <div className="hero-x-chips" aria-hidden="true">
        {chips.map((chip, i) => (
          <span
            key={chip.key}
            className={`hero-x-chip hero-x-chip-${i + 1}`}
            style={{ "--depth": chip.depth, "--i": i } as CSSProperties}
          >
            <span className="hero-x-chip-inner">
              <i className="hero-x-chip-dot" />
              {t(chip.key)}
              {chip.spark && <Sparkline />}
            </span>
          </span>
        ))}
      </div>

      <div className="hero-content hero-x-content">
        <div className="hero-badge hero-x-badge">
          <span className="dot" />
          {t("hero.badge")}
        </div>

        {/* Keyed on language so the entrance replays when it changes. */}
        <h1 className="hero-x-title" key={lang} aria-label={`${title1} ${title2}`}>
          <span className="hero-x-line" aria-hidden="true">
            <SplitWords text={title1} delay={0.3} step={wordStep} />
          </span>
          <span className="hero-x-accent" aria-hidden="true">
            <span className="hero-x-accent-text">{title2}</span>
            <svg className="hero-x-underline" viewBox="0 0 400 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="hero-x-underline-grad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="var(--accent)" />
                  <stop offset="0.6" stopColor="var(--accent-light)" />
                  <stop offset="1" stopColor="var(--gold)" />
                </linearGradient>
              </defs>
              <path d="M4 15 C 90 5, 230 3, 396 10" pathLength="1" />
            </svg>
          </span>
        </h1>

        <p className="hero-x-desc">{t("hero.desc")}</p>

        <div className="hero-buttons hero-x-buttons">
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            data-magnetic
          >
            {t("hero.cta1")}
            <span className="btn-arrow">→</span>
          </a>
          <a href="#programs" className="btn-secondary" data-magnetic>
            {t("hero.cta2")}
          </a>
        </div>

        <div className="hero-newsletter hero-x-newsletter">
          <div className="hero-newsletter-label">{t("hero.newsletter")}</div>
          <p className="hero-newsletter-desc">{t("hero.newsletterDesc")}</p>
          <NewsletterForm />
        </div>
      </div>

      <a href="#programs" className="hero-x-scroll" aria-label="Scroll down">
        <span className="hero-x-mouse">
          <span />
        </span>
        <span className="hero-x-scroll-label">{t("hero.scroll")}</span>
      </a>
    </section>
  );
}
