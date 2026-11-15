import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Data engineering, PLM and observability services — resilient pipelines, cloud data platforms, migrations and monitoring built for small teams.",
  alternates: { canonical: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
