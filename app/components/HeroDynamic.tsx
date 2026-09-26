"use client";

import { Fragment, useEffect, useRef } from "react";
import { useLang } from "./LangProvider";
import { useTheme } from "./ThemeProvider";
import NewsletterForm from "./NewsletterForm";
import { JOIN_URL } from "@/app/lib/links";

// The dynamic hero used on the home page. The original, calmer Hero.tsx is still
// in use on /classic -- this is an addition, not a replacement.

const TAU = Math.PI * 2;

/* ── A band of two flowing lines beneath the hero content ──
   Crimson and a quiet neutral, weaving through each other, with one point
   riding the crimson line. The band has its own place in the layout, so the
   lines never run behind text. Decoration only: no axes, values or labels. */
function MarketBand() {
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    const lines = [
      { tone: "red", base: 0.5, amp: 0.3, freq: 1.1, speed: 0.00022, phase: 0, width: 1.6, alpha: 0.9, fill: true },
      { tone: "ink", base: 0.55, amp: 0.24, freq: 0.85, speed: -0.00016, phase: 2.3, width: 1.1, alpha: 0.35, fill: false },
    ] as const;

    const palette = () =>
      themeRef.current === "light"
        ? { red: "204, 0, 51", ink: "17, 17, 32", grid: 0.07, dot: "#ffffff" }
        : { red: "255, 26, 77", ink: "240, 240, 245", grid: 0.06, dot: "#060610" };

    const lineY = (l: (typeof lines)[number], x: number, t: number) => {
      const k = TAU * l.freq * (x / w);
      return (
        h * l.base +
        h *
          l.amp *
          (Math.sin(k + t * l.speed + l.phase) * 0.65 +
            Math.sin(k * 2.1 - t * l.speed * 1.5 + l.phase * 1.7) * 0.25 +
            Math.sin(k * 4.3 + t * l.speed * 2.2) * 0.1)
      );
    };

    const draw = (now: number) => {
      if (!w || !h) return;
      const t = now - start;
      const pal = palette();
      ctx.clearRect(0, 0, w, h);

      // Three faint rules, like a chart's gridlines.
      ctx.strokeStyle = `rgba(${pal.ink}, ${pal.grid})`;
      ctx.lineWidth = 1;
      for (const f of [0.2, 0.5, 0.8]) {
        const gy = Math.round(h * f) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const step = w < 700 ? 8 : 6;
      for (const l of lines) {
        const c = pal[l.tone];
        const pts: number[] = [];
        for (let x = 0; x <= w + step; x += step) pts.push(x, lineY(l, x, t));
        const trace = () => {
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
        };

        if (l.fill) {
          trace();
          ctx.lineTo(w + step, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          const fill = ctx.createLinearGradient(0, 0, 0, h);
          fill.addColorStop(0, `rgba(${c}, 0.12)`);
          fill.addColorStop(1, `rgba(${c}, 0)`);
          ctx.fillStyle = fill;
          ctx.fill();
        }

        trace();
        ctx.strokeStyle = `rgba(${c}, ${l.alpha})`;
        ctx.lineWidth = l.width;
        ctx.stroke();
      }

      // One point riding the crimson line, left to right.
      const period = 14000;
      const px = ((t % period) / period) * w;
      const py = lineY(lines[0], px, t);
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, TAU);
      ctx.fillStyle = pal.dot;
      ctx.fill();
      ctx.strokeStyle = `rgb(${pal.red})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      if (!w || !h) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Resizing clears the canvas; repaint now rather than wait for a frame
      // that may never come if the band is off screen.
      draw(running ? performance.now() : start + 4000);
    };

    const frame = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(frame);
    };
    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    // Only animate while the band is on screen and the tab is visible.
    const sync = () => (visible && !document.hidden ? startLoop() : stopLoop());

    redrawRef.current = () => {
      if (!running) draw(start + 4000);
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
  }, []);

  return (
    <div className="hero-x-band" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
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

export default function HeroDynamic() {
  const { t, lang } = useLang();
  const title1 = t("hero.title1");
  const title2 = t("hero.title2");
  const wordStep = lang === "zh" ? 0.07 : 0.1;

  return (
    <section className="hero hero-x" id="hero">
      <div className="hero-x-backdrop" aria-hidden="true">
        <div className="hero-x-aurora">
          <span />
          <span />
        </div>
        <div className="hero-grid" />
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
            {title2}
          </span>
        </h1>

        <p className="hero-x-desc">{t("hero.desc")}</p>

        <div className="hero-buttons hero-x-buttons">
          <a href={JOIN_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {t("hero.cta1")}
            <span className="btn-arrow">→</span>
          </a>
          <a href="#programs" className="btn-secondary">
            {t("hero.cta2")}
          </a>
        </div>

        <div className="hero-newsletter hero-x-newsletter">
          <div className="hero-newsletter-label">{t("hero.newsletter")}</div>
          <p className="hero-newsletter-desc">{t("hero.newsletterDesc")}</p>
          <NewsletterForm />
        </div>
      </div>

      <MarketBand />
    </section>
  );
}
