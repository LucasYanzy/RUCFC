"use client";

import { ThemeProvider } from "./components/ThemeProvider";
import { LangProvider } from "./components/LangProvider";
import MotionProvider from "./components/motion/MotionProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Programs from "./components/Programs";
import Join from "./components/Join";
import Footer from "./components/Footer";
import Ticker from "./components/reserved/Ticker";
import Stats from "./components/reserved/Stats";
import About from "./components/reserved/About";
import Timeline from "./components/reserved/Timeline";
import Speakers from "./components/reserved/Speakers";
import Faq from "./components/reserved/Faq";
import { SECTIONS } from "./lib/site";

/* Who we are, what we run, and how to join.
   The reserved blocks are wired in page order so that switching one on in
   lib/site.ts drops it into the right place with no further edits. */
export default function Home() {
  return (
    <ThemeProvider>
      <LangProvider>
        <MotionProvider>
          <Navbar />
          <main>
            <Hero />
            {SECTIONS.ticker && <Ticker />}
            {SECTIONS.stats && <Stats />}
            {SECTIONS.about && <About />}
            <Programs />
            {SECTIONS.timeline && <Timeline />}
            {SECTIONS.speakers && <Speakers />}
            {SECTIONS.faq && <Faq />}
            <Join />
          </main>
          <Footer />
        </MotionProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
