import type { Metadata } from "next";

const title = "About Us";
const description =
  "Meet the WillowVibe Data Synapse team — the data engineers and builders behind our services, products and client projects.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about" },
  twitter: { title, description },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
