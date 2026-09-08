"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { useLang } from "./LangProvider";

type Point = { x: number; y: number; z: number };
type Coordinate = [number, number];
type RGB = [number, number, number];
const RAD = Math.PI / 180;

// Simplified coastlines, sampled locally so the globe needs no map service.
const LAND: Coordinate[][] = [
  [
    [-168, 72],
    [-145, 72],
    [-128, 69],
    [-111, 73],
    [-92, 80],
    [-72, 77],
    [-60, 62],
    [-57, 52],
    [-67, 45],
    [-78, 33],
    [-81, 25],
    [-96, 17],
    [-104, 20],
    [-117, 32],
    [-124, 47],
    [-133, 55],
    [-151, 60],
    [-165, 60],
  ],
  [
    [-98, 22],
    [-88, 21],
    [-85, 15],
    [-77, 8],
    [-83, 8],
    [-92, 15],
  ],
  [
    [-81, 11],
    [-72, 12],
    [-61, 9],
    [-51, 3],
    [-35, -6],
    [-38, -20],
    [-48, -29],
    [-54, -39],
    [-68, -55],
    [-75, -47],
    [-73, -28],
    [-81, -5],
  ],
  [
    [-52, 60],
    [-43, 60],
    [-22, 74],
    [-25, 82],
    [-48, 84],
    [-61, 76],
  ],
  [
    [-11, 36],
    [-9, 44],
    [-2, 49],
    [8, 54],
    [5, 59],
    [16, 71],
    [30, 71],
    [41, 65],
    [42, 54],
    [32, 46],
    [27, 41],
    [20, 39],
    [14, 42],
    [9, 44],
    [3, 41],
  ],
  [
    [-8, 50],
    [-2, 50],
    [0, 58],
    [-5, 59],
  ],
  [
    [-24, 63],
    [-14, 64],
    [-15, 67],
    [-23, 67],
  ],
  [
    [-17, 36],
    [10, 37],
    [25, 32],
    [35, 31],
    [44, 12],
    [51, 11],
    [42, -5],
    [36, -19],
    [29, -34],
    [18, -35],
    [11, -18],
    [9, 3],
    [-1, 5],
    [-11, 5],
    [-17, 15],
  ],
  [
    [33, 31],
    [43, 30],
    [58, 22],
    [50, 13],
    [43, 13],
  ],
  [
    [28, 41],
    [36, 52],
    [31, 68],
    [59, 74],
    [91, 78],
    [117, 73],
    [142, 73],
    [169, 67],
    [179, 64],
    [177, 51],
    [156, 52],
    [145, 44],
    [140, 35],
    [128, 39],
    [123, 31],
    [119, 22],
    [108, 20],
    [108, 10],
    [100, 5],
    [97, 18],
    [90, 22],
    [81, 7],
    [75, 10],
    [68, 24],
    [57, 27],
    [50, 39],
    [39, 42],
  ],
  [
    [130, 31],
    [136, 35],
    [140, 41],
    [145, 44],
    [144, 36],
    [137, 32],
  ],
  [
    [119, 19],
    [123, 18],
    [126, 8],
    [122, 5],
    [119, 11],
  ],
  [
    [97, 5],
    [104, 0],
    [106, -6],
    [114, -8],
    [122, -9],
    [127, -5],
    [118, 0],
    [111, 2],
    [108, 7],
  ],
  [
    [130, -3],
    [141, -3],
    [151, -9],
    [143, -10],
    [135, -6],
  ],
  [
    [113, -22],
    [121, -16],
    [131, -12],
    [139, -17],
    [145, -15],
    [153, -27],
    [149, -38],
    [138, -36],
    [131, -32],
    [116, -35],
  ],
  [
    [166, -35],
    [173, -40],
    [178, -39],
    [173, -45],
    [167, -47],
    [165, -43],
  ],
  [
    [44, -13],
    [50, -15],
    [49, -24],
    [44, -26],
  ],
];

function inside(lon: number, lat: number, polygon: Coordinate[]) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      result = !result;
  }
  return result;
}

function sphere(lon: number, lat: number): Point {
  return {
    x: Math.cos(lat * RAD) * Math.sin(lon * RAD),
    y: Math.sin(lat * RAD),
    z: Math.cos(lat * RAD) * Math.cos(lon * RAD),
  };
}

const DOTS: { point: Point; land: boolean }[] = [];
for (let lat = -57; lat <= 81; lat += 1.9) {
  const step = 1.9 / Math.max(0.2, Math.cos(lat * RAD));
  for (let lon = -180; lon < 180; lon += step) {
    const land = LAND.some((polygon) => inside(lon, lat, polygon));
    DOTS.push({ point: sphere(lon, lat), land });
  }
}

const NEW_YORK = sphere(-74.006, 40.713);
const SHANGHAI = sphere(121.474, 31.23);
const LONDON = sphere(-0.128, 51.507);
const SINGAPORE = sphere(103.82, 1.35);

