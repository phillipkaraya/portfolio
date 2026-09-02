"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import type { DeepProject } from "@/lib/projects";
import { SystemGlyph, type GlyphKind } from "@/components/system-glyph";

/**
 * The systems section.
 *
 * Six of seven systems are backend and cannot be screenshotted (the memory
 * graph must never be, since its corpus holds real transcripts), so each row
 * carries a generated canvas signature derived from what that system actually
 * does instead of a placeholder image.
 *
 * Rows are scroll-driven: each starts as a dashed wireframe and locks in as it
 * crosses the build line. The un-built state is reduced opacity, never
 * opacity 0, so a failed bundle still leaves the section readable.
 */

/** Which generated signature belongs to which system. */
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
  const rowsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [built, setBuilt] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = rowsRef.current.filter(Boolean) as HTMLDivElement[];

    if (reduced) {
      rows.forEach((r) => r.classList.add("is-built"));
      setBuilt(rows.length);
      return;
    }

    let ticking = false;
    function update() {
      ticking = false;
      const line = window.innerHeight * 0.82;
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
    <div className="mt-14">
      <div className="border-line flex items-center justify-between border-b pb-3 font-mono text-[10px] tracking-[0.14em] uppercase">
        <span className="text-muted">system assembly</span>
        <span className="text-royal tabular-nums">
          {built} / {projects.length} built
        </span>
      </div>
      <div aria-hidden className="bg-line h-px w-full">
        <div
          className="bg-royal h-px origin-left transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${projects.length ? built / projects.length : 0})` }}
        />
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              rowsRef.current[i] = el;
            }}
            className="assembly-row border-line bg-paper overflow-hidden rounded-xl border border-dashed transition duration-500"
          >
            <div className="grid gap-0 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              {/* Generated signature, not a screenshot. */}
              <div className="bg-night relative min-h-[168px] overflow-hidden md:min-h-full">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-70"
                  style={{
                    background:
                      "radial-gradient(28rem 14rem at 30% 0%, rgba(31,68,224,0.32), transparent 62%)",
                  }}
                />
                <div className="absolute inset-0 p-5">
                  <SystemGlyph kind={GLYPHS[p.slug] ?? "vectors"} seed={7 + i * 31} />
                </div>
                <span className="text-royal-light absolute top-4 left-5 font-mono text-[9.5px] tracking-[0.16em] uppercase">
                  {p.kicker}
                </span>
              </div>

              <div className="flex flex-col p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl leading-tight font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <Link
                    href={`/work/${p.slug}`}
                    className="text-muted hover:text-ink mt-1 shrink-0 transition"
                    aria-label={`Read the ${p.title} breakdown`}
                  >
                    <ArrowUpRight className="size-5" />
                  </Link>
                </div>

                <p className="text-muted mt-2.5 text-sm leading-relaxed">{p.summary}</p>

                {/* The technical breakdown: what the hard part actually was. */}
                {p.hardPart && (
                  <div className="border-line mt-5 border-l-2 pl-4">
                    <span className="text-muted font-mono text-[9.5px] tracking-[0.14em] uppercase">
                      the hard part
                    </span>
                    <p className="text-ink/80 mt-1.5 text-[13px] leading-relaxed">
                      {p.hardPart.problem}
                    </p>
                  </div>
                )}

                {/* Full stack, not a truncated chip row. */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="border-line text-muted rounded-md border px-2 py-1 font-mono text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="border-line mt-5 flex flex-wrap gap-x-7 gap-y-2 border-t pt-4 font-mono text-xs">
                  {p.stats.map((s) => (
                    <span key={s.label}>
                      <span className="text-royal text-base font-medium tabular-nums">
                        {s.value}
                        {s.unit}
                      </span>
                      <span className="text-muted ml-1.5">{s.label}</span>
                    </span>
                  ))}
                </div>

                {p.guard && (
                  <p className="text-muted mt-4 flex items-start gap-2 text-[11px] leading-relaxed">
                    <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                    <span>{p.guard.lead}</span>
                  </p>
                )}

                <Link
                  href={`/work/${p.slug}`}
                  className="text-ink mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium hover:underline"
                >
                  Read the breakdown
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
