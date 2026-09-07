"use client";

import { createElement, Fragment, type ElementType, type ReactNode } from "react";

/* Splits a string into tokens, each wrapped in its own clipping mask, so a
   heading can rise out of an invisible edge one token at a time instead of
   fading in as a block. MotionProvider animates the inner spans.

   English splits on whitespace. Chinese has none, so it splits per character --
   which happens to be the better-looking reveal for it anyway. */

const CJK = /[　-〿㐀-䶿一-鿿＀-￯]/;

function tokenize(text: string): { token: string; space: boolean }[] {
  if (!text.includes(" ") && CJK.test(text)) {
    return Array.from(text).map((token) => ({ token, space: false }));
  }
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((token, i) => ({ token, space: i < words.length - 1 }));
}

export default function MaskedText({
  as = "span",
  text,
  className,
  auto = true,
  mode = "tokens",
}: {
  as?: ElementType;
  text: string;
  className?: string;
  /** Leave false when a local timeline drives this heading instead of the
      page-wide batch in MotionProvider -- the hero does exactly that. Such a
      heading still needs data-mask="manual" on its own root so the failsafe
      sweep can rescue it; see Hero. */
  auto?: boolean;
  /** "block" keeps the whole string inside one mask. Needed wherever the line
      carries a background-clip gradient, which cannot survive being cut into
      per-token clipping boxes. */
  mode?: "tokens" | "block";
}) {
  if (mode === "block") {
    return createElement(
      as,
      { className, ...(auto ? { "data-mask": "" } : {}) },
      <span className="line-mask">
        <span>{text}</span>
      </span>,
    );
  }

  const children: ReactNode[] = tokenize(text).map(({ token, space }, i) => (
    <Fragment key={`${token}-${i}`}>
      <span className="line-mask line-mask--token">
        <span>{token}</span>
      </span>
      {space ? " " : null}
    </Fragment>
  ));

  return createElement(as, { className, ...(auto ? { "data-mask": "" } : {}) }, children);
}