function route(start: Point, end: Point, height: number) {
  const angle = Math.acos(
    Math.max(
      -1,
      Math.min(1, start.x * end.x + start.y * end.y + start.z * end.z),
    ),
  );
  return Array.from({ length: 101 }, (_, index) => {
    const t = index / 100;
    const a = Math.sin((1 - t) * angle) / Math.sin(angle);
    const b = Math.sin(t * angle) / Math.sin(angle);
    const lift = 1 + Math.sin(t * Math.PI) * height;
    return {
      x: (a * start.x + b * end.x) * lift,
      y: (a * start.y + b * end.y) * lift,
      z: (a * start.z + b * end.z) * lift,
    };
  });
}

const ROUTES = [
  route(NEW_YORK, SHANGHAI, 0.24),
  route(NEW_YORK, LONDON, 0.13),
  route(SHANGHAI, SINGAPORE, 0.16),
];
const LATITUDES = Array.from({ length: 7 }, (_, n) =>
  Array.from({ length: 121 }, (_, i) => sphere(i * 3, n * 20 - 60)),
);
const LONGITUDES = Array.from({ length: 12 }, (_, n) =>
  Array.from({ length: 61 }, (_, i) => sphere(n * 30, i * 3 - 90)),
);

function blendColor(dark: RGB, light: RGB, amount: number) {
  return dark
    .map((channel, index) =>
      (channel + (light[index] - channel) * amount).toFixed(3),
    )
    .join(",");
}

