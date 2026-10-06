"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { DISCORD_INVITE, LINKEDIN_URL } from "@/app/lib/links";
import logo from "@/public/logo.png";

// The newsletter form moved to the Join section, which is where someone reading
// top to bottom is ready to act. The Instagram and WeChat icons that used to sit
// here were href="#" -- no account exists yet, so they are gone rather than dead.
// `alternate` links to the other version of the site -- the classic page points
// at the current one and vice versa. It goes through next/link so the basePath
// is applied; a bare relative href would break when the URL has no trailing slash.
export default function Footer({
  alternate,
}: {
  alternate?: { href: string; labelKey: string };
}) {
  const { t } = useLang();

  const links = [
    { href: "#hero", label: t("nav.home") },
    { href: "#programs", label: t("nav.programs") },
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
            {alternate && (
              <Link href={alternate.href} className="footer-alt-link">
                {t(alternate.labelKey)}
              </Link>
            )}
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
