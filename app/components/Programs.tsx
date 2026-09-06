"use client";

import { useLang } from "./LangProvider";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import ScrollReveal from "./ScrollReveal";

// Was a three-column grid of bordered boxes. That grid is the single most
// generic thing a page can do, and no amount of palette work rescues it -- all
// three cards are on screen at once, at the same size, saying "this is a
// template". ScrollStack gives the same three items a sequence instead: each one
// pins, scales and blurs behind the next, so the section is read rather than
// scanned.
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
          <ScrollReveal
            containerClassName="section-subtitle-reveal"
            textClassName="section-subtitle"
            enableBlur
            baseOpacity={0.12}
            baseRotation={2}
            blurStrength={5}
          >
            {t("programs.subtitle")}
          </ScrollReveal>
        </div>
      </div>

      {/* useWindowScroll keeps this on the page's own scroll rather than opening
          a nested scroller, and installs Lenis on the window -- which is where
          the whole page's smoothing comes from. */}
      <ScrollStack
        className="programs-stack"
        useWindowScroll
        itemDistance={90}
        itemStackDistance={26}
        itemScale={0.025}
        baseScale={0.88}
        stackPosition="22%"
        scaleEndPosition="12%"
        rotationAmount={0}
        blurAmount={1.4}
      >
        {programs.map((prog, i) => (
          <ScrollStackItem key={prog.titleKey} itemClassName="program-card">
            <span className="program-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{t(prog.titleKey)}</h3>
            <p>{t(prog.descKey)}</p>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
