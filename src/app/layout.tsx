import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBotLoader } from "@/components/ChatBotLoader";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://www.willowvibe.com";
const SITE_NAME = "WillowVibe | Data Synapse";
const SITE_TITLE = "WillowVibe | Data Synapse — Data Engineering Services";
const SITE_DESCRIPTION =
  "Fixed-scope data engineering and AI on your own data: Airflow and dbt pipelines, document Q&A pilots and PLM migration checks, built on open-source tools.";
const SAME_AS = ["https://github.com/willowvibe", "https://www.linkedin.com/company/willowvibe/"];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | WillowVibe Data Synapse" },
  description: SITE_DESCRIPTION,
  authors: [{ name: "WillowVibe Data Synapse", url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      email: "contact@willowvibe.com",
      sameAs: SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: SITE_NAME,
      url: SITE_URL,
      email: "contact@willowvibe.com",
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/opengraph-image`,
      sameAs: SAME_AS,
      areaServed: ["US", "GB", "EU", "AU"],
      address: [
        {
          "@type": "PostalAddress",
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        {
          "@type": "PostalAddress",
          addressLocality: "Hilter",
          addressRegion: "Lower Saxony",
          addressCountry: "DE",
        },
      ],
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Pipeline health audit" },
          price: 1500,
          priceCurrency: "USD",
          url: `${SITE_URL}/work-with-us`,
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "AI on your data pilot" },
          priceSpecification: { "@type": "PriceSpecification", minPrice: 4000, priceCurrency: "USD" },
          url: `${SITE_URL}/work-with-us`,
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Data stack kickoff" },
          priceSpecification: { "@type": "PriceSpecification", minPrice: 6500, priceCurrency: "USD" },
          url: `${SITE_URL}/work-with-us`,
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "PLM migration readiness check" },
          priceSpecification: { "@type": "PriceSpecification", minPrice: 3000, priceCurrency: "USD" },
          url: `${SITE_URL}/work-with-us`,
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-black focus:font-semibold"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Navbar />
        <main id="main" className="pt-16 md:pt-20 min-h-screen">{children}</main>
        <Footer />
        <ChatBotLoader />
        <Analytics />
      </body>
    </html>
  );
}
