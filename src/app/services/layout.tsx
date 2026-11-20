import type { Metadata } from "next";

const title = "Services";
const description =
  "Data engineering and AI on your own data for small teams, with fixed scope and fixed prices. Backed by open-source tools we ship.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: { title: `${title} | WillowVibe Data Synapse`, description, url: "/services" },
  twitter: { title: `${title} | WillowVibe Data Synapse`, description },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
