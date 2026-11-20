"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Server, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { BOOKING_URL } from "@/lib/site";
import { OFFERS, offerPrice } from "@/lib/offers";
import { TOOLS } from "@/lib/tools";
import { TrackedLink } from "@/components/TrackedLink";

const visualPlaceholder = () => <div className="w-full h-48" />;

const BeforeAfterSlider = dynamic(
  () => import("@/components/BeforeAfterSlider").then((mod) => mod.BeforeAfterSlider),
  { ssr: false, loading: visualPlaceholder },
);
const DataStreamVisual = dynamic(
  () => import("@/components/DataStreamVisual").then((mod) => mod.DataStreamVisual),
  { ssr: false, loading: visualPlaceholder },
);
const AnomalyDetectionVisual = dynamic(
  () => import("@/components/AnomalyDetectionVisual").then((mod) => mod.AnomalyDetectionVisual),
  { ssr: false, loading: visualPlaceholder },
);
const CitationVisual = dynamic(
  () => import("@/components/CitationVisual").then((mod) => mod.CitationVisual),
  { ssr: false, loading: visualPlaceholder },
);

type Project = {
  id: number;
  title: string;
  tags: string[];
  stat: string;
  desc: string;
  visual: string;
  link: string;
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "ObservaKit",
    tags: ["Postgres", "Prometheus", "Grafana"],
    stat: "Open source",
    desc: "Self-hosted data observability for small teams — freshness, volume and schema checks with Slack, Email, Discord, Teams and PagerDuty alerts.",
    visual: "anomaly",
    link: "https://github.com/willowvibe/ObservaKit",
  },
  {
    id: 2,
    title: "PipelineProbe",
    tags: ["Airflow", "dbt", "PyPI"],
    stat: "pip install pipelineprobe",
    desc: "A one-command, read-only audit of Airflow, dbt and warehouse health that returns a 0–100 score, an HTML and JSON report, and a CI gate.",
    visual: "stream",
    link: "https://github.com/willowvibe/pipelineprobe",
  },
  {
    id: 3,
    title: "rag-docs-chatbot",
    tags: ["pgvector", "FastAPI", "RAG"],
    stat: "Live demo",
    desc: "Ask questions of a document set and get answers that cite the exact page — or an explicit \"I don't know\". Hybrid search, reranking and a 40-question evaluation.",
    visual: "citation",
    link: "https://rag-docs-chatbot-three.vercel.app",
  },
  {
    id: 4,
    title: "plm-bom-pipeline",
    tags: ["dbt", "DuckDB", "PLM"],
    stat: "Open source",
    desc: "A tested PLM analytics pipeline on a synthetic bicycle company: 2,000 parts, five-level BOMs and ECR → ECO → ECN history, with seven seeded data defects each caught by its own dbt test.",
    visual: "slider",
    link: "https://github.com/willowvibe/plm-bom-pipeline",
  },
];

const CAPABILITIES = [
  {
    id: "ai",
    href: "/services/ai-on-your-data",
    illustration: "/analytics.svg",
    alt: "Analytics illustration for AI on your own data",
    title: "AI on your own data",
    description:
      "Document Q&A with citations, AI integrated into your systems, and retrieval evals you can rerun.",
    tags: ["RAG", "pgvector", "Evals"],
    accent: "border-cyan-500/60",
    glow: "group-hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]",
    tagColor: "border-cyan-900/50 bg-cyan-950/30 text-cyan-300",
    iconBg: "bg-cyan-950/30",
  },
  {
    id: "ai-integration",
    href: "/services/ai-integration",
    illustration: "/core.svg",
    alt: "Integration illustration for connecting AI models to existing tools",
    title: "AI integration",
    description:
      "Connect AI models to your existing tools and workflows: assistants on your website or internal tools, AI steps inside your data pipelines, with guardrails, rate limits and evals.",
    tags: ["LLM APIs", "Guardrails", "Evals"],
    accent: "border-indigo-500/60",
    glow: "group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]",
    tagColor: "border-indigo-900/50 bg-indigo-950/30 text-indigo-300",
    iconBg: "bg-indigo-950/30",
  },
  {
    id: "pipelines",
    href: "/services/data-pipelines",
    illustration: "/pipe.svg",
    alt: "Pipeline illustration for data pipelines",
    title: "Data pipelines",
    description:
      "Airflow and dbt builds, pipeline health audits, and data quality and observability.",
    tags: ["Airflow", "dbt", "Postgres", "BigQuery", "Snowflake"],
    accent: "border-blue-500/60",
    glow: "group-hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]",
    tagColor: "border-blue-900/50 bg-blue-950/30 text-blue-300",
    iconBg: "bg-blue-950/30",
  },
  {
    id: "plm",
    href: "/services/plm-data-migration",
    illustration: "/team.svg",
    alt: "Team illustration for PLM data migration",
    title: "PLM data migration",
    description:
      "Windchill and Teamcenter migration readiness, plus BOM and change-record data quality.",
    tags: ["Windchill", "Teamcenter", "BOM"],
    accent: "border-purple-500/60",
    glow: "group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]",
    tagColor: "border-purple-900/50 bg-purple-950/30 text-purple-300",
    iconBg: "bg-purple-950/30",
  },
  {
    id: "apps",
    href: "/services/web-and-data-apps",
    illustration: "/server.svg",
    alt: "Server illustration for web and data apps",
    title: "Web and data apps",
    description:
      "Dashboards, internal tools and integrations alongside the data work.",
    tags: ["Next.js", "Python"],
    accent: "border-teal-500/60",
    glow: "group-hover:shadow-[0_0_25px_rgba(20,184,166,0.25)]",
    tagColor: "border-teal-900/50 bg-teal-950/30 text-teal-300",
    iconBg: "bg-teal-950/30",
  },
];

