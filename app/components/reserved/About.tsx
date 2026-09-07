"use client";

import { useLang } from "../LangProvider";
import MaskedText from "../motion/MaskedText";

/* Reserved — see app/lib/site.ts.
   A sticky left column against pillars that scroll past it. */

const PILLARS = ["1", "2", "3"];

export default function About() {
  const { t } = useLang();

  return (
    <section className="section about" id="about">
      <div className="container about__layout">
        <div className="about__sticky">
          <span className="eyebrow" data-reveal="fade">
            {t("about.label")}
          </span>
          <MaskedText as="h2" className="section-title" text={t("about.title")} />
          <p className="about__body" data-reveal="up">
            {t("about.body1")}
          </p>
          <p className="about__body" data-reveal="up">
            {t("about.body2")}
          </p>
        </div>

        <div className="about__pillars">
          {PILLARS.map((n, i) => (
            <article
              className="panel panel--lift spotlight pillar"
              key={n}
              data-reveal="up"
            >
              <h3 className="pillar__title">
                <span className="pillar__num mono">{String(i + 1).padStart(2, "0")}</span>
                {t(`about.pillar${n}.title`)}
              </h3>
              <p className="pillar__desc">{t(`about.pillar${n}.desc`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
