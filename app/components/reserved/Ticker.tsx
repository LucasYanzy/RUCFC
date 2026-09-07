"use client";

import { useLang } from "../LangProvider";

/* Reserved — see app/lib/site.ts.
   A slow bilingual term marquee. Two identical tracks so the loop is seamless;
   the second is hidden from assistive tech. */
export default function Ticker() {
  const { t } = useLang();
  const items = t("ticker.items").split(" · ");

  const track = (hidden: boolean) => (
    <div className="marquee__track" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span className="ticker__item" key={`${item}-${i}`}>
          <span className="ticker__dot" />
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <section className="ticker" aria-label="Focus areas">
      <div className="marquee">
        {track(false)}
        {track(true)}
      </div>
    </section>
  );
}
