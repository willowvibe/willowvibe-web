import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { BOOKING_URL } from "@/lib/site";
import { getService } from "@/lib/services";
import {
  ARTICLES,
  formatArticleDate,
  plainTitle,
  type Article,
} from "@/lib/insights";
import { TrackedLink } from "@/components/TrackedLink";

const SITE_URL = "https://www.willowvibe.com";

type ArticleLayoutProps = {
  article: Article;
  children: ReactNode;
};

export function ArticleTitle({ title }: { title: string }) {
  const parts = title.split("`");

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-cyan-200"
          >
            {part}
          </code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function ArticleLayout({ article, children }: ArticleLayoutProps) {
  const service = getService(article.relatedServiceSlug);
  const headline = plainTitle(article.title);
  const articleUrl = `${SITE_URL}/insights/${article.slug}`;
  const publishedDate = formatArticleDate(article.published);
  const otherArticles = ARTICLES.filter((item) => item.slug !== article.slug);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        headline,
        description: article.description,
        datePublished: article.published,
        dateModified: article.published,
        author: {
          "@type": "Person",
          name: "Harish Nagari",
        },
        publisher: {
          "@type": "Organization",
          name: "WillowVibe | Data Synapse",
          logo: `${SITE_URL}/logo.png`,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        url: articleUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Insights",
            item: `${SITE_URL}/insights`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: headline,
            item: articleUrl,
          },
        ],
      },
    ],
  };

  const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-600">
              ›
            </li>
            <li>
              <Link
                href="/insights"
                className="hover:text-primary transition-colors"
              >
                Insights
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-600">
              ›
            </li>
            <li aria-current="page" className="text-gray-300">
              <ArticleTitle title={article.title} />
            </li>
          </ol>
        </nav>

        <header>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            <ArticleTitle title={article.title} />
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-mono text-gray-400">
            <span className="text-gray-300">Harish Nagari</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.published}>{publishedDate}</time>
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
        </header>

        <div className="mt-8 text-[15px] md:text-base leading-7 text-gray-300 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-white md:[&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5 [&_strong]:text-white [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-cyan-300 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-cyan-200 [&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-neutral-900 [&_pre]:p-4 [&_pre]:text-xs [&_pre]:leading-relaxed md:[&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-200">
          {children}
        </div>

        <aside className="mt-12 rounded-2xl bg-neutral-900 border border-white/10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
            Want help with this?
          </h2>
          <p className="mt-2 text-sm md:text-base leading-relaxed text-gray-300">
            Our{" "}
            <Link
              href={`/services/${article.relatedServiceSlug}`}
              className="text-primary underline underline-offset-2 hover:text-cyan-300 transition-colors"
            >
              {service ? service.name : article.relatedServiceSlug}
            </Link>{" "}
            service covers this kind of work, from the first check to a clean
            handover.
          </p>
          <TrackedLink
            href={BOOKING_URL}
            event="book_call_click"
            props={{ location: `insight-${article.slug}` }}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition-all text-sm shadow-[0_0_25px_rgba(34,211,238,0.3)]"
          >
            Book a 30-minute call <ArrowRight size={15} aria-hidden="true" />
          </TrackedLink>
        </aside>

        <section className="mt-12">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 font-mono mb-4">
            More insights
          </h2>
          <ul className="flex flex-col gap-3">
            {otherArticles.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/insights/${item.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-white/10 bg-neutral-900 px-5 py-4 hover:border-cyan-400/40 transition-colors"
                >
                  <span className="text-sm md:text-base font-semibold text-white leading-snug">
                    <ArticleTitle title={item.title} />
                  </span>
                  <span className="inline-flex items-center gap-2 shrink-0 text-[11px] font-mono text-cyan-300">
                    {item.readingMinutes} min read
                    <ArrowRight
                      size={12}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
