"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "./LangProvider";

type NewsRegion = "All" | "China" | "United States" | "Global";

type MarketNewsItem = {
  id: string;
  region: Exclude<NewsRegion, "All">;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: string;
};

type MarketNewsPayload = {
  generatedAt: string;
  source: string;
  items: MarketNewsItem[];
};

const fallbackNews: MarketNewsPayload = {
  generatedAt: new Date().toISOString(),
  source: "fallback",
  items: [
    {
      id: "fallback-china",
      region: "China",
      headline: "China credit and policy signals remain key for market sentiment",
      summary:
        "Investors are watching monetary support, property-sector measures, and yuan stability for signals on Chinese financial markets.",
      source: "RUCFC Research Desk",
      url: "https://finnhub.io/",
      datetime: new Date().toISOString(),
    },
    {
      id: "fallback-us",
      region: "United States",
      headline: "US rates and earnings expectations drive cross-asset pricing",
      summary:
        "Treasury yields, Federal Reserve guidance, and corporate earnings remain core drivers for US equity and bond markets.",
      source: "RUCFC Research Desk",
      url: "https://finnhub.io/",
      datetime: new Date().toISOString(),
    },
  ],
};

export default function Insights() {
  const { t, lang } = useLang();
  const [news, setNews] = useState<MarketNewsPayload>(fallbackNews);
  const [activeRegion, setActiveRegion] = useState<NewsRegion>("All");

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      try {
        const response = await fetch("data/market-news.json", { cache: "no-store" });
        if (!response.ok) throw new Error("News file unavailable.");
        const payload = (await response.json()) as MarketNewsPayload;
        if (!cancelled && Array.isArray(payload.items) && payload.items.length > 0) {
          setNews(payload);
        }
      } catch {
        if (!cancelled) setNews(fallbackNews);
      }
    }

    loadNews();
    return () => {
      cancelled = true;
    };
  }, []);

  const regions: NewsRegion[] = ["All", "China", "United States", "Global"];
  const visibleNews = useMemo(
    () =>
      activeRegion === "All"
        ? news.items
        : news.items.filter((item) => item.region === activeRegion),
    [activeRegion, news.items]
  );

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

  return (
    <section className="insights-section" id="insights">
      <div className="container">
        <div className="insights-header reveal">
          <div>
            <div className="section-label">{t("insights.label")}</div>
            <h2 className="section-title">{t("insights.title")}</h2>
          </div>
          <p className="section-subtitle insights-subtitle">
            {t("insights.subtitle")}
          </p>
        </div>

        <div className="market-news reveal">
          <div className="market-news-header">
            <div>
              <div className="section-label">{t("news.label")}</div>
              <h3>{t("news.title")}</h3>
              <p>{t("news.subtitle")}</p>
            </div>
            <div className="news-updated">
              <span>{t("news.updated")}</span>
              <strong>{formatDate(news.generatedAt)}</strong>
            </div>
          </div>

          <div className="news-tabs" aria-label={t("news.regionFilter")}>
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                className={activeRegion === region ? "active" : ""}
                onClick={() => setActiveRegion(region)}
              >
                {t(`news.region.${region}`)}
              </button>
            ))}
          </div>

          <div className="news-grid">
            {visibleNews.map((item) => (
              <a
                className="news-card"
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="news-card-meta">
                  <span>{t(`news.region.${item.region}`)}</span>
                  <span>{item.source}</span>
                  <span>{formatDate(item.datetime)}</span>
                </div>
                <h4>{item.headline}</h4>
                <p>{item.summary}</p>
                <div className="news-card-link">{t("news.readMore")} →</div>
              </a>
            ))}
          </div>

          <div className="market-news-footnote">
            {news.source === "finnhub" ? t("news.poweredBy") : t("news.fallback")}
          </div>
        </div>
      </div>
    </section>
  );
}
