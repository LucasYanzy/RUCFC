"use client";

import { useLang } from "./LangProvider";
import NewsletterForm from "./NewsletterForm";
import { JOIN_URL } from "@/app/lib/links";
import Threads from "./Threads";
import StarBorder from "./StarBorder";
import SplitText from "./SplitText";

// The hand-rolled canvas mesh that used to live here is replaced by Threads, a
// WebGL shader from @react-bits. Aurora was the first choice and was wrong for
// this: a three-stop colour wash spends the whole palette on decoration, and the
// stops it needed were not Rutgers colours. Threads is a single-hue line field,
// so it runs entirely on scarlet and reads as a tape rather than as a gradient.
// It draws nothing when WebGL is missing, so .hero-grid and the CSS gradient
// behind it stay as the floor.
//
// ogl wants linear 0-1 components, not hex: #CC0033 -> 204/255, 0, 51/255.
const THREAD_SCARLET: [number, number, number] = [0.8, 0, 0.2];

export default function Hero() {
  const { t, lang } = useLang();

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />

      <div className="hero-threads" aria-hidden="true">
        <Threads color={THREAD_SCARLET} amplitude={0.7} distance={0.25} enableMouseInteraction />
      </div>

      <div className="hero-grid" />

      <div className="hero-content">
        <StarBorder
          as="div"
          className="hero-badge-star animate-float-in"
          color="#cc0033"
          speed="6s"
          thickness={1}
          backgroundColor="var(--bg-card)"
          textColor="var(--text-secondary)"
          borderColor="var(--border-color)"
        >
          <span className="dot" />
          {t("hero.badge")}
        </StarBorder>

        {/* Two SplitText runs rather than one: the second line carries the accent
            colour, and splitting per line keeps the stagger reading left to right
            on each. `lang` in the key forces a clean re-split on toggle. */}
        <h1 className="hero-title-split">
          <SplitText
            key={`t1-${lang}`}
            text={t("hero.title1")}
            tag="span"
            className="hero-title-line"
            delay={35}
            duration={1}
            splitType="chars"
            from={{ opacity: 0, y: 44 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
          <SplitText
            key={`t2-${lang}`}
            text={t("hero.title2")}
            tag="span"
            className="hero-title-line hero-title-accent"
            delay={35}
            duration={1}
            splitType="chars"
            from={{ opacity: 0, y: 44 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
        </h1>

        <p className="animate-hero-desc">{t("hero.desc")}</p>

        <div className="hero-buttons animate-hero-buttons">
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {t("hero.cta1")}
            <span className="btn-arrow">→</span>
          </a>
          <a href="#programs" className="btn-secondary">
            {t("hero.cta2")}
          </a>
        </div>

        <div className="hero-newsletter animate-hero-buttons">
          <div className="hero-newsletter-label">{t("hero.newsletter")}</div>
          <p className="hero-newsletter-desc">{t("hero.newsletterDesc")}</p>
          <NewsletterForm />
        </div>
      </div>

      <a href="#programs" className="scroll-arrow animate-hero-buttons" aria-label="Scroll down">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  );
}
