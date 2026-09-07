"use client";

import { useLang } from "./LangProvider";
import MaskedText from "./motion/MaskedText";

const PROGRAMS = [
  { title: "programs.card1.title", desc: "programs.card1.desc" },
  { title: "programs.card2.title", desc: "programs.card2.desc" },
  { title: "programs.card3.title", desc: "programs.card3.desc" },
];

export default function Programs() {
  const { t } = useLang();

  return (
    <section className="section programs" id="programs">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow" data-reveal="fade">
            {t("programs.label")}
          </span>
          <MaskedText as="h2" className="section-title" text={t("programs.title")} />
          <p className="section-lead" data-reveal="up">
            {t("programs.subtitle")}
          </p>
        </header>

        <div className="programs__grid">
          {PROGRAMS.map((program, i) => (
            <article
              key={program.title}
              className="panel panel--lift spotlight program"
              data-reveal="up"
            >
              <span className="program__index mono">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="program__title">{t(program.title)}</h3>
              <p className="program__body">{t(program.desc)}</p>
              <span className="program__rule" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
