import type { Metadata } from "next";

const title = "About Us";
const description =
  "Meet the WillowVibe Data Synapse team — the data engineers and builders behind our services, products and client projects.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: `${title} | WillowVibe Data Synapse`, description, url: "/about" },
  twitter: { title: `${title} | WillowVibe Data Synapse`, description },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
