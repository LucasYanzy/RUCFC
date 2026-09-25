"use client";

import type { CSSProperties } from "react";
import { useLang } from "./LangProvider";
import { FOCUS } from "@/app/lib/focus";

// The four focus areas as columns ruled in scarlet, like traditional Chinese
// red-lined letter paper, each headed by its character.
export default function Focus() {
  const { t } = useLang();

  return (
    <section className="focus-section" id="focus">
      <div className="container">
        <header className="focus-header reveal">
          <p className="section-label">{t("focus.label")}</p>
          <h2 className="section-title">{t("focus.title")}</h2>
          <p className="section-subtitle">{t("focus.subtitle")}</p>
        </header>

        <ul className="focus-grid reveal">
          {FOCUS.map(({ glyph, key }, i) => (
            <li className="focus-item" key={key} style={{ "--i": i } as CSSProperties}>
              <span className="focus-glyph" lang="zh-CN" aria-hidden="true">
                {glyph}
              </span>
              <span className="focus-gloss">{t(`${key}.gloss`)}</span>
              <h3>{t(`${key}.title`)}</h3>
              <p className="focus-alt">{t(`${key}.alt`)}</p>
              <p className="focus-desc">{t(`${key}.desc`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
