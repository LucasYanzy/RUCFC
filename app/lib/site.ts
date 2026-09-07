/* Which sections are switched on.
   The reserved blocks below are built, styled, translated and wired -- they are
   simply not rendered yet, because they need real club content (numbers, event
   dates, speaker names) before they can go live. Flip a flag to ship one; no
   other change is needed. */

export const SECTIONS = {
  ticker: false,
  stats: false,
  about: false,
  timeline: false,
  speakers: false,
  faq: false,
} as const;

export type SectionKey = keyof typeof SECTIONS;
