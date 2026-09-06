"use client";

import { useTheme } from "./ThemeProvider";
import { useLang } from "./LangProvider";
import SpecularButton from "./SpecularButton";
import CardNav, { type CardNavItem } from "./CardNav";
import logo from "@/public/logo.png";
import logoWhite from "@/public/logo-white.png";
import { JOIN_URL, DISCORD_INVITE, LINKEDIN_URL } from "@/app/lib/links";

// The hand-rolled navbar this replaces was a fixed bar, a hamburger, a slide-in
// panel and an overlay -- about 150 lines of layout and focus handling. CardNav
// is one component that covers all of it, so the state, the resize listener, the
// Escape handler and the body scroll lock are gone with it.
//
// Two things it does not do out of the box: hold the theme and language toggles,
// and treat its call to action as a link. Both are local additions to
// CardNav.tsx -- `slot` and `ctaHref` -- rather than markup bolted on around it.
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  const items: CardNavItem[] = [
    {
      label: t("nav.explore"),
      bgColor: "var(--bg-card)",
      textColor: "var(--text-primary)",
      links: [
        { label: t("nav.home"), href: "#hero", ariaLabel: t("nav.home") },
        { label: t("nav.programs"), href: "#programs", ariaLabel: t("nav.programs") },
      ],
    },
    {
      label: t("nav.community"),
      bgColor: "var(--bg-elevated)",
      textColor: "var(--text-primary)",
      links: [
        { label: t("join.discord"), href: DISCORD_INVITE, ariaLabel: t("join.discord") },
        { label: t("join.linkedin"), href: LINKEDIN_URL, ariaLabel: t("join.linkedin") },
      ],
    },
    {
      label: t("nav.getStarted"),
      bgColor: "var(--accent-deep)",
      textColor: "#ffffff",
      links: [
        { label: t("join.form"), href: JOIN_URL, ariaLabel: t("join.form") },
        { label: t("nav.join"), href: "#join", ariaLabel: t("nav.join") },
      ],
    },
  ];

  const toggles = (
    <>
      <button
        className="toggle-btn lang-toggle"
        onClick={toggleLang}
        aria-label="Toggle language"
        title={lang === "en" ? "切换中文" : "Switch to English"}
      >
        <span className="toggle-icon">{lang === "en" ? "中" : "EN"}</span>
      </button>

      <button
        className="toggle-btn theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className={`theme-icon ${theme}`}>
          <svg className="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg className="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </button>
    </>
  );

  return (
    <CardNav
      // Static imports rather than "/logo.png": they carry the basePath, which
      // is "/preview" on this deploy and "/RUCFC" on Pages.
      logo={(theme === "light" ? logoWhite : logo).src}
      logoAlt="RUCFC"
      items={items}
      slot={toggles}
      ctaNode={
        <SpecularButton
          className="nav-cta"
          href={JOIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          radius={6}
          baseColor="#cc0033"
          tint="#ff2d55"
          tintOpacity={0.25}
          textColor="#ffffff"
          lineColor="#ffffff"
          intensity={1.15}
        >
          {t("nav.join")}
        </SpecularButton>
      }
      baseColor="var(--nav-bg-solid)"
      menuColor="var(--text-primary)"
    />
  );
}
