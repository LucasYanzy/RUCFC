import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RUCFC — Chinese Markets, AI & Global Business | Rutgers",
  description:
    "Explore Chinese markets, practical AI in finance, business culture, and career connections with Rutgers Chinese Finance Club. Open to all Rutgers students; no Chinese language skills or finance background required.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.dataset.motion = 'off';
                try {
                  var t = localStorage.getItem('rucfc-theme');
                  if (t === 'light' || t === 'dark') {
                    document.documentElement.setAttribute('data-theme', t);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
