"use client";

import Image from "next/image";
import { useLang } from "./LangProvider";
import NewsletterForm from "./NewsletterForm";
import logo from "@/public/logo.png";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-section">
            <div className="footer-logo">
              <Image src={logo} alt="RUCF" width={40} height={40} />
              <span>Rutgers Chinese Finance Club</span>
            </div>
            <p>{t("footer.desc")}</p>
          </div>

          <div className="footer-col">
            <h4>{t("footer.links")}</h4>
            <a href="#hero">{t("nav.home")}</a>
            <a href="#programs">{t("nav.programs")}</a>
            <a href="#insights">{t("nav.insights")}</a>
            <a href="#board">{t("nav.board")}</a>
          </div>

          <div className="footer-col">
            <h4>{t("footer.newsletter")}</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "8px" }}>
              {t("footer.newsletterDesc")}
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t("footer.copyright")}</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="https://www.linkedin.com/company/rutgers-chinese-finance-club/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="WeChat">💬</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
