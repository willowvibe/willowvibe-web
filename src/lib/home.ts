export type Project = {
  id: number;
  title: string;
  tags: string[];
  stat: string;
  desc: string;
  visual: string;
  link: string;
};

export const PROJECTS: Project[] = [
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

export type Capability = {
  id: string;
  href: string;
  illustration: string;
  alt: string;
  title: string;
  description: string;
  tags: string[];
  accent: string;
  glow: string;
  tagColor: string;
  iconBg: string;
};

export const CAPABILITIES: Capability[] = [
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
