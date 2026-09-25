"use client";

import { useLang } from "./LangProvider";

// Everything here comes from the program cards -- the strip restates what the
// club runs, it does not add claims of its own.
const TOPICS = [
  "topic.bloomberg",
  "topic.bmc",
  "topic.esg",
  "topic.ai",
  "topic.leaders",
  "topic.markets",
  "topic.careers",
  "topic.community",
  "topic.bridge",
];

export default function TopicMarquee() {
  const { t } = useLang();

  // The list is rendered twice and the track slides by exactly half its width,
  // which makes the loop seamless. The copy is hidden from assistive tech.
  const group = (copy: boolean) => (
    <ul className="marquee-group" aria-hidden={copy || undefined}>
      {TOPICS.map((key, i) => (
        <li key={key} className={i % 2 ? "is-outline" : undefined}>
          {t(key)}
        </li>
      ))}
    </ul>
  );

  return (
    <section className="marquee" aria-label={t("topics.label")}>
      <div className="marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}
