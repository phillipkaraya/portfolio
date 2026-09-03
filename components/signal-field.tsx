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

/**
 * The caption under the animation.
 *
 * This used to be a scoreboard reading "bm25 0.789 / hybrid 0.829 / dense
 * 0.957". Two problems: those are benchmark names a recruiter cannot parse,
 * and the panel sat at all zeros for the first third of every loop, so the
 * most common thing a visitor saw was a blank readout. It now narrates what
 * the animation is doing in words, and the phase it shows always matches the
 * phase the field is actually in.
 */
const PHASES = {
  searching: { label: "searching", note: "1,204 documents" },
  ranked: { label: "ranked", note: "40 best matches" },
} as const;

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
  const [phase, setPhase] = useState<keyof typeof PHASES>("searching");

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
      // Reduced motion gets the finished state, so the caption says "ranked".
      setPhase("ranked");
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

      // The caption tracks the field's own phase, so what it says is always
      // what the animation is doing. React bails out on an identical value,
      // so setting this every frame costs nothing.
      setPhase(ranked ? "ranked" : "searching");

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
      {/*
        One line, not a scoreboard. It says what the animation is doing in
        words a non-specialist reads at a glance, and it is never blank: both
        phases carry a label and a count.
      */}
      <div
        aria-hidden
        className="absolute top-28 right-8 z-20 hidden items-center gap-2.5 font-mono text-[10px] tracking-[0.12em] uppercase lg:flex"
      >
        <span className="bg-royal-light size-1.5 rounded-full" />
        <span className="text-royal-light">{PHASES[phase].label}</span>
        <span className="text-white/35">{PHASES[phase].note}</span>
      </div>
    </>
  );
}
