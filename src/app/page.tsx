"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Server, Quote, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { DataStreamVisual } from "@/components/DataStreamVisual";
import { AnomalyDetectionVisual } from "@/components/AnomalyDetectionVisual";
import { CitationVisual } from "@/components/CitationVisual";

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
    title: "Enterprise PLM & data migration",
    tags: ["Teamcenter", "3DEXPERIENCE", "dbt"],
    stat: "Service",
    desc: "A capability, not a client result: moving PLM and BOM data out of spreadsheets and into governed pipelines.",
    visual: "slider",
    link: "/services",
  },
];

const TESTIMONIALS = [
  {
    quote: "We were struggling with scattered data across three different systems — our ERP, our CRM, and a legacy warehouse nobody wanted to touch. WillowVibe built us a single automated pipeline that pulls everything together overnight. Our Monday morning reports now take minutes instead of half a day.",
    name: "Rajesh Nair",
    role: "Head of Operations, Bengaluru Logistics Pvt. Ltd.",
    real: true,
  },
];


function CoreCapabilitiesIDE() {
  const PILLARS = [
    {
      id: "plm",
      illustration: "/team.svg",
      title: "Enterprise PLM & CAD",
      description: "Full-lifecycle PLM architecture, BOM management, change control governance, and production-ready CAD for complex engineering environments.",
      tags: ["3DEXPERIENCE", "Teamcenter", "CATIA V5", "SolidWorks"],
      accent: "border-blue-500/60",
      glow: "group-hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]",
      tagColor: "border-blue-900/50 bg-blue-950/30 text-blue-300",
      iconBg: "bg-blue-950/30",
    },
    {
      id: "de",
      illustration: "/server.svg",
      title: "Data Engineering & Integration",
      description: "Resilient cloud lakehouses, automated ETL/ELT pipelines, zero-downtime migrations, and scalable cloud infrastructure on AWS, Azure, and GCP.",
      tags: ["Snowflake", "Databricks", "Kafka", "dbt", "Airflow"],
      accent: "border-cyan-500/60",
      glow: "group-hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]",
      tagColor: "border-cyan-900/50 bg-cyan-950/30 text-cyan-300",
      iconBg: "bg-cyan-950/30",
    },
    {
      id: "dta",
      illustration: "/analytics.svg",
      title: "Data Trust & Analytics",
      description: "Data quality automation, governance frameworks, real-time observability, AI infrastructure, and business intelligence dashboards your team will actually trust.",
      tags: ["Data Quality", "Observability", "AI Infra", "Power BI"],
      accent: "border-purple-500/60",
      glow: "group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]",
      tagColor: "border-purple-900/50 bg-purple-950/30 text-purple-300",
      iconBg: "bg-purple-950/30",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PILLARS.map((pillar, idx) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`group relative flex flex-col rounded-2xl bg-neutral-900 border ${pillar.accent} ${pillar.glow} transition-all duration-500 overflow-hidden hover:-translate-y-2`}
          >
            {/* Illustration area */}
            <div className={`w-full flex items-center justify-center p-8 ${pillar.iconBg} border-b border-white/5`}>
              <Image
                src={pillar.illustration}
                alt={pillar.title}
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
                href="/services"
                className={`inline-flex items-center gap-2 text-xs font-mono font-bold px-4 py-2 rounded-lg border-2 ${pillar.tagColor} hover:scale-105 hover:opacity-90 transition-all mt-auto shadow-sm`}
              >
                Explore service <ArrowRight size={12} />
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
      <section className="relative w-full max-w-7xl mx-auto px-4 pt-8 pb-2 md:pt-24 md:pb-8 text-left">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2">
            <div className="w-full max-w-xl mx-auto md:mx-0 relative mb-6 md:mb-8 pt-2 md:pt-8">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 -translate-y-1/2 z-0 mt-3">
                <motion.div className="h-full bg-cyan-400" animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ width: "30%" }} />
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
              Trusted data. Smarter products. Faster decisions.
            </motion.h1>
            
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed font-light">
              Your product data, your pipeline data, and your analytics data all live in different silos — and that&apos;s costing you. WillowVibe connects the dots. We engineer the systems that make your product lifecycle, data pipelines, and business intelligence work as one.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-cyan-400 text-black font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm">
                Start a Project <ArrowRight size={16} />
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
        <div className="w-full relative flex overflow-hidden">
          <motion.div className="flex gap-6 md:gap-24 whitespace-nowrap px-4 md:px-12"
            animate={{ x: [0, -2000] }} transition={{ repeat: Infinity, ease: "linear", duration: 40 }}>
            {["AWS", "SNOWFLAKE", "DATABRICKS", "KAFKA", "DBT", "AIRFLOW", "TEAMCENTER", "WINDCHILL", "BOM MANAGEMENT", "VARIANT CONFIGURATION", "CHANGE CONTROL", "ENOVIA", "AWS", "SNOWFLAKE", "DATABRICKS", "KAFKA", "DBT", "AIRFLOW", "TEAMCENTER", "WINDCHILL", "BOM MANAGEMENT", "VARIANT CONFIGURATION", "CHANGE CONTROL", "ENOVIA"].map((tech, i) => (
              <span key={i} className="text-[10px] md:text-base font-mono font-bold text-gray-600 tracking-widest uppercase">{tech}</span>
            ))}
          </motion.div>
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
              className={`h-2 transition-all duration-300 rounded-full ${activeIndex === index ? "w-8 bg-cyan-400" : "w-2 bg-white/30"}`}
              aria-label={`Go to project ${index + 1}: ${project.title}`}
              aria-current={activeIndex === index}
            />
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS — carousel on mobile, grid on desktop */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8 pb-12 md:py-20 md:pb-28">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-3xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Client Endorsements</h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto" />
        </div>
        <div className="md:hidden flex flex-col gap-4">
          {TESTIMONIALS.filter(t => t.real).map((testimonial, index) => (
            <div key={index} className="relative p-4 rounded-xl bg-neutral-900 border border-neutral-700">
              <Quote className="absolute top-3 right-3 w-6 h-6 text-cyan-400/10 rotate-180" />
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic mb-3">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="border-t border-neutral-700 pt-3">
                <h4 className="text-white font-bold text-sm">{testimonial.name}</h4>
                <p className="text-cyan-400 text-xs font-mono mt-0.5">{testimonial.role}</p>
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] gap-4 text-center">
            <Image
              src="/endorse.svg"
              alt="More endorsements coming"
              width={128}
              height={128}
              className="w-32 h-32 object-contain opacity-70"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              We are collecting feedback from our clients. Real stories, real results — coming soon.
            </p>
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {/* Real testimonial — Rajesh Nair */}
          {TESTIMONIALS.filter(t => t.real).map((testimonial, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="relative p-6 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-cyan-400/30 transition-colors flex flex-col">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-cyan-400/10 rotate-180" />
              <div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => (<svg key={i} className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
              <p className="text-gray-300 text-sm leading-relaxed italic mb-4 flex-grow">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="border-t border-neutral-700 pt-3">
                <h4 className="text-white font-bold text-sm">{testimonial.name}</h4>
                <p className="text-cyan-400 text-xs font-mono mt-0.5">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}

          {/* Coming soon block — spans 2 columns */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-2 relative rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-8 gap-5 text-center">
            <Image
              src="/endorse.svg"
              alt="More endorsements coming"
              width={192}
              height={192}
              className="w-48 h-48 object-contain opacity-70"
            />
            <p className="text-gray-300 text-base font-medium leading-relaxed max-w-sm">
              We are collecting feedback from our clients. Real stories, real results — coming soon.
            </p>
          </motion.div>
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
      </Link>
    </div>
  );
}
