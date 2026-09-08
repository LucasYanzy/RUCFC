"use client";

import { useEffect } from "react";

/**
 * Observes elements with `.reveal` and `.reveal-stagger` classes,
 * adding `.visible` class when they scroll into view.
 */
export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger")
    );

    const reveal = (el: Element) => el.classList.add("visible");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    // A hidden document reports no intersections at all, so a tab restored in
    // the background can sit with whole sections stuck at opacity 0 and nothing
    // to nudge them. Sweep what is already on screen without asking the
    // observer. Anything below the fold is left alone, so it still animates.
    const sweep = () => {
      for (const el of elements) {
        if (el.classList.contains("visible")) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) reveal(el);
      }
    };

    const timer = window.setTimeout(sweep, 1200);
    document.addEventListener("visibilitychange", sweep);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", sweep);
    };
  }, []);
}
