"use client";

import { useLang } from "./LangProvider";

// Laid out as a numbered list rather than a row of cards: three cards of two
// lines each left most of every card empty, and the hover lift they had
// suggested a click that went nowhere.
export default function Programs() {
  const { t } = useLang();

  const programs = [
    { titleKey: "programs.card1.title", descKey: "programs.card1.desc" },
    { titleKey: "programs.card2.title", descKey: "programs.card2.desc" },
    { titleKey: "programs.card3.title", descKey: "programs.card3.desc" },
  ];

  return (
    <section className="programs-section" id="programs">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-label">{t("programs.label")}</div>
            <h2 className="section-title">{t("programs.title")}</h2>
          </div>
          <p className="section-subtitle">{t("programs.subtitle")}</p>
        </div>

        <ol className="program-list reveal-stagger">
          {programs.map((prog, i) => (
            <li key={prog.titleKey} className="program-row">
              <span className="program-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t(prog.titleKey)}</h3>
              <p>{t(prog.descKey)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
