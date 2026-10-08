"use client";

import Image from "next/image";
import { useLang } from "./LangProvider";
import NewsletterForm from "./NewsletterForm";
import { JOIN_URL } from "@/app/lib/links";
import logo from "@/public/logo.png";

// The animated node mesh that used to sit behind this was drawn at 5-8%
// opacity, so it cost a canvas redraw every frame and could barely be seen.
// The club's own emblem fills that space now -- the navbar already loads the
// same file, so it adds no download.
export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-content">
          <div className="hero-eyebrow animate-float-in">
            <span className="dot" />
            {t("hero.badge")}
          </div>

          <h1 className="animate-hero-title">
            {t("hero.title1")}
            <br />
            <span className="hero-title-accent">{t("hero.title2")}</span>
          </h1>

          <p className="hero-desc animate-hero-desc">{t("hero.desc")}</p>

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
            <p className="hero-newsletter-label">
              <strong>{t("hero.newsletter")}</strong>
              <span>{t("hero.newsletterDesc")}</span>
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="hero-emblem animate-hero-emblem" aria-hidden="true">
          <span className="hero-emblem-ring" />
          <Image src={logo} alt="" priority />
        </div>
      </div>
    </section>
  );
}
