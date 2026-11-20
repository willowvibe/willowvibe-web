import type { Metadata } from "next";
import { FAQ } from "@/lib/faq";

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function WorkWithUsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
