"use client";

import { useLang } from "./LangProvider";

// Third setting for this section. It was a three-column grid of bordered boxes
// (generic), then a ScrollStack (each card pinned and scaled behind the next).
// The stack cost more than it returned: the back cards collapse to 26px slivers
// so only one of the three is ever readable, it measured card positions from
// their own transformed boxes and shook, and it pulled in Lenis to do it.
// A ruled list says the same thing, keeps all three legible at once, and has
// no scroll-position state to get wrong.
const programs = [
  { titleKey: "programs.card1.title", descKey: "programs.card1.desc" },
  { titleKey: "programs.card2.title", descKey: "programs.card2.desc" },
  { titleKey: "programs.card3.title", descKey: "programs.card3.desc" },
];

export default function Programs() {
  const { t } = useLang();

  return (
    <section className="programs-section" id="programs">
      <div className="container">
        <div className="programs-header">
          <div className="section-label">{t("programs.label")}</div>
          <h2 className="section-title">{t("programs.title")}</h2>
          <p className="section-subtitle">{t("programs.subtitle")}</p>
        </div>

        <ol className="program-list">
          {programs.map((prog, i) => (
            <li className="program-row" key={prog.titleKey}>
              <span className="program-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="program-body">
                <h3>{t(prog.titleKey)}</h3>
                <p>{t(prog.descKey)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
