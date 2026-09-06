"use client";

import { useLang } from "./LangProvider";
import { JOIN_URL, DISCORD_INVITE, LINKEDIN_URL } from "@/app/lib/links";
import GlareHover from "./GlareHover";
import AnimatedContent from "./AnimatedContent";

// Replaces the old Discord, LinkedIn and CTA sections. Those rendered simulated
// clients -- fake avatars, fake like buttons, a hardcoded follower count -- around
// what was really just two links. This section is those links, plus the one action
// that actually matters.
const channels = [
  {
    href: DISCORD_INVITE,
    labelKey: "join.discord",
    descKey: "join.discordDesc",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.65 12.65 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.644-1.873.891a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
      </svg>
    ),
  },
  {
    href: LINKEDIN_URL,
    labelKey: "join.linkedin",
    descKey: "join.linkedinDesc",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
      </svg>
    ),
  },
];

export default function Join() {
  const { t } = useLang();

  return (
    <section className="join-section" id="join">
      <div className="container">
        <AnimatedContent distance={60} duration={0.9} threshold={0.15}>
        <div className="join-header">
          <div className="section-label">{t("join.label")}</div>
          <h2 className="section-title">{t("join.title")}</h2>
          <p className="section-subtitle">{t("join.subtitle")}</p>
        </div>

        <div className="join-primary">
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {t("join.form")}
            <span className="btn-arrow">→</span>
          </a>
          <span className="join-primary-note">{t("join.formNote")}</span>
        </div>
        </AnimatedContent>

        <div className="join-grid">
          {channels.map((channel, i) => (
            <AnimatedContent
              key={channel.href}
              distance={40}
              duration={0.7}
              delay={i * 0.08}
              threshold={0.1}
            >
              {/* GlareHover is a div, so the anchor wraps it rather than the other
                  way round -- the sweep is decoration and the link is the element
                  that has to stay focusable and announced. */}
              <a
                className="join-card-link"
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlareHover
                  className="join-card"
                  width="100%"
                  height="100%"
                  background="var(--bg-card)"
                  borderColor="var(--border-color)"
                  borderRadius="var(--radius-card)"
                  glareColor="#ffffff"
                  glareOpacity={0.14}
                  glareAngle={-32}
                  glareSize={260}
                  transitionDuration={780}
                >
                  <span className="join-card-icon">{channel.icon}</span>
                  <span className="join-card-body">
                    <strong>{t(channel.labelKey)}</strong>
                    <span>{t(channel.descKey)}</span>
                  </span>
                  <span className="join-card-arrow" aria-hidden="true">
                    →
                  </span>
                </GlareHover>
              </a>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
