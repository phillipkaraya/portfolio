"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's ambient graphic: a particle field that renders retrieval ranking.
 *
 * Every particle carries a relevance score. The field cycles between a
 * scattered state and a ranked state, where particles are laid out on a spiral
 * whose radius is a function of rank, so the "resolve" is genuinely drawing a
 * ranked list rather than shuffling noise. The top-k ignite in royal; the tail
 * dims. The HUD counters below read from the same cycle clock as the animation,
 * so the numbers and the motion can never disagree.
 *
 * Rendered behind text, so it is aria-hidden and pointer-events flow through to
 * the copy. Falls back to a single static ranked frame under reduced motion.
 */

const CORPUS = 1204;
const TOP_K = 40;
const PARTICLES = 620;

/** Scores shown in the HUD. These are the harness's real reported figures. */
const SCORES = [
  { key: "bm25", value: 0.789 },
  { key: "hybrid", value: 0.829 },
  { key: "dense", value: 0.957, win: true },
] as const;

type Particle = {
  x: number;
  y: number;
  hx: number;
  hy: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
};

export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [readout, setReadout] = useState({ corpus: 0, scored: 0, progress: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;

    function seed() {
      // Relevance is skewed so most documents score low, which is what makes
      // the top-k cluster read as a real result set rather than an even ring.
      const scored = Array.from({ length: PARTICLES }, () => Math.pow(Math.random(), 2.1)).sort(
        (a, b) => b - a,
      );

      particles = scored.map((_, rank) => {
        const angle = (rank / PARTICLES) * Math.PI * 2 * 6;
        const radius = 26 + Math.pow(rank / PARTICLES, 0.62) * Math.min(width, height) * 0.46;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          hx: Math.random() * width,
          hy: Math.random() * height,
          tx: width * 0.74 + Math.cos(angle) * radius * 0.86,
          ty: height * 0.48 + Math.sin(angle) * radius * 0.52,
          vx: 0,
          vy: 0,
        };
      });
    }

    function resize() {
      const rect = host!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function paint(ease: number) {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const topK = i < TOP_K;
        const alpha = topK ? 0.3 + ease * 0.62 : 0.1 + (1 - ease) * 0.18;
        const size = topK ? 1.05 + ease * 0.9 : 0.75;
        ctx!.fillStyle = topK
          ? `rgba(111,139,255,${alpha.toFixed(3)})`
          : `rgba(148,160,190,${alpha.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      // One static ranked frame, plus final numbers.
      particles.forEach((p) => {
        p.x = p.tx;
        p.y = p.ty;
      });
      paint(1);
      setReadout({ corpus: CORPUS, scored: TOP_K, progress: 1 });
      return () => window.removeEventListener("resize", resize);
    }

    function onMove(e: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }
    function onLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const start = performance.now();

    function frame(now: number) {
      const elapsed = (now - start) / 1000;
      // 0-2.2s scattering, 2.2-6.4s ranked, then it re-scatters. A visitor
      // always lands mid-computation rather than on a finished still.
      const cycle = elapsed % 7.2;
      const ranked = cycle > 2.2 && cycle < 6.4;
      const ease = ranked ? Math.min(1, (cycle - 2.2) / 1.5) : Math.max(0, 1 - cycle / 1.6);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const goalX = p.hx + (p.tx - p.hx) * ease;
        const goalY = p.hy + (p.ty - p.hy) * ease;
        p.vx += (goalX - p.x) * 0.011;
        p.vy += (goalY - p.y) * 0.011;

        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 13000 && distSq > 0.01) {
          const force = (1 - distSq / 13000) * 1.5;
          const dist = Math.sqrt(distSq);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
      }

      paint(ease);

      const progress = ranked ? Math.min(1, (cycle - 2.2) / 1.5) : 0;
      setReadout({
        corpus: Math.round(CORPUS * (ranked ? 1 : Math.min(1, cycle / 2.2))),
        scored: Math.round(TOP_K * progress),
        progress,
      });

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
      <div
        aria-hidden
        className="absolute top-28 right-6 z-20 hidden w-52 rounded-md border border-white/10 bg-night/75 p-3 font-mono text-[10px] leading-[1.9] backdrop-blur-sm lg:block"
      >
        <div className="text-royal-light mb-1.5 text-[9px] tracking-[0.14em] uppercase">
          retrieval · live
        </div>
        <Row label="corpus" value={readout.corpus.toLocaleString()} />
        <Row label="scored" value={String(readout.scored)} />
        {SCORES.map((s) => (
          <Row
            key={s.key}
            label={s.key}
            value={(s.value * readout.progress).toFixed(3)}
            win={"win" in s}
          />
        ))}
      </div>
    </>
  );
}

function Row({ label, value, win }: { label: string; value: string; win?: boolean }) {
  return (
    <div className="flex justify-between text-white/45">
      <span>{label}</span>
      <span className={`tabular-nums ${win ? "text-royal-light" : "text-white/85"}`}>{value}</span>
    </div>
  );
}
