"use client";

import { ThemeProvider } from "./components/ThemeProvider";
import { LangProvider } from "./components/LangProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Programs from "./components/Programs";
import Join from "./components/Join";
import Footer from "./components/Footer";
import Noise from "./components/Noise";

export default function Home() {

  // Who we are, what we run, and how to join.
  return (
    <ThemeProvider>
      <LangProvider>
        {/* The grain sits over everything at a very low alpha. It is the cheapest
            and most effective fix for the flat, moulded look: real surfaces have
            noise, and a page composited entirely from solid fills does not. */}
        <Noise patternSize={220} patternAlpha={9} patternRefreshInterval={3} />

        <Navbar />
        <Hero />
        <Programs />
        <Join />
        <Footer />
      </LangProvider>
    </ThemeProvider>
  );
}
