"use client";

import { useId } from "react";

/**
 * A Chinese seal (印章) in Rutgers scarlet: four characters cut white into a red
 * square, the style called 白文. Seals are read in columns from the right, so
 * `chars` goes right column top-to-bottom, then left column top-to-bottom --
 * ["华", "人", "金", "融"] reads 华人金融. A displacement filter roughens the
 * edges the way stone-cut seals print. Purely decorative.
 */
export default function Seal({
  chars,
  className,
}: {
  chars: [string, string, string, string];
  className?: string;
}) {
  const filterId = `seal-${useId().replace(/:/g, "")}`;
  const [a, b, c, d] = chars;

  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <filter id={filterId} x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="3.4" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <rect className="seal-ground" x="5" y="5" width="90" height="90" rx="6" />
        <g className="seal-chars" textAnchor="middle">
          <text x="71" y="45">{a}</text>
          <text x="71" y="86">{b}</text>
          <text x="29" y="45">{c}</text>
          <text x="29" y="86">{d}</text>
        </g>
      </g>
    </svg>
  );
}
