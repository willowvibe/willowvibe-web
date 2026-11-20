"use client";

import { useCallback, useEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function Reveal({ as = "div", delay = 0, className, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const attachRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { top } = el.getBoundingClientRect();
    if (top < window.innerHeight) return;

    el.classList.add("reveal-pending");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.remove("reveal-pending");
          el.classList.add("reveal-in");
          observer.disconnect();
          break;
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay]);

  const Tag = as;

  return (
    <Tag ref={attachRef} className={className} {...rest}>
      {children}
    </Tag>
  );
}
