"use client";

import { useRef, useState } from "react";
import { useLang } from "../LangProvider";
import MaskedText from "../motion/MaskedText";
import { gsap } from "../motion/gsap";

/* Reserved — see app/lib/site.ts.
   An accordion animated from a measured height to auto, so the panel can grow
   with translated copy without a hardcoded max-height. */

const ITEMS = ["1", "2", "3", "4"];

export default function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState<string | null>(null);
  const panels = useRef(new Map<string, HTMLDivElement>());

  const toggle = (id: string) => {
    const next = open === id ? null : id;

    for (const [key, el] of panels.current) {
      const shouldOpen = key === next;
      gsap.killTweensOf(el);

      if (shouldOpen) {
        gsap.set(el, { height: "auto" });
        gsap.from(el, { height: 0, duration: 0.5, ease: "power3.out" });
        gsap.fromTo(
          el.firstElementChild,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.08 },
        );
      } else if (el.offsetHeight > 0) {
        gsap.to(el, { height: 0, duration: 0.4, ease: "power3.inOut" });
      }
    }

    setOpen(next);
  };

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow" data-reveal="fade">
            {t("faq.label")}
          </span>
          <MaskedText as="h2" className="section-title" text={t("faq.title")} />
        </header>

        <div className="faq" data-reveal="up">
          {ITEMS.map((n) => (
            <div className="faq__item" key={n}>
              <button
                type="button"
                className="faq__trigger"
                aria-expanded={open === n}
                aria-controls={`faq-panel-${n}`}
                onClick={() => toggle(n)}
              >
                {t(`faq.q${n}`)}
                <span className="faq__sign" aria-hidden="true" />
              </button>
              <div
                className="faq__panel"
                id={`faq-panel-${n}`}
                role="region"
                ref={(el) => {
                  if (el) panels.current.set(n, el);
                  else panels.current.delete(n);
                }}
              >
                <p className="faq__answer">{t(`faq.a${n}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
