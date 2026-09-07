"use client";

import { useRef } from "react";
import { useLang } from "./LangProvider";
import NewsletterForm from "./NewsletterForm";
import Atmosphere from "./motion/Atmosphere";
import MaskedText from "./motion/MaskedText";
import { gsap, useGSAP } from "./motion/gsap";
import { scrollToSection } from "./motion/scroll";
import { JOIN_URL } from "@/app/lib/links";

export default function Hero() {
  const { lang, t } = useLang();
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  /* Entrance. The hero is above the fold, so it plays on load rather than on
     scroll -- the only sequence on the page that is not scroll-driven. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Reduced motion gets no entrance at all: the [data-hero] elements are
         already visible, so only the masked headline needs releasing. */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        title.current?.setAttribute("data-revealed", "true");
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          "[data-hero='badge']",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7 },
        )
          .fromTo(
            title.current?.querySelectorAll(".line-mask > span") ?? [],
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 1.15,
              ease: "power4.out",
              stagger: 0.045,
              onComplete: () =>
                title.current?.setAttribute("data-revealed", "true"),
            },
            "-=0.45",
          )
          .fromTo(
            "[data-hero='lead']",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.8 },
            "-=0.7",
          )
          .fromTo(
            "[data-hero='actions'] > *",
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 },
            "-=0.55",
          )
          .fromTo(
            "[data-hero='newsletter']",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.8 },
            "-=0.45",
          )
          .fromTo(
            "[data-hero='cue']",
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            "-=0.3",
          );

        // Content drifts up and dims as the section leaves, so the hero hands
        // off to the next block instead of simply scrolling away.
        gsap.to(content.current, {
          yPercent: -14,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });
    },
    { scope: root },
  );

  /* Switching language re-runs just the headline mask. The completed reveal
     pins the spans open with !important, so the flag comes off for the replay
     and goes back on when it lands. */
  useGSAP(
    () => {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const spans = title.current?.querySelectorAll(".line-mask > span");
      if (!spans?.length) return;

      title.current?.removeAttribute("data-revealed");
      gsap.fromTo(
        spans,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.03,
          onComplete: () =>
            title.current?.setAttribute("data-revealed", "true"),
        },
      );
    },
    { scope: root, dependencies: [lang] },
  );

  return (
    <section className="hero" id="hero" ref={root}>
      <Atmosphere />

      <div className="container">
        <div className="hero__inner" ref={content}>
          <span className="badge" data-hero="badge">
            <span className="badge__dot" />
            {t("hero.badge")}
          </span>

          <h1 className="display hero__title" ref={title} data-mask="manual">
            <MaskedText
              as="span"
              auto={false}
              className="hero__title-row"
              text={t("hero.title1")}
            />
            <MaskedText
              as="span"
              auto={false}
              mode="block"
              className="hero__title-row hero__title-accent"
              text={t("hero.title2")}
            />
          </h1>

          <p className="hero__lead" data-hero="lead">
            {t("hero.desc")}
          </p>

          <div className="hero__actions" data-hero="actions">
            <a
              className="btn btn--primary"
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("hero.cta1")}
              <span className="btn__arrow">→</span>
            </a>
            <a
              className="btn btn--secondary"
              href="#programs"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#programs");
              }}
            >
              {t("hero.cta2")}
            </a>
          </div>

          <div
            className="panel spotlight hero__newsletter"
            data-hero="newsletter"
          >
            <div className="hero__newsletter-head">
              <span className="eyebrow">{t("hero.newsletter")}</span>
            </div>
            <p className="hero__newsletter-desc">{t("hero.newsletterDesc")}</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <a
        className="hero__cue"
        href="#programs"
        data-hero="cue"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("#programs");
        }}
      >
        <span className="hero__cue-line" />
        {t("hero.scroll")}
      </a>
    </section>
  );
}
