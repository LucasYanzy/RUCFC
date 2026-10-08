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
        {/* Poppins is the typeface of the logo, so headings now match it. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap"
        />
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
                  if (localStorage.getItem('rucfc-lang') === 'zh') {
                    document.documentElement.lang = 'zh-CN';
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
