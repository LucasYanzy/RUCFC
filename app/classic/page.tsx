"use client";

import { ThemeProvider } from "../components/ThemeProvider";
import { LangProvider } from "../components/LangProvider";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Programs from "../components/Programs";
import Join from "../components/Join";
import Footer from "../components/Footer";
import { useScrollReveal } from "../components/useScrollReveal";

// The site as it was before the dynamic hero, kept on its own route rather than
// deleted. It composes the same sections the home page used to, with the
// original Hero, and none of the .site-v2 styling applies here.
export default function ClassicHome() {
  useScrollReveal();

  return (
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <Hero />
        <Programs />
        <Join />
        <Footer alternate={{ href: "/", labelKey: "footer.newVersion" }} />
      </LangProvider>
    </ThemeProvider>
  );
}
