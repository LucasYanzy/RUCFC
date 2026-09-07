"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* Registering twice is harmless but pointless, so every module imports the
   already-registered gsap from here instead of calling registerPlugin itself. */
gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Defaults tuned once: a long decelerating ease is what makes the whole page
   feel like one motion system rather than a pile of separate animations. */
gsap.defaults({ ease: "power3.out", duration: 0.9 });

export const EASE = "power3.out";
export const EASE_SOFT = "power2.out";

export { gsap, ScrollTrigger, useGSAP };
