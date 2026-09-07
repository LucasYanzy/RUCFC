"use client";

import type Lenis from "lenis";

/* Lenis owns the scroll position once it starts, so anything that wants to move
   the page -- nav links, the hero scroll cue -- has to go through it rather
   than through scrollIntoView, which Lenis would immediately fight. This module
   holds the single instance and the one helper everything else calls. */

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

/** Scrolls to an in-page target, clearing the fixed navbar. */
export function scrollToSection(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;

  const navH = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
    10,
  );
  const offset = -(Number.isFinite(navH) ? navH : 64) - 12;

  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.1 });
    return;
  }

  // No Lenis: reduced motion, or the bundle has not hydrated yet.
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "auto" });
}
