import { Server, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BOOKING_URL } from "@/lib/site";
import { OFFERS, offerPrice } from "@/lib/offers";
import { TOOLS } from "@/lib/tools";
import { CAPABILITIES } from "@/lib/home";
import { Reveal } from "@/components/Reveal";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { TrackedLink } from "@/components/TrackedLink";

function CoreCapabilitiesIDE() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {CAPABILITIES.map((pillar, idx) => (
          <Reveal
            key={pillar.id}
            delay={idx * 80}
            className={`group relative flex flex-col rounded-2xl bg-neutral-900 border ${pillar.accent} ${pillar.glow} transition-all duration-500 overflow-hidden hover:-translate-y-2 ${idx < 2 ? "lg:col-span-3" : "lg:col-span-2"} ${idx === CAPABILITIES.length - 1 ? "md:col-span-2 lg:col-span-2" : ""}`}
          >
            {/* Illustration area */}
            <div className={`w-full flex items-center justify-center p-8 ${pillar.iconBg} border-b border-white/5`}>
              <Image
                src={pillar.illustration}
                alt={pillar.alt}
                width={160}
                height={160}
                className="w-40 h-40 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content area */}
            <div className="flex flex-col flex-grow p-6">
              <h3 className="text-lg font-bold text-white mb-3 leading-tight">
                {pillar.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-grow">
                {pillar.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {pillar.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-mono px-2 py-1 rounded border ${pillar.tagColor}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={pillar.href}
                className={`inline-flex items-center gap-2 text-xs font-mono font-bold px-4 py-2 rounded-lg border-2 ${pillar.tagColor} hover:scale-105 hover:opacity-90 transition-all mt-auto shadow-sm`}
              >
                Explore {pillar.title} <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>

            {/* Bottom glow line */}
            <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 `} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white overflow-x-hidden selection:bg-cyan-400/30">

      {/* 1. HERO */}
      <section className="relative w-full max-w-7xl mx-auto px-4 pt-8 pb-2 md:pt-24 md:pb-8 text-left">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2">
            <div className="w-full max-w-xl mx-auto md:mx-0 relative mb-6 md:mb-8 pt-2 md:pt-8">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 -translate-y-1/2 z-0 mt-3">
                <div className="h-full bg-cyan-400 anim-scan" style={{ width: "30%" }} />
              </div>
              <div className="flex items-center justify-between w-full relative z-10">
                {["INGESTION", "TRANSFORMATION", "INTELLIGENCE"].map((step) => (
                  <div key={step} className="flex flex-col items-center gap-2 md:gap-4 bg-neutral-950 px-1 md:px-2 py-2 md:py-4 rounded-full">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-black">
                      <Server className="text-cyan-400 w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-[9px] md:text-xs font-mono text-cyan-400 tracking-wider">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <h1 className="anim-fade-up text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              Data engineering and AI on your own data.{" "}
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Fixed scope, fixed price.
              </span>
            </h1>

            <p className="anim-fade-up anim-delay-1 text-sm md:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed font-light">
              Pipelines, document Q&amp;A and PLM data work for small teams. Every engagement is built on open-source tools we&apos;ve shipped, so you can inspect the work first.
            </p>

            <div className="anim-fade-up anim-delay-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <TrackedLink
                href={BOOKING_URL}
                event="book_call_click"
                props={{ location: "home-hero" }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 bg-cyan-400 text-black font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm"
              >
                Book a 30-minute call <ArrowRight size={16} />
              </TrackedLink>
              <Link
                href="/work-with-us"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 border border-white/15 text-gray-200 font-bold rounded-lg hover:border-cyan-400 hover:text-white hover:scale-105 transition-all text-sm"
              >
                See the offers
              </Link>
            </div>
          </div>

          <div className="anim-fade-up anim-delay-3 w-full md:w-1/2 flex items-center justify-center">
            <Image
              src="/hero-data-new.svg"
              alt="Data engineering illustration"
              width={1024}
              height={1024}
              priority
              className="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg drop-shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            />
          </div>
        </div>
      </section>

      {/* 2. TRUST TICKER */}
      <section className="w-full border-y border-white/5 bg-white/[0.02] py-2 md:py-3 overflow-hidden">
        <p className="text-center text-[10px] md:text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
          Tools we work with
        </p>
        <div className="w-full relative flex overflow-hidden">
          <div className="marquee flex w-max gap-6 md:gap-24 whitespace-nowrap px-4 md:px-12">
            {[...TOOLS, ...TOOLS].map((tech, i) => (
              <span key={i} className="text-[10px] md:text-base font-mono font-bold text-gray-400 tracking-widest uppercase">{tech}</span>
            ))}
          </div>
        </div>
      </section>


      {/* 4. CORE CAPABILITIES */}
      <section className="w-full py-8 md:py-20 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 text-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-3xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Core Capabilities</h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto" />
        </div>
        <CoreCapabilitiesIDE />
      </section>

      {/* 4b. FIXED-SCOPE ENGAGEMENTS */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-20 border-b border-white/5">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-3xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Fixed-scope engagements</h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {OFFERS.map((offer, index) => (
            <Reveal key={offer.slug} delay={index * 80}>
              <Link
                href="/work-with-us"
                aria-label={`${offer.name}: ${offerPrice(offer)}, ${offer.duration}. ${offer.audience}`}
                className="group flex h-full flex-col rounded-xl bg-neutral-900 border border-white/10 p-5 hover:border-cyan-400/40 transition-colors"
              >
                <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-2">
                  {offer.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                  <span className="text-lg font-extrabold text-white">{offerPrice(offer)}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300">
                    <Clock size={12} /> {offer.duration}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                  {offer.audience}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 group-hover:gap-3 transition-all">
                  View offer <ArrowRight size={12} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/work-with-us"
            className="inline-flex items-center gap-2 text-sm font-mono font-bold text-cyan-400 hover:gap-3 transition-all"
          >
            See all offers and FAQ <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 5. FEATURED PROJECTS */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-20 border-b border-white/5">
        <ProjectCarousel>
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Featured Projects</h2>
            <div className="h-0.5 w-16 bg-cyan-400 mx-auto md:mx-0" />
          </div>
        </ProjectCarousel>
      </section>

      {/* 6. FINAL CTA */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-20">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 p-6 md:p-12 text-center">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Not sure which fits?
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6">
              Book a 30-minute call and get a fixed quote within 48 hours.
            </p>
            <TrackedLink
              href={BOOKING_URL}
              event="book_call_click"
              props={{ location: "home-footer-cta" }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition-all text-sm shadow-[0_0_25px_rgba(34,211,238,0.3)]"
            >
              Book a 30-minute call <ArrowRight size={15} />
            </TrackedLink>
          </div>
        </div>
      </section>

    </div>
  );
}
