"use client";

import { ThemeProvider } from "./components/ThemeProvider";
import { LangProvider } from "./components/LangProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Programs from "./components/Programs";
import Discord from "./components/Discord";
import LinkedIn from "./components/LinkedIn";
import Insights from "./components/Insights";
import CTA from "./components/CTA";
import Board from "./components/Board";
import Footer from "./components/Footer";
import { useScrollReveal } from "./components/useScrollReveal";

export default function Home() {
  useScrollReveal();

  return (
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <Hero />
        <StatsBar />
        <Programs />
        <Discord />
        <LinkedIn />
        <Insights />
        <CTA />
        <Board />
        <Footer />
      </LangProvider>
    </ThemeProvider>
  );
}
