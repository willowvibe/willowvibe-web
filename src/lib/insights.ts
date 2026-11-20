export type Article = {
  slug: string;
  title: string;
  description: string;
  published: string;
  readingMinutes: number;
  tags: string[];
  relatedServiceSlug: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "airflow-bugs-dags-test-misses",
    title: "6 Airflow bugs that `airflow dags test` won't catch",
    description:
      "Six Airflow failures that pass `airflow dags test`: queued runs, Execution API errors, container permissions, init UIDs, Cosmos tests and DuckDB locks.",
    published: "2026-11-21",
    readingMinutes: 8,
    tags: ["Airflow", "CI", "Docker"],
    relatedServiceSlug: "data-pipelines",
  },
  {
    slug: "how-to-evaluate-a-rag-system",
    title: "How to evaluate a RAG system: hit@5, MRR and faithfulness",
    description:
      "How to evaluate RAG retrieval with a golden set, hit@5, MRR and faithfulness, plus the numbers from our 40-question eval.",
    published: "2026-11-21",
    readingMinutes: 7,
    tags: ["RAG", "Evaluation", "Retrieval"],
    relatedServiceSlug: "ai-on-your-data",
  },
  {
    slug: "plm-data-defects-before-migration",
    title:
      "7 PLM data defects to fix before a Windchill or Teamcenter migration",
    description:
      "Seven PLM data defects that break Windchill or Teamcenter migrations, how to detect each one, and what to check before cutover.",
    published: "2026-11-21",
    readingMinutes: 8,
    tags: ["PLM", "Data migration", "dbt"],
    relatedServiceSlug: "plm-data-migration",
  },
  {
    slug: "dbt-tests-every-pipeline-needs",
    title: "6 dbt tests every pipeline needs",
    description:
      "Six dbt tests every pipeline needs: key uniqueness, foreign keys, accepted values, source freshness and row-count checks that fail loudly.",
    published: "2026-11-21",
    readingMinutes: 6,
    tags: ["dbt", "Data quality", "Testing"],
    relatedServiceSlug: "data-pipelines",
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function plainTitle(title: string): string {
  return title.replace(/`/g, "");
}

const PUBLISHED_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatArticleDate(isoDate: string): string {
  return PUBLISHED_FORMATTER.format(new Date(isoDate));
}
