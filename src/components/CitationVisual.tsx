"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function CitationVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative w-full h-48 bg-neutral-900 rounded-xl overflow-hidden border border-neutral-600 select-none shadow-inner flex flex-col justify-center gap-3 px-5"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:15px_15px]" />

      <div className="relative z-10 flex items-start gap-2">
        <span className="text-[9px] font-mono font-bold text-cyan-400 tracking-widest mt-1">
          ANSWER
        </span>
        <p className="text-xs text-gray-200 leading-snug">
          Disable an authenticator after 100 consecutive failed attempts
          <span className="ml-1.5 inline-flex items-center rounded border border-cyan-500/50 bg-cyan-950/40 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
            [1]
          </span>
        </p>
      </div>

      <div className="relative z-10 rounded-lg border border-neutral-700 bg-neutral-800/80 p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono font-bold text-cyan-400 tracking-widest">
            SP 800-63B · p. 41
          </span>
          <span className="text-[9px] font-mono text-gray-500">SOURCE [1]</span>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed">
          <motion.span
            className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone] bg-no-repeat"
            style={{
              backgroundImage:
                "linear-gradient(transparent 12%, rgba(253, 224, 71, 0.32) 12%, rgba(253, 224, 71, 0.32) 88%, transparent 88%)",
            }}
            initial={{ backgroundSize: "0% 100%" }}
            animate={inView ? { backgroundSize: "100% 100%" } : { backgroundSize: "0% 100%" }}
            transition={
              inView
                ? {
                    duration: 1.1,
                    ease: "easeInOut",
                    delay: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2.6,
                    repeatType: "reverse",
                  }
                : undefined
            }
          >
            the verifier SHALL limit consecutive failed authentication
            attempts &hellip; to no more than 100
          </motion.span>
        </p>
      </div>
    </div>
  );
}
