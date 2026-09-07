import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Self-hosted through next/font so there is no render-blocking request to
   fonts.googleapis.com and no layout shift when the display face lands.
   The Chinese stack stays system-only -- see the note in styles/tokens.css. */
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono-face",
});

export const metadata: Metadata = {
  title: "Rutgers Chinese Finance Club — Bridging Cultures, Advancing Careers",
  description:
    "A dynamic platform empowering Rutgers students in finance by bridging Eastern and Western business cultures.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060608" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

/* Runs before first paint so the stored theme and language are applied without
   a flash, and so `js-motion` -- the gate every hidden-until-revealed style
   sits behind -- is only ever set when scripting actually works. */
const BOOT = `(function(){
  var d = document.documentElement;
  d.classList.add('js-motion');
  try {
    var t = localStorage.getItem('rucfc-theme');
    if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
    var l = localStorage.getItem('rucfc-lang');
    if (l === 'en' || l === 'zh') d.setAttribute('lang', l);
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
