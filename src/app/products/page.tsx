import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";

export default function ProductsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

        {/* Header */}
        <div className="text-center mb-10 md:mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse" />
          <h1 className="anim-fade-up text-4xl md:text-5xl font-extrabold tracking-tight">
            Our Products
          </h1>
          <p className="anim-fade-up anim-delay-1 max-w-2xl mx-auto text-gray-300 text-sm md:text-lg leading-relaxed">
            From open-source data tools to client-commissioned applications — everything we build is engineered to last.
          </p>
          <div className="anim-fade-up anim-delay-2 flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Live</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>In Development</span>
            </div>
          </div>
        </div>

        <ProductGrid />

        {/* Bottom CTA */}
        <Reveal as="div" className="mt-16 md:mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 mb-6 text-xs font-mono">
            <Star size={12} /> More products being engineered
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Have an app idea?</h2>
          <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            We take on select client app projects handling design, engineering, authentication, backend infrastructure and long-term maintenance.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-400 text-black font-bold rounded-xl hover:scale-105 transition-all text-sm md:text-base shadow-[0_0_25px_rgba(34,211,238,0.3)]"
          >
            Tell Us Your Idea <ArrowRight size={16} />
          </Link>
        </Reveal>

      </div>
    </div>
  );
}
