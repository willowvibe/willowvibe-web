import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getArticle, plainTitle } from "@/lib/insights";

const SLUG = "plm-data-defects-before-migration";
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

export default function PlmDefectsArticlePage() {
  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout article={article}>
      <p>
        A PLM migration tool will move bad data as faithfully as good data, so
        the defects have to be found before cutover. Windchill and Teamcenter
        extracts are full of structures that the source team learned to work
        around: a BOM cycle, an orphan part, a released assembly with an
        unreleased child. The new system has no memory of those workarounds: it
        resolves the structure as written, and the failure surfaces in the
        target, in ERP, or in an audit months later.
      </p>

      <h2>Migration tools move data; they do not validate it</h2>
      <p>
        A migration tool answers one question: did the record arrive? It copies
        fields, maps attributes and preserves ids. It does not know that a
        revision range cannot overlap, that a released assembly needs released
        children, or that a quantity of zero is meaningless, because those are
        rules about your product data that live outside the mapping.
      </p>
      <p>
        The source system often accepts the same defects because people and
        workarounds absorb them. A planner knows which BOM to ignore, and an
        engineer knows which revision is real. After migration, that knowledge
        is not in the database, and the downstream ERP receives the same
        ambiguity without the human context.
      </p>
      <p>
        The checks below assume a simple extract: parts, BOM edges, revisions
        with effectivity dates, and change records. Each check is a singular dbt
        test that returns the failing rows. A test that returns no rows passes.
      </p>

      <h2>1. Cyclic BOMs</h2>
      <p>
        A cycle looks like an assembly that contains itself through a chain of
        children, such as A → B → C → A. It can arrive from a bad copy, a
        re-parenting mistake or a placeholder part that points back up the
        structure.
      </p>
      <p>
        The target PLM explodes the BOM recursively, so a cycle is an infinite
        loop or a hard error. The downstream ERP may reject the item or, worse,
        calculate a cost that includes itself. A recursive CTE finds the cycle by
        walking the edges and marking the first repeat.
      </p>
      <pre>
        <code>{`-- tests/assert_no_cyclic_bom.sql
WITH RECURSIVE walk AS (
  SELECT parent_part_id AS root, child_part_id AS node,
         ARRAY[parent_part_id, child_part_id] AS path,
         false AS closed
  FROM bom_edges
  UNION ALL
  SELECT w.root, e.child_part_id, w.path || e.child_part_id,
         e.child_part_id = ANY(w.path)
  FROM walk w
  JOIN bom_edges e ON e.parent_part_id = w.node
  WHERE NOT w.closed
)
SELECT DISTINCT root FROM walk WHERE closed;`}</code>
      </pre>

      <h2>2. Orphan parts</h2>
      <p>
        An orphan part exists but no assembly references it and it is not a
        top-level product. It may be a leftover from a deleted structure, a
        duplicate number or a part that was never attached.
      </p>
      <p>
        Orphans inflate the item master, break ownership and confuse ERP item
        creation. A released orphan is worse, because it looks valid and can be
        picked up by a downstream process. Detect released parts that appear as
        no one&apos;s child.
      </p>
      <pre>
        <code>{`-- tests/assert_no_orphan_parts.sql
SELECT p.part_id
FROM parts p
LEFT JOIN bom_edges e ON e.child_part_id = p.part_id
WHERE p.state = 'released'
  AND e.child_part_id IS NULL;`}</code>
      </pre>
      <p>
        Exclude legitimate top-level assemblies and adjust the rule to match how
        your source marks a product root.
      </p>

      <h2>3. Released assembly with an unreleased child</h2>
      <p>
        A released assembly contains a child part that is still in draft,
        review or obsolete. It looks like a structure problem, but it is a
        release-state problem.
      </p>
      <p>
        The target PLM will not release a structure whose children are not
        released, or it will release it with a hidden draft dependency. ERP then
        receives a manufacturable item with a component that cannot be procured
        or built. Detect the pair directly.
      </p>
      <pre>
        <code>{`-- tests/assert_no_released_assembly_unreleased_child.sql
SELECT b.parent_part_id, b.child_part_id
FROM bom_edges b
JOIN parts parent ON parent.part_id = b.parent_part_id
JOIN parts child ON child.part_id = b.child_part_id
WHERE parent.state = 'released'
  AND child.state <> 'released';`}</code>
      </pre>

      <h2>4. Overlapping revision effectivity</h2>
      <p>
        Two revisions of the same part have date ranges that overlap. For a
        period, the system cannot say which revision is current. This usually
        comes from a manual date edit, a copied record or a missing end date on
        the older revision.
      </p>
      <p>
        The target PLM resolves effectivity to one revision at a time. An overlap
        makes the answer depend on row order or on the query, and the ERP may
        consume the wrong revision for an order. A self-join on the part finds
        the pairs.
      </p>
      <pre>
        <code>{`-- tests/assert_no_overlapping_revision_effectivity.sql
SELECT a.part_id, a.revision, b.revision
FROM revisions a
JOIN revisions b
  ON a.part_id = b.part_id
 AND a.revision < b.revision
 AND a.effective_from < COALESCE(b.effective_to, DATE '9999-12-31')
 AND b.effective_from < COALESCE(a.effective_to, DATE '9999-12-31');`}</code>
      </pre>

      <h2>5. Zero or negative quantity</h2>
      <p>
        A BOM line carries a quantity of zero or less. It may be a placeholder, a
        data-entry error or a line that was meant to be deleted.
      </p>
      <p>
        A zero quantity produces a component that is in the structure but never
        consumed. A negative quantity produces a negative cost or a material
        requirement that cannot be planned. Either one corrupts cost roll-up and
        MRP in ERP, and the check needs no join.
      </p>
      <pre>
        <code>{`-- tests/assert_no_zero_or_negative_quantity.sql
SELECT parent_part_id, child_part_id, quantity
FROM bom_edges
WHERE quantity <= 0;`}</code>
      </pre>

      <h2>6. Unit-of-measure mismatch</h2>
      <p>
        The BOM line uses a unit that does not match the child part&apos;s base
        unit, and no conversion exists. It might say &quot;each&quot; where the
        part is stocked by length, or &quot;kg&quot; where the part is counted.
      </p>
      <p>
        The target system may accept the line and calculate nonsense. ERP then
        orders the wrong amount, or the cost is out by a large factor. Detect
        lines whose unit differs from the part base unit unless a conversion is
        defined.
      </p>
      <pre>
        <code>{`-- tests/assert_no_uom_mismatch.sql
SELECT b.parent_part_id, b.child_part_id, b.uom, p.base_uom
FROM bom_edges b
JOIN parts p ON p.part_id = b.child_part_id
WHERE b.uom <> p.base_uom
  AND NOT EXISTS (
    SELECT 1 FROM uom_conversions c
    WHERE c.from_uom = b.uom
      AND c.to_uom = p.base_uom
  );`}</code>
      </pre>

      <h2>7. ECO closed without an ECN</h2>
      <p>
        An engineering change order is closed but no engineering change notice
        exists for it. The paper trail jumps from the request to a closed order
        with no released notice in between.
      </p>
      <p>
        The target PLM keeps change history as the evidence for why a design
        changed. A missing notice leaves a gap that an auditor or a customer
        question will find. Detect closed ECOs with no matching ECN.
      </p>
      <pre>
        <code>{`-- tests/assert_no_eco_closed_without_ecn.sql
SELECT eco.eco_id
FROM eco
LEFT JOIN ecn ON ecn.eco_id = eco.eco_id
WHERE eco.status = 'closed'
  AND ecn.ecn_id IS NULL;`}</code>
      </pre>
      <p>
        The ECR → ECO → ECN chain matters because each step records a different
        decision. A missing ECN is not a formatting issue; it is missing
        evidence.
      </p>

      <h2>Prove each test catches only its own defect</h2>
      <p>
        A test that always fails is as useless as a test that never runs. We
        built a synthetic bicycle company to prove the checks work: 2,000 parts,
        18 products, five-level BOMs, revision effectivity dates and ECR → ECO →
        ECN change records. The dataset is clean enough to pass, then seven
        defects can be seeded one at a time.
      </p>
      <p>
        Each defect is caught by exactly one singular dbt test:{" "}
        <code>assert_no_cyclic_bom</code>,{" "}
        <code>assert_no_orphan_parts</code>,{" "}
        <code>assert_no_released_assembly_unreleased_child</code>,{" "}
        <code>assert_no_overlapping_revision_effectivity</code>,{" "}
        <code>assert_no_zero_or_negative_quantity</code>,{" "}
        <code>assert_no_uom_mismatch</code> and{" "}
        <code>assert_no_eco_closed_without_ecn</code>.
      </p>
      <p>
        <code>make verify-defects</code> runs the suite with each defect enabled
        and checks that exactly its own test fails. That catches an
        over-broad test before it hides a real problem, and it catches a test
        that has stopped testing anything. The example lives in{" "}
        <a
          href="https://github.com/willowvibe/plm-bom-pipeline"
          target="_blank"
          rel="noopener noreferrer"
        >
          plm-bom-pipeline
        </a>
        .
      </p>

      <h2>A pre-cutover checklist</h2>
      <ul>
        <li>Run the checks on the extract, not on the live schema.</li>
        <li>Fix defects in the source while the fix is still cheap.</li>
        <li>Rerun the same checks after every cleanup pass.</li>
        <li>Reconcile parts and quantities against ERP where both exist.</li>
        <li>Review the change history for gaps in the ECR → ECO → ECN chain.</li>
        <li>Freeze the data, take a final extract and run the whole suite again.</li>
        <li>Keep the report and the check code so the result can be audited.</li>
        <li>Do not cut over on a green migration count alone.</li>
      </ul>
      <p>
        A migration is ready when the data satisfies the rules, not when every
        row has arrived. The difference is the defects above.
      </p>
    </ArticleLayout>
  );
}
