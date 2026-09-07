"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { setLenis } from "./scroll";

/* One controller for every page-wide motion concern:
   - Lenis inertial scrolling, driven off the GSAP ticker so the two share a
     single rAF loop and never tear against each other.
   - The reveal batches that bring sections in.
   - The scroll progress rule.
   - The pointer position that .spotlight surfaces read.

   Everything scroll-linked is built inside a prefers-reduced-motion guard, so
   the reduced-motion path is not "the same animations, faster" -- it is no
   scroll animation at all. */

/* Short travel, long settle. 22px over 0.95s reads as a slide; 14px over 1.1s
   on a curve that spends most of its time decelerating reads as something
   arriving and coming to rest. The distance is what makes it look cheap, not
   the duration -- the further a thing moves the more it announces that it was
   animated. */
const REVEAL_FROM: Record<string, gsap.TweenVars> = {
  up: { opacity: 0, y: 14 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.985 },
};

function markRevealed(elements: Element[]) {
  for (const el of elements) el.setAttribute("data-revealed", "true");
}

export default function MotionProvider({ children }: { children: ReactNode }) {
  const progressRef = useRef<HTMLDivElement>(null);

  /* ---- Lenis ---- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Expo-out: fast commit, long glide. The curve is what reads as "silky".
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.7,
      autoRaf: false,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lag smoothing would let the ticker skip time after a stall, which shows
    // up as the page jumping ahead of the scroll position.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  /* ---- Reveals and scroll chrome ---- */
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      document
        .querySelectorAll("[data-reveal], [data-mask]")
        .forEach((el) => el.setAttribute("data-revealed", "true"));
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Blocks and cards.
      ScrollTrigger.batch("[data-reveal]:not([data-revealed])", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          const groups = new Map<string, Element[]>();
          for (const el of batch) {
            const key = (el as HTMLElement).dataset.reveal || "up";
            const bucket = groups.get(key);
            if (bucket) bucket.push(el);
            else groups.set(key, [el]);
          }

          for (const [key, elements] of groups) {
            gsap.fromTo(elements, REVEAL_FROM[key] ?? REVEAL_FROM.up, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.07,
              overwrite: true,
              onComplete: () => markRevealed(elements),
            });
          }
        },
      });

      // Headings whose lines rise out of a clipping mask.
      ScrollTrigger.batch('[data-mask=""]:not([data-revealed])', {
        start: "top 86%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((el, i) => {
            const parts = el.querySelectorAll(".line-mask > span");
            if (!parts.length) {
              el.setAttribute("data-revealed", "true");
              return;
            }
            gsap.fromTo(
              parts,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: 1.05,
                ease: "power4.out",
                stagger: 0.055,
                delay: i * 0.06,
                overwrite: true,
                onComplete: () => el.setAttribute("data-revealed", "true"),
              },
            );
          });
        },
      });

      // Progress rule across the top of the viewport.
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        });
      }
    });

    // Late-loading images and webfonts move every trigger position.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    /* While a tab is hidden the browser stops calling requestAnimationFrame,
       so the ticker driving Lenis and ScrollTrigger stops with it. A page
       scrolled or resized in that state comes back with correct positions but
       no update ever having run, which is how sections used to end up stuck at
       opacity 0 forever. Sweeping anything already on screen makes that
       unrecoverable state impossible rather than merely unlikely. */
    const sweep = () => {
      document
        .querySelectorAll<HTMLElement>(
          "[data-reveal]:not([data-revealed]), [data-mask]:not([data-revealed])",
        )
        .forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.setAttribute("data-revealed", "true");
          }
        });
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      ScrollTrigger.refresh();
      sweep();
    };

    const failsafe = window.setTimeout(sweep, 2600);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);

    return () => {
      window.removeEventListener("load", refresh);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
      window.clearTimeout(failsafe);
    };
  }, []);

  /* ---- Pointer position for .spotlight surfaces ----
     One delegated listener writing two custom properties. The highlight itself
     is a pseudo-element gradient, so this never triggers layout. */
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    /* Two surfaces can want the pointer at the same time: a card, and the hero
       behind it. Both are tracked so moving onto a card does not strand the
       hero glow wherever it was last seen. */
    const TRACKED = [".spotlight", ".hero"];

    let frame = 0;
    let point: { x: number; y: number } | null = null;
    let targets: HTMLElement[] = [];

    /* Rects are read here rather than in the move handler. Reading them per
       event would force layout on every pointermove; in the rAF callback it
       happens once a frame however fast the mouse is going. */
    const flush = () => {
      frame = 0;
      if (!point) return;
      for (const el of targets) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${point.x - rect.left}px`);
        el.style.setProperty("--my", `${point.y - rect.top}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      const node = event.target as HTMLElement | null;
      if (!node) return;

      const next: HTMLElement[] = [];
      for (const selector of TRACKED) {
        const el = node.closest<HTMLElement>(selector);
        if (el) next.push(el);
      }
      if (!next.length) return;

      targets = next;
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      {children}
    </>
  );
}
