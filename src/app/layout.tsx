import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { MotionProvider } from "@/components/MotionProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://www.willowvibe.com";
const SITE_DESCRIPTION =
  "WillowVibe Data Synapse is your dedicated data engineering team. We build resilient cloud lakehouses, automate complex data pipelines, and eliminate data silos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "WillowVibe | Data Synapse — Data Engineering Services", template: "%s | WillowVibe Data Synapse" },
  description: SITE_DESCRIPTION,
  keywords: ["data engineering", "data pipeline", "cloud lakehouse", "ETL ELT", "Snowflake", "Databricks", "AWS data engineering", "WillowVibe"],
  authors: [{ name: "WillowVibe Data Synapse", url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: "WillowVibe | Data Synapse", title: "WillowVibe | Data Synapse — Architecting the Data Ecosystem of Tomorrow", description: "Your dedicated data engineering team." },
  twitter: {
    card: "summary_large_image",
    title: "WillowVibe | Data Synapse — Data Engineering Services",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WillowVibe | Data Synapse",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  email: "contact@willowvibe.com",
  sameAs: ["https://github.com/willowvibe", "https://www.linkedin.com/company/willowvibe/"],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <MotionProvider>
          <Navbar />
          <main id="main" className="pt-16 md:pt-20 min-h-screen">{children}</main>
          <Footer />
          <ChatBot />
        </MotionProvider>
      </body>
    </html>
  );
}
