import type { Metadata } from "next";

const title = "Work with us";
const description =
  "Fixed-price data and AI engagements: AI pilots, pipeline audits, data stack builds and PLM migration checks, built on open-source tools we've shipped.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work-with-us" },
  openGraph: { title: `${title} | WillowVibe Data Synapse`, description, url: "/work-with-us" },
  twitter: { title: `${title} | WillowVibe Data Synapse`, description },
};

export default function WorkWithUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
