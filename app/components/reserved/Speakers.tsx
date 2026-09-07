"use client";

import { useLang } from "../LangProvider";
import MaskedText from "../motion/MaskedText";

/* Reserved — see app/lib/site.ts.
   Deliberately placeholder: initials, not photographs, and names that are
   obviously stand-ins. Nothing here should read as a real endorsement until
   the club replaces it. */
const PLACEHOLDERS = [
  { initials: "—", name: "Guest name", role: "Title · Firm" },
  { initials: "—", name: "Guest name", role: "Title · Firm" },
  { initials: "—", name: "Guest name", role: "Title · Firm" },
  { initials: "—", name: "Guest name", role: "Title · Firm" },
];

export default function Speakers() {
  const { t } = useLang();

  return (
    <section className="section speakers" id="speakers">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow" data-reveal="fade">
            {t("speakers.label")}
          </span>
          <MaskedText as="h2" className="section-title" text={t("speakers.title")} />
          <p className="section-lead" data-reveal="up">
            {t("speakers.subtitle")}
          </p>
        </header>

        <div className="speakers__grid">
          {PLACEHOLDERS.map((person, i) => (
            <article
              className="panel panel--lift spotlight speaker"
              key={i}
              data-reveal="up"
            >
              <span className="speaker__avatar" aria-hidden="true">
                {person.initials}
              </span>
              <div>
                <div className="speaker__name">{person.name}</div>
                <div className="speaker__role">{person.role}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
