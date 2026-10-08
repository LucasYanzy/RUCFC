"use client";

import { useLang } from "./LangProvider";

const itemKeys = [
  "ticker.1",
  "ticker.2",
  "ticker.3",
  "ticker.4",
  "ticker.5",
  "ticker.6",
  "ticker.7",
];

// A ticker-tape strip of what the club actually covers. The track holds two
// identical runs and slides left by exactly one run's width, so the loop has
// no seam. Each run repeats the items twice so it stays wider than a 4K
// screen and the strip never shows a gap at its right edge.
export default function Ticker() {
  const { t } = useLang();
  const run = [...itemKeys, ...itemKeys];

  return (
    <div className="ticker">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="ticker-list" aria-hidden={copy === 1 ? true : undefined}>
            {run.map((key, i) => (
              <li key={`${key}-${i}`}>{t(key)}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
