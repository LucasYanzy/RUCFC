"use client";

import { ThemeProvider } from "./components/ThemeProvider";
import { LangProvider } from "./components/LangProvider";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Programs from "./components/Programs";
import Insights from "./components/Insights";
import Board from "./components/Board";
import Join from "./components/Join";
import Footer from "./components/Footer";
import { useScrollReveal } from "./components/useScrollReveal";

export default function Home() {
  useScrollReveal();

  // Who we are, what we run, what we publish, who runs it, how to join. Board
  // comes before Join so the ask lands after the reader knows who is asking.
  return (
    <ThemeProvider>
      <LangProvider>
        <Navbar />
        <Hero />
        <Programs />
        <Insights />
        <Board />
        <Join />
        <Footer />
      </LangProvider>
    </ThemeProvider>
  );
}
