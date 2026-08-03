import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import type { Build, DeepProject, Accent } from "@/lib/projects";

const accentBar: Record<Accent, string> = {
  royal: "bg-royal",
  red: "bg-red",
  violet: "bg-violet",
};

const accentText: Record<Accent, string> = {
  royal: "text-royal",
  red: "text-red",
  violet: "text-violet",
};

const accentGlow: Record<Accent, string> = {
  royal: "group-hover:shadow-[0_18px_50px_-18px_rgba(31,68,224,0.45)]",
  red: "group-hover:shadow-[0_18px_50px_-18px_rgba(225,29,42,0.4)]",
  violet: "group-hover:shadow-[0_18px_50px_-18px_rgba(109,63,209,0.42)]",
};

/**
 * Card for a system or platform. Always routes to its own detail page.
 *
 * `showImage` exists because the two tiers are visually different: all four
 * platforms have screenshots, but only one of the seven systems does (the rest
 * are backend systems, and the memory graph must never be screenshotted). A
 * grid where one card carries an image and six do not reads as broken, so the
 * systems grid opts out and shows a uniform typographic row instead.
 */
export function DeepCard({
  project,
  showImage = true,
}: {
  project: DeepProject;
  showImage?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group border-line bg-paper relative flex h-full flex-col overflow-hidden rounded-xl border transition duration-300 hover:-translate-y-1 hover:border-transparent ${accentGlow[project.accent]}`}
    >
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${accentBar[project.accent]}`} />

      {showImage && project.image && (
        <div className="border-line relative aspect-[16/9] overflow-hidden border-b bg-surface">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <span className="text-muted font-mono text-[11px] tracking-wide uppercase">
          {project.kicker}
        </span>
        <h3 className="font-display mt-3 text-xl font-semibold tracking-tight">{project.title}</h3>
        <p className="text-muted mt-2 text-sm leading-relaxed">{project.summary}</p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
          {project.stats.slice(0, 3).map((s) => (
            <span key={s.label} className={accentText[project.accent]}>
              {s.value}
              {s.unit}
              <span className="text-muted"> {s.label}</span>
            </span>
          ))}
        </div>

        {project.guard && (
          <p className="text-muted mt-4 flex items-start gap-2 text-xs leading-relaxed">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
            <span>
              <strong className="text-ink font-medium">{project.guard.lead}</strong>
            </span>
          </p>
        )}

        <span className="text-ink mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium">
          Read the breakdown
          <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

/** Compact card for a live client build. Links straight to the running site. */
export function BuildCard({ build }: { build: Build }) {
  return (
    <a
      href={build.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group border-line bg-paper flex h-full flex-col overflow-hidden rounded-xl border transition duration-300 hover:-translate-y-1 hover:border-royal/30 hover:shadow-[0_16px_44px_-20px_rgba(10,11,13,0.35)]"
    >
      <div className="border-line bg-surface relative aspect-[16/10] overflow-hidden border-b">
        <Image
          src={build.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight font-semibold">{build.name}</h3>
          <ArrowUpRight className="text-muted mt-0.5 size-4 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-royal" />
        </div>
        <span className="text-royal mt-1 font-mono text-[11px] tracking-wide uppercase">
          {build.kind}
        </span>
        <p className="text-muted mt-3 text-sm leading-relaxed">{build.blurb}</p>
        <span className="text-muted mt-auto pt-4 font-mono text-xs">{build.domain}</span>
      </div>
    </a>
  );
}
