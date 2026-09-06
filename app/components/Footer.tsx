"use client";

import Image from "next/image";
import { useLang } from "./LangProvider";
import { DISCORD_INVITE, LINKEDIN_URL } from "@/app/lib/links";
import logo from "@/public/logo.png";

// The newsletter form moved to the Join section, which is where someone reading
// top to bottom is ready to act. The Instagram and WeChat icons that used to sit
// here were href="#" -- no account exists yet, so they are gone rather than dead.
export default function Footer() {
  const { t } = useLang();

  const links = [
    { href: "#hero", label: t("nav.home") },
    { href: "#programs", label: t("nav.programs") },
    { href: "#insights", label: t("nav.insights") },
    { href: "#join", label: t("nav.join") },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-section">
            <div className="footer-logo">
              <Image src={logo} alt="RUCFC" width={40} height={40} />
              <span>Rutgers Chinese Finance Club</span>
            </div>
            <p>{t("footer.desc")}</p>
          </div>

          <div className="footer-col">
            <h4>{t("footer.links")}</h4>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t("footer.copyright")}</p>
          <div className="footer-socials">
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
