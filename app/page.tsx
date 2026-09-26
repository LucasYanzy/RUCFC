"use client";

import { ThemeProvider } from "./components/ThemeProvider";
import { LangProvider } from "./components/LangProvider";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import HeroDynamic from "./components/HeroDynamic";
import TopicMarquee from "./components/TopicMarquee";
import Programs from "./components/Programs";
import Join from "./components/Join";
import Footer from "./components/Footer";
import { useScrollReveal } from "./components/useScrollReveal";
import { useCardGlow } from "./components/useCardGlow";

export default function Home() {
  useScrollReveal();
  useCardGlow();

  // Who we are, what we run, and how to join. `.site-v2` scopes the motion
  // layer in globals.css, so the same sections render unchanged on /classic.
  return (
    <ThemeProvider>
      <LangProvider>
        <div className="site-v2">
          <ScrollProgress />
          <Navbar />
          <HeroDynamic />
          <TopicMarquee />
          <Programs />
          <Join />
          <Footer alternate={{ href: "/classic/", labelKey: "footer.classic" }} />
        </div>
      </LangProvider>
    </ThemeProvider>
  );
}
