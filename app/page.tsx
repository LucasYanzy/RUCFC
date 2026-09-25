"use client";

import { ThemeProvider } from "./components/ThemeProvider";
import { LangProvider } from "./components/LangProvider";
import Navbar from "./components/Navbar";
import HomeHero from "./components/HomeHero";
import Focus from "./components/Focus";
import Join from "./components/Join";
import Footer from "./components/Footer";
import { useScrollReveal } from "./components/useScrollReveal";

const SECTIONS = [
  { labelKey: "nav.home", href: "#hero" },
  { labelKey: "nav.focus", href: "#focus" },
];

export default function Home() {
  useScrollReveal();

  // What the club does now, where it points, and how to join. `.site-v2`
  // scopes the palette and type in globals.css, so /classic keeps its own.
  return (
    <ThemeProvider>
      <LangProvider>
        <div className="site-v2">
          <Navbar items={SECTIONS} />
          <HomeHero />
          <Focus />
          <Join />
          <Footer
            descKey="footer.thesis"
            links={[...SECTIONS, { labelKey: "nav.join", href: "#join" }]}
            alternate={{ href: "/classic/", labelKey: "footer.classic" }}
          />
        </div>
      </LangProvider>
    </ThemeProvider>
  );
}
