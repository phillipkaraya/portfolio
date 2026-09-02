"use client";

import { useEffect, useRef } from "react";

/**
 * The live status rack.
 *
 * Cards respond to cursor *proximity* rather than :hover, so the rack reacts
 * a beat before the pointer arrives, which is what makes it read as
 * instrumented rather than as a normal hover grid. A warm glow tracks the
 * cursor across the panel, and each row draws its own deterministic sparkline.
 *
 * Every value here is a real figure from the sweep. Nothing is invented.
 */

type Slot = {
  name: string;
  meta: string;
  seed: number;
  state: "live" | "open source";
};

const SLOTS: Slot[] = [
  { name: "Multi-agent trading simulator", meta: "4 agents · 120s scan loop", seed: 3, state: "live" },
  { name: "Operational memory graph", meta: "240,825 msg · 106,797 vec", seed: 7, state: "live" },
  { name: "Resilient acquisition engine", meta: "30 markets · 200 tests passing", seed: 11, state: "live" },
  { name: "RAG eval harness + MCP", meta: "0.957 nDCG@3 · 5 agent tools", seed: 5, state: "open source" },
];

export function LiveRack() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Sparklines. A tiny LCG keyed off each row's seed keeps the shape stable
    // across repaints while giving every row its own distinct signal.
    const sparks = Array.from(root.querySelectorAll<HTMLCanvasElement>("canvas[data-seed]"));
    function drawSparks() {
      sparks.forEach((cv) => {
        const w = cv.clientWidth;
        const h = 26;
        if (!w) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = w * dpr;
        cv.height = h * dpr;
        const c = cv.getContext("2d");
        if (!c) return;
        c.setTransform(dpr, 0, 0, dpr, 0, 0);

        let s = Number(cv.dataset.seed) || 1;
        const n = 34;
        const pts: number[] = [];
        for (let i = 0; i < n; i++) {
          s = (s * 9301 + 49297) % 233280;
          pts.push(0.35 + (s / 233280) * 0.5);
        }

        c.beginPath();
        pts.forEach((v, i) => {
          const x = (i / (n - 1)) * w;
          const y = h - v * h;
          if (i) c.lineTo(x, y);
          else c.moveTo(x, y);
        });
        c.strokeStyle = "rgba(111,139,255,0.9)";
        c.lineWidth = 1.1;
        c.stroke();
        c.lineTo(w, h);
        c.lineTo(0, h);
        c.closePath();
        c.fillStyle = "rgba(111,139,255,0.09)";
        c.fill();

        c.beginPath();
        c.arc(w - 1.5, h - pts[n - 1] * h, 1.8, 0, Math.PI * 2);
        c.fillStyle = "#6f8bff";
        c.fill();
      });
    }
    drawSparks();
    window.addEventListener("resize", drawSparks);

    if (reduced) {
      return () => window.removeEventListener("resize", drawSparks);
    }

    const slots = Array.from(root.querySelectorAll<HTMLElement>("[data-slot]"));

    function onMove(e: PointerEvent) {
      const rect = root!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (glowRef.current) {
        glowRef.current.style.left = `${mx}px`;
        glowRef.current.style.top = `${my}px`;
        glowRef.current.style.opacity = "1";
      }
      slots.forEach((s) => {
        const b = s.getBoundingClientRect();
        const cx = b.left + b.width / 2 - rect.left;
        const cy = b.top + b.height / 2 - rect.top;
        s.classList.toggle("is-near", Math.hypot(mx - cx, my - cy) < 210);
      });
    }

    function onLeave() {
      if (glowRef.current) glowRef.current.style.opacity = "0";
      slots.forEach((s) => s.classList.remove("is-near"));
    }

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("resize", drawSparks);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="bg-night relative overflow-hidden rounded-xl border border-white/10">
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-[left,top,opacity] duration-500 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(31,68,224,0.20), transparent 62%)",
        }}
      />

      <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/10 px-5 py-2.5 font-mono text-[9.5px] tracking-[0.14em] text-white/45 uppercase">
        <span className="flex items-center gap-2">
          <span className="pulse-dot bg-royal-light size-1.5 rounded-full" />4 systems live
        </span>
        <span>28 shipped</span>
        <span className="ml-auto">Remote, US</span>
      </div>

      <div className="relative grid gap-2 p-4 sm:grid-cols-2">
        {SLOTS.map((s) => (
          <div
            key={s.name}
            data-slot
            className="rack-slot bg-night-soft relative overflow-hidden rounded-md border border-white/10 p-4 transition duration-300"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-white/90">{s.name}</span>
              <span
                className={`shrink-0 rounded-sm border px-2 py-0.5 font-mono text-[8.5px] tracking-[0.12em] uppercase ${
                  s.state === "live"
                    ? "border-royal-light/30 text-royal-light"
                    : "border-white/15 text-white/45"
                }`}
              >
                {s.state}
              </span>
            </div>
            <canvas data-seed={s.seed} aria-hidden className="mt-3 block h-[26px] w-full" />
            <span className="mt-2 block font-mono text-[9.5px] tracking-wide text-white/40 tabular-nums">
              {s.meta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
