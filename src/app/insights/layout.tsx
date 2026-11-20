import type { Metadata } from "next";

const title = "Insights";
const description =
  "Build notes from the open-source tools we ship: what broke, how we fixed it, and what we would check in your stack.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/insights" },
  openGraph: {
    title: `${title} | WillowVibe Data Synapse`,
    description,
    url: "/insights",
  },
  twitter: {
    title: `${title} | WillowVibe Data Synapse`,
    description,
  },
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
