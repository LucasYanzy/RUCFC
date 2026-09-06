"use client";

import { useLang } from "./LangProvider";

const executives = [
  { roleKey: "board.founder", name: "ZhiYao Yan (Lucas)", linkedin: "https://www.linkedin.com/in/lucasyanzy" },
  { roleKey: "board.cto", name: "Bowen Rui", linkedin: "https://www.linkedin.com/in/bowenrui/" },
  { roleKey: "board.vp", name: "JianXia Sun (Harry)" },
  { roleKey: "board.secretary", name: "SanMu Zhang (Ethan)" },
  { roleKey: "board.treasurer", name: "ZhenHe Shi (Spark)" },
];

const cofounders = [
  "LiLi Gu (Lily)", "ShuoXin Wang (Peter)",
  "YuanYuan Meng (Emma)", "DaWei Dai (David)", "WenDing Lu (Lucas)",
  "ZhanBo Zhang (Shawn)", "LeYang Yu (Julia)", "JiaYin Wang (Jiayin)",
  "XinYan Zhang (Connie)", "MengDi Liu (Mandy)",
];

export default function Board() {
  const { t } = useLang();

  return (
    <section className="board-section" id="board">
      <div className="container">
        <div className="board-header reveal">
          <div className="section-label">{t("board.label")}</div>
          <h2 className="section-title">{t("board.title")}</h2>
          <p className="section-subtitle">{t("board.subtitle")}</p>
        </div>

        <div className="board-grid reveal-stagger">
          {executives.map((exec, i) => (
            <div key={i} className="board-card">
              <div className="board-card-role">{t(exec.roleKey)}</div>
              <div className="board-card-divider" />
              <div className="board-card-name">
                {exec.linkedin ? (
                  <a
                    href={exec.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="board-linkedin-link"
                  >
                    {exec.name}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 6, verticalAlign: "middle", opacity: 0.6 }}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                ) : (
                  exec.name
                )}
              </div>
            </div>
          ))}

          <div className="board-card board-card-wide">
            <div className="board-card-role">{t("board.cofounders")}</div>
            <div className="board-card-divider board-card-divider-wide" />
            <div className="cofounders-grid">
              {cofounders.map((name, i) => (
                <div key={i} className="cofounder-name">{name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
