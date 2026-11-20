import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { getArticle, plainTitle } from "@/lib/insights";

const SLUG = "how-to-evaluate-a-rag-system";
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

export default function RagEvaluationArticlePage() {
  if (!article) {
    notFound();
  }

  return (
    <ArticleLayout article={article}>
      <p>
        A RAG demo is not evidence that retrieval works: a handful of friendly
        questions in a chat window tells you that the model can sound confident,
        not that it finds the right passage or that its answer matches the
        source. To know whether a RAG system is good, you need a fixed set of
        real questions and numbers you can compare across changes. This is how
        we build and read that eval in{" "}
        <a
          href="https://github.com/willowvibe/rag-docs-chatbot"
          target="_blank"
          rel="noopener noreferrer"
        >
          rag-docs-chatbot
        </a>
        .
      </p>

      <h2>&quot;The demo looked great&quot; is not evidence</h2>
      <p>
        Demos are chosen to work. You pick a question you know the answer to, the
        right document is in the index, and the model returns a clean paragraph.
        Nobody writes down the question that failed, and nobody reruns the same
        question after a prompt change, so the result feels like progress while
        the system stays unmeasured.
      </p>
      <p>
        The problem is that RAG has two separate jobs. Retrieval has to put the
        right passage in front of the model, and generation has to answer from
        that passage without adding claims. A good-sounding answer can hide a
        retrieval miss because the model may guess from general knowledge, while
        a correct retrieval can still produce a bad answer if the generation
        step ignores it.
      </p>
      <p>You cannot see either failure from one happy-path demo.</p>
      <p>
        An eval replaces impressions with a repeatable test. It does not need to
        be large. It needs to be fixed, honest and easy to rerun.
      </p>

      <h2>Build a golden set from real questions</h2>
      <p>
        Start with questions your users actually ask. Pull them from support
        tickets, search logs or the questions people send your team. Do not
        invent questions that match your document headings, because those are
        easy and they flatter the retriever.
      </p>
      <p>
        For each question, record the passage that answers it. Store the document
        id, the page or section, and a short quote. That passage is the ground
        truth for retrieval: if it is not in the top results, the retrieval
        failed, even if the final answer happens to be right.
      </p>
      <p>
        Include questions that cannot be answered from the corpus. A good RAG
        system should say &quot;I don&apos;t know&quot; instead of improvising.
      </p>
      <p>
        If every question in your set has an answer, you are only testing the
        easy half of the behaviour. We keep unanswerable questions in the set and
        score the refusal as the correct outcome.
      </p>
      <h2>Measure retrieval with hit@k and MRR</h2>
      <p>
        Hit@k asks a simple question: for each question, did at least one
        relevant passage appear in the top <em>k</em> results? Hit@5 is the
        fraction of questions where that happened. It is easy to explain and
        hard to game, because a missing passage is a real failure.
      </p>
      <p>
        Hit@k ignores position within the top <em>k</em>: a passage at rank one
        and the same passage at rank five score the same. That is why we also
        report MRR, the mean reciprocal rank.
      </p>
      <p>
        For each question, find the rank of the first relevant passage, take its
        reciprocal, and average those values. Rank one gives 1.0, rank two gives
        0.5, rank three gives 0.333, and no relevant result gives 0.
      </p>
      <p>
        A tiny worked example makes it concrete. Suppose the first question puts
        its relevant passage at rank three, so its reciprocal rank is 1/3 =
        0.333 and it is a hit@5.
      </p>
      <p>
        The second question has the relevant passage at rank one: reciprocal
        rank 1.0, also a hit. The third question has no relevant passage in the
        top five: reciprocal rank 0 and a miss.
      </p>
      <p>
        Across these three questions, hit@5 is 2/3 = 0.667 and MRR is (0.333 +
        1.0 + 0) / 3 = 0.444.
      </p>
      <p>
        Report both numbers. A system can have a high hit rate and a poor MRR if
        the right passage is usually present but buried. Since the model reads
        only the top few chunks, rank matters.
      </p>

      <h2>Judge answer faithfulness with care</h2>
      <p>
        Retrieval metrics do not tell you whether the answer is supported by the
        passages. That is the job of faithfulness.
      </p>
      <p>
        The usual approach is an LLM judge: give a model the question, the
        retrieved passages and the answer, then ask whether every claim in the
        answer is supported by the passages. Score each answer as faithful or
        not, and report the share that passes.
      </p>
      <p>
        An LLM judge is useful and imperfect. It can be too generous, it can
        disagree with a human on a borderline answer, and it can be swayed by the
        same fluent wording it is judging.
      </p>
      <p>
        Treat the score as a signal, not a certificate. Write a short rubric,
        keep it fixed, and spot-check a sample by hand every time you change the
        judge or the prompt.
      </p>
      <p>
        If the judge model changes, the score is a new measurement, not a
        continuation of the old one.
      </p>
      <h2>&quot;I don&apos;t know&quot; is a feature</h2>
      <p>
        A refusal is not a failure when the corpus does not contain the answer.
        An assistant that says &quot;I don&apos;t know&quot; is telling the user
        to look elsewhere.
      </p>
      <p>
        An assistant that guesses is telling the user something false with the
        same confident tone. For contracts, procedures and specs, the second
        behaviour is worse than no answer.
      </p>
      <p>
        Make refusal an explicit part of the eval. For an unanswerable question,
        a refusal is a pass.
      </p>
      <p>
        For an answerable question, a refusal is a miss, because the system
        failed to use the evidence it had. Both outcomes then become visible in
        one score, instead of being hidden in a demo.
      </p>

      <h2>Our numbers on a 40-question set</h2>
      <p>
        We ran a 40-question golden set against the{" "}
        <a
          href="https://github.com/willowvibe/rag-docs-chatbot"
          target="_blank"
          rel="noopener noreferrer"
        >
          rag-docs-chatbot
        </a>{" "}
        baseline. Evidence hit@5 was 87.5%, MRR was 0.713, and faithfulness
        judged by an LLM was 0.97. Those numbers describe that dataset and that
        setup, not RAG in general.
      </p>
      <p>
        Adding hybrid search and a MiniLM cross-encoder reranker raised hit@5 to
        92.5% and MRR to 0.805 on the same set. The reranker improves the order
        of the results, which is why MRR moves as well as hit@5. The change was
        accepted because the eval improved, not because the technology sounded
        modern.
      </p>
      <p>
        The same run also showed the limits. Five of the 40 questions still miss
        retrieval entirely.
      </p>
      <p>
        No prompt change fixes those, because the evidence never reaches the
        model. That list is the most useful output of the eval.
      </p>

      <h2>Treat the failure list as a to-do list</h2>
      <p>
        A score tells you whether the system improved. The failures tell you
        what to do next. Read every miss and group it by cause: a missing
        document, a chunk that split an answer in half, a query that used the
        wrong words, or a passage that exists but ranks too low.
      </p>
      <p>
        Missing documents are a content decision, bad chunks are an ingestion
        change, vocabulary mismatches are a reason to add hybrid search, and low
        ranks are a reason to try a reranker.
      </p>
      <p>
        Each category points at a different fix, and the eval keeps you from
        guessing which one applies.
      </p>
      <p>
        Re-read the refusal cases too. A system that refuses answerable questions
        is not safe, it is just quiet. The goal is to refuse only when the
        evidence is genuinely absent.
      </p>

      <h2>Rerun the eval on every change</h2>
      <p>
        An eval that runs once is a blog post. An eval that runs on every change
        is a tool.
      </p>
      <p>
        Rerun it when you change the prompt, swap the model, alter the chunk size
        or overlap, change the embedding model, add a reranker, or reingest a
        document set. Those are exactly the changes that can improve one question
        and break another.
      </p>
      <p>
        Keep the golden set and the runner in the repository. Store the scores
        with the commit or the run id, so a regression has a cause and a date.
      </p>
      <p>
        Make the eval cheap enough to run often, and keep a small hand-checked
        sample for the cases the judge is likely to get wrong. If a change lowers
        hit@5 or MRR, you now know before your users do.
      </p>

      <h2>A short Python runner</h2>
      <p>
        This snippet computes hit@5 and MRR from a list of ranked results. Each
        result is a list of <code>(doc_id, score)</code> pairs plus the set of
        relevant ids for that question. It has no dependencies, so it works as a
        starting point in your own pipeline.
      </p>
      <pre>
        <code>{`def hit_at_k(ranked, relevant, k=5):
    return any(doc_id in relevant for doc_id, _ in ranked[:k])

def reciprocal_rank(ranked, relevant):
    for rank, (doc_id, _) in enumerate(ranked, start=1):
        if doc_id in relevant:
            return 1 / rank
    return 0.0

results = [
    ([("p3", 0.91), ("p1", 0.88), ("p7", 0.40)], {"p1"}),
    ([("p2", 0.95), ("p9", 0.60)], {"p4"}),
]

n = len(results)
hit5 = sum(hit_at_k(ranked, rel) for ranked, rel in results) / n
mrr = sum(reciprocal_rank(ranked, rel) for ranked, rel in results) / n
print(f"hit@5={hit5:.3f} mrr={mrr:.3f}")`}</code>
      </pre>
      <p>
        Replace the hard-coded results with the output of your retriever, load
        the relevant ids from the golden set, and you have a report you can run
        in CI. Add a faithfulness call for the generated answers once retrieval
        is stable enough to judge.
      </p>

      <h2>A checklist to take away</h2>
      <ul>
        <li>Replace demo questions with a fixed golden set from real users.</li>
        <li>Label the passage that answers each question, not just the answer.</li>
        <li>Include unanswerable questions and score refusal as correct.</li>
        <li>Report hit@5 and MRR together, with a worked example for scale.</li>
        <li>Judge faithfulness with a fixed rubric and spot-check the judge.</li>
        <li>Read the misses and turn each one into a specific fix.</li>
        <li>Rerun the whole eval on every prompt, model or chunking change.</li>
        <li>Keep the eval and its history in the repo, not in a slide deck.</li>
      </ul>
    </ArticleLayout>
  );
}
