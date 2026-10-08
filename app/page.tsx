"use client";

import { ThemeProvider } from "./components/ThemeProvider";
import { LangProvider } from "./components/LangProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Programs from "./components/Programs";
import Join from "./components/Join";
import Footer from "./components/Footer";
import { useScrollReveal } from "./components/useScrollReveal";

export default function Home() {
  useScrollReveal();

  // Who we are, what we run, and how to join.
  return (
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <Hero />
        <Ticker />
        <Programs />
        <Join />
        <Footer />
      </LangProvider>
    </ThemeProvider>
  );
}
