"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { useLang } from "./LangProvider";
import logo from "@/public/logo.png";
import logoWhite from "@/public/logo-white.png";
import { JOIN_URL } from "@/app/lib/links";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { label: t("nav.home"), href: "#hero" },
    { label: t("nav.programs"), href: "#programs" },
    { label: t("nav.insights"), href: "#insights" },
    { label: t("nav.board"), href: "#board" },
    { label: t("nav.join"), href: "#join" },
  ];

  // Use white-bg logo for light theme, dark logo for dark theme
  const logoSrc = theme === "light" ? logoWhite : logo;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="container">
        <a
          href="#hero"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#hero");
          }}
        >
          <Image src={logoSrc} alt="RUCFC Logo" width={44} height={44} />
          <span>RUCFC</span>
        </a>

        <div className={`nav-links ${menuOpen ? "open" : ""}`} id="mobile-navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              {item.label}
            </a>
          ))}

          {/* Language Toggle */}
          <button
            className="toggle-btn lang-toggle"
            onClick={toggleLang}
            aria-label="Toggle language"
            title={lang === "en" ? "切换中文" : "Switch to English"}
          >
            <span className="toggle-icon">{lang === "en" ? "中" : "EN"}</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="toggle-btn theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className={`theme-icon ${theme}`}>
              <svg className="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg className="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
          </button>

          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-join-btn"
          >
            {t("nav.join")}
          </a>
        </div>

        <button
          className={`nav-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <button
          className={`nav-overlay ${menuOpen ? "open" : ""}`}
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
        />
      </div>
    </nav>
  );
}
