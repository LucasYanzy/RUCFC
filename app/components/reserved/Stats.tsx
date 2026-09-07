"use client";

import { useRef } from "react";
import { useLang } from "../LangProvider";
import MaskedText from "../motion/MaskedText";
import { gsap, useGSAP } from "../motion/gsap";

/* Reserved — see app/lib/site.ts.
   Counters run up once when the row reaches the viewport. Non-numeric values
   (and reduced motion) render as plain text, so "120+" still ends at "120+". */

const STATS = ["1", "2", "3", "4"];

export default function Stats() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        for (const el of gsap.utils.toArray<HTMLElement>(".stat__value")) {
          const final = el.textContent ?? "";
          const target = Number.parseFloat(final.replace(/[^\d.]/g, ""));
          if (!Number.isFinite(target)) continue;
          const suffix = final.replace(/[\d.,]/g, "");
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = `${Math.round(counter.value)}${suffix}`;
            },
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <section className="section section--tight stats" id="stats" ref={root}>
      <div className="container">
        <header className="section-head">
          <span className="eyebrow" data-reveal="fade">
            {t("stats.label")}
          </span>
          <MaskedText as="h2" className="section-title" text={t("stats.title")} />
        </header>

        <div className="stats__grid" data-reveal="up">
          {STATS.map((n) => (
            <div className="stat" key={n}>
              <span className="stat__value">{t(`stats.${n}.value`)}</span>
              <span className="stat__label">{t(`stats.${n}.label`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
