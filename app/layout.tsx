import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rutgers Chinese Finance Club — Bridging Cultures, Advancing Careers",
  description:
    "A dynamic platform empowering Rutgers students in finance by bridging Eastern and Western business cultures.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                document.documentElement.classList.add('js-reveal');
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
      <body>{children}</body>
    </html>
  );
}
