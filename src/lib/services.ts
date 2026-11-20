export type ServiceProof = {
  title: string;
  fact: string;
  href: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type RelatedOption = "hourly" | "retainer";

export type Service = {
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  problem: string[];
  approach: string[];
  deliverables: string[];
  proof: ServiceProof[];
  relatedOfferSlugs: string[];
  relatedOptions?: RelatedOption[];
  faq: ServiceFaq[];
  tools: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "ai-on-your-data",
    name: "AI on your own data",
    h1: "RAG development services for your own documents",
    metaTitle: "RAG development services | Cited answers on your data",
    metaDescription:
      "We build RAG assistants that answer from your documents and cite the exact page or say I don't know. Fixed-scope pilot from $4,000.",
    summary:
      "Document Q&A and RAG assistants that answer from your own documents, cite the exact page and admit when they don't know.",
    problem: [
      "Your team already has the answers, but they are buried in PDFs, wikis, support tickets and internal systems. People search, open documents and ask colleagues, then repeat the same question next week. The answer exists, but finding it depends on who is online and what they remember.",
      "A general chatbot gives confident answers with no source. That is worse than no answer when the question is about a contract, a procedure or a technical spec, because nobody can check it. You cannot ship an assistant that cannot be checked.",
      "You want an assistant your team can trust, and you want to know whether it retrieves the right evidence before you put it in front of customers. The useful question is not whether a demo sounds good, but whether the right passage is in the context the model receives. We treat retrieval quality as the foundation and the answer as the output.",
    ],
    approach: [
      "Pick a document set and a short list of real questions, then agree what a correct answer looks like before any code is written. A narrow, honest starting point beats a broad assistant that is wrong in ways nobody can see.",
      "Build the ingestion path: parse the files, split them into chunks, embed them and store the vectors in Postgres with pgvector. Keep the pipeline reproducible so re-ingesting a changed document is routine.",
      "Add retrieval, then measure it with a repeatable question set so every change is judged on evidence rather than impressions. We report hit rate and ranking quality, not just whether the demo felt right.",
      "Add hybrid search and a reranker when the baseline misses, and keep the eval as the tool that decides whether the change helped.",
      "Ground every answer in retrieved passages, return the exact page or an explicit \"I don't know\", and log what was retrieved for each answer.",
      "Deploy in your cloud or ours, hand over the code and the eval, and show your team how to rerun both.",
    ],
    deliverables: [
      "A cited-answer assistant over an agreed document set",
      "A retrieval-quality eval you own and can rerun",
      "The ingestion and query code, documented",
      "Deployment in your cloud or ours",
      "A handover session and a short runbook",
      "A written readout of where retrieval works, where it fails and which documents to add next",
    ],
    proof: [
      {
        title: "rag-docs-chatbot evaluation",
        fact: "On a 40-question eval, evidence hit@5 reached 87.5% and MRR 0.713, with faithfulness 0.97.",
        href: "https://github.com/willowvibe/rag-docs-chatbot",
      },
      {
        title: "Hybrid search and reranker results",
        fact: "Adding hybrid search and a reranker raised hit@5 to 92.5% and MRR to 0.805 on the same eval.",
        href: "https://github.com/willowvibe/rag-docs-chatbot",
      },
      {
        title: "Live RAG demo",
        fact: "Ask the demo questions and it cites the exact page or says \"I don't know\".",
        href: "https://rag-docs-chatbot-three.vercel.app",
      },
    ],
    relatedOfferSlugs: ["ai-pilot"],
    faq: [
      {
        question: "What does a RAG pilot cost and how long does it take?",
        answer:
          "The AI on your data pilot starts at $4,000 and runs for two weeks. We agree the documents, the questions and the deployment target before work starts. You get a working assistant and the evaluation results, not a slide deck.",
      },
      {
        question: "Do you need access to our documents?",
        answer:
          "Yes, but we sign a mutual NDA before we access any data or systems. You can also start with a sample set you are comfortable sharing. Access can be temporary and limited to the agreed document set.",
      },
      {
        question: "Can we run it on our own infrastructure?",
        answer:
          "Yes. We deploy in your cloud or ours, and the code and configuration transfer to you when the final invoice is paid. We keep the deployment steps documented so your team can repeat them.",
      },
      {
        question: "How do you know the answers are good?",
        answer:
          "We build a question set from your own documents and report retrieval and answer quality against it. The public rag-docs-chatbot repo shows the same approach with a 40-question eval. We share the results before the handover so there are no surprises.",
      },
    ],
    tools: ["Python", "RAG / pgvector", "PostgreSQL", "Docker"],
  },
  {
    slug: "ai-integration",
    name: "AI integration",
    h1: "AI integration for your existing tools and workflows",
    metaTitle: "AI integration for tools, pipelines and assistants",
    metaDescription:
      "We connect AI models to your website, internal tools and data pipelines, with guardrails, rate limits, evals and clear failure handling.",
    summary:
      "AI models wired into the tools you already use, with guardrails, rate limits and evals that make the behaviour predictable.",
    problem: [
      "An AI feature often starts as a demo that looks good in a chat window and then fails in production. It has no limits, no fallback and no way to tell whether an answer helped or hurt. A model call that works once is not the same as a feature that survives a bad input, a provider outage or a busy day.",
      "Your existing tools already hold the workflow: the website, the support desk, the internal dashboard or the pipeline scheduler. The model has to fit into that flow without breaking it. The integration point matters more than the model name.",
      "You need clear rules for cost, access, data handling and failure, plus a way to test changes before they reach users. Without those rules, every prompt edit becomes a release risk. We make those rules explicit in code so they can be reviewed and changed.",
    ],
    approach: [
      "Map the workflow and choose one place where a model saves real effort, such as drafting, classification, extraction or answering from a known source. Start with a task that has a clear input and a checkable output.",
      "Choose the model and provider around your constraints: data residency, cost, latency and the option to fall back to another model.",
      "Wrap every call in guardrails: input and output checks, rate limits per user or IP, timeouts, retries and a fallback path. Log the failures as well as the successes.",
      "Keep the model grounded in your data and tools, and return the source or the tool result with the answer.",
      "Build a small eval set with examples from your own workflow and rerun it whenever the prompt, model or data changes.",
      "Ship, monitor and hand over the code, prompts and eval so your team can operate it without us. Include a rollback path for the provider.",
    ],
    deliverables: [
      "An assistant or AI step integrated into an agreed tool or workflow",
      "Guardrails, rate limits and fallback handling",
      "A small eval set with a runner your team can use",
      "Logging for model calls, failures and cost signals",
      "Code, configuration and a handover session",
      "A written note on limits and what to monitor",
    ],
    proof: [
      {
        title: "WillowVibe site assistant",
        fact: "Our own assistant runs on free OpenRouter models with fallback, answers only from site facts and is limited to 20 questions per IP per hour.",
        href: "https://www.willowvibe.com",
      },
      {
        title: "rag-docs-chatbot",
        fact: "An open-source RAG service with a cited-answer demo and a 40-question retrieval eval.",
        href: "https://github.com/willowvibe/rag-docs-chatbot",
      },
      {
        title: "Cited-answer demo",
        fact: "A live assistant that returns the exact page or an explicit \"I don't know\" instead of an unsourced guess.",
        href: "https://rag-docs-chatbot-three.vercel.app",
      },
    ],
    relatedOfferSlugs: ["ai-pilot"],
    relatedOptions: ["hourly", "retainer"],
    faq: [
      {
        question: "Can you add AI to our existing product?",
        answer:
          "Yes. We integrate models into an existing website, internal tool or data pipeline and keep the rest of the workflow in place. We start from the workflow you already have and change as little as possible.",
      },
      {
        question: "How do you control cost and abuse?",
        answer:
          "We add rate limits per user or IP, input and output checks, timeouts and fallbacks. Our own site assistant, for example, allows 20 questions per IP per hour. The limits are configuration, so you can change them without a rewrite.",
      },
      {
        question: "Which models do you use?",
        answer:
          "We choose models around your data, cost and latency constraints, and we keep the provider layer replaceable. The site assistant uses free OpenRouter models with fallback. We document the provider setup so another team can take over.",
      },
      {
        question: "Who owns the integration?",
        answer:
          "You do. Code and configuration transfer to you when the final invoice is paid, and we sign a mutual NDA before accessing your data. We also document the provider and model choices so a future change is a decision, not a surprise.",
      },
    ],
    tools: ["Python", "Next.js", "RAG / pgvector", "Docker"],
  },
  {
    slug: "data-pipelines",
    name: "Data pipelines",
    h1: "Data engineering services for Airflow, dbt and the warehouse",
    metaTitle: "Data engineering services | Airflow, dbt and audits",
    metaDescription:
      "Airflow and dbt pipeline builds, rescues and audits, plus data quality and observability for small teams. Fixed-scope pipeline audit from $1,500.",
    summary:
      "Airflow and dbt builds, rescues and audits, with data quality and observability that keep the warehouse trustworthy.",
    problem: [
      "Pipelines grow one urgent request at a time. A scheduled job fails at night, someone patches it, and nobody knows which table is stale until a dashboard looks wrong. Each patch adds another undocumented dependency.",
      "dbt models pass their tests in development and then drift in production because the source changed, a schema moved or a dependency was skipped. The team learns about it from a report, not from the pipeline. Tests are useful only if they run on a schedule and fail loudly.",
      "You may be starting fresh, or you may be inheriting a stack that only one person understands. Either way you need a clear view of what runs, what depends on what and what to fix first. Teams bring us in as a data engineering consultant when a pipeline needs to be rescued, rebuilt or explained. The goal is a stack your team can operate without a resident expert.",
    ],
    approach: [
      "Start read-only. We inspect Airflow, dbt and the warehouse, then write down what runs, what depends on what and where it fails.",
      "Score the stack and rank the problems by risk, so the first fix removes the most pain rather than the loudest complaint.",
      "Build or repair the ingestion and transformation layers with versioned code, tests and clear ownership. Every model should explain where its data comes from.",
      "Add orchestration, CI and containers so a change is tested before it reaches production.",
      "Add freshness, volume, quality and schema checks, with alerts that reach the people on call. Tune alerts so people act on them instead of muting them.",
      "Hand over runbooks and a fix plan, and show your team how to rerun the audit and the tests.",
    ],
    deliverables: [
      "A read-only audit of Airflow, dbt and the warehouse",
      "A prioritized report and a fix plan",
      "Ingestion and dbt models with tests",
      "CI, Docker and optional Airflow orchestration",
      "Freshness, volume, quality and schema-drift checks",
      "Docs and a walkthrough for your team",
    ],
    proof: [
      {
        title: "PipelineProbe",
        fact: "A one-command, read-only audit of Airflow, dbt and the warehouse that returns a 0–100 health score, HTML and JSON reports and a CI gate.",
        href: "https://github.com/willowvibe/pipelineprobe",
      },
      {
        title: "data-pipeline-template",
        fact: "One Copier command generates ingestion, dbt models and tests, linting, CI, Docker and optional Airflow across DuckDB or Postgres, with all four combinations tested in CI.",
        href: "https://github.com/willowvibe/data-pipeline-template",
      },
      {
        title: "ObservaKit",
        fact: "Self-hosted data observability for 1–5 person data teams: freshness, volume, quality and schema-drift alerts on Prometheus and Grafana.",
        href: "https://github.com/willowvibe/ObservaKit",
      },
    ],
    relatedOfferSlugs: ["pipeline-audit", "data-stack"],
    faq: [
      {
        question: "What does the pipeline audit include?",
        answer:
          "A read-only review of Airflow, dbt and the warehouse, a prioritized written report, a one-hour walkthrough and a fix plan with estimates. It costs $1,500 and takes one week. You get the report in writing and a walkthrough of the findings.",
      },
      {
        question: "Can you act as an Airflow or dbt consultant as well as audit the stack?",
        answer:
          "Yes. We can start with the audit, then move into a fixed-scope build or a data stack kickoff so the fixes ship with tests and monitoring. The audit gives us the evidence to scope that work accurately.",
      },
      {
        question: "Which warehouses do you work with?",
        answer:
          "We work with Postgres, DuckDB, BigQuery and Snowflake, and we keep the pipeline code portable where the work allows. We confirm the warehouse and orchestration versions before we start.",
      },
      {
        question: "How do you handle access?",
        answer:
          "We sign a mutual NDA before accessing your data or systems, and the audit itself is read-only. Read-only access is enough for the audit, and we remove it when the work ends.",
      },
    ],
    tools: [
      "Python",
      "SQL",
      "dbt",
      "Apache Airflow",
      "PostgreSQL",
      "DuckDB",
      "BigQuery",
      "Snowflake",
      "Docker",
    ],
  },
  {
    slug: "plm-data-migration",
    name: "PLM data migration",
    h1: "PLM data migration for Windchill and Teamcenter",
    metaTitle: "PLM data migration | Windchill and Teamcenter checks",
    metaDescription:
      "Check Windchill and Teamcenter data before migration: BOM structure, change records, part quality and PLM-to-ERP reconciliation. From $3,000.",
    summary:
      "Migration readiness for Windchill and Teamcenter: BOM structure, change records, part quality and PLM-to-ERP reconciliation.",
    problem: [
      "A PLM migration moves more than parts. It moves assemblies, revisions, effectivity dates, documents and the change history that explains why a design looks the way it does today. The migration team inherits all of it, including the assumptions nobody wrote down.",
      "Bad data that a team can work around in the source system becomes a hard stop after cutover. Cyclic BOMs, orphan parts and released assemblies with unreleased children break the new structure or the downstream ERP. A Windchill data migration and a Teamcenter data migration fail in the same places: structure, effectivity and change history. These are not cosmetic issues; they change how the new system resolves a structure.",
      "Change records add another layer. Overlapping revision effectivity or an ECO closed without an ECN can leave the new system without a defensible history, which is exactly the point where an audit or a customer question becomes expensive. The checks should run before the migration, on extracts, while fixes are still cheap.",
    ],
    approach: [
      "Profile the source data and map the objects that must survive the move: parts, BOMs, revisions, effectivity and change records.",
      "Run automated checks for structural defects before anyone writes a migration script. Each check should name the rule and the record it fails.",
      "Review the change history for gaps between ECR, ECO and ECN, and flag records that cannot be explained.",
      "Reconcile PLM data against ERP where both systems hold the same part or quantity.",
      "Size the defects by severity and recommend cleanup before cutover, not after. Fixing data in the source is cheaper than repairing it in the target.",
      "Hand over the check code and the report so the same checks can run again after cleanup.",
    ],
    deliverables: [
      "Automated BOM and part-data defect checks",
      "A change-record consistency review",
      "A defect report sized by severity",
      "Cleanup recommendations before cutover",
      "A PLM-to-ERP reconciliation view",
      "A walkthrough with the migration team",
    ],
    proof: [
      {
        title: "plm-bom-pipeline",
        fact: "A synthetic bicycle company with 2,000 parts, five-level BOMs and ECR → ECO → ECN history, built to test migration data quality.",
        href: "https://github.com/willowvibe/plm-bom-pipeline",
      },
      {
        title: "Seven seeded defects",
        fact: "Cyclic BOMs, orphan parts, released assemblies with unreleased children, overlapping revision effectivity, zero or negative quantities, unit-of-measure mismatches and ECOs closed without an ECN, each caught by its own dbt test.",
        href: "https://github.com/willowvibe/plm-bom-pipeline",
      },
    ],
    relatedOfferSlugs: ["plm-readiness"],
    faq: [
      {
        question: "Do you migrate the data or check it?",
        answer:
          "We focus on readiness: automated checks, a defect report and cleanup recommendations before cutover. We can also work alongside your migration team on the data fixes. We can review the target model so the checks match the destination.",
      },
      {
        question: "Which PLM systems do you cover?",
        answer:
          "Windchill and Teamcenter, with a focus on BOM structure, part data, change records and reconciliation with ERP. We can include extracts from both systems in the same review.",
      },
      {
        question: "What does the readiness check cost?",
        answer:
          "The PLM migration readiness check starts at $3,000 and takes one to two weeks, depending on the data set. The exact scope depends on how many objects and change records the extract contains.",
      },
      {
        question: "Will you sign an NDA before we share PLM data?",
        answer:
          "Yes. We sign a mutual NDA before we access any data or systems, and we can start with an extract rather than a live connection. We can work from a sanitised extract if a live connection is not possible.",
      },
    ],
    tools: ["Windchill", "Teamcenter", "SQL", "dbt", "DuckDB", "PostgreSQL"],
  },
  {
    slug: "web-and-data-apps",
    name: "Web and data apps",
    h1: "Web and data apps for small teams",
    metaTitle: "Web and data apps | Dashboards and internal tools",
    metaDescription:
      "Dashboards, internal tools, integrations and client web apps built alongside the data work, with fixed quotes and code you own.",
    summary:
      "Dashboards, internal tools, integrations and client web apps that sit on top of the data work.",
    problem: [
      "The data is ready but the work still happens in spreadsheets and chat. People cannot see the numbers, update a record or hand a task to the next person without copying it by hand. The data work stays invisible until someone can act on it.",
      "An internal tool can become another system to maintain if it is built without tests, without clear ownership and without a path back to the source data. A tool nobody can maintain becomes a cost instead of a saving.",
      "Customer-facing work has the same problem from the other side: a slow or unclear site loses trust before anyone reads the content. The interface has to load quickly, explain itself and keep working when a dependency fails. We build for the person doing the task, not for a feature list.",
    ],
    approach: [
      "Agree the job of the page or tool: who uses it, what they decide and which data they need.",
      "Design the smallest interface that does that job, with clear states for loading, empty and error.",
      "Build the server-rendered pages and API routes, and connect them to the warehouse or source system. Keep the data definitions in one place.",
      "Add the integrations the workflow needs, such as payments, email, forms or a model endpoint.",
      "Test the paths that matter, then deploy with monitoring and a rollback path.",
      "Hand over the code, docs and a walkthrough so your team can run it. Cover deploys and common failures in the handover notes.",
    ],
    deliverables: [
      "A server-rendered web app or internal dashboard",
      "API routes and integrations for the agreed workflow",
      "Responsive layouts with accessible controls",
      "Tests for the critical paths",
      "Deployment and monitoring setup",
      "Code, docs and a handover session",
    ],
    proof: [
      {
        title: "Cosmic Saju",
        fact: "A live web app running at cosmicsaju.com.",
        href: "https://cosmicsaju.com",
      },
      {
        title: "Dikshithra Atelier",
        fact: "A live e-commerce store running at dikshithra.com.",
        href: "https://dikshithra.com",
      },
      {
        title: "willowvibe.com",
        fact: "This site runs on Next.js with server-rendered pages and an assistant that answers only from site facts.",
        href: "https://www.willowvibe.com",
      },
    ],
    relatedOfferSlugs: [],
    relatedOptions: ["hourly", "retainer"],
    faq: [
      {
        question: "Can you build the app and the data pipeline?",
        answer:
          "Yes. We often build the pipeline and the interface together so the data definitions stay consistent. That keeps the definitions and the screens in step.",
      },
      {
        question: "Do you work with our existing design?",
        answer:
          "Yes. We can follow an existing design system or build a clear interface in the style you already use. We keep the components and tokens consistent with what you already use.",
      },
      {
        question: "How do you price web work?",
        answer:
          "Web and data app work runs at $70 per hour, or $1,300 per month for 20 hours of steady improvements and support. We can also quote a fixed scope after a 30-minute call. Larger builds get a fixed quote after we see the scope.",
      },
      {
        question: "Who owns the app?",
        answer:
          "You do. Code and configuration transfer to you when the final invoice is paid, and we sign a mutual NDA before accessing your systems. We also hand over the deployment setup so you are not locked to us.",
      },
    ],
    tools: ["Next.js", "Python", "SQL", "PostgreSQL", "Docker"],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
