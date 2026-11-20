"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/home";

const visualPlaceholder = () => <div className="w-full h-48" />;

const BeforeAfterSlider = dynamic(
  () => import("@/components/BeforeAfterSlider").then((mod) => mod.BeforeAfterSlider),
  { ssr: false, loading: visualPlaceholder },
);
const DataStreamVisual = dynamic(
  () => import("@/components/DataStreamVisual").then((mod) => mod.DataStreamVisual),
  { ssr: false, loading: visualPlaceholder },
);
const AnomalyDetectionVisual = dynamic(
  () => import("@/components/AnomalyDetectionVisual").then((mod) => mod.AnomalyDetectionVisual),
  { ssr: false, loading: visualPlaceholder },
);
const CitationVisual = dynamic(
  () => import("@/components/CitationVisual").then((mod) => mod.CitationVisual),
  { ssr: false, loading: visualPlaceholder },
);

type ProjectCarouselProps = {
  children: ReactNode;
};

export function ProjectCarousel({ children }: ProjectCarouselProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const getStep = useCallback(() => {
    const scroller = sliderRef.current;
    if (!scroller) return 0;
    const first = scroller.firstElementChild as HTMLElement | null;
    if (!first) return 0;
    const styles = window.getComputedStyle(scroller);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return first.offsetWidth + gap;
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = sliderRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: index * getStep(), behavior: "smooth" });
    setActiveIndex(index);
  }, [getStep]);

  const handleScroll = useCallback(() => {
    const scroller = sliderRef.current;
    const step = getStep();
    if (scroller && step > 0) {
      setActiveIndex(Math.min(PROJECTS.length - 1, Math.round(scroller.scrollLeft / step)));
    }
  }, [getStep]);

  const goPrev = useCallback(() => {
    scrollToIndex((activeIndex - 1 + PROJECTS.length) % PROJECTS.length);
  }, [activeIndex, scrollToIndex]);

  const goNext = useCallback(() => {
    scrollToIndex((activeIndex + 1) % PROJECTS.length);
  }, [activeIndex, scrollToIndex]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  }, [goPrev, goNext]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion) return;
    const interval = setInterval(() => {
      scrollToIndex((activeIndex + 1) % PROJECTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, reduceMotion, activeIndex, scrollToIndex]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      <MotionConfig reducedMotion="user">
        <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {children}
          <div className="flex justify-center md:justify-end gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous project"
              className="w-10 h-10 rounded-full border border-neutral-600 bg-neutral-900 text-cyan-400 flex items-center justify-center hover:border-cyan-400 hover:scale-105 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next project"
              className="w-10 h-10 rounded-full border border-neutral-600 bg-neutral-900 text-cyan-400 flex items-center justify-center hover:border-cyan-400 hover:scale-105 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="relative">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 snap-x snap-mandatory py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                className="w-[calc(100vw-2rem)] md:w-[48%] lg:w-[32%] flex-none snap-start md:snap-center"
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          {PROJECTS.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              className="flex min-w-6 min-h-6 items-center justify-center rounded-full"
              aria-label={`Go to project ${index + 1}: ${project.title}`}
              aria-current={activeIndex === index}
            >
              <span
                className={`h-2 transition-all duration-300 rounded-full ${activeIndex === index ? "w-8 bg-cyan-400" : "w-2 bg-white/30"}`}
              />
            </button>
          ))}
        </div>
      </MotionConfig>
    </div>
  );
}

function ProjectCard({ title, tags, stat, desc, visual, link }: Project) {
  const isExternal = link.startsWith("http");
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div className="group relative p-4 md:p-6 h-full flex flex-col bg-neutral-800 border border-neutral-600 rounded-xl hover:border-cyan-400 transition-all duration-500">
      <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-white">
        <Link
          href={link}
          {...linkProps}
          className="hover:text-cyan-400 transition-colors"
        >
          {title}
        </Link>
      </h3>
      <p className="text-sm md:text-base text-gray-300 mb-4 flex-grow leading-relaxed">{desc}</p>
      <div className="mb-4">
        {visual === "slider" && <BeforeAfterSlider />}
        {visual === "stream" && <DataStreamVisual />}
        {visual === "anomaly" && <AnomalyDetectionVisual />}
        {visual === "citation" && <CitationVisual />}
      </div>
      <div className="pt-4 border-t border-neutral-600 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">{tags.map((tag) => (<span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-black/60 border border-neutral-500 text-cyan-400">{tag}</span>))}</div>
        <div className="font-mono text-xs text-cyan-300 font-bold bg-black/40 px-3 py-1 rounded border border-neutral-600">STATUS: {stat}</div>
      </div>
      <Link
        href={link}
        {...linkProps}
        className="mt-4 inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:gap-3 transition-all"
      >
        {isExternal ? "View project" : "Learn more"} <ArrowRight size={12} />
        <span className="sr-only"> {title}</span>
      </Link>
    </div>
  );
}
