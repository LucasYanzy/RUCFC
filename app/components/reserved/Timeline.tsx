"use client";

import { useRef } from "react";
import { useLang } from "../LangProvider";
import MaskedText from "../motion/MaskedText";
import { gsap, useGSAP } from "../motion/gsap";

/* Reserved — see app/lib/site.ts.
   The spine fills as the section passes, so scroll position and semester
   position are the same gesture. */

const EVENTS = ["1", "2", "3", "4"];

export default function Timeline() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".timeline__spine span", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 72%",
            end: "bottom 65%",
            scrub: 0.4,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".timeline__spine span", { scaleY: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section className="section timeline-section" id="timeline" ref={root}>
      <div className="container">
        <header className="section-head">
          <span className="eyebrow" data-reveal="fade">
            {t("timeline.label")}
          </span>
          <MaskedText as="h2" className="section-title" text={t("timeline.title")} />
          <p className="section-lead" data-reveal="up">
            {t("timeline.subtitle")}
          </p>
        </header>

        <div className="timeline">
          <span className="timeline__spine" aria-hidden="true">
            <span />
          </span>

          {EVENTS.map((n) => (
            <article className="event" key={n} data-reveal="up">
              <span className="event__date">{t(`timeline.${n}.date`)}</span>
              <div>
                <h3 className="event__title">{t(`timeline.${n}.title`)}</h3>
                <p className="event__desc">{t(`timeline.${n}.desc`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
