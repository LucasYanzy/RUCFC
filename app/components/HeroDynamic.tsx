"use client";

import { Fragment } from "react";
import { useLang } from "./LangProvider";
import NewsletterForm from "./NewsletterForm";
import { JOIN_URL } from "@/app/lib/links";

// The dynamic hero used on the home page. The original, calmer Hero.tsx is still
// in use on /classic -- this is an addition, not a replacement.

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
    </section>
  );
}
