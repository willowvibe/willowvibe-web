"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowRight, Lock, CheckCircle, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  illustration: string;
  category: string;
  badge: string;
  status: string;
  statusColor: string;
  accent: string;
  border: string;
  glow: string;
  titleGradient: string;
  tagColor: string;
  ctaColor: string;
  highlights: string[];
  tags: string[];
  cta: { label: string; href: string; github?: boolean } | null;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "ObservaKit",
    tagline: "Enterprise data observability — free, self-hosted, under 10 minutes.",
    description: "ObservaKit gives 1 to 5 person data teams the same observability pillars that enterprise teams rely on — commercial platforms typically charge five figures annually — running entirely on your own infrastructure. No vendor lock-in, no data leaving your systems.",
    illustration: "/maintain.svg",
    category: "Data Observability",
    badge: "Free and Open Source",
    status: "Live",
    statusColor: "bg-emerald-500",
    accent: "from-white/10 to-cyan-950/60",
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_40px_rgba(34,211,238,0.08)]",
    titleGradient: "from-cyan-400 to-blue-400",
    tagColor: "bg-cyan-950/50 border-cyan-500/40 text-cyan-300",
    ctaColor: "bg-cyan-400 hover:bg-cyan-300 text-black",
    cta: { label: "Get Started", href: "https://github.com/willowvibe/ObservaKit", github: true },
    highlights: [
      "Commercial platforms typically charge five figures annually",
      "Self-hosted so your data never leaves your infrastructure",
      "Setup in under 10 minutes with Docker",
      "Slack, Email, Discord, Teams and PagerDuty alerts",
      "Native dbt integration with no extra packages",
    ],
    tags: ["PostgreSQL", "BigQuery", "Snowflake", "MySQL", "Redshift", "DuckDB"],
  },
  {
    id: 2,
    name: "PipelineProbe",
    tagline: "Instant data pipeline audit — one command, zero agents.",
    description: "PipelineProbe is a read-only one-command audit tool that connects to your Airflow, dbt and warehouse stack and produces a single actionable health report with a 0 to 100 score. Perfect for consulting and one-off audits.",
    illustration: "/pipe.svg",
    category: "Pipeline Auditing",
    badge: "Free and Open Source",
    status: "Live",
    statusColor: "bg-emerald-500",
    accent: "from-white/10 to-purple-950/60",
    border: "border-purple-500/30",
    glow: "shadow-[0_0_40px_rgba(168,85,247,0.08)]",
    titleGradient: "from-purple-400 to-pink-400",
    tagColor: "bg-purple-950/50 border-purple-500/40 text-purple-300",
    ctaColor: "bg-purple-400 hover:bg-purple-300 text-black",
    cta: { label: "Get Started", href: "https://github.com/willowvibe/pipelineprobe", github: true },
    highlights: [
      "Zero agents so nothing is installed on your stack",
      "HTML and JSON reports ready for client delivery",
      "CI quality gate to fail builds on critical issues",
      "Regression detection with report diff",
      "Perfect for consulting and one-off audits",
    ],
    tags: ["PostgreSQL", "BigQuery", "Snowflake", "Apache Airflow", "dbt Core"],
  },
  {
    id: 3,
    name: "rag-docs-chatbot",
    tagline: "Answers from your documents, with the exact page cited.",
    description: "A retrieval-augmented chatbot over public NIST digital-identity guidelines (SP 800-63B / 800-63-4) that answers with [n] citations to the source page, or says it doesn't know. Built with FastAPI and Postgres pgvector using local BGE embeddings, with optional hybrid search and reranking, and scored on a 40-question evaluation.",
    illustration: "/ragdocs.webp",
    category: "AI Document Search",
    badge: "Free and Open Source",
    status: "Live",
    statusColor: "bg-emerald-500",
    accent: "from-white/10 to-sky-950/60",
    border: "border-sky-500/30",
    glow: "shadow-[0_0_40px_rgba(14,165,233,0.08)]",
    titleGradient: "from-sky-400 to-blue-400",
    tagColor: "bg-sky-950/50 border-sky-500/40 text-sky-300",
    ctaColor: "bg-sky-400 hover:bg-sky-300 text-black",
    cta: { label: "Try the Live Demo", href: "https://rag-docs-chatbot-three.vercel.app" },
    highlights: [
      "Every answer cites the source document and page",
      "Says \"I don't know\" instead of guessing",
      "87.5% of questions retrieve the right passage in the top 5 (40-question eval)",
      "Hybrid search and a cross-encoder reranker, switchable by flag",
      "Self-host with Docker Compose and bring your own model key",
    ],
    tags: ["RAG", "pgvector", "FastAPI", "PostgreSQL", "LLM", "Python"],
  },
  {
    id: 4,
    name: "plm-bom-pipeline",
    tagline: "PLM exports to tested BOM and change-control analytics in one command.",
    description: "A synthetic bicycle manufacturer's PLM data (parts, revisions, five-level BOMs, ECR → ECO → ECN change control) generated deterministically and modelled by dbt on DuckDB into seven tested marts, with a self-contained HTML report.",
    illustration: "/analytics.svg",
    category: "PLM Analytics",
    badge: "Free and Open Source",
    status: "Live",
    statusColor: "bg-emerald-500",
    accent: "from-white/10 to-teal-950/60",
    border: "border-teal-500/30",
    glow: "shadow-[0_0_40px_rgba(20,184,166,0.08)]",
    titleGradient: "from-teal-400 to-emerald-400",
    tagColor: "bg-teal-950/50 border-teal-500/40 text-teal-300",
    ctaColor: "bg-teal-400 hover:bg-teal-300 text-black",
    cta: { label: "Get Started", href: "https://github.com/willowvibe/plm-bom-pipeline", github: true },
    highlights: [
      "Recursive BOM explosion with cost and weight rollups",
      "ECO cycle times and cross-product change impact",
      "195 data-quality checks; seeded defects each fail one named test",
      "PLM to ERP BOM reconciliation",
      "Static report and dbt docs — no server to run",
    ],
    tags: ["dbt", "DuckDB", "Python", "PLM", "BOM"],
  },
  {
    id: 5,
    name: "Doctor App",
    tagline: "Complete patient management for independent doctors.",
    description: "Built for doctors who do home visits and clinic consultations. Doctor App gives independent practitioners a clean, fast way to manage patient records, track vitals, log visit notes, store documents and maintain full history across every patient interaction. Authentication and backend fully maintained by WillowVibe.",
    illustration: "/doctor.svg",
    category: "Healthcare Technology",
    badge: "Client Project",
    status: "In Development",
    statusColor: "bg-amber-500",
    accent: "from-emerald-950/40 to-black",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.08)]",
    titleGradient: "from-emerald-400 to-cyan-400",
    tagColor: "bg-emerald-950/50 border-emerald-500/40 text-emerald-300",
    ctaColor: "bg-emerald-400 hover:bg-emerald-300 text-black",
    cta: null,
    highlights: [
      "Patient records with full visit history",
      "Vitals tracking and document uploads",
      "Clinic and home visit management",
      "Secure authentication for every practitioner",
      "Multi-platform support on web and mobile",
      "Backend infrastructure maintained by WillowVibe",
    ],
    tags: ["Healthcare", "Multi-platform", "Authentication", "Backend", "Mobile"],
  },
  {
    id: 6,
    name: "Cosmic Saju",
    tagline: "Korean Four Pillars readings, reviewed by a person.",
    description: "A web app that calculates a Korean Saju (Four Pillars) birth chart, gives a free snapshot, and sells paid reports that a human reviews before delivery. Built and maintained by WillowVibe.",
    illustration: "/cosmicsaju.webp",
    category: "Astrology Web App",
    badge: "Client Project",
    status: "Live",
    statusColor: "bg-emerald-500",
    accent: "from-violet-950/40 to-black",
    border: "border-violet-500/30",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.08)]",
    titleGradient: "from-violet-400 to-amber-400",
    tagColor: "bg-violet-950/50 border-violet-500/40 text-violet-300",
    ctaColor: "bg-violet-400 hover:bg-violet-300 text-black",
    cta: { label: "Visit Site", href: "https://www.cosmicsaju.com" },
    highlights: [
      "Free Saju (Four Pillars) birth chart snapshot",
      "Paid in-depth reports reviewed by a person",
      "Built and maintained by WillowVibe",
      "Live web app at cosmicsaju.com",
    ],
    tags: ["Web App", "Astrology", "Korean Saju", "Client Work"],
  },
  {
    id: 7,
    name: "Dikshithra Atelier",
    tagline: "Online store for everyday ethnic and office wear.",
    description: "An e-commerce storefront for kurtis, kurti sets, salwars and office wear. Built by WillowVibe.",
    illustration: "/dikshithra.webp",
    category: "E-commerce",
    badge: "Client Project",
    status: "Live",
    statusColor: "bg-emerald-500",
    accent: "from-rose-950/40 to-black",
    border: "border-rose-500/30",
    glow: "shadow-[0_0_40px_rgba(244,63,94,0.08)]",
    titleGradient: "from-rose-400 to-pink-400",
    tagColor: "bg-rose-950/50 border-rose-500/40 text-rose-300",
    ctaColor: "bg-rose-400 hover:bg-rose-300 text-black",
    cta: { label: "Visit Store", href: "https://dikshithra.com" },
    highlights: [
      "Kurtis, kurti sets, salwars and office wear",
      "Responsive e-commerce storefront",
      "Built by WillowVibe",
      "Live store at dikshithra.com",
    ],
    tags: ["E-commerce", "Web", "Client Work"],
  },
];

