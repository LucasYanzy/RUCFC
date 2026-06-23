"use client";

import { useEffect } from "react";

/**
 * Observes elements with `.reveal` and `.reveal-stagger` classes,
 * adding `.visible` class when they scroll into view.
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    const elements = document.querySelectorAll(".reveal, .reveal-stagger");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
