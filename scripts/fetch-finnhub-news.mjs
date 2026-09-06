import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "public", "data");
const outputFile = path.join(outputDir, "market-news.json");

const financeKeywords = [
  "market", "stock", "stocks", "share", "shares", "equity", "bank", "banks",
  "finance", "financial", "economy", "economic", "inflation", "rate", "rates",
  "bond", "bonds", "yield", "treasury", "earnings", "revenue", "profit",
  "investor", "trading", "ipo", "fund", "funds", "fed", "central bank",
  "currency", "dollar", "yuan", "renminbi", "tariff", "exports", "imports",
  "adr", "etf", "index", "futures", "analyst", "rating", "price target",
  "sector", "chip", "semiconductor", "tech", "oil", "property", "gdp",
];

const chinaKeywords = [
  "china", "chinese", "hong kong", "beijing", "shanghai", "shenzhen", "yuan",
  "renminbi", "pboc", "people's bank", "hang seng", "csi", "a-shares",
  "alibaba", "tencent", "jd.com", "baidu", "byd", "pdd", "meituan",
];

const usKeywords = [
  "u.s.", " us ", "united states", "america", "american", "wall street",
  "federal reserve", " fed ", "nasdaq", "s&p", "dow", "treasury", "dollar",
  "sec", "cpi", "jobs", "nvidia", "apple", "microsoft", "jpmorgan",
  "goldman", "bank of america", "citigroup",
];

const chinaSymbols = ["BABA", "JD", "BIDU", "PDD", "NIO", "LI"];
const usSymbols = ["SPY", "QQQ", "JPM", "NVDA", "AAPL", "MSFT"];

const fallbackItems = [
  {
    id: "fallback-china-credit",
    region: "China",
    headline: "China credit and property policy remain central to market sentiment",
    summary:
      "Investors continue watching monetary support, housing measures, and yuan stability for signals on Chinese market momentum.",
    source: "RUCFC Research Desk",
    url: "https://finnhub.io/",
    datetime: new Date().toISOString(),
  },
  {
    id: "fallback-us-rates",
    region: "United States",
    headline: "US rate expectations continue to drive equity and bond volatility",
    summary:
      "Treasury yields, inflation data, and Federal Reserve guidance remain key inputs for US financial market pricing.",
    source: "RUCFC Research Desk",
    url: "https://finnhub.io/",
    datetime: new Date().toISOString(),
  },
  {
    id: "fallback-global-flows",
    region: "Global",
    headline: "Global capital flows rotate between growth, policy, and currency themes",
    summary:
      "Cross-border investors are balancing US earnings resilience with China policy expectations and broader currency moves.",
    source: "RUCFC Research Desk",
    url: "https://finnhub.io/",
    datetime: new Date().toISOString(),
  },
];

const fallbackByRegion = new Map(fallbackItems.map((item) => [item.region, item]));

function loadLocalEnv() {
  const envPath = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }
}

function includesAny(text, keywords) {
  const value = ` ${text.toLowerCase()} `;
  return keywords.some((keyword) => value.includes(keyword));
}

function classifyRegion(articleText) {
  const hasChina = includesAny(articleText, chinaKeywords);
  const hasUS = includesAny(articleText, usKeywords);

  if (hasChina && hasUS) return "Global";
  if (hasChina) return "China";
  if (hasUS) return "United States";
  return "Global";
}

function cleanText(value, fallback) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text || fallback;
}

function cleanSummary(value, headline) {
  let summary = cleanText(value, "Read the full article for details.");

  if (summary.toLowerCase().endsWith(headline.toLowerCase())) {
    summary = summary.slice(0, -headline.length).trim();
  }

  const maxLength = 220;
  return summary.length > maxLength ? `${summary.slice(0, maxLength).trim()}...` : summary;
}

function normalizeArticle(article, forcedRegion) {
  const text = `${article.headline ?? ""} ${article.summary ?? ""} ${article.related ?? ""}`;
  const region = forcedRegion ?? classifyRegion(text);
  const headline = cleanText(article.headline, "Market update");

  return {
    id: String(article.id ?? article.url ?? article.headline),
    region,
    headline,
    summary: cleanSummary(article.summary, headline),
    source: cleanText(article.source, "Finnhub"),
    url: article.url || "https://finnhub.io/",
    datetime: article.datetime
      ? new Date(article.datetime * 1000).toISOString()
      : new Date().toISOString(),
  };
}

