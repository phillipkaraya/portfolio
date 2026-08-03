"use client";

import { useEffect, useRef } from "react";
import type { Stat } from "@/lib/projects";

/**
 * Parses the leading number out of a stat value so it can be counted up.
 *
 * Stat values are deliberately free-form strings ("71,600", "~$1.40", "24/7",
 * "Multi", "12, 18"). Anything that is not a single clean number renders
 * static, which is correct: animating "12, 18 mo" would be nonsense.
 */
function parseCountable(value: string): { target: number; decimals: number } | null {
  // Reject values carrying a second number or a slash, e.g. "12, 18" or "24/7"
  if (value.includes("/") || (value.match(/\d+/g) ?? []).length > 1) return null;

  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  const numeric = match[2].replace(/,/g, "");
  const target = Number(numeric);
  if (!Number.isFinite(target)) return null;

  return { target, decimals: numeric.includes(".") ? numeric.split(".")[1].length : 0 };
}

/** Re-applies the source string's thousands grouping to an in-flight value. */
function format(n: number, decimals: number, original: string) {
  const fixed = n.toFixed(decimals);
  if (!original.includes(",")) return fixed;
  const [whole, frac] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}

/**
 * Counts a stat up when it scrolls into view.
 *
 * Writes textContent directly rather than going through React state. At 60fps
 * a state-driven counter would re-render the tree once per frame per stat; this
 * touches one text node instead. The server render already contains the FINAL
 * value, so no-JS clients and crawlers see the real number.
 */
function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parsed = parseCountable(value);
    if (!el || !parsed || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Reserve the final width so the layout does not jitter while counting
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    el.style.display = "inline-block";
    el.textContent = value.replace(/[\d,.]+/, format(0, parsed.decimals, value));

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // ease-out cubic: fast start, settles rather than stopping dead
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = value.replace(
            /[\d,.]+/,
            format(parsed.target * eased, parsed.decimals, value),
          );
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}

export function StatBlock({
  stats,
  tone = "light",
  className = "",
}: {
  stats: Stat[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const valueColor = tone === "dark" ? "text-white" : "text-ink";
  const labelColor = tone === "dark" ? "text-white/55" : "text-muted";
  const lineColor = tone === "dark" ? "border-white/12" : "border-line";

  return (
    // flex-wrap rather than auto-flow columns: stat arrays run 2 to 4 items and
    // must wrap on narrow screens instead of compressing to unreadable widths.
    <dl className={`flex flex-wrap gap-x-7 gap-y-5 ${className}`}>
      {stats.map((s) => (
        <div key={s.label} className={`border-l pl-4 first:border-l-0 first:pl-0 ${lineColor}`}>
          <dd
            className={`font-display text-3xl leading-none font-semibold md:text-4xl ${valueColor}`}
          >
            <AnimatedValue value={s.value} />
            {s.unit && <span className="align-top text-lg md:text-xl">{s.unit}</span>}
          </dd>
          <dt className={`mt-2 font-mono text-[11px] leading-snug tracking-wide ${labelColor}`}>
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
