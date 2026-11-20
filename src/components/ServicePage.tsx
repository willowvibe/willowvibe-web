import Link from "next/link";
import { ArrowRight, ChevronDown, Clock, ExternalLink } from "lucide-react";
import { BOOKING_URL } from "@/lib/site";
import {
  HOURLY_OPTION,
  OFFERS,
  RETAINER_OPTION,
  offerPrice,
  type Offer,
  type Option,
} from "@/lib/offers";
import { TrackedLink } from "@/components/TrackedLink";
import type { Service, ServiceProof } from "@/lib/services";

const SITE_URL = "https://www.willowvibe.com";
const ORGANIZATION_NAME = "WillowVibe | Data Synapse";

function proofLinkLabel(proof: ServiceProof): string {
  if (proof.href.includes("github.com")) {
    return `View ${proof.title} on GitHub`;
  }
  if (proof.href.includes("vercel.app")) {
    return `Open the ${proof.title} demo`;
  }
  return `Open ${proof.title}`;
}

function buildStructuredData(service: Service) {
  const pageUrl = `${SITE_URL}/services/${service.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.name,
        description: service.metaDescription,
        provider: {
          "@type": "Organization",
          name: ORGANIZATION_NAME,
          url: SITE_URL,
        },
        areaServed: ["US", "GB", "EU", "AU"],
        url: pageUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${SITE_URL}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export function ServicePage({ service }: { service: Service }) {
  const relatedOffers = service.relatedOfferSlugs
    .map((slug) => OFFERS.find((offer) => offer.slug === slug))
    .filter((offer): offer is Offer => Boolean(offer));

  const relatedOptions: Option[] = [];
  if (service.relatedOptions?.includes("hourly")) {
    relatedOptions.push(HOURLY_OPTION);
  }
  if (service.relatedOptions?.includes("retainer")) {
    relatedOptions.push(RETAINER_OPTION);
  }

  const structuredData = buildStructuredData(service);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white overflow-x-hidden">
      <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400">
            <li>
              <Link href="/" className="hover:text-cyan-300 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-600">
              ›
            </li>
            <li>
              <Link href="/services" className="hover:text-cyan-300 transition-colors">
                Services
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-600">
              ›
            </li>
            <li aria-current="page" className="text-gray-200">
              {service.name}
            </li>
          </ol>
        </nav>

        <header className="relative">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <h1 className="relative text-3xl md:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {service.h1}
          </h1>
          <p className="relative mt-4 text-gray-300 text-base md:text-lg leading-relaxed">
            {service.summary}
          </p>
        </header>

        <section className="mt-10 md:mt-14">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
            The problem
          </h2>
          <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
            {service.problem.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mt-10 md:mt-14">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
            How we work
          </h2>
          <ol className="space-y-4">
            {service.approach.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-xl bg-neutral-900 border border-white/10 p-4 md:p-5"
              >
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xs font-mono font-bold"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 md:mt-14">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
            What you get
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 rounded-xl bg-white/[0.02] border border-white/10 p-4 text-sm text-gray-300 leading-relaxed"
              >
                <span aria-hidden="true" className="text-cyan-400 mt-0.5">
                  ▸
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 md:mt-14">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
            Proof you can inspect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.proof.map((proof) => (
              <a
                key={`${proof.title}-${proof.href}`}
                href={proof.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col rounded-xl bg-neutral-900 border border-white/10 p-5 hover:border-cyan-400/40 transition-colors"
              >
                <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-2">
                  {proof.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                  {proof.fact}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 group-hover:gap-3 transition-all">
                  {proofLinkLabel(proof)}
                  <ExternalLink size={12} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {(relatedOffers.length > 0 || relatedOptions.length > 0) && (
          <section className="mt-10 md:mt-14">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
              Related engagements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedOffers.map((offer) => (
                <Link
                  key={offer.slug}
                  href="/work-with-us"
                  className="group flex flex-col rounded-xl bg-neutral-900 border border-cyan-500/30 p-5 hover:border-cyan-400/60 transition-colors"
                >
                  <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-2">
                    {offer.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                    <span className="text-lg font-extrabold text-white">
                      {offerPrice(offer)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300">
                      <Clock size={12} aria-hidden="true" /> {offer.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                    {offer.audience}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 group-hover:gap-3 transition-all">
                    See the offer <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </Link>
              ))}
              {relatedOptions.map((option) => (
                <Link
                  key={option.name}
                  href="/work-with-us"
                  className="group flex flex-col rounded-xl bg-neutral-900 border border-purple-500/30 p-5 hover:border-purple-400/60 transition-colors"
                >
                  <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-2">
                    {option.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                    <span className="text-lg font-extrabold text-white">
                      {option.price}
                    </span>
                    {option.duration && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-300">
                        <Clock size={12} aria-hidden="true" /> {option.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                    {option.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-300 group-hover:gap-3 transition-all">
                    See the options <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 md:mt-14">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
            Tools
          </h2>
          <ul className="flex flex-wrap gap-2">
            {service.tools.map((tool) => (
              <li
                key={tool}
                className="text-xs font-mono px-3 py-1.5 rounded-full border border-cyan-900/50 bg-cyan-950/30 text-cyan-300"
              >
                {tool}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 md:mt-14">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-3">
            {service.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl bg-neutral-900 border border-white/10 open:border-cyan-400/40 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-sm md:text-base font-semibold text-white [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className="flex-shrink-0 text-cyan-300 transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <p className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 md:mt-16">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 p-6 md:p-10 text-center">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
                Book a 30-minute call
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6">
                Tell us about the data and the result you need. We send a fixed
                quote within 48 hours of the call.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <TrackedLink
                  href={BOOKING_URL}
                  event="book_call_click"
                  props={{ location: `service-${service.slug}` }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition-all text-sm shadow-[0_0_25px_rgba(34,211,238,0.3)]"
                >
                  Book a 30-minute call <ArrowRight size={15} aria-hidden="true" />
                </TrackedLink>
                <Link
                  href="/work-with-us"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-white/15 text-gray-200 font-bold rounded-xl hover:border-cyan-400 hover:text-white hover:scale-105 transition-all text-sm"
                >
                  See all offers <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
