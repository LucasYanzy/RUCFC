"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { useLang } from "./LangProvider";
import { gsap, ScrollTrigger, useGSAP } from "./motion/gsap";
import { scrollToSection } from "./motion/scroll";
import { JOIN_URL } from "@/app/lib/links";
import logo from "@/public/logo.png";
import logoWhite from "@/public/logo-white.png";

const NAV_ITEMS = [
  { key: "nav.home", href: "#hero" },
  { key: "nav.programs", href: "#programs" },
  { key: "nav.join", href: "#join" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");
  const navRef = useRef<HTMLElement>(null);

  /* Scrolled state and retract-on-descend. Both are attribute flips rather
     than React state so the scroll handler never re-renders the tree. */
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      ScrollTrigger.create({
        // The bar sits above every section and changes no layout, so it
        // refreshes first and cannot disturb the sections' measurements.
        refreshPriority: -1,
        start: 24,
        end: "max",
        onUpdate: (self) => {
          nav.dataset.scrolled = String(self.scroll() > 24);
          // Never retract while the mobile sheet is hanging off the bar.
          const retract =
            self.direction === 1 && self.scroll() > 420 && nav.dataset.menu !== "open";
          nav.dataset.hidden = String(retract);
        },
        onLeaveBack: () => {
          nav.dataset.scrolled = "false";
          nav.dataset.hidden = "false";
        },
      });

      for (const item of NAV_ITEMS) {
        const section = document.querySelector<HTMLElement>(item.href);
        if (!section) continue;
        ScrollTrigger.create({
          refreshPriority: -1,
          trigger: section,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActive(item.href);
          },
        });
      }
    },
    { scope: navRef },
  );

  /* Mobile sheet: lock the page, close on Escape, and close if a resize takes
     the viewport back to the desktop layout while the sheet is open. */
  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    if (navRef.current) navRef.current.dataset.menu = open ? "open" : "closed";

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 860 && setOpen(false);

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  /* The bar itself drops in once, after the hero type has started moving. */
  useGSAP(() => {
    gsap.fromTo(
      navRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, delay: 0.35, ease: "power3.out" },
    );
  }, {});

  const go = (href: string) => {
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      <nav className="nav" ref={navRef} data-scrolled="false" data-hidden="false">
        <div className="container">
          <a
            className="nav__brand"
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("#hero");
            }}
          >
            <Image
              src={theme === "light" ? logoWhite : logo}
              alt=""
              width={30}
              height={30}
              priority
            />
            <span>RUCFC</span>
          </a>

          <div className="nav__links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                className="nav__link"
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.href);
                }}
              >
                {t(item.key)}
              </a>
            ))}
          </div>

          <div className="nav__tools">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleLang}
              aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
            >
              <span className="icon-btn__label">{lang === "en" ? "中" : "EN"}</span>
            </button>

            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              <span className="theme-swap" data-theme={theme}>
                <svg
                  className="icon-sun"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
                <svg
                  className="icon-moon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
              </span>
            </button>

            <a
              className="btn btn--primary btn--sm"
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("nav.joinCta")}
            </a>
          </div>

          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="nav-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        className="nav__scrim"
        data-open={open}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <div className="nav__sheet" id="nav-sheet" data-open={open} inert={!open || undefined}>
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item.href}
            className="nav__sheet-link"
            href={item.href}
            style={{ "--delay": `${80 + i * 60}ms` } as React.CSSProperties}
            onClick={(e) => {
              e.preventDefault();
              go(item.href);
            }}
          >
            {t(item.key)}
          </a>
        ))}
        <a
          className="btn btn--primary"
          style={{ marginTop: "var(--s-4)" }}
          href={JOIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          {t("nav.joinCta")}
          <span className="btn__arrow">→</span>
        </a>
      </div>
    </>
  );
}
