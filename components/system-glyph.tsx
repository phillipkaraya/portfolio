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
        // Four agents on independent orbits writing to one shared ledger at
        // the centre. Radii are derived from the box so this stays legible at
        // the small size the assembly row renders it.
        const cx = w / 2;
        const cy = h / 2;
        const unit = Math.min(w, h) / 2;
        c.lineWidth = 0.8;
        for (let i = 0; i < 4; i++) {
          const r = unit * (0.28 + i * 0.19);
          c.strokeStyle = INK + "0.16)";
          c.beginPath();
          c.arc(cx, cy, r, 0, Math.PI * 2);
          c.stroke();
          const a = t * (0.00016 + i * 0.00009) + i * 1.7;
          c.beginPath();
          c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.max(1.4, unit * 0.07), 0, Math.PI * 2);
          c.fillStyle = INK + "0.95)";
          c.fill();
        }
        c.beginPath();
        c.arc(cx, cy, Math.max(1.6, unit * 0.08), 0, Math.PI * 2);
        c.fillStyle = WARM + "0.9)";
        c.fill();
      }

      if (kind === "vectors") {
        // Embedding cloud with near-neighbours linked. Point count and link
        // radius scale with the box so it reads as a cluster, not a smear,
        // when drawn small.
        const unit = Math.min(w, h);
        const n = Math.max(38, Math.round(unit * 1.1));
        const linkDist = Math.pow(unit * 0.17, 2);
        const pts: Array<[number, number]> = [];
        for (let i = 0; i < n; i++) {
          const a = rnd() * Math.PI * 2;
          const rad = Math.pow(rnd(), 0.55) * unit * 0.46;
          pts.push([w / 2 + Math.cos(a) * rad, h / 2 + Math.sin(a) * rad]);
        }
        c.strokeStyle = INK + "0.16)";
        c.lineWidth = 0.5;
        for (let i = 0; i < pts.length; i += 2) {
          for (let j = i + 1; j < Math.min(i + 5, pts.length); j++) {
            const dx = pts[i][0] - pts[j][0];
            const dy = pts[i][1] - pts[j][1];
            if (dx * dx + dy * dy < linkDist) {
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
          c.arc(p[0], p[1], Math.max(0.9, unit * 0.017), 0, Math.PI * 2);
          c.fillStyle = INK + (0.45 + pulse).toFixed(2) + ")";
          c.fill();
        });
      }

      if (kind === "tiers") {
        // Cost escalation: a request steps up only when the cheaper tier fails,
        // so each bar is taller (more expensive) and most volume stops early.
        const bars = 4;
        const pad = w * 0.12;
        const usable = w - pad * 2;
        const bw = usable / bars;
        const base = h * 0.82;
        for (let i = 0; i < bars; i++) {
          const height = (h * 0.6) * (0.22 + i * 0.26);
          const x = pad + i * bw;
          c.fillStyle = INK + (0.5 - i * 0.1).toFixed(2) + ")";
          c.fillRect(x, base - height, bw - Math.max(2, bw * 0.22), height);
        }
        // The escalation path itself.
        c.strokeStyle = WARM + "0.55)";
        c.lineWidth = 1;
        c.setLineDash([2, 2]);
        c.beginPath();
        for (let i = 0; i < bars; i++) {
          const height = (h * 0.6) * (0.22 + i * 0.26);
          const x = pad + i * bw + (bw - Math.max(2, bw * 0.22)) / 2;
          const y = base - height - 3;
          i ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.stroke();
        c.setLineDash([]);
        c.strokeStyle = INK + "0.22)";
        c.beginPath();
        c.moveTo(pad, base);
        c.lineTo(w - pad, base);
        c.stroke();
      }

      if (kind === "routing") {
        // One inbound stream fanning out to service desks, with the selected
        // route emphasised. Desk count drops at small sizes to stay readable.
        const unit = Math.min(w, h);
        const desks = unit < 90 ? 5 : 8;
        const sx = w * 0.14;
        const sy = h / 2;
        const tx = w * 0.86;
        const top = h * 0.12;
        const span = h * 0.76;
        for (let i = 0; i < desks; i++) {
          const ty = top + (i * span) / (desks - 1);
          const hot = i === Math.floor(desks / 3);
          c.beginPath();
          c.moveTo(sx, sy);
          c.bezierCurveTo(w * 0.45, sy, w * 0.55, ty, tx, ty);
          c.strokeStyle = hot ? INK + "0.8)" : INK + "0.2)";
          c.lineWidth = hot ? 1.3 : 0.7;
          c.stroke();
          c.beginPath();
          c.arc(tx, ty, Math.max(1.1, unit * 0.026), 0, Math.PI * 2);
          c.fillStyle = hot ? WARM + "0.9)" : INK + "0.45)";
          c.fill();
        }
        c.beginPath();
        c.arc(sx, sy, Math.max(1.8, unit * 0.05), 0, Math.PI * 2);
        c.fillStyle = INK + "0.95)";
        c.fill();
      }

      if (kind === "matching") {
        // Entity resolution: two record columns, links weighted by confidence.
        // High-confidence joins are solid; low-confidence ones stay dashed and
        // unmerged, which is the actual decision the system makes.
        const rows = 7;
        const lx = w * 0.2;
        const rx = w * 0.8;
        const top = h * 0.14;
        const span = h * 0.72;
        for (let i = 0; i < rows; i++) {
          const y = top + (i * span) / (rows - 1);
          c.fillStyle = INK + "0.3)";
          c.fillRect(lx - 5, y - 1, 10, 2);
          c.fillRect(rx - 5, y - 1, 10, 2);
        }
        const links: Array<[number, number, boolean]> = [
          [0, 0, true],
          [1, 2, true],
          [2, 1, true],
          [3, 4, false],
          [4, 3, true],
          [5, 6, false],
        ];
        links.forEach(([a, b, confident]) => {
          const ay = top + (a * span) / (rows - 1);
          const by = top + (b * span) / (rows - 1);
          c.beginPath();
          c.moveTo(lx + 6, ay);
          c.bezierCurveTo(w * 0.45, ay, w * 0.55, by, rx - 6, by);
          c.strokeStyle = confident ? INK + "0.62)" : INK + "0.18)";
          c.lineWidth = confident ? 1.1 : 0.7;
          c.setLineDash(confident ? [] : [2, 3]);
          c.stroke();
          c.setLineDash([]);
        });
      }

      if (kind === "reach") {
        // Cumulative reach across platforms, one emphasised.
        const series = 4;
        for (let sIdx = 0; sIdx < series; sIdx++) {
          const r2 = lcg(seed + sIdx * 13);
          c.beginPath();
          let prev = h * 0.84;
          for (let i = 0; i <= 26; i++) {
            const x = (i / 26) * w;
            prev -= r2() * (h * 0.034);
            const y = Math.max(h * 0.08, prev + sIdx * (h * 0.03));
            i ? c.lineTo(x, y) : c.moveTo(x, y);
          }
          c.strokeStyle = sIdx === 0 ? WARM + "0.85)" : INK + (0.45 - sIdx * 0.1).toFixed(2) + ")";
          c.lineWidth = sIdx === 0 ? 1.3 : 0.8;
          c.stroke();
        }
      }

      if (kind === "dialogue") {
        // Alternating turns, the last one handing off to a human.
        const unit = Math.min(w, h);
        const msgs = unit < 90 ? 5 : 7;
        const top = h * 0.14;
        const span = h * 0.72;
        const barH = Math.max(3, unit * 0.075);
        for (let i = 0; i < msgs; i++) {
          const y = top + (i * span) / (msgs - 1);
          const right = i % 2 === 1;
          const bw2 = w * (0.3 + (i % 3) * 0.12);
          const x = right ? w * 0.9 - bw2 : w * 0.1;
          const handoff = i === msgs - 1;
          c.fillStyle = handoff ? WARM + "0.8)" : INK + (right ? "0.5)" : "0.24)");
          c.beginPath();
          c.roundRect(x, y - barH / 2, bw2, barH, barH / 2);
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
