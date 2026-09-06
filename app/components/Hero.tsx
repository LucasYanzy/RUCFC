"use client";

import { useLang } from "./LangProvider";
import NewsletterForm from "./NewsletterForm";
import { JOIN_URL } from "@/app/lib/links";
import LightRays from "./LightRays";
import SafeVisual, { useWebGLSupport } from "./SafeVisual";
import MaskedHeading from "./MaskedHeading";
import SpecularButton from "./SpecularButton";
import StarBorder from "./StarBorder";
import mesh from "@/public/mesh.svg";

// Fourth background this section has had: a hand-rolled canvas mesh, Aurora,
// DarkVeil, now LightRays. DarkVeil looked right but could not be made to obey
// the palette -- it paints a fixed blue-violet field and exposes only a hue
// rotation, so scarlet was reachable only by guessing at a rotation in YIQ
// space, and every guess landed on green or magenta. LightRays takes the colour
// as a hex, so #CC0033 is #CC0033. Volumetric beams also read as depth rather
// than as a coloured sheet, which is the actual problem being solved here.
export default function Hero() {
  const { t, lang } = useLang();
  const webgl = useWebGLSupport();

  return (
    <section className="hero" id="hero">
      <div className="hero-veil" aria-hidden="true">
        {webgl && (
        <SafeVisual>
        <LightRays
          raysOrigin="top-center"
          raysColor="#cc0033"
          raysSpeed={0.7}
          lightSpread={0.85}
          rayLength={2.4}
          fadeDistance={1.1}
          saturation={0.85}
          followMouse
          mouseInfluence={0.08}
          noiseAmount={0.06}
          distortion={0.04}
        />
        </SafeVisual>
        )}
      </div>

      <div className="hero-content">
        <StarBorder
          as="div"
          className="hero-badge-star animate-float-in"
          color="#cc0033"
          speed="6s"
          thickness={1}
          backgroundColor="var(--bg-card)"
          textColor="var(--text-secondary)"
          borderColor="var(--border-color)"
        >
          <span className="dot" />
          {t("hero.badge")}
        </StarBorder>

        {/* The headline is a window onto public/mesh.svg rather than a block of
            solid colour -- that mesh is built from the Rutgers scarlet, dark red
            and dark grey, so the type is lit by brand colour instead of painted
            with it. `lang` in the key forces a clean re-measure on toggle, since
            the mask is laid out per glyph. */}
        <MaskedHeading
          key={`mh-${lang}`}
          className="hero-masked"
          text={`${t("hero.title1")} ${t("hero.title2")}`}
          tag="h1"
          src={mesh.src}
          align="center"
          weight={400}
          reveal="rise"
          trigger="mount"
          duration={1.1}
          stagger={0.05}
          parallax={18}
          drift={14}
          textScale={0.125}
          tracking={-0.018}
          lineHeight={1.04}
        />

        <p className="animate-hero-desc hero-lede">{t("hero.desc")}</p>

        <div className="hero-buttons animate-hero-buttons">
          <SpecularButton
            
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            radius={6}
            baseColor="#cc0033"
            tint="#ff2d55"
            tintOpacity={0.25}
            textColor="#ffffff"
            lineColor="#ffffff"
            intensity={1.15}
          >
            {t("hero.cta1")}
          </SpecularButton>

          <SpecularButton
            
            href="#programs"
            size="lg"
            radius={6}
            baseColor="#222222"
            tint="#ffffff"
            tintOpacity={0.06}
            textColor="var(--text-primary)"
            lineColor="#ffffff"
            intensity={0.7}
          >
            {t("hero.cta2")}
          </SpecularButton>
        </div>

        <div className="hero-newsletter animate-hero-buttons">
          <div className="hero-newsletter-label">{t("hero.newsletter")}</div>
          <p className="hero-newsletter-desc">{t("hero.newsletterDesc")}</p>
          <NewsletterForm />
        </div>
      </div>

      <a href="#programs" className="scroll-arrow animate-hero-buttons" aria-label="Scroll down">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  );
}
