"use client";

import { useLang } from "./LangProvider";

export default function Programs() {
  const { t } = useLang();

  const programs = [
    { icon: "📈", titleKey: "programs.card1.title", descKey: "programs.card1.desc" },
    { icon: "👔", titleKey: "programs.card2.title", descKey: "programs.card2.desc" },
    { icon: "🤝", titleKey: "programs.card3.title", descKey: "programs.card3.desc" },
  ];

  return (
    <section className="programs-section" id="programs">
      <div className="container">
        <div className="programs-header reveal">
          <div className="section-label">{t("programs.label")}</div>
          <h2 className="section-title">{t("programs.title")}</h2>
          <p className="section-subtitle">{t("programs.subtitle")}</p>
        </div>

        <div className="programs-grid reveal-stagger">
          {programs.map((prog, i) => (
            <div key={i} className="program-card">
              <div className="program-icon">{prog.icon}</div>
              <h3>{t(prog.titleKey)}</h3>
              <p>{t(prog.descKey)}</p>
              <div className="card-shine" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
