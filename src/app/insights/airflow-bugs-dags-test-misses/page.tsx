import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getArticle, plainTitle } from "@/lib/insights";

const SLUG = "airflow-bugs-dags-test-misses";
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

export default function AirflowBugsArticlePage() {
  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout article={article}>
      <p>
        <code>airflow dags test</code> can be green while{" "}
        <code>make up</code> is broken. It runs tasks in one process and skips
        the parts of a real deployment where most Airflow bugs live. In PR #8 of{" "}
        <a
          href="https://github.com/willowvibe/data-pipeline-template"
          target="_blank"
          rel="noopener noreferrer"
        >
          data-pipeline-template
        </a>{" "}
        we fixed six failures that only appeared once the scheduler, the
        Execution API, container users and task parallelism were all involved.
        Each one passed <code>airflow dags test</code> and failed within minutes
        of a real start. Here is what broke, why the short test could not see
        it, and the exact fix that made the stack come up clean.
      </p>

      <h2>Why airflow dags test cannot catch these</h2>
      <p>
        <code>airflow dags test</code> is a useful debugging tool. It parses a
        DAG, creates a run and executes the tasks in-process against the
        metadata database. That is enough to catch an import error or a broken
        Python callable. It is not enough to test a deployment.
      </p>
      <p>
        The command never asks the scheduler to schedule anything. It does not
        go through the Execution API that workers use. It does not start a task
        in its configured container as its configured user. It does not run two
        tasks at once, so it cannot expose a race or a shared-file lock.
      </p>
      <p>
        A DAG can pass and still fail on <code>docker compose up</code> because
        of a missing shared environment variable, a UID mismatch on a bind
        mount, a missing directory, an init step that never ran, or two tasks
        opening the same database file. The test answers &quot;does this task
        run in this Python process?&quot; The deployment asks &quot;does this
        DAG run here, as this user, with these services?&quot; Those are
        different questions.
      </p>

      <h2>A triggered run stayed queued</h2>
      <p>
        <strong>Symptom:</strong> we triggered the DAG and the run stayed in{" "}
        <code>queued</code>. No task started and no task logged an error.
      </p>
      <p>
        <strong>Cause:</strong> <code>make up</code> unpaused the DAG before the
        dag-processor had registered it. The trigger was accepted, but there was
        no scheduler entry to pick it up yet.
      </p>
      <p>
        <strong>Fix:</strong> wait for registration before unpausing. Query the
        DAG list until the DAG is present, then unpause it. A fixed sleep hides
        the race on a fast machine and fails on a slow one.
      </p>
      <pre>
        <code>{`until airflow dags list | grep -q my_dag; do sleep 2; done
airflow dags unpause my_dag`}</code>
      </pre>
      <p>
        The same wait belongs in any script that triggers a new DAG right after
        startup.
      </p>

      <h2>Every task failed to reach the Execution API</h2>
      <p>
        <strong>Symptom:</strong> every task failed with{" "}
        <code>Could not reach the Execution API server</code>. The scheduler
        looked healthy, so the failure was easy to blame on the worker.
      </p>
      <p>
        <strong>Cause:</strong> the workers were calling an API address that was
        not set in their environment. A task that runs in a container does not
        inherit the address you used on your laptop, and the default is not the
        service name in your compose network.
      </p>
      <p>
        <strong>Fix:</strong> set{" "}
        <code>AIRFLOW__CORE__EXECUTION_API_SERVER_URL</code> in the shared
        environment used by the scheduler, the workers and the API server. Set
        it once, in the file all three read, instead of repeating it per
        service.
      </p>
      <pre>
        <code>{`AIRFLOW__CORE__EXECUTION_API_SERVER_URL=http://airflow-apiserver:8080/`}</code>
      </pre>
      <p>If the URL differs between services, you still have a bug.</p>

      <h2>Permission denied on data/raw</h2>
      <p>
        <strong>Symptom:</strong> <code>Permission denied: data/raw</code>. The
        directory existed and the compose file looked correct.
      </p>
      <p>
        <strong>Cause:</strong> the containers ran as root while the bind mount
        was owned by the host user. Airflow then tried to write as a different
        user and lost.
      </p>
      <p>
        <strong>Fix:</strong> run the containers as the host uid and create the
        directory before startup. Put the uid in one place so every service
        uses the same value.
      </p>
      <pre>
        <code>{`AIRFLOW_UID ?= $(id -u)`}</code>
      </pre>
      <pre>
        <code>{`mkdir -p data/raw`}</code>
      </pre>
      <p>
        The Makefile target should run <code>mkdir</code> before{" "}
        <code>docker compose up</code>, not after the first failure. That also
        makes a fresh checkout work without a manual step.
      </p>

      <h2>airflow-init failed with getpwuid(): uid not found</h2>
      <p>
        <strong>Symptom:</strong> the init container failed with{" "}
        <code>getpwuid(): uid not found</code>.
      </p>
      <p>
        <strong>Cause:</strong> the init command bypassed the official
        image&apos;s entrypoint and ran as a uid with no passwd entry. Airflow
        needs a resolvable user for its init steps.
      </p>
      <p>
        <strong>Fix:</strong> initialise through the image&apos;s{" "}
        <code>/entrypoint</code> and use the entrypoint flags for database
        migration and the first user. Let the image handle the setup it already
        knows how to do.
      </p>
      <pre>
        <code>{`airflow-init:
  entrypoint: /entrypoint
  environment:
    _AIRFLOW_DB_MIGRATE: "true"
    _AIRFLOW_WWW_USER_CREATE: "true"`}</code>
      </pre>
      <p>
        The uid stays host-owned through <code>AIRFLOW_UID</code>; the
        entrypoint is what makes the init run.
      </p>

      <h2>A dbt test ran before its model existed</h2>
      <p>
        <strong>Symptom:</strong> a dbt test failed because{" "}
        <code>city_extremes</code> did not exist yet. The model was defined, so
        the error looked like a broken dependency.
      </p>
      <p>
        <strong>Cause:</strong> Cosmos attached a parent model&apos;s tests to
        more than one downstream parent. The test could run before the model it
        needed was built.
      </p>
      <p>
        <strong>Fix:</strong> set{" "}
        <code>should_detach_multiple_parents_tests=True</code> so those tests
        are detached and scheduled after the model they test.
      </p>
      <pre>
        <code>{`DbtDag(
    ...,
    should_detach_multiple_parents_tests=True,
)`}</code>
      </pre>
      <p>
        A test that runs too early is not a data failure. It is a scheduling
        failure, and it will look like a data failure until you read the order
        of tasks.
      </p>

      <h2>DuckDB could not set a lock on the file</h2>
      <p>
        <strong>Symptom:</strong> <code>Could not set lock on file</code>. One
        task passed and the other failed, depending on timing.
      </p>
      <p>
        <strong>Cause:</strong> several tasks opened the same DuckDB file at the
        same time. DuckDB allows one writer, so parallelism that is safe in
        Postgres is not safe here.
      </p>
      <p>
        <strong>Fix:</strong> set <code>max_active_tasks=1</code> for a DuckDB
        DAG, and <code>max_active_runs=1</code> everywhere so two runs cannot
        share the file.
      </p>
      <pre>
        <code>{`with DAG(
    ...,
    max_active_runs=1,
    max_active_tasks=1,
):`}</code>
      </pre>
      <p>
        Use the warehouse&apos;s real concurrency limit in the DAG, not the
        default. The scheduler will happily start work that the storage cannot
        accept.
      </p>

      <h2>The CI job that runs the real stack</h2>
      <p>
        The lasting fix was not a longer checklist. It was a new{" "}
        <code>airflow-stack</code> CI job that renders the project, runs the
        real <code>make up</code>, and waits for every DAG run to succeed. The
        job starts the scheduler, the API server and the workers in the same
        containers and environment your team uses.
      </p>
      <pre>
        <code>{`airflow-stack:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: make render
    - run: make up
    - run: ./scripts/wait-for-dag-runs.sh`}</code>
      </pre>
      <p>
        <code>make render</code> catches template mistakes cheaply.{" "}
        <code>make up</code> catches the six bugs above. The wait script is
        what turns &quot;the containers started&quot; into &quot;the pipeline
        worked&quot;.
      </p>
      <p>
        Two details make the wait reliable. First, wait for DAG registration
        before unpausing, the same fix as bug one. Second, fail on a timeout and
        print the scheduler and worker logs, not just a red cross. A timeout
        without logs sends the next person back to the beginning.
      </p>
      <p>
        This job is slower than <code>airflow dags test</code>, and that is the
        point. It tests the thing that actually runs.
      </p>

      <h2>A checklist to take away</h2>
      <ul>
        <li>Run the real stack in CI, not only the parser and the task body.</li>
        <li>Wait for DAG registration before you unpause a new DAG.</li>
        <li>
          Put shared addresses such as{" "}
          <code>AIRFLOW__CORE__EXECUTION_API_SERVER_URL</code> in one
          environment file.
        </li>
        <li>
          Run containers as the host uid with{" "}
          <code>AIRFLOW_UID ?= $(id -u)</code>.
        </li>
        <li>Create bind-mount directories before startup, not after a failure.</li>
        <li>
          Initialise through the official image <code>/entrypoint</code> and
          its migration and user flags.
        </li>
        <li>
          Detach multiple-parent dbt tests with{" "}
          <code>should_detach_multiple_parents_tests=True</code>.
        </li>
        <li>
          Set <code>max_active_tasks=1</code> for DuckDB and{" "}
          <code>max_active_runs=1</code> everywhere.
        </li>
        <li>Make the CI wait fail with logs, not just an exit code.</li>
        <li>
          Treat <code>airflow dags test</code> as a unit check, never as a
          deployment test.
        </li>
      </ul>
    </ArticleLayout>
  );
}
