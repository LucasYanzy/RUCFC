import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rutgers Chinese Finance Club — From Rutgers to China",
  description:
    "Educating and connecting the Rutgers community to advanced education and opportunities to work in China, across Chinese finance, AI and innovation, exchange, and supply chains.",
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
