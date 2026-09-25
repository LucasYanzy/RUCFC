"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";
import { LAND_MASK, POLAR } from "@/app/lib/polarLand";

// The home page's map: the world seen from above the North Pole, with the
// shortest route from Rutgers to Shanghai drawn on it. That route really does
// cross the Arctic, which is why the map is polar rather than the usual flat one.

type LatLon = { lat: number; lon: number };

const NEW_BRUNSWICK: LatLon = { lat: 40.5008, lon: -74.4474 };
const SHANGHAI: LatLon = { lat: 31.2304, lon: 121.4737 };
const BEIJING: LatLon = { lat: 39.9042, lon: 116.4074 };
const SHENZHEN: LatLon = { lat: 22.5431, lon: 114.0579 };
const EARTH_RADIUS_KM = 6371.0088;

// SVG space is 100x100; the disc leaves a margin for the tick marks on its rim.
const C = 50;
const R = 45;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const n = (v: number) => v.toFixed(2);

// North-polar azimuthal equidistant: distance from the centre is distance from
// the Pole, and the angle is longitude, turned so New Brunswick points down.
// The land mask in polarLand.ts was generated with the same constants.
function project({ lat, lon }: LatLon): [number, number] {
  const r = ((90 - lat) / POLAR.colatMax) * R;
  const theta = rad(POLAR.thetaRef + (lon - POLAR.lonRef));
  return [C + r * Math.cos(theta), C - r * Math.sin(theta)];
}

const toVector = ({ lat, lon }: LatLon) => [
  Math.cos(rad(lat)) * Math.cos(rad(lon)),
  Math.cos(rad(lat)) * Math.sin(rad(lon)),
  Math.sin(rad(lat)),
];

// Points along the great circle between two places: the shortest path over
// the sphere, and roughly the one nonstop flights fly.
function greatCircle(from: LatLon, to: LatLon, steps: number) {
  const a = toVector(from);
  const b = toVector(to);
  const omega = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  const points: LatLon[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
    const s2 = Math.sin(t * omega) / Math.sin(omega);
    const v = [0, 1, 2].map((k) => s1 * a[k] + s2 * b[k]);
    points.push({ lat: deg(Math.asin(v[2])), lon: deg(Math.atan2(v[1], v[0])) });
  }
  return { points, km: omega * EARTH_RADIUS_KM };
}

// One zero-length segment per land cell; with square caps each draws a dot.
function landPath() {
  const bytes = Uint8Array.from(atob(LAND_MASK), (ch) => ch.charCodeAt(0));
  const cell = (2 * R) / POLAR.grid;
  let d = "";
  for (let i = 0; i < POLAR.grid * POLAR.grid; i++) {
    if (!((bytes[i >> 3] >> (i & 7)) & 1)) continue;
    const x = C - R + ((i % POLAR.grid) + 0.5) * cell;
    const y = C - R + (Math.floor(i / POLAR.grid) + 0.5) * cell;
    d += `M${n(x)} ${n(y)}h0`;
  }
  return d;
}

// All of this is fixed geometry, so it is worked out once per page load.
const LAND_D = landPath();
const ROUTE = greatCircle(NEW_BRUNSWICK, SHANGHAI, 120);
const ROUTE_D = ROUTE.points
  .map((p, i) => {
    const [x, y] = project(p);
    return `${i ? "L" : "M"}${n(x)} ${n(y)}`;
  })
  .join("");
const PARALLELS = [30, 60].map((lat) => ((90 - lat) / POLAR.colatMax) * R);
const MERIDIANS_D = Array.from({ length: 12 }, (_, i) => {
  const [x, y] = project({ lat: 90 - POLAR.colatMax, lon: i * 30 });
  return `M${C} ${C}L${n(x)} ${n(y)}`;
}).join("");
const TICKS_D = Array.from({ length: 36 }, (_, i) => {
  const theta = rad(POLAR.thetaRef + (i * 10 - POLAR.lonRef));
  const outer = R + (i % 3 === 0 ? 2.6 : 1.3);
  const [cos, sin] = [Math.cos(theta), Math.sin(theta)];
  return `M${n(C + R * cos)} ${n(C - R * sin)}L${n(C + outer * cos)} ${n(C - outer * sin)}`;
}).join("");

const [NB_X, NB_Y] = project(NEW_BRUNSWICK);
const [SH_X, SH_Y] = project(SHANGHAI);
const [BJ_X, BJ_Y] = project(BEIJING);
const [SZ_X, SZ_Y] = project(SHENZHEN);

/* ── Local time at each end, updated on the minute ── */

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    let interval = 0;
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);
  return now;
}

// Minutes since the epoch of the wall-clock time in a zone, so two zones can be
// subtracted to get the offset between them (12 h in summer, 13 in winter).
function wallMinutes(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute")) / 60_000;
}

