import type { Metadata } from "next";

const title = "Services";
const description =
  "Data engineering, PLM and observability services — resilient pipelines, cloud data platforms, migrations and monitoring built for small teams.";

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
