"use client";

import { useLang } from "./LangProvider";

const JOIN_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSejjOl4pe0uux4EFgA-422cIIHpvoisIeId5vv1sS0zmfvwCQ/viewform?usp=header";

export default function CTA() {
  const { t } = useLang();

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content reveal">
          <h2 className="cta-title">{t("cta.title")}</h2>
          <p className="cta-subtitle">{t("cta.subtitle")}</p>
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-glow"
          >
            {t("nav.join")}
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
