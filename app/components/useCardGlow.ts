"use client";

import { useEffect } from "react";

/**
 * Tracks the pointer over cards, exposing its position as `--gx`/`--gy` (for a
 * spotlight that follows the cursor) and a slight 3D tilt as `--rx`/`--ry`.
 * The CSS decides what to draw with them. Skipped entirely on touch screens,
 * and the tilt is skipped when reduced motion is requested.
 */
export function useCardGlow(selector = ".site-v2 .program-card, .site-v2 .join-card") {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = Array.from(document.querySelectorAll<HTMLElement>(selector));

    const cleanups = cards.map((card) => {
      const maxTilt = card.classList.contains("program-card") ? 5 : 3;
      let raf = 0;
      let last: PointerEvent | null = null;

      const apply = () => {
        raf = 0;
        if (!last) return;
        const rect = card.getBoundingClientRect();
        const x = last.clientX - rect.left;
        const y = last.clientY - rect.top;
        card.style.setProperty("--gx", `${x.toFixed(0)}px`);
        card.style.setProperty("--gy", `${y.toFixed(0)}px`);
        if (!reduced && rect.width && rect.height) {
          card.style.setProperty("--rx", `${((0.5 - y / rect.height) * maxTilt).toFixed(2)}deg`);
          card.style.setProperty("--ry", `${((x / rect.width - 0.5) * maxTilt).toFixed(2)}deg`);
        }
      };

      const onMove = (event: PointerEvent) => {
        last = event;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      const onLeave = () => {
        last = null;
        cancelAnimationFrame(raf);
        raf = 0;
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      };

      card.addEventListener("pointermove", onMove, { passive: true });
      card.addEventListener("pointerleave", onLeave);
      return () => {
        cancelAnimationFrame(raf);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, [selector]);
}