function CoreCapabilitiesIDE() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {CAPABILITIES.map((pillar, idx) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { amount: 0.2 });
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const getStep = useCallback(() => {
    const scroller = sliderRef.current;
    if (!scroller) return 0;
    const first = scroller.firstElementChild as HTMLElement | null;
    if (!first) return 0;
    const styles = window.getComputedStyle(scroller);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return first.offsetWidth + gap;
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = sliderRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: index * getStep(), behavior: "smooth" });
    setActiveIndex(index);
  }, [getStep]);

  const handleScroll = useCallback(() => {
    const scroller = sliderRef.current;
    const step = getStep();
    if (scroller && step > 0) {
      setActiveIndex(Math.min(PROJECTS.length - 1, Math.round(scroller.scrollLeft / step)));
    }
  }, [getStep]);

  const goPrev = useCallback(() => {
    scrollToIndex((activeIndex - 1 + PROJECTS.length) % PROJECTS.length);
  }, [activeIndex, scrollToIndex]);

  const goNext = useCallback(() => {
    scrollToIndex((activeIndex + 1) % PROJECTS.length);
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion) return;
    const interval = setInterval(() => {
      scrollToIndex((activeIndex + 1) % PROJECTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, reduceMotion, activeIndex, scrollToIndex]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-neutral-950 text-white overflow-x-hidden selection:bg-cyan-400/30">

      {/* 1. HERO */}
      <section ref={heroRef} className="relative w-full max-w-7xl mx-auto px-4 pt-8 pb-2 md:pt-24 md:pb-8 text-left">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] -z-10${heroInView ? " animate-pulse" : ""}`} />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2">
            <div className="w-full max-w-xl mx-auto md:mx-0 relative mb-6 md:mb-8 pt-2 md:pt-8">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 -translate-y-1/2 z-0 mt-3">
                <motion.div className="h-full bg-cyan-400" animate={heroInView ? { x: ["-100%", "200%"] } : { x: "-100%" }} transition={heroInView ? { repeat: Infinity, duration: 3, ease: "linear" } : undefined} style={{ width: "30%" }} />
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

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              Data engineering and AI on your own data.{" "}
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Fixed scope, fixed price.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed font-light">
              Pipelines, document Q&amp;A and PLM data work for small teams. Every engagement is built on open-source tools we&apos;ve shipped, so you can inspect the work first.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
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
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="w-full md:w-1/2 flex items-center justify-center"
          >
            <Image
              src="/hero-data-new.svg"
              alt="Data engineering illustration"
              width={1024}
              height={1024}
              priority
              className="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg drop-shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            />
          </motion.div>
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
            <motion.div
              key={offer.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
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
            </motion.div>
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
      <section
        className="w-full max-w-7xl mx-auto px-4 py-8 md:py-20 border-b border-white/5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Featured Projects</h2>
            <div className="h-0.5 w-16 bg-cyan-400 mx-auto md:mx-0" />
          </div>
          <div className="flex justify-center md:justify-end gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous project"
              className="w-10 h-10 rounded-full border border-neutral-600 bg-neutral-900 text-cyan-400 flex items-center justify-center hover:border-cyan-400 hover:scale-105 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next project"
              className="w-10 h-10 rounded-full border border-neutral-600 bg-neutral-900 text-cyan-400 flex items-center justify-center hover:border-cyan-400 hover:scale-105 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="relative">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 snap-x snap-mandatory py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                className="w-[calc(100vw-2rem)] md:w-[48%] lg:w-[32%] flex-none snap-start md:snap-center"
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          {PROJECTS.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              className="flex min-w-6 min-h-6 items-center justify-center rounded-full"
              aria-label={`Go to project ${index + 1}: ${project.title}`}
              aria-current={activeIndex === index}
            >
              <span
                className={`h-2 transition-all duration-300 rounded-full ${activeIndex === index ? "w-8 bg-cyan-400" : "w-2 bg-white/30"}`}
              />
            </button>
          ))}
        </div>
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

function ProjectCard({ title, tags, stat, desc, visual, link }: Project) {
  const isExternal = link.startsWith("http");
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div className="group relative p-4 md:p-6 h-full flex flex-col bg-neutral-800 border border-neutral-600 rounded-xl hover:border-cyan-400 transition-all duration-500">
      <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-white">
        <Link
          href={link}
          {...linkProps}
          className="hover:text-cyan-400 transition-colors"
        >
          {title}
        </Link>
      </h3>
      <p className="text-sm md:text-base text-gray-300 mb-4 flex-grow leading-relaxed">{desc}</p>
      <div className="mb-4">
        {visual === "slider" && <BeforeAfterSlider />}
        {visual === "stream" && <DataStreamVisual />}
        {visual === "anomaly" && <AnomalyDetectionVisual />}
        {visual === "citation" && <CitationVisual />}
      </div>
      <div className="pt-4 border-t border-neutral-600 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">{tags.map((tag) => (<span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-black/60 border border-neutral-500 text-cyan-400">{tag}</span>))}</div>
        <div className="font-mono text-xs text-cyan-300 font-bold bg-black/40 px-3 py-1 rounded border border-neutral-600">STATUS: {stat}</div>
      </div>
      <Link
        href={link}
        {...linkProps}
        className="mt-4 inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:gap-3 transition-all"
      >
        {isExternal ? "View project" : "Learn more"} <ArrowRight size={12} />
        <span className="sr-only"> {title}</span>
      </Link>
    </div>
  );
}