function clock(date: Date, timeZone: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function zoneAbbreviation(date: Date, timeZone: string) {
  return (
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? ""
  );
}

function coordinates({ lat, lon }: LatLon, lang: string) {
  const la = Math.abs(lat).toFixed(2);
  const lo = Math.abs(lon).toFixed(2);
  if (lang === "zh") return `${lat >= 0 ? "北纬" : "南纬"} ${la}° ${lon >= 0 ? "东经" : "西经"} ${lo}°`;
  return `${la}°${lat >= 0 ? "N" : "S"} ${lo}°${lon >= 0 ? "E" : "W"}`;
}

export default function RouteMap() {
  const { t, lang } = useLang();
  const now = useNow();
  const locale = lang === "zh" ? "zh-CN" : "en-US";

  const nbZone = now ? (lang === "zh" ? t("route.nbZone") : zoneAbbreviation(now, "America/New_York")) : "";
  const ahead = now
    ? Math.round((wallMinutes(now, "Asia/Shanghai") - wallMinutes(now, "America/New_York")) / 60)
    : null;
  const km = new Intl.NumberFormat(locale).format(Math.round(ROUTE.km));
  const nameClass = (l: string) => (l === "zh" ? "route-text route-text-cn" : "route-text");

  return (
    <figure className="route-map">
      <svg className="route-svg" viewBox="0 0 100 100" role="img" aria-label={t("route.aria")}>
        <g className="route-graticule">
          {PARALLELS.map((r) => (
            <circle key={r} className="route-grid route-grid-dash" cx={C} cy={C} r={n(r)} />
          ))}
          <path className="route-grid" d={MERIDIANS_D} />
          <circle className="route-rim" cx={C} cy={C} r={R} />
          <path className="route-ticks" d={TICKS_D} />
        </g>

        <path className="route-land" d={LAND_D} />

        <g className="route-pole" aria-hidden="true">
          <path d={`M${C - 1.2} ${C}h2.4M${C} ${C - 1.2}v2.4`} />
          <text className={`${nameClass(lang)} route-text-minor`} x={C + 2} y={C - 1.4}>
            {t("route.pole")}
          </text>
        </g>

        <path className="route-arc-ghost" d={ROUTE_D} />
        <path className="route-arc" d={ROUTE_D} pathLength={1} />

        <g className="route-places">
          <circle className="route-city" cx={n(BJ_X)} cy={n(BJ_Y)} r="0.7" />
          <text className={`${nameClass(lang)} route-text-minor`} x={n(BJ_X + 1.6)} y={n(BJ_Y + 0.9)}>
            {t("route.beijing")}
          </text>
          <circle className="route-city" cx={n(SZ_X)} cy={n(SZ_Y)} r="0.7" />
          <text className={`${nameClass(lang)} route-text-minor`} x={n(SZ_X + 1.6)} y={n(SZ_Y + 0.9)}>
            {t("route.shenzhen")}
          </text>
          <text className={nameClass(lang)} x={n(SH_X - 2.6)} y={n(SH_Y + 1)} textAnchor="end">
            {t("route.sh")}
          </text>
          <text className={nameClass(lang)} x={n(NB_X + 2.6)} y={n(NB_Y + 1)}>
            {t("route.nb")}
          </text>
        </g>

        <rect className="route-marker route-marker-nb" x={n(NB_X - 1.3)} y={n(NB_Y - 1.3)} width="2.6" height="2.6" />
        <rect className="route-marker route-marker-sh" x={n(SH_X - 1.5)} y={n(SH_Y - 1.5)} width="3" height="3" />

        {/* A pulse leaves Rutgers, crosses the Arctic and lands in Shanghai, which
            answers with a ripple. Both run on the same 8 s cycle. Hidden when
            reduced motion is requested. */}
        <circle className="route-ripple" cx={n(SH_X)} cy={n(SH_Y)} r="1.5" opacity="0">
          <animate attributeName="r" values="1.5;1.5;6" keyTimes="0;0.7;1" dur="8s" begin="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;0.7;0" keyTimes="0;0.69;0.7;1" dur="8s" begin="3s" repeatCount="indefinite" />
        </circle>
        <circle className="route-traveller" r="1" opacity="0">
          <animateMotion
            path={ROUTE_D}
            dur="8s"
            begin="3s"
            repeatCount="indefinite"
            keyPoints="0;1;1"
            keyTimes="0;0.7;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0 0 1 1"
          />
          <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.06;0.66;0.7;1" dur="8s" begin="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      <figcaption className="route-caption">
        <div className="route-end">
          <strong>{t("route.nb")}</strong>
          <span className="route-alt">{t("route.nbAlt")}</span>
          <span>{coordinates(NEW_BRUNSWICK, lang)}</span>
          <span className="route-clock">
            {now ? `${clock(now, "America/New_York", locale)} ${nbZone}` : " "}
          </span>
        </div>
        <div className="route-mid">
          <strong className="route-km">
            {km} {t("route.km")}
          </strong>
          <span>{t("route.kind")}</span>
          <span className="route-clock">{ahead !== null ? t("route.ahead").replace("{h}", String(ahead)) : " "}</span>
        </div>
        <div className="route-end route-end-far">
          <strong>{t("route.sh")}</strong>
          <span className="route-alt">{t("route.shAlt")}</span>
          <span>{coordinates(SHANGHAI, lang)}</span>
          <span className="route-clock">
            {now ? `${clock(now, "Asia/Shanghai", locale)} ${t("route.shZone")}` : " "}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
