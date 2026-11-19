"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";

type Offer = {
  slug: string;
  name: string;
  price: string;
  duration: string;
  badge?: string;
  audience: string;
  deliverables: string[];
  builtOn: { label: string; href: string }[];
  border: string;
  glow: string;
  accent: string;
  titleGradient: string;
  badgeColor: string;
  textColor: string;
  linkColor: string;
  bulletColor: string;
  ctaColor: string;
};

const OFFERS: Offer[] = [
  {
    slug: "ai-pilot",
    name: "AI on your data pilot",
    price: "$4,000",
    duration: "2 weeks",
    badge: "Most requested",
    audience:
      "For teams that want answers from their own documents and systems.",
    deliverables: [
      "A cited-answer assistant over your documents",
      "A retrieval-quality eval you can rerun",
      "Deployment in your cloud or ours",
      "A handover session",
    ],
    builtOn: [
      { label: "rag-docs-chatbot", href: "https://github.com/willowvibe/rag-docs-chatbot" },
      { label: "live demo", href: "https://rag-docs-chatbot-three.vercel.app" },
    ],
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_40px_rgba(34,211,238,0.08)]",
    accent: "from-white/10 to-cyan-950/60",
    titleGradient: "from-cyan-400 to-blue-400",
    badgeColor: "border-cyan-500/40 bg-cyan-950/50 text-cyan-300",
    textColor: "text-cyan-300",
    linkColor: "text-cyan-300 hover:text-cyan-200",
    bulletColor: "text-cyan-400",
    ctaColor: "bg-cyan-400 hover:bg-cyan-300 text-black",
  },
  {
    slug: "pipeline-audit",
    name: "Pipeline health audit",
    price: "$1,500",
    duration: "1 week",
    badge: "Best first step",
    audience:
      "For teams whose Airflow/dbt pipelines fail, run slowly or can't be trusted.",
    deliverables: [
      "A read-only review of Airflow, dbt and the warehouse",
      "One prioritized written report",
      "A 1-hour walkthrough call",
      "A fix plan with estimates",
    ],
    builtOn: [
      { label: "PipelineProbe", href: "https://github.com/willowvibe/pipelineprobe" },
    ],
    border: "border-purple-500/30",
    glow: "shadow-[0_0_40px_rgba(168,85,247,0.08)]",
    accent: "from-white/10 to-purple-950/60",
    titleGradient: "from-purple-400 to-pink-400",
    badgeColor: "border-purple-500/40 bg-purple-950/50 text-purple-300",
    textColor: "text-purple-300",
    linkColor: "text-purple-300 hover:text-purple-200",
    bulletColor: "text-purple-400",
    ctaColor: "bg-purple-400 hover:bg-purple-300 text-black",
  },
  {
    slug: "data-stack",
    name: "Data stack kickoff",
    price: "$6,500",
    duration: "2\u20133 weeks",
    audience: "For teams starting or rebuilding a data platform.",
    deliverables: [
      "Ingestion, dbt models and tests",
      "CI and Docker",
      "Optional Airflow orchestration",
      "Data-quality monitoring and docs",
    ],
    builtOn: [
      { label: "data-pipeline-template", href: "https://github.com/willowvibe/data-pipeline-template" },
      { label: "ObservaKit", href: "https://github.com/willowvibe/ObservaKit" },
    ],
    border: "border-amber-500/30",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.08)]",
    accent: "from-white/10 to-amber-950/60",
    titleGradient: "from-amber-400 to-orange-400",
    badgeColor: "border-amber-500/40 bg-amber-950/50 text-amber-300",
    textColor: "text-amber-300",
    linkColor: "text-amber-300 hover:text-amber-200",
    bulletColor: "text-amber-400",
    ctaColor: "bg-amber-400 hover:bg-amber-300 text-black",
  },
  {
    slug: "plm-readiness",
    name: "PLM migration readiness check",
    price: "$3,000",
    duration: "1\u20132 weeks",
    audience:
      "For manufacturers and PLM integrators planning a Windchill or Teamcenter migration.",
    deliverables: [
      "Automated BOM and part-data defect checks",
      "A change-record (ECR/ECO) consistency review",
      "A defect report sized by severity",
      "Cleanup recommendations before cutover",
    ],
    builtOn: [
      { label: "plm-bom-pipeline", href: "https://github.com/willowvibe/plm-bom-pipeline" },
    ],
    border: "border-teal-500/30",
    glow: "shadow-[0_0_40px_rgba(20,184,166,0.08)]",
    accent: "from-white/10 to-teal-950/60",
    titleGradient: "from-teal-400 to-emerald-400",
    badgeColor: "border-teal-500/40 bg-teal-950/50 text-teal-300",
    textColor: "text-teal-300",
    linkColor: "text-teal-300 hover:text-teal-200",
    bulletColor: "text-teal-400",
    ctaColor: "bg-teal-400 hover:bg-teal-300 text-black",
  },
];

