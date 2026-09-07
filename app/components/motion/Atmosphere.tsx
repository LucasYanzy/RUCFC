"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

/* The luminous layer: three drifting colour bodies, a two-scale hairline grid,
   film grain at two frequencies, a vignette, and a fade into the flat canvas.
   The drift itself is CSS keyframes (cheap, always running); GSAP only adds the
   scroll-linked parallax, and only when the visitor has not asked for reduced
   motion. Nothing here carries a filter -- see motion.css for why. */

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
      {/* Two grain scales and a vignette. All three are static textures or a
          single gradient -- no filter runs after the first rasterisation. */}
      <div className="atmosphere__grain atmosphere__grain--coarse" />
      <div className="atmosphere__grain" />
      <div className="atmosphere__vignette" />
      {fade ? <div className="atmosphere__fade" /> : null}
    </div>
  );
}
