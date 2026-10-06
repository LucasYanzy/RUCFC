"use client";

import { useLang } from "./LangProvider";

// The club's focus areas, in the club's order.
const TOPICS = [
  "topic.finance",
  "topic.ai",
  "topic.exchange",
  "topic.fintech",
  "topic.research",
];

export default function TopicMarquee() {
  const { t } = useLang();

  // The track holds two identical groups and slides by exactly half its width,
  // which makes the loop seamless; the second group is hidden from assistive
  // tech. Items alternate filled and outlined, and with an odd number of topics
  // each group lists them twice so the alternation also lines up at the seam.
  const items = [...TOPICS, ...TOPICS];
  const group = (copy: boolean) => (
    <ul className="marquee-group" aria-hidden={copy || undefined}>
      {items.map((key, i) => (
        <li
          key={`${key}-${i}`}
          className={i % 2 ? "is-outline" : undefined}
          aria-hidden={(!copy && i >= TOPICS.length) || undefined}
        >
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
