"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

/* The luminous layer: three drifting colour bodies, a hairline grid, film
   grain, and a fade into the flat canvas. The drift itself is CSS keyframes
   (cheap, always running); GSAP only adds the scroll-linked parallax, and only
   when the visitor has not asked for reduced motion. */

export default function Atmosphere({
  parallax = true,
  grid = true,
  fade = true,
}: {
  parallax?: boolean;
  grid?: boolean;
  fade?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!parallax) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".atmosphere__aurora", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    },
    { scope: root, dependencies: [parallax] },
  );

  return (
    <div className="atmosphere" ref={root} aria-hidden="true">
      <div className="atmosphere__aurora">
        <div className="atmosphere__blob atmosphere__blob--a" />
        <div className="atmosphere__blob atmosphere__blob--b" />
        <div className="atmosphere__blob atmosphere__blob--c" />
      </div>
      {grid ? <div className="atmosphere__grid" /> : null}
      <div className="atmosphere__grain" />
      {fade ? <div className="atmosphere__fade" /> : null}
    </div>
  );
}
