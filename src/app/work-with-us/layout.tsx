import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work with us",
  description:
    "Fixed-scope, fixed-price data and AI engagements. AI pilots, pipeline audits, data stack builds and PLM migration readiness checks, built on open-source tools we've shipped.",
  alternates: { canonical: "/work-with-us" },
};

export default function WorkWithUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
