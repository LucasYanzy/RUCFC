"use client";

import Image from "next/image";
import { useLang } from "./LangProvider";
import { scrollToSection } from "./motion/scroll";
import { DISCORD_INVITE, LINKEDIN_URL } from "@/app/lib/links";
import logo from "@/public/logo.png";

/* The newsletter form lives in the hero, where someone is still deciding.
   Instagram and WeChat are absent because no account exists yet -- a dead
   href="#" icon is worse than no icon. */
export default function Footer() {
  const { t } = useLang();

  const links = [
    { href: "#hero", label: t("nav.home") },
    { href: "#programs", label: t("nav.programs") },
    { href: "#join", label: t("nav.joinCta") },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div data-reveal="up">
            <span className="footer__brand">
              <Image src={logo} alt="" width={34} height={34} />
              Rutgers Chinese Finance Club
            </span>
            <p className="footer__desc">{t("footer.desc")}</p>
          </div>

          <nav className="footer__col" data-reveal="up">
            <h4>{t("footer.links")}</h4>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p>{t("footer.copyright")}</p>
          <div className="footer__socials">
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <span className="footer__wordmark" aria-hidden="true" data-reveal="fade">
          RUCFC
        </span>
      </div>
    </footer>
  );
}