function ProductCard({
  product,
  index,
  onSelect,
}: {
  product: Product;
  index: number;
  onSelect: (product: Product) => void;
}) {
  const isSvg = product.illustration.endsWith(".svg");
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onSelect(product)}
      aria-label={`Open details for ${product.name}`}
      className={`group relative flex flex-col text-left rounded-2xl bg-neutral-900 border ${product.border} ${product.glow} transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400`}
    >
      {/* Status badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-gray-300">
        <div className={`w-1.5 h-1.5 rounded-full ${product.statusColor} ${product.status === "In Development" ? "animate-pulse" : ""}`} />
        {product.status}
      </div>

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-gray-300">
        {product.badge}
      </div>

      {/* Illustration area */}
      <div className={`w-full flex items-center justify-center p-6 bg-gradient-to-br ${product.accent} border-b border-white/5`}>
        <Image
          src={product.illustration}
          alt={product.name}
          width={128}
          height={128}
          unoptimized={isSvg}
          className="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5 gap-3">
        <span className={`text-[10px] font-mono tracking-widest ${product.tagColor.split(" ").find(c => c.startsWith("text-")) ?? "text-cyan-300"}`}>
          {product.category}
        </span>
        <h3 className={`text-lg font-extrabold tracking-tight bg-gradient-to-r ${product.titleGradient} bg-clip-text text-transparent leading-tight`}>
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed flex-grow">
          {product.tagline}
        </p>

        {/* Animated arrow */}
        <span
          className={`mt-2 flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border-2 ${product.tagColor} group-hover:scale-105 transition-all duration-300 w-full justify-center`}
        >
          <span>Explore Product</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={13} />
          </motion.span>
        </span>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.button>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  onSelect,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  onSelect: (product: Product) => void;
}) {
  return (
    <section className="mb-16 md:mb-20">
      <div className="mb-6 md:mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-extrabold tracking-tight"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 text-sm md:text-base mt-2"
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            index={idx}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

export default function ProductsPage() {
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

        {/* Header */}
        <div className="text-center mb-10 md:mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse" />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-300 text-sm md:text-lg leading-relaxed"
          >
            From open-source data tools to client-commissioned applications — everything we build is engineered to last.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-6 mt-4"
          >
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Live</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>In Development</span>
            </div>
          </motion.div>
        </div>

        {/* Open-source tools */}
        <ProductSection
          title="Open-source tools"
          subtitle="Free, self-hostable tools we build and maintain in the open."
          products={PRODUCTS.filter((product) => product.badge === "Free and Open Source")}
          onSelect={setSelected}
        />

        {/* Client work */}
        <ProductSection
          title="Client work"
          subtitle="Products we build and run for our clients."
          products={PRODUCTS.filter((product) => product.badge === "Client Project")}
          onSelect={setSelected}
        />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 mb-6 text-xs font-mono">
            <Star size={12} /> More products being engineered
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Have an app idea?</h2>
          <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            We take on select client app projects handling design, engineering, authentication, backend infrastructure and long-term maintenance.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition-all text-sm md:text-base shadow-[0_0_25px_rgba(34,211,238,0.3)]"
          >
            Tell Us Your Idea <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-modal-title"
              className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-neutral-900 border ${selected.border} ${selected.glow} rounded-3xl shadow-2xl z-10`}
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className={`flex flex-col md:flex-row items-center gap-6 p-6 md:p-10 bg-gradient-to-br ${selected.accent} rounded-t-3xl border-b border-white/5`}>
                <Image
                  src={selected.illustration}
                  alt={selected.name}
                  width={176}
                  height={176}
                  unoptimized={selected.illustration.endsWith(".svg")}
                  className="w-32 h-32 md:w-44 md:h-44 object-contain flex-shrink-0"
                />
                <div className="flex flex-col gap-3 text-center md:text-left">
                  <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${selected.tagColor}`}>
                      {selected.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-black border border-white/10 text-gray-300">
                      <div className={`w-1.5 h-1.5 rounded-full ${selected.statusColor} ${selected.status === "In Development" ? "animate-pulse" : ""}`} />
                      {selected.status}
                    </span>
                  </div>
                  <h2 id="product-modal-title" className={`text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r ${selected.titleGradient} bg-clip-text text-transparent`}>
                    {selected.name}
                  </h2>
                  <p className="text-gray-200 text-sm md:text-base font-medium leading-relaxed">
                    {selected.tagline}
                  </p>
                </div>
              </div>
              <div className="p-6 md:p-10 flex flex-col gap-5">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selected.description}
                </p>
                <ul className="flex flex-col gap-2">
                  {selected.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span key={tag} className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${selected.tagColor}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
                  {selected.cta ? (
                    <>
                      <a href={selected.cta.href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${selected.ctaColor} hover:scale-105 transition-all shadow-lg`}>
                        {selected.cta.label} <ArrowRight size={14} />
                      </a>
                      {selected.cta.github && (
                        <a href={selected.cta.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 text-sm transition-all font-mono">
                          <Github size={14} /> View on GitHub
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <Link href="/contact" onClick={() => setSelected(null)} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${selected.ctaColor} hover:scale-105 transition-all shadow-lg`}>
                        Enquire About This <ArrowRight size={14} />
                      </Link>
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-500 text-sm font-mono cursor-not-allowed">
                        <Lock size={13} /> Private Project
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
