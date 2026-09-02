"use client";

import { useEffect, useRef } from "react";

/**
 * A generated visual signature for each system.
 *
 * Six of the seven systems are backend and have no screenshot; the memory
 * graph must never be screenshotted at all, since its corpus holds real
 * session transcripts. So instead of a photograph, each system gets a canvas
 * drawing derived from what that system actually does: orbiting agents for the
 * trading simulator, a vector cloud for the memory graph, escalating retry
 * tiers for the scraper, and so on.
 *
 * Everything is deterministic. A small LCG seeded per slug keeps each drawing
 * stable across repaints, so a system's signature is always the same image.
 */

export type GlyphKind =
  | "agents"
  | "vectors"
  | "tiers"
  | "routing"
  | "matching"
  | "reach"
  | "dialogue";

const INK = "rgba(111,139,255,";
const WARM = "rgba(225,29,42,";

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function SystemGlyph({ kind, seed = 7 }: { kind: GlyphKind; seed?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function draw(t: number) {
      const w = cv!.clientWidth;
      const h = cv!.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv!.width !== w * dpr || cv!.height !== h * dpr) {
        cv!.width = w * dpr;
        cv!.height = h * dpr;
      }
      const c = ctx!;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      const rnd = lcg(seed);

      if (kind === "agents") {
        // Four agents on independent orbits around a shared ledger.
        const cx = w / 2;
        const cy = h / 2;
        c.strokeStyle = INK + "0.16)";
        c.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const r = 16 + i * 13;
          c.beginPath();
          c.ellipse(cx, cy, r * 1.5, r, 0, 0, Math.PI * 2);
          c.stroke();
        }
        for (let i = 0; i < 4; i++) {
          const r = 16 + i * 13;
          const speed = 0.00016 + i * 0.00009;
          const a = t * speed + i * 1.7;
          const x = cx + Math.cos(a) * r * 1.5;
          const y = cy + Math.sin(a) * r;
          c.beginPath();
          c.arc(x, y, 3, 0, Math.PI * 2);
          c.fillStyle = INK + "0.95)";
          c.fill();
          c.beginPath();
          c.arc(x, y, 7, 0, Math.PI * 2);
          c.strokeStyle = INK + "0.28)";
          c.stroke();
        }
        c.beginPath();
        c.arc(cx, cy, 3.5, 0, Math.PI * 2);
        c.fillStyle = WARM + "0.9)";
        c.fill();
      }

      if (kind === "vectors") {
        // A dense embedding cloud with a few near-neighbours linked.
        const pts: Array<[number, number]> = [];
        for (let i = 0; i < 130; i++) {
          const a = rnd() * Math.PI * 2;
          const rad = Math.pow(rnd(), 0.55) * Math.min(w, h) * 0.44;
          pts.push([w / 2 + Math.cos(a) * rad * 1.55, h / 2 + Math.sin(a) * rad]);
        }
        c.strokeStyle = INK + "0.14)";
        c.lineWidth = 0.6;
        for (let i = 0; i < pts.length; i += 3) {
          for (let j = i + 1; j < Math.min(i + 6, pts.length); j++) {
            const dx = pts[i][0] - pts[j][0];
            const dy = pts[i][1] - pts[j][1];
            if (dx * dx + dy * dy < 620) {
              c.beginPath();
              c.moveTo(pts[i][0], pts[i][1]);
              c.lineTo(pts[j][0], pts[j][1]);
              c.stroke();
            }
          }
        }
        pts.forEach((p, i) => {
          const pulse = reduced ? 0 : Math.sin(t * 0.0012 + i) * 0.18;
          c.beginPath();
          c.arc(p[0], p[1], 1.35, 0, Math.PI * 2);
          c.fillStyle = INK + (0.45 + pulse).toFixed(2) + ")";
          c.fill();
        });
      }

      if (kind === "tiers") {
        // Escalating fetch tiers: cheap attempts first, heavier ones behind.
        const rows = 5;
        const pad = 14;
        const bw = (w - pad * 2) / rows;
        for (let i = 0; i < rows; i++) {
          const height = (h - 28) * (0.24 + i * 0.18);
          const x = pad + i * bw;
          const y = h - 14 - height;
          c.fillStyle = INK + (0.13 + i * 0.16).toFixed(2) + ")";
          c.fillRect(x, y, bw - 6, height);
          if (i === rows - 1) {
            c.fillStyle = WARM + "0.75)";
            c.fillRect(x, y, bw - 6, 2.5);
          }
        }
        c.strokeStyle = INK + "0.2)";
        c.setLineDash([3, 3]);
        c.beginPath();
        c.moveTo(pad, h - 14);
        c.lineTo(w - pad, h - 14);
        c.stroke();
        c.setLineDash([]);
      }

      if (kind === "routing") {
        // One inbound stream fanning out to eight service desks.
        const sx = 16;
        const sy = h / 2;
        const desks = 8;
        for (let i = 0; i < desks; i++) {
          const ty = 14 + (i * (h - 28)) / (desks - 1);
          const tx = w - 18;
          c.beginPath();
          c.moveTo(sx, sy);
          c.bezierCurveTo(w * 0.42, sy, w * 0.55, ty, tx, ty);
          c.strokeStyle = INK + (i === 2 ? "0.75)" : "0.2)");
          c.lineWidth = i === 2 ? 1.6 : 0.9;
          c.stroke();
          c.beginPath();
          c.arc(tx, ty, 2.4, 0, Math.PI * 2);
          c.fillStyle = i === 2 ? WARM + "0.9)" : INK + "0.5)";
          c.fill();
        }
        c.beginPath();
        c.arc(sx, sy, 4.5, 0, Math.PI * 2);
        c.fillStyle = INK + "0.95)";
        c.fill();
      }

      if (kind === "matching") {
        // Two columns of records, with confident matches joined.
        const rows = 11;
        const lx = 22;
        const rx = w - 22;
        for (let i = 0; i < rows; i++) {
          const ly = 12 + (i * (h - 24)) / (rows - 1);
          c.fillStyle = INK + "0.32)";
          c.fillRect(lx - 7, ly - 1, 14, 2);
          const ry = 12 + (i * (h - 24)) / (rows - 1);
          c.fillRect(rx - 7, ry - 1, 14, 2);
        }
        // 64% resolution rate: seven of eleven rows link.
        const linked = [0, 1, 3, 4, 6, 8, 10];
        linked.forEach((i) => {
          const ly = 12 + (i * (h - 24)) / (rows - 1);
          const j = (i + (i % 3) - 1 + rows) % rows;
          const ry = 12 + (j * (h - 24)) / (rows - 1);
          c.beginPath();
          c.moveTo(lx + 8, ly);
          c.bezierCurveTo(w * 0.45, ly, w * 0.55, ry, rx - 8, ry);
          c.strokeStyle = INK + "0.42)";
          c.lineWidth = 0.9;
          c.stroke();
        });
      }

      if (kind === "reach") {
        // Views accumulating across four platforms.
        const series = 4;
        for (let s = 0; s < series; s++) {
          const r2 = lcg(seed + s * 13);
          c.beginPath();
          let prev = h * 0.86;
          for (let i = 0; i <= 30; i++) {
            const x = (i / 30) * w;
            prev -= r2() * (h * 0.031);
            const y = Math.max(8, prev + s * 4);
            i ? c.lineTo(x, y) : c.moveTo(x, y);
          }
          c.strokeStyle = s === 0 ? WARM + "0.8)" : INK + (0.5 - s * 0.11).toFixed(2) + ")";
          c.lineWidth = s === 0 ? 1.7 : 1;
          c.stroke();
        }
      }

      if (kind === "dialogue") {
        // Alternating message bubbles, one handing off to a human.
        const msgs = 7;
        for (let i = 0; i < msgs; i++) {
          const y = 12 + (i * (h - 26)) / (msgs - 1);
          const right = i % 2 === 1;
          const bw2 = 34 + (i % 3) * 16;
          const x = right ? w - 16 - bw2 : 16;
          const handoff = i === msgs - 1;
          c.fillStyle = handoff ? WARM + "0.72)" : INK + (right ? "0.5)" : "0.24)");
          c.beginPath();
          c.roundRect(x, y - 4, bw2, 8, 4);
          c.fill();
        }
      }

      if (!reduced && (kind === "agents" || kind === "vectors")) {
        raf = requestAnimationFrame(draw);
      }
    }

    draw(performance.now());
    const onResize = () => draw(performance.now());
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [kind, seed]);

  return <canvas ref={ref} aria-hidden className="block size-full" />;
}
