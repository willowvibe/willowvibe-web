import type { Metadata } from "next";

const title = "Products";
const description =
  "Products and client projects from WillowVibe Data Synapse, including ObservaKit, PipelineProbe, Cosmic Saju and Dikshithra Atelier.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products" },
  openGraph: { title: `${title} | WillowVibe Data Synapse`, description, url: "/products" },
  twitter: { title: `${title} | WillowVibe Data Synapse`, description },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
