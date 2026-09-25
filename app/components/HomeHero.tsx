"use client";

import { useLang } from "./LangProvider";
import NewsletterForm from "./NewsletterForm";
import RouteMap from "./RouteMap";
import Seal from "./Seal";
import { FOCUS } from "@/app/lib/focus";
import { JOIN_URL } from "@/app/lib/links";

// Home hero: the thesis on the left, the route it describes on the right. The
// original hero is Hero.tsx, still used by /classic.
export default function HomeHero() {
  const { t } = useLang();

  return (
    <section className="home-hero" id="hero">
      <div className="container home-hero-grid">
        <div className="home-hero-copy">
          <p className="home-kicker">
            <span className="home-kicker-cn" lang="zh-CN">
              罗格斯华人金融社团
            </span>
            <span className="home-kicker-rule" aria-hidden="true" />
            <span>{t("hero.badge")}</span>
          </p>

          <h1 className="home-title">
            <span className="home-title-line">{t("home.title1")}</span>{" "}
            <span className="home-title-line home-title-accent">
              {t("home.title2")}
              {/* Stamped after the headline the way a seal closes a piece of
                  calligraphy. It reads 华人金融, "Chinese finance". */}
              <Seal chars={["华", "人", "金", "融"]} className="home-seal" />
            </span>
          </h1>

          <p className="home-thesis">{t("home.thesis")}</p>

          <ul className="home-tags" aria-label={t("home.focusLabel")}>
            {FOCUS.map(({ glyph, key }) => (
              <li key={key}>
                <span className="home-tag-glyph" lang="zh-CN" aria-hidden="true">
                  {glyph}
                </span>
                {t(`${key}.title`)}
              </li>
            ))}
          </ul>

          <div className="home-actions">
            <a href={JOIN_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              {t("hero.cta1")}
              <span className="btn-arrow">→</span>
            </a>
            <a href="#focus" className="btn-secondary">
              {t("home.focusLabel")}
            </a>
          </div>
        </div>

        <RouteMap />

        <div className="home-newsletter">
          <div>
            <p className="home-newsletter-label">{t("hero.newsletter")}</p>
            <p className="home-newsletter-desc">{t("home.newsletterDesc")}</p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
