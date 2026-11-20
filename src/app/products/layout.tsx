import type { Metadata } from "next";

const title = "Products";
const description =
  "Products and client projects from WillowVibe Data Synapse, including ObservaKit, PipelineProbe, Cosmic Saju and Dikshithra Atelier.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products" },
  openGraph: { title, description, url: "/products" },
  twitter: { title, description },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
