"use client";

import { ThemeProvider } from "./components/ThemeProvider";
import { LangProvider } from "./components/LangProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Programs from "./components/Programs";
import Insights from "./components/Insights";
import Join from "./components/Join";
import Footer from "./components/Footer";
import { useScrollReveal } from "./components/useScrollReveal";

export default function Home() {
  useScrollReveal();

  // Who we are, what we run, what we publish, and how to join.
  return (
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <Hero />
        <Programs />
        <Insights />
        <Join />
        <Footer />
      </LangProvider>
    </ThemeProvider>
  );
}