function rankArticle(article) {
  const text = `${article.headline} ${article.summary}`.toLowerCase();
  let score = 0;
  for (const keyword of financeKeywords) if (text.includes(keyword)) score += 2;
  for (const keyword of chinaKeywords) if (text.includes(keyword)) score += 3;
  for (const keyword of usKeywords) if (text.includes(keyword)) score += 3;
  if (article.region === "China" || article.region === "United States") score += 2;
  return score;
}

function hasFinanceSignal(article) {
  return includesAny(`${article.headline} ${article.summary}`, financeKeywords);
}

function pickBalancedArticles(articles) {
  const seen = new Set();
  const ranked = articles
    .map((article) => ({ article, score: rankArticle(article) }))
    .filter(({ article, score }) => article.headline && article.url && score >= 3 && hasFinanceSignal(article))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.article.datetime).getTime() - new Date(a.article.datetime).getTime();
    })
    .map(({ article }) => article)
    .filter((article) => {
      const key = `${article.headline.toLowerCase()}-${article.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const fillRegion = (region, count) => {
    const selected = ranked.filter((article) => article.region === region).slice(0, count);
    const fallback = fallbackByRegion.get(region);
    if (selected.length === 0 && fallback) selected.push(fallback);
    return selected;
  };

  const china = fillRegion("China", 3);
  const us = fillRegion("United States", 3);
  const global = fillRegion("Global", 3);
  const merged = [...china, ...us, ...global];

  return (merged.length ? merged : fallbackItems).slice(0, 9);
}

async function fetchMarketNews(apiKey) {
  const url = new URL("https://finnhub.io/api/v1/news");
  url.searchParams.set("category", "general");
  url.searchParams.set("token", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Finnhub request failed with ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Finnhub response was not an array.");
  }

  return payload.map(normalizeArticle);
}

function formatDate(value) {
  return value.toISOString().slice(0, 10);
}

function daysAgo(days) {
  const value = new Date();
  value.setUTCDate(value.getUTCDate() - days);
  return value;
}

async function fetchCompanyNews(apiKey, symbol, region) {
  const url = new URL("https://finnhub.io/api/v1/company-news");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("from", formatDate(daysAgo(21)));
  url.searchParams.set("to", formatDate(new Date()));
  url.searchParams.set("token", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${symbol} company-news request failed with ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error(`${symbol} company-news response was not an array.`);
  }

  return payload.map((article) =>
    normalizeArticle(
      {
        ...article,
        related: `${article.related ?? ""} ${symbol}`,
      },
      region
    )
  );
}

async function fetchSymbolNews(apiKey, symbols, region) {
  const results = [];

  for (const symbol of symbols) {
    try {
      results.push(...(await fetchCompanyNews(apiKey, symbol, region)));
    } catch (error) {
      console.warn(`[news] ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return results;
}

async function fetchFinnhubNews(apiKey) {
  const [marketNews, chinaCompanyNews, usCompanyNews] = await Promise.all([
    fetchMarketNews(apiKey),
    fetchSymbolNews(apiKey, chinaSymbols, "China"),
    fetchSymbolNews(apiKey, usSymbols, "United States"),
  ]);

  return [...marketNews, ...chinaCompanyNews, ...usCompanyNews];
}

// Real articles already on disk beat three placeholders. Returns them only when
// a previous run actually reached Finnhub.
function existingFinnhubNews() {
  try {
    const data = JSON.parse(fs.readFileSync(outputFile, "utf8"));
    if (data.source === "finnhub" && Array.isArray(data.items) && data.items.length) {
      return data;
    }
  } catch {
    // No usable file yet -- placeholders it is.
  }
  return null;
}

async function main() {
  loadLocalEnv();
  const apiKey = process.env.FINNHUB_API_KEY;
  let source = "fallback";
  let items = fallbackItems;

  if (apiKey) {
    try {
      items = pickBalancedArticles(await fetchFinnhubNews(apiKey));
      source = "finnhub";
    } catch (error) {
      console.warn(`[news] ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    console.warn("[news] FINNHUB_API_KEY is not set.");
  }

  if (source !== "finnhub") {
    // Leave the file untouched rather than overwriting real articles -- and
    // rather than stamping a fresh generatedAt onto stale ones, which would
    // show the site's "Updated" line as today.
    const existing = existingFinnhubNews();
    if (existing) {
      console.warn(
        `[news] Keeping ${existing.items.length} existing articles from ${existing.generatedAt}.`
      );
      return;
    }
    console.warn("[news] No existing articles to keep. Writing placeholders.");
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source,
        items,
      },
      null,
      2
    )
  );

  console.log(`[news] Wrote ${items.length} items to ${path.relative(rootDir, outputFile)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
