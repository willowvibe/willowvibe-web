import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getArticle, plainTitle } from "@/lib/insights";

const SLUG = "dbt-tests-every-pipeline-needs";
const article = getArticle(SLUG);

if (!article) {
  throw new Error(`Missing article data for ${SLUG}`);
}

export const metadata: Metadata = {
  title: { absolute: plainTitle(article.title) },
  description: article.description,
  alternates: { canonical: `/insights/${article.slug}` },
  openGraph: {
    type: "article",
    title: plainTitle(article.title),
    description: article.description,
    url: `/insights/${article.slug}`,
    publishedTime: article.published,
    authors: ["Harish Nagari"],
  },
  twitter: {
    card: "summary_large_image",
    title: plainTitle(article.title),
    description: article.description,
  },
};

export default function DbtTestsArticlePage() {
  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout article={article}>
      <p>
        Most dbt projects contain models with no tests at all, and those models
        fail silently. dbt will happily build a table from a join that dropped
        half the rows, a filter that matched nothing, or a status value nobody
        expected. Nothing turns red. The dashboard just shows a wrong number
        with the same confidence as a right one. Tests are the only part of a
        dbt project that makes a bad number visible. The six below cover keys,
        relationships, allowed values, freshness and volume. Each one is a few
        lines of YAML or SQL, and each one earns its place.
      </p>

      <h2>Models with zero tests fail silently</h2>
      <p>
        A dbt model is a <code>SELECT</code> statement. On its own it asserts
        nothing about the data that comes back. If an upstream column changes
        type, a join starts fanning out, or a source stops loading, the model
        still runs and still writes a table. The build is green because dbt only
        checks that the SQL executed.
      </p>
      <p>
        Tests are assertions that run against the result. They run after the
        model builds and return rows when the assertion is broken. A test that
        returns zero rows passes. That inversion is the whole mechanism: you
        write a query for the bad rows you never want to see, and dbt fails when
        it finds any.
      </p>
      <p>
        You do not need hundreds of tests. You need the ones that protect the
        grain, the joins, the allowed values, the load schedule and the size of
        the biggest tables. Start with these six.
      </p>

      <h2>1. unique on primary keys</h2>
      <p>
        Every model should have a declared grain, and the column or columns that
        define it should appear once per row. A <code>unique</code> test catches
        duplicate ingestion and fan-out joins, the two most common ways a model
        silently grows.
      </p>
      <pre>
        <code>{`models:
  - name: fct_orders
    columns:
      - name: order_id
        data_tests:
          - unique`}</code>
      </pre>
      <p>
        Use it on staging models and marts. A failure means the query produced
        more rows than the business entity, which usually means a join
        multiplied the data. If you are on an older dbt version, the key is{" "}
        <code>tests:</code> instead of <code>data_tests:</code>.
      </p>

      <h2>2. not_null on primary keys</h2>
      <p>
        A key that can be null is not a key. The <code>not_null</code> test
        catches missing values that otherwise flow into every downstream join
        and aggregate.
      </p>
      <pre>
        <code>{`models:
  - name: fct_orders
    columns:
      - name: order_id
        data_tests:
          - not_null`}</code>
      </pre>
      <p>
        A failure often means a left join missed its match, an upstream column
        changed, or a default value leaked through. Combine it with{" "}
        <code>unique</code> on the same column so the grain is protected from
        both directions.
      </p>

      <h2>3. relationships on foreign keys</h2>
      <p>
        A fact table is only useful if its keys resolve in the dimension. A{" "}
        <code>relationships</code> test checks that every value in one column
        exists in another model or source.
      </p>
      <pre>
        <code>{`models:
  - name: fct_orders
    columns:
      - name: customer_id
        data_tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id`}</code>
      </pre>
      <p>
        Run this on every foreign key. It catches orphan facts, late-arriving
        dimensions and type mismatches that silently fail to join. On a large
        warehouse the test can be slow, but a broken key is more expensive.
      </p>
      <p>
        If a foreign key is genuinely nullable, keep the test and filter the
        nulls in its config. Do not drop the test because some rows are allowed
        to have no match.
      </p>

      <h2>4. accepted_values on status columns</h2>
      <p>
        Status columns are enums owned by application code, and the database
        rarely enforces the list. When an app adds a new status, the warehouse
        sees an unfamiliar string and downstream logic quietly ignores those
        rows.
      </p>
      <pre>
        <code>{`models:
  - name: fct_orders
    columns:
      - name: status
        data_tests:
          - accepted_values:
              values: ["pending", "paid", "shipped", "cancelled"]`}</code>
      </pre>
      <p>
        Use this on every column whose meaning depends on a fixed set of values.
        It also catches casing changes, empty strings and placeholder values
        such as <code>unknown</code>. Keep the list in sync with the application
        enum, and treat a failure as a decision point rather than an automatic
        bug.
      </p>

      <h2>5. Source freshness</h2>
      <p>
        Freshness is not a data test. It answers a different question: did the
        source load at all? A pipeline can pass every row-level test while the
        extractor has been dead for two days and the tables simply stopped
        changing.
      </p>
      <pre>
        <code>{`sources:
  - name: raw
    schema: raw
    loaded_at_field: _loaded_at
    freshness:
      warn_after: { count: 6, period: hour }
      error_after: { count: 24, period: hour }
    tables:
      - name: orders`}</code>
      </pre>
      <p>
        Run it as its own step:
      </p>
      <pre>
        <code>{`dbt source freshness`}</code>
      </pre>
      <p>
        Point <code>loaded_at_field</code> at a real ingestion timestamp, not at
        a business <code>updated_at</code> that changes only when a row is
        edited. Set <code>warn_after</code> to the cadence you expect and{" "}
        <code>error_after</code> to the point where someone must act. Then put
        the command on a schedule; a freshness rule that never runs is
        documentation, not a check.
      </p>

      <h2>6. Row-count and volume checks on large fact tables</h2>
      <p>
        Some failures keep every key valid and every status legal while changing
        the amount of data. A filter becomes too narrow, a partition stops
        arriving, or a join starts dropping rows. A volume check catches that.
      </p>
      <p>
        A singular test is just a SQL file in <code>tests/</code> that returns
        bad rows. This one fails when the last seven days are suspiciously small
        or large:
      </p>
      <pre>
        <code>{`-- tests/assert_orders_row_count_reasonable.sql
with counts as (
    select count(*) as row_count
    from {{ ref('fct_orders') }}
    where order_date >= current_date - interval '7 day'
)

select *
from counts
where row_count < 1000
   or row_count > 1000000`}</code>
      </pre>
      <p>
        If you already use the dbt-utils package, you can express the same guard
        as a package test. Note that <code>dbt_utils.expression_is_true</code>{" "}
        is not part of core dbt; it needs the package installed and declared.
      </p>
      <pre>
        <code>{`models:
  - name: fact_daily_volume
    data_tests:
      - dbt_utils.expression_is_true:
          expression: "row_count between 1000 and 1000000"`}</code>
      </pre>
      <p>
        Set the bounds from your own history. A threshold copied from a blog
        post will either fire every day or never fire at all.
      </p>

      <h2>Test severity: warn versus error</h2>
      <p>
        Severity decides whether a failure stops the run. The default is{" "}
        <code>error</code>: dbt marks the test failed and the command exits
        non-zero. <code>warn</code> records the failure and lets the run
        continue.
      </p>
      <pre>
        <code>{`models:
  - name: fct_orders
    columns:
      - name: status
        data_tests:
          - accepted_values:
              values: ["pending", "paid", "shipped", "cancelled"]
              config:
                severity: warn`}</code>
      </pre>
      <p>
        Use <code>error</code> for keys, relationships and anything that
        protects the grain. Use <code>warn</code> for a noisy signal you are
        still cleaning up, or for a value you want to observe before enforcing.
        Volume checks can also use <code>error_if</code> and{" "}
        <code>warn_if</code> thresholds instead of a hard-coded pass mark.
      </p>
      <p>
        The rule is simple: if nobody would act on it today, make it a warning.
        If it must block bad data, make it an error. Do not set everything to{" "}
        <code>warn</code> and call the project tested.
      </p>

      <h2>Run the tests on a schedule and fail loudly in CI</h2>
      <p>
        A test that only runs on a laptop is a suggestion. Run{" "}
        <code>dbt build</code> after every load so tests run in dependency
        order, and run <code>dbt test</code> as a separate step when you want to
        check data without rebuilding models.
      </p>
      <pre>
        <code>{`dbt build --select state:modified+ --defer --state ./prod-manifest`}</code>
      </pre>
      <p>
        In CI, run the same tests against a small target on every pull request.
        dbt returns a non-zero exit code when an error-severity test fails, so
        the job goes red without extra scripting. Make that job required. A
        pipeline that is allowed to fail is a dashboard, not a gate.
      </p>
      <p>
        On a schedule, run the full build plus{" "}
        <code>dbt source freshness</code>. Alert on the first failure, not on
        the size of the next morning&apos;s report. The earlier a broken load is
        caught, the smaller the repair.
      </p>

      <h2>How PipelineProbe flags models with zero tests</h2>
      <p>
        You cannot fix a gap you cannot see.{" "}
        <a
          href="https://github.com/willowvibe/pipelineprobe"
          target="_blank"
          rel="noopener noreferrer"
        >
          PipelineProbe
        </a>{" "}
        is a one-command read-only audit of Airflow, dbt and the warehouse. It
        lists dbt models with zero tests or a failed last run, alongside DAG
        failure rates, tasks with no retries, stale DAGs, large tables and
        tables missing <code>created_at</code> or <code>updated_at</code>.
      </p>
      <pre>
        <code>{`pip install pipelineprobe`}</code>
      </pre>
      <p>
        It produces a 0–100 health score, an HTML report and a JSON report, and
        it can run as a CI gate. Use the model list as the work queue for the
        six tests above. A model with no tests and no owner is the first place
        to look when a number feels wrong.
      </p>

      <h2>A checklist to take away</h2>
      <ul>
        <li>
          Put <code>unique</code> and <code>not_null</code> on the key that
          defines each model&apos;s grain.
        </li>
        <li>
          Add a <code>relationships</code> test for every foreign key.
        </li>
        <li>
          Add <code>accepted_values</code> to every status or enum-like column.
        </li>
        <li>
          Configure source freshness on every source with a real load
          timestamp, and run <code>dbt source freshness</code>.
        </li>
        <li>
          Add a row-count guard to each large fact table, with bounds taken from
          your own history.
        </li>
        <li>
          Set severity on purpose: <code>error</code> for keys and
          relationships, <code>warn</code> for signals still being cleaned up.
        </li>
        <li>
          Run <code>dbt build</code> after every load and on every pull request,
          and make the CI job required.
        </li>
        <li>
          Audit models with zero tests regularly, starting with PipelineProbe.
        </li>
      </ul>
    </ArticleLayout>
  );
}
