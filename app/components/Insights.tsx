"use client";

import { useLang } from "./LangProvider";

export default function Insights() {
  const { t } = useLang();

  return (
    <section className="insights-section" id="insights">
      <div className="container">
        <div className="insights-header reveal">
          <div>
            <div className="section-label">{t("insights.label")}</div>
            <h2 className="section-title">{t("insights.title")}</h2>
          </div>
          <p className="section-subtitle" style={{ textAlign: "right" }}>
            {t("insights.subtitle")}
          </p>
        </div>

        <div className="insights-content reveal">
          <div className="insights-coming-soon">
            <div className="pulse-ring" />
            <h3>{t("insights.coming")}</h3>
            <p>{t("insights.comingDesc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
