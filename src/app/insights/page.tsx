import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ARTICLES, formatArticleDate } from "@/lib/insights";
import { ArticleTitle } from "@/components/ArticleLayout";

export default function InsightsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <header className="relative max-w-3xl">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <h1 className="relative text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Insights
          </h1>
          <p className="relative text-gray-300 text-sm md:text-lg leading-relaxed">
            Build notes from the open-source tools we ship: what broke, how we
            fixed it, and what we&apos;d check in your stack.
          </p>
        </header>

        <div className="mt-10 md:mt-14 grid grid-cols-1 gap-5">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col rounded-2xl bg-neutral-900 border border-white/10 p-6 hover:border-cyan-400/40 transition-colors"
            >
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white leading-tight mb-2">
                <ArticleTitle title={article.title} />
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                {article.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] font-mono text-gray-400 mb-5">
                <time dateTime={article.published}>
                  {formatArticleDate(article.published)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{article.readingMinutes} min read</span>
                <span aria-hidden="true">·</span>
                <span className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-cyan-900/50 bg-cyan-950/30 px-2 py-0.5 text-[10px] text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
              <Link
                href={`/insights/${article.slug}`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 group-hover:gap-3 transition-all"
              >
                Read the article <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
