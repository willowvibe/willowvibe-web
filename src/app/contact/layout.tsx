import type { Metadata } from "next";

const title = "Contact";
const description =
  "Contact WillowVibe Data Synapse at contact@willowvibe.com for data engineering, PLM and observability work.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact" },
  twitter: { title, description },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