const STEPS = [
  {
    title: "30-minute call",
    desc: "We talk through the problem, your stack and what a good result looks like.",
  },
  {
    title: "Fixed proposal within 48 hours",
    desc: "Scope, price, timeline and deliverables in writing, with no hourly surprises.",
  },
  {
    title: "Build with weekly demos",
    desc: "Working software every week, so you can steer the build as it happens.",
  },
  {
    title: "Handover with docs",
    desc: "Code, runbooks and a walkthrough so your team can run and extend it.",
  },
];

function OfferCard({ offer, index }: { offer: Offer; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative flex flex-col rounded-2xl bg-neutral-900 border ${offer.border} ${offer.glow} overflow-hidden`}
    >
      <div className={`relative p-6 border-b border-white/5 bg-gradient-to-br ${offer.accent}`}>
        {offer.badge && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono tracking-wide ${offer.badgeColor}`}
          >
            <Sparkles size={11} /> {offer.badge}
          </span>
        )}
        <h3
          className={`mt-3 text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r ${offer.titleGradient} bg-clip-text text-transparent leading-tight`}
        >
          {offer.name}
        </h3>
        <div className="flex flex-wrap items-baseline gap-3 mt-3">
          <span className="text-2xl md:text-3xl font-extrabold text-white">
            {offer.price}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${offer.textColor}`}>
            <Clock size={12} /> {offer.duration}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow gap-4 p-6">
        <p className="text-gray-300 text-sm leading-relaxed">{offer.audience}</p>

        <ul className="flex flex-col gap-2">
          {offer.deliverables.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
              <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${offer.bulletColor}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
            <span className="text-gray-500 uppercase tracking-widest text-[10px]">
              Built on
            </span>
            {offer.builtOn.map((repo, repoIndex) => (
              <span key={repo.href} className="inline-flex items-center gap-2">
                {repoIndex > 0 && <span className="text-gray-700">·</span>}
                <a
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 ${offer.linkColor} transition-colors hover:underline`}
                >
                  {repo.label} <ExternalLink size={10} aria-hidden="true" />
                </a>
              </span>
            ))}
          </div>

          <Link
            href={`/contact?offer=${offer.slug}`}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm ${offer.ctaColor} hover:scale-[1.02] transition-all shadow-lg`}
          >
            Book a call <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.article>
  );
}

export default function WorkWithUsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-4 md:px-8 py-8 md:py-16">

        {/* Hero */}
        <div className="text-center mb-10 md:mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse" />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            Fixed-scope engagements, fixed prices
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto text-gray-300 text-sm md:text-lg leading-relaxed"
          >
            Small data and AI projects with a clear scope, a fixed price and a
            working result. Every offer is backed by open-source tools
            we&apos;ve already built and shipped.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-mono"
          >
            <Globe size={12} className="text-cyan-400" />
            Remote, working across US, UK, EU and Australian hours.
          </motion.div>
        </div>

        {/* Offers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {OFFERS.map((offer, index) => (
            <OfferCard key={offer.slug} offer={offer} index={index} />
          ))}
        </div>

        {/* Need something else */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-24"
        >
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 p-6 md:p-10">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 mb-4 text-xs font-mono">
                  <Wrench size={12} /> Flexible engagement
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Need something else?
                </h2>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
                  Not every job needs a fixed-scope package. We also take on
                  smaller pieces of work or an ongoing part-time slot.
                </p>
              </div>

              <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-black/40 border border-cyan-500/30 p-5">
                  <div className="text-2xl font-extrabold text-white">$70<span className="text-sm text-gray-400 font-normal">/hr</span></div>
                  <div className="text-sm font-semibold text-cyan-300 mt-1">Hourly work</div>
                  <p className="text-xs text-gray-400 leading-relaxed mt-2">
                    Fixes and small builds: web apps, dashboards and integrations.
                  </p>
                </div>
                <div className="rounded-xl bg-black/40 border border-purple-500/30 p-5">
                  <div className="text-2xl font-extrabold text-white">$1,300<span className="text-sm text-gray-400 font-normal">/month</span></div>
                  <div className="text-sm font-semibold text-purple-300 mt-1">Part-time retainer</div>
                  <p className="text-xs text-gray-400 leading-relaxed mt-2">
                    20 h/month for steady improvements, maintenance and support.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition-all text-sm shadow-[0_0_25px_rgba(34,211,238,0.3)]"
              >
                Talk about your project <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-24"
        >
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
              How it works
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Four steps from first call to a working handover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative rounded-xl bg-neutral-900 border border-white/10 p-5 hover:border-cyan-400/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xs font-mono font-bold mb-3">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white leading-snug mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
