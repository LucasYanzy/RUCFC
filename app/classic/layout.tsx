import type { Metadata } from "next";

// Same content as the home page, so keep it out of search results rather than
// have it compete with the page it is an older copy of.
export const metadata: Metadata = {
  title: "Rutgers Chinese Finance Club — Classic",
  robots: { index: false, follow: true },
};

export default function ClassicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
