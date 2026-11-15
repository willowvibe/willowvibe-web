import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Products and client projects from WillowVibe Data Synapse, including ObservaKit, PipelineProbe, Cosmic Saju and Dikshithra Atelier.",
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
