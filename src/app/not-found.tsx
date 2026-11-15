import Link from "next/link";
import { Database, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 mb-6 text-xs font-mono tracking-wider">
          <Database className="w-3.5 h-3.5" />
          <span>404_NOT_FOUND</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight glow-text mb-4">404</h1>
        <p className="text-gray-400 text-base md:text-lg mb-8">
          This route does not exist in the data graph.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-black font-bold text-sm tracking-wide hover:bg-primary/90 transition-colors"
        >
          Back to Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
