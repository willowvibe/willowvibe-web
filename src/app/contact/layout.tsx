import type { Metadata } from "next";

const title = "Contact";
const description =
  "Contact WillowVibe Data Synapse at contact@willowvibe.com for data engineering, PLM and observability work.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: `${title} | WillowVibe Data Synapse`, description, url: "/contact" },
  twitter: { title: `${title} | WillowVibe Data Synapse`, description },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
