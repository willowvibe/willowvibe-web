import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BOOKING_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { TrackedLink } from "@/components/TrackedLink";

export default function ServicesPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <header className="relative max-w-3xl">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <h1 className="relative text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Services
          </h1>
          <p className="relative text-gray-300 text-sm md:text-lg leading-relaxed">
            Data engineering and AI on your own data for small teams, with fixed
            scope and fixed prices. Each service is backed by open-source tools
            we&apos;ve shipped.
          </p>
        </header>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICES.map((service) => (
            <article
              key={service.slug}
              className="group flex flex-col rounded-2xl bg-neutral-900 border border-white/10 p-6 hover:border-cyan-400/40 transition-colors"
            >
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white leading-tight mb-2">
                {service.name}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                {service.summary}
              </p>
              <ul className="flex flex-wrap gap-2 mb-5">
                {service.tools.map((tool) => (
                  <li
                    key={tool}
                    className="text-[10px] font-mono px-2 py-1 rounded border border-cyan-900/50 bg-cyan-950/30 text-cyan-300"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 group-hover:gap-3 transition-all"
              >
                Explore {service.name} <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-12 md:mt-16">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 p-6 md:p-10 text-center">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
                Not sure which fits?
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6">
                Book a 30-minute call and get a fixed quote within 48 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <TrackedLink
                  href={BOOKING_URL}
                  event="book_call_click"
                  props={{ location: "services-hub" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition-all text-sm shadow-[0_0_25px_rgba(34,211,238,0.3)]"
                >
                  Book a 30-minute call <ArrowRight size={15} aria-hidden="true" />
                </TrackedLink>
                <Link
                  href="/work-with-us"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-white/15 text-gray-200 font-bold rounded-xl hover:border-cyan-400 hover:text-white hover:scale-105 transition-all text-sm"
                >
                  See all offers <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
