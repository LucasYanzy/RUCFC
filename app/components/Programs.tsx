"use client";

import { useLang } from "./LangProvider";
import SpotlightCard from "./SpotlightCard";
import AnimatedContent from "./AnimatedContent";

// One scarlet for all three. The first pass gave each card its own hue -- red,
// cyan, amber -- which looked lively and read as a consumer product. The Rutgers
// identity budgets supporting colours at roughly a tenth of the page, so the
// accent stays scarlet everywhere and the cards are told apart by their index
// rather than by colour.
const SPOTLIGHT = "rgba(204, 0, 51, 0.18)";

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
        <AnimatedContent distance={60} duration={0.9} threshold={0.15}>
          <div className="programs-header">
            <div className="section-label">{t("programs.label")}</div>
            <h2 className="section-title">{t("programs.title")}</h2>
            <p className="section-subtitle">{t("programs.subtitle")}</p>
          </div>
        </AnimatedContent>

        <div className="programs-grid">
          {programs.map((prog, i) => (
            <AnimatedContent
              key={prog.titleKey}
              distance={50}
              duration={0.8}
              delay={i * 0.09}
              threshold={0.1}
            >
              <SpotlightCard className="program-card" spotlightColor={SPOTLIGHT}>
                <span className="program-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{t(prog.titleKey)}</h3>
                <p>{t(prog.descKey)}</p>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
