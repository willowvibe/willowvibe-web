export type OfferLink = {
  label: string;
  href: string;
};

export type Offer = {
  slug: string;
  name: string;
  price: string;
  pricePrefix?: string;
  duration: string;
  badge?: string;
  audience: string;
  deliverables: string[];
  builtOn: OfferLink[];
};

export type Option = {
  name: string;
  price: string;
  duration?: string;
  description: string;
};

export const OFFERS: Offer[] = [
  {
    slug: "ai-pilot",
    name: "AI on your data pilot",
    price: "$4,000",
    pricePrefix: "From",
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
  },
  {
    slug: "data-stack",
    name: "Data stack kickoff",
    price: "$6,500",
    pricePrefix: "From",
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
  },
  {
    slug: "plm-readiness",
    name: "PLM migration readiness check",
    price: "$3,000",
    pricePrefix: "From",
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
  },
];

export const HOURLY_OPTION: Option = {
  name: "Hourly work",
  price: "$70/hr",
  description:
    "Fixes and small builds: web apps, dashboards and integrations.",
};

export const RETAINER_OPTION: Option = {
  name: "Part-time retainer",
  price: "$1,300/month",
  duration: "20 h/month",
  description:
    "Steady improvements, maintenance and support.",
};

export const OFFERS_PAGE_URL = "https://www.willowvibe.com/work-with-us";

export function offerPrice(offer: Offer): string {
  return offer.pricePrefix
    ? `${offer.pricePrefix.toLowerCase()} ${offer.price}`
    : offer.price;
}

export function offerTools(offer: Offer): string[] {
  return offer.builtOn
    .filter((link) => link.href.startsWith("https://github.com/"))
    .map((link) => link.label);
}

export function offerPrefillLabel(offer: Offer): string {
  return `${offer.name} (${offerPrice(offer)}, ${offer.duration})`;
}