export default function Globe({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { lang } = useLang();
  const settings = useRef({ paused, theme });
  const refresh = useRef<() => void>(() => {});

  useEffect(() => {
    settings.current = { paused, theme };
    refresh.current();
  }, [paused, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motion.matches;
    let visible = true;
    let width = 600;
    let height = 490;
    let radius = 190;
    let centerX = 300;
    let centerY = 245;
    let rotation = -30 * RAD;
    let tilt = 50 * RAD;
    let pointerX = 0;
    let pointerY = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let disposed = false;

    function motionDisabled() {
      return reduced || document.documentElement.dataset.motion === "off";
    }

    function project(point: Point) {
      const sin = Math.sin(rotation + parallaxX * 0.04);
      const cos = Math.cos(rotation + parallaxX * 0.04);
      const x = point.x * cos + point.z * sin;
      const z = point.z * cos - point.x * sin;
      const pitch = tilt + parallaxY * 0.025;
      const y = point.y * Math.cos(pitch) - z * Math.sin(pitch);
      return {
        x: centerX + x * radius,
        y: centerY - y * radius,
        z: point.y * Math.sin(pitch) + z * Math.cos(pitch),
      };
    }

    function drawLine(
      points: Point[],
      color: string,
      lineWidth = 0.55,
      frontOnly = true,
    ) {
      ctx!.beginPath();
      let penDown = false;
      for (const point of points) {
        const p = project(point);
        if (frontOnly && p.z < 0) {
          penDown = false;
          continue;
        }
        if (penDown) ctx!.lineTo(p.x, p.y);
        else ctx!.moveTo(p.x, p.y);
        penDown = true;
      }
      ctx!.strokeStyle = color;
      ctx!.lineWidth = lineWidth;
      ctx!.stroke();
    }

    function draw() {
      if (disposed) return;
      // Share the page's rendered progress, including interrupted transitions.
      const themeProgress = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--theme-progress",
        ),
      );
      const themeAmount = Number.isFinite(themeProgress)
        ? Math.max(0, Math.min(1, themeProgress))
        : settings.current.theme === "dark"
          ? 0
          : 1;
      const ink = blendColor([216, 222, 231], [47, 52, 61], themeAmount);
      const red = blendColor([203, 65, 83], [177, 36, 56], themeAmount);
      const core = blendColor([3, 4, 5], [248, 249, 250], themeAmount);
      const headColor = blendColor([248, 250, 253], [177, 36, 56], themeAmount);
      ctx!.clearRect(0, 0, width, height);

      // A solid core and hairline silhouette keep the continents crisp.
      ctx!.beginPath();
      ctx!.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgb(${core})`;
      ctx!.fill();
      ctx!.strokeStyle = `rgba(${ink},${0.14 + 0.06 * themeAmount})`;
      ctx!.lineWidth = 0.65;
      ctx!.stroke();

      for (const points of LATITUDES) {
        drawLine(points, `rgba(${ink},.024)`, 0.45, false);
        drawLine(points, `rgba(${ink},.09)`, 0.5);
      }
      for (const points of LONGITUDES) {
        drawLine(points, `rgba(${ink},.018)`, 0.45, false);
        drawLine(points, `rgba(${ink},.075)`, 0.5);
      }

      const dotScale = radius / 210;
      for (const { point, land } of DOTS) {
        const p = project(point);
        if (p.z < 0) continue;
        // Dense silver land, barely visible ocean; no scanning or color wash.
        const size = land ? (0.67 + p.z * 0.34) * dotScale : 0.34 * dotScale;
        const alpha = land ? 0.18 + p.z * 0.62 : 0.025 + p.z * 0.035;
        ctx!.fillStyle = `rgba(${ink},${alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx!.fill();
      }

      ROUTES.forEach((points, index) => {
        drawLine(
          points,
          `rgba(${red},${index === 0 ? 0.68 : 0.38})`,
          index === 0 ? 0.95 : 0.7,
        );
        const head = ((elapsed * 0.105 + index * 0.3 + 0.28) % 1) * 100;
        const tailStart = Math.max(0, Math.floor(head) - 9);
        for (let at = tailStart; at < Math.floor(head); at++) {
          const strength = 1 - (head - at) / 10;
          drawLine(
            points.slice(at, at + 2),
            `rgba(${ink},${strength * 0.55})`,
            1.1,
          );
        }
        const low = Math.floor(head);
        const fraction = head - low;
        const a = points[low];
        const b = points[Math.min(low + 1, 100)];
        const p = project({
          x: a.x + (b.x - a.x) * fraction,
          y: a.y + (b.y - a.y) * fraction,
          z: a.z + (b.z - a.z) * fraction,
        });
        if (p.z > 0) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, index === 0 ? 2.1 : 1.6, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${headColor},.96)`;
          ctx!.fill();
        }
      });

      for (const city of [
        { point: NEW_YORK, label: "NEW YORK", side: -1 },
        { point: SHANGHAI, label: "SHANGHAI", side: 1 },
      ]) {
        const p = project(city.point);
        if (p.z < 0.015) continue;
        const fade = Math.min(1, p.z * 6);
        ctx!.font = `${width < 420 ? 8 : 9}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        const labelWidth = ctx!.measureText(city.label).width;
        const minX = city.side < 0 ? labelWidth + 18 : 18;
        const maxX = city.side > 0 ? width - labelWidth - 18 : width - 18;
        const endX = Math.max(minX, Math.min(maxX, p.x + city.side * 28));
        const endY = Math.max(26, p.y - 24);
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(endX, endY);
        ctx!.lineTo(endX + city.side * 12, endY);
        ctx!.strokeStyle = `rgba(${ink},${0.35 * fade})`;
        ctx!.lineWidth = 0.6;
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${red},${fade})`;
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${red},${0.3 * fade})`;
        ctx!.lineWidth = 0.7;
        ctx!.stroke();
        ctx!.textAlign = city.side < 0 ? "right" : "left";
        ctx!.textBaseline = "bottom";
        ctx!.fillStyle = `rgba(${ink},${0.78 * fade})`;
        ctx!.fillText(city.label, endX + city.side * 5, endY - 5);
      }
    }

    function shouldAnimate() {
      return (
        !disposed &&
        !settings.current.paused &&
        !motionDisabled() &&
        visible &&
        !document.hidden
      );
    }

    function tick(time: number) {
      frame = 0;
      if (!shouldAnimate()) {
        lastTime = 0;
        return;
      }
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.04) : 0;
      lastTime = time;
      elapsed += delta;
      if (!dragging) rotation += delta * 0.035;
      parallaxX += (pointerX - parallaxX) * 0.045;
      parallaxY += (pointerY - parallaxY) * 0.045;
      draw();
      frame = requestAnimationFrame(tick);
    }

    function update() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      draw();
      if (shouldAnimate()) frame = requestAnimationFrame(tick);
    }
    refresh.current = update;

    function resize() {
      const bounds = canvas!.getBoundingClientRect();
      width = bounds.width || 600;
      height = bounds.height || 490;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width * 0.425, height * 0.425);
      centerX = width * 0.5;
      centerY = height * 0.525;
      update();
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      canvas!.setPointerCapture(event.pointerId);
      canvas!.style.cursor = "grabbing";
    }
    function onPointerMove(event: PointerEvent) {
      const bounds = canvas!.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / width - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / height - 0.5) * 2;
      if (dragging) {
        rotation += (event.clientX - previousX) * 0.006;
        tilt = Math.max(
          -0.6,
          Math.min(1.2, tilt + (event.clientY - previousY) * 0.003),
        );
        previousX = event.clientX;
        previousY = event.clientY;
        if (!shouldAnimate()) draw();
      }
    }
    function onPointerUp() {
      dragging = false;
      canvas!.style.cursor = "grab";
    }
    function onPointerLeave() {
      pointerX = 0;
      pointerY = 0;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      if (event.key === "ArrowLeft") rotation -= 0.15;
      if (event.key === "ArrowRight") rotation += 0.15;
      if (event.key === "ArrowUp") tilt = Math.min(1.2, tilt + 0.1);
      if (event.key === "ArrowDown") tilt = Math.max(-0.6, tilt - 0.1);
      draw();
    }
    function onMotionChange() {
      reduced = motion.matches;
      update();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const motionObserver = new MutationObserver(update);
    motionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("resize", resize, { passive: true });
    motion.addEventListener("change", onMotionChange);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("lostpointercapture", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("keydown", onKeyDown);
    resize();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      refresh.current = () => {};
      resizeObserver.disconnect();
      motionObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("lostpointercapture", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="globe-canvas"
      role="img"
      tabIndex={0}
      aria-label={
        lang === "zh"
          ? "连接纽约与上海的交互地球。拖动或使用方向键旋转。"
          : "Interactive globe connecting New York and Shanghai. Drag or use arrow keys to rotate."
      }
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        cursor: "grab",
        touchAction: "pan-y",
      }}
    />
  );
}
