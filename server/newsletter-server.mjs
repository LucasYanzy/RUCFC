import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const maxBodyBytes = 64 * 1024;
const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://lucasyanzy.github.io",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function getAllowedOrigins() {
  return (process.env.NEWSLETTER_ALLOWED_ORIGINS || defaultAllowedOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(req) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  const allowAny = allowedOrigins.includes("*");
  const allowedOrigin = origin && (allowAny || allowedOrigins.includes(origin)) ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Vary": "Origin",
  };
}

function isOriginAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes("*") || allowedOrigins.includes(origin);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = "";

    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > maxBodyBytes) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function cleanString(value, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

function normalizeSubscription(payload) {
  const email = cleanString(payload.email).toLowerCase();

  if (!emailPattern.test(email)) {
    const error = new Error("Invalid email address.");
    error.statusCode = 400;
    throw error;
  }

  return {
    email,
    list: cleanString(payload.list, "RUCFC Newsletter"),
    language: cleanString(payload.language, "en").slice(0, 8),
    source: cleanString(payload.source, "rucfc-website").slice(0, 80),
    page: cleanString(payload.page || payload.url).slice(0, 500),
    createdAt: new Date().toISOString(),
  };
}

async function postWebhook(subscription) {
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (process.env.NEWSLETTER_WEBHOOK_SECRET) {
    headers["X-Newsletter-Secret"] = process.env.NEWSLETTER_WEBHOOK_SECRET;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw new Error(`Newsletter webhook rejected the request with ${response.status}.`);
  }

  return true;
}

function getGitHubConfig() {
  const token = process.env.NEWSLETTER_GITHUB_TOKEN;
  const owner = process.env.NEWSLETTER_GITHUB_OWNER;
  const repo = process.env.NEWSLETTER_GITHUB_REPO;

  if (!token || !owner || !repo) return null;

  return {
    token,
    owner,
    repo,
    branch: process.env.NEWSLETTER_GITHUB_BRANCH || "main",
    filePath: process.env.NEWSLETTER_GITHUB_PATH || "newsletter/subscribers.json",
  };
}

async function fetchGitHubSubscribers(config) {
  const url = new URL(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}`
  );
  url.searchParams.set("ref", config.branch);

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "rucfc-newsletter-server",
    },
  });

  if (response.status === 404) {
    return {
      sha: undefined,
      data: {
        updatedAt: null,
        subscribers: [],
      },
    };
  }

  if (!response.ok) {
    throw new Error(`GitHub storage read failed with ${response.status}.`);
  }

  const payload = await response.json();
  const content = Buffer.from(String(payload.content || ""), "base64").toString("utf8");
  const data = content ? JSON.parse(content) : { subscribers: [] };

  if (!Array.isArray(data.subscribers)) data.subscribers = [];

  return {
    sha: payload.sha,
    data,
  };
}

async function storeGitHub(subscription) {
  const config = getGitHubConfig();
  if (!config) return false;

  const { sha, data } = await fetchGitHubSubscribers(config);
  const existing = data.subscribers.find((item) => item.email?.toLowerCase() === subscription.email);

  if (existing) {
    existing.lastSeenAt = subscription.createdAt;
    existing.language = subscription.language;
    existing.source = subscription.source;
    existing.count = Number(existing.count || 1) + 1;
  } else {
    data.subscribers.push({
      ...subscription,
      firstSeenAt: subscription.createdAt,
      lastSeenAt: subscription.createdAt,
      count: 1,
    });
  }

  data.updatedAt = subscription.createdAt;
  data.subscribers.sort((a, b) => String(a.email).localeCompare(String(b.email)));

  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.filePath}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "rucfc-newsletter-server",
      },
      body: JSON.stringify({
        message: "Update RUCFC newsletter subscribers",
        content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
        branch: config.branch,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub storage write failed with ${response.status}.`);
  }

  return true;
}

async function storeLocal(subscription) {
  const localFile = process.env.NEWSLETTER_LOCAL_FILE;
  if (!localFile) return false;

  const filePath = path.resolve(localFile);
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  let data = { updatedAt: null, subscribers: [] };
  try {
    data = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    // Local file storage is only a development fallback.
  }

  if (!Array.isArray(data.subscribers)) data.subscribers = [];

  const existing = data.subscribers.find((item) => item.email?.toLowerCase() === subscription.email);
  if (existing) {
    existing.lastSeenAt = subscription.createdAt;
    existing.count = Number(existing.count || 1) + 1;
  } else {
    data.subscribers.push({ ...subscription, firstSeenAt: subscription.createdAt, count: 1 });
  }

  data.updatedAt = subscription.createdAt;
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return true;
}

async function storeResend(subscription) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return false;

  const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    // Resend keys contacts by address, so re-adding one that is already in the
    // audience returns that same contact rather than duplicating it. A repeat
    // signup therefore needs no membership check first.
    body: JSON.stringify({ email: subscription.email, unsubscribed: false }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Resend storage write failed with ${response.status}.${detail ? ` ${detail.slice(0, 200)}` : ""}`
    );
  }

  return true;
}

// Every configured backend runs, rather than the first one winning, so a local
// file kept alongside a remote list stays a complete backup of it. Writing the
// same address twice is harmless: GitHub and Resend both key subscribers by
// address, and storeLocal counts repeats instead of appending them.
const backends = [
  // Disk first. An address that reached the local file can always be replayed
  // to a remote list afterwards; the reverse leaves nothing to replay from.
  ["local", storeLocal],
  ["resend", storeResend],
  ["webhook", postWebhook],
  ["github", storeGitHub],
];

async function storeSubscription(subscription) {
  const storedIn = [];
  const failures = [];

  for (const [name, store] of backends) {
    try {
      if (await store(subscription)) storedIn.push(name);
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
    }
  }

  if (failures.length) {
    console.error(`[newsletter] ${subscription.email}: ${failures.join("; ")}`);
  }

  // A partial failure is not worth rejecting the visitor's signup: if any
  // backend took the address it is not lost, and the log above names the ones
  // that still need reconciling.
  if (storedIn.length === 0) {
    const error = new Error(
      failures.length
        ? "Every configured newsletter store failed."
        : "Newsletter storage is not configured."
    );
    error.statusCode = 503;
    throw error;
  }

  return storedIn.join("+");
}

async function handleNewsletter(req, res) {
  const headers = corsHeaders(req);

  if (!isOriginAllowed(req)) {
    jsonResponse(res, 403, { ok: false, error: "Origin is not allowed." }, headers);
    return;
  }

  const body = await readBody(req);
  const payload = body ? JSON.parse(body) : {};
  const subscription = normalizeSubscription(payload);
  const storedIn = await storeSubscription(subscription);

  jsonResponse(res, 200, { ok: true, storedIn }, headers);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS" && req.url === "/api/newsletter") {
      res.writeHead(204, corsHeaders(req));
      res.end();
      return;
    }

    if (req.method === "POST" && req.url === "/api/newsletter") {
      await handleNewsletter(req, res);
      return;
    }

    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      jsonResponse(res, 200, { ok: true, service: "rucfc-newsletter" });
      return;
    }

    jsonResponse(res, 404, { ok: false, error: "Not found." });
  } catch (error) {
    const status = Number(error.statusCode || 500);
    const message =
      status >= 500 ? "Newsletter service is unavailable." : error.message || "Request failed.";
    jsonResponse(res, status, { ok: false, error: message }, corsHeaders(req));
  }
});

server.listen(port, host, () => {
  console.log(`RUCFC newsletter server listening on ${host}:${port}`);
});
