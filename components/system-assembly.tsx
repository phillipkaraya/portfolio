"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DeepProject } from "@/lib/projects";
import { SystemGlyph, type GlyphKind } from "@/components/system-glyph";

/**
 * The systems section.
 *
 * Seven rows, so density is the constraint rather than impact: an expansive
 * card here costs a mobile reader seven full screens of scrolling before they
 * reach anything else. Each row is therefore one compact band with a small
 * diagram, and leads with the architectural mechanism rather than the hard
 * part, because seven consecutive obstacle statements read as a list of things
 * that went wrong instead of a body of engineering.
 *
 * Rows lock in as they cross the build line. The un-built state is reduced
 * opacity rather than opacity 0, so a failed bundle still leaves the section
 * readable.
 */

const GLYPHS: Record<string, GlyphKind> = {
  "trading-simulator": "agents",
  "memory-graph": "vectors",
  "acquisition-engine": "tiers",
  "airline-support-agent": "routing",
  "contact-resolution": "matching",
  "social-analytics": "reach",
  "whatsapp-booking-agent": "dialogue",
};

export function SystemAssembly({ projects }: { projects: DeepProject[] }) {
  const rowsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const [built, setBuilt] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = rowsRef.current.filter(Boolean) as HTMLAnchorElement[];

    if (reduced) {
      rows.forEach((r) => r.classList.add("is-built"));
      setBuilt(rows.length);
      return;
    }

    let ticking = false;
    function update() {
      ticking = false;
      const line = window.innerHeight * 0.86;
      let count = 0;
      rows.forEach((row) => {
        if (row.getBoundingClientRect().top < line) {
          row.classList.add("is-built");
          count++;
        } else {
          row.classList.remove("is-built");
        }
      });
      setBuilt(count);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="mt-12">
      <div className="border-line flex items-center justify-between border-b pb-2.5 font-mono text-[10px] tracking-[0.14em] uppercase">
        <span className="text-muted">system assembly</span>
        <span className="text-royal tabular-nums">
          {built} / {projects.length}
        </span>
      </div>
      <div aria-hidden className="bg-line h-px w-full">
        <div
          className="bg-royal h-px origin-left transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${projects.length ? built / projects.length : 0})` }}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            ref={(el) => {
              rowsRef.current[i] = el;
            }}
            className="assembly-row group border-line bg-paper hover:border-royal/40 block overflow-hidden rounded-lg border border-dashed transition duration-500"
          >
            <div className="grid grid-cols-[52px_minmax(0,1fr)] items-start gap-4 p-4 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-5 sm:p-5">
              {/* Small diagram, sized so seven of them stay scannable. */}
              <div className="bg-night relative aspect-square overflow-hidden rounded-md">
                <div className="absolute inset-1.5">
                  <SystemGlyph kind={GLYPHS[p.slug] ?? "vectors"} seed={7 + i * 31} />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  {/*
                    Wraps rather than truncates. A clipped system name is worse
                    than a second line, especially on a phone where this is the
                    only thing identifying the row.
                  */}
                  <h3 className="font-display text-[15px] leading-snug font-semibold tracking-tight text-balance sm:text-lg">
                    {p.title}
                  </h3>
                  <ArrowUpRight className="text-muted group-hover:text-royal mt-0.5 size-4 shrink-0 transition" />
                </div>

                {/* Mechanism, not obstacle. */}
                {p.mechanism && (
                  <p className="text-royal mt-1 font-mono text-[10px] leading-snug">
                    {p.mechanism.label}
                  </p>
                )}

                {/*
                  The detail is the payload on desktop and noise on a phone,
                  where seven of them cost several screens. Hidden below sm.
                */}
                <p className="text-muted mt-1.5 hidden text-[13px] leading-relaxed sm:line-clamp-2 sm:block">
                  {p.mechanism?.detail ?? p.summary}
                </p>

                <div className="text-muted mt-2 flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-[10px]">
                  {p.stats.slice(0, 3).map((s) => (
                    <span key={s.label}>
                      <span className="text-ink font-medium tabular-nums">
                        {s.value}
                        {s.unit}
                      </span>
                      <span className="ml-1">{s.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
