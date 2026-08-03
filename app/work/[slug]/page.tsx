import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleAlert, ShieldAlert, Wrench } from "lucide-react";
import { StatBlock } from "@/components/stat-block";
import { Reveal } from "@/components/reveal";
import { Atmosphere, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { deepProjects, getDeepProject, type Accent } from "@/lib/projects";

/** Prerender all 11 deep pages at build time. */
export function generateStaticParams() {
  return deepProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getDeepProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} · Phillip Karaya`,
      description: project.summary,
      images: project.image ? [project.image] : undefined,
    },
  };
}

const accentBg: Record<Accent, string> = {
  royal: "bg-royal",
  red: "bg-red",
  violet: "bg-violet",
};

const accentTextDark: Record<Accent, string> = {
  royal: "text-royal-light",
  red: "text-red-light",
  violet: "text-violet-light",
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getDeepProject(slug);
  if (!project) notFound();

  // Next/previous within the same tier, so navigation stays coherent
  const siblings = deepProjects.filter((p) => p.tier === project.tier);
  const index = siblings.findIndex((p) => p.slug === project.slug);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index < siblings.length - 1 ? siblings[index + 1] : null;

  return (
    <div>
      {/* ---------------------------------------------------------------- Hero */}
      <header className="bg-night relative overflow-hidden text-white">
        <Atmosphere intensity={0.9} />
        <div className="relative mx-auto w-full max-w-5xl px-6">
          <SiteHeader />

          <div className="py-14 md:py-20">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-xs text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="size-3.5" />
              All work
            </Link>

            <p
              className={`mt-8 font-mono text-xs tracking-[0.18em] uppercase ${accentTextDark[project.accent]}`}
            >
              {project.kicker}
            </p>
            <h1 className="font-display mt-4 max-w-[20ch] text-4xl leading-[1.04] font-semibold tracking-tight md:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-[58ch] text-lg text-white/60">{project.summary}</p>

            <StatBlock stats={project.stats} tone="dark" className="mt-12" />
          </div>
        </div>
      </header>

      <main>
        {/* ------------------------------------------------------- Screenshot */}
        {project.image && (
          <div className="bg-surface">
            <div className="mx-auto w-full max-w-5xl px-6">
              <Reveal>
                <div className="border-line relative -mt-10 aspect-[16/9] overflow-hidden rounded-xl border bg-white shadow-[0_28px_70px_-30px_rgba(10,11,13,0.5)]">
                  <Image
                    src={project.image}
                    alt={`${project.title} interface`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover object-top"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- Body */}
        <section className={`${project.image ? "bg-surface" : ""}`}>
          <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16">
              {/*
                What / so what. The third beat, "now what", gets the dark band
                further down so the page ends on the takeaway rather than on
                detail.
              */}
              <Reveal className="space-y-9">
                <div>
                  <h2 className="text-muted font-mono text-[11px] tracking-[0.16em] uppercase">
                    What it is
                  </h2>
                  <p className="text-ink/85 mt-3 text-lg leading-relaxed">{project.what}</p>
                </div>
                <div>
                  <h2 className="text-muted font-mono text-[11px] tracking-[0.16em] uppercase">
                    Why it matters
                  </h2>
                  <p className="text-ink/85 mt-3 text-lg leading-relaxed">{project.soWhat}</p>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="md:sticky md:top-8">
                  <h2 className="text-muted font-mono text-[11px] tracking-[0.16em] uppercase">
                    Stack & techniques
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <li
                        key={s}
                        className="border-line text-ink/75 rounded-full border bg-white px-3 py-1.5 font-mono text-xs"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>

                  {project.links && project.links.length > 0 && (
                    <div className="mt-8 flex flex-col gap-2">
                      {project.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-between gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
                            l.kind === "primary"
                              ? `${accentBg[project.accent]} text-white hover:opacity-90`
                              : "border-line hover:border-ink/40 border"
                          }`}
                        >
                          {l.label}
                          <ArrowUpRight className="size-4" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ Guard note */}
        {project.guard && (
          <section className="mx-auto w-full max-w-5xl px-6 pb-4">
            <Reveal>
              <div className="border-line flex gap-4 rounded-xl border bg-white p-6">
                <ShieldAlert className={`size-5 shrink-0 ${accentTextDark[project.accent]}`} />
                <p className="text-muted text-sm leading-relaxed">
                  <strong className="text-ink font-semibold">{project.guard.lead}</strong>{" "}
                  {project.guard.text}
                </p>
              </div>
            </Reveal>
          </section>
        )}

        {/* --------------------------------------------------------- Modules */}
        {project.modules && project.modules.length > 0 && (
          <section className="mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="text-muted font-mono text-xs tracking-[0.18em] uppercase">
                  {project.modulesTitle ?? "What it does"}
                </span>
                <span aria-hidden className="rule-fade text-line h-px flex-1" />
              </div>
            </Reveal>
            <ul className="border-line mt-8 grid gap-px overflow-hidden rounded-xl border bg-line sm:grid-cols-2">
              {project.modules.map((m, i) => (
                <li key={m.name} className="bg-paper p-5">
                  <span className="text-muted font-mono text-[11px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display-sm text-ink mt-1 text-base font-semibold">{m.name}</h3>
                  <p className="text-muted mt-1 text-sm leading-relaxed">{m.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ------------------------------------------------------- Hard part */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-14 pb-16 md:pt-16 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="text-muted font-mono text-xs tracking-[0.18em] uppercase">
                Shipping it
              </span>
              <span aria-hidden className="rule-fade text-line h-px flex-1" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="border-line bg-surface mt-8 grid gap-8 rounded-xl border p-7 md:grid-cols-2 md:gap-10 md:p-9">
              <div>
                <h2 className="text-ink flex items-center gap-2 text-sm font-semibold">
                  <CircleAlert className={`size-4 ${accentTextDark[project.accent]}`} />
                  What made it hard
                </h2>
                <p className="text-muted mt-3 leading-relaxed">{project.hardPart.problem}</p>
              </div>
              <div className="border-line md:border-l md:pl-10">
                <h2 className="text-ink flex items-center gap-2 text-sm font-semibold">
                  <Wrench className={`size-4 ${accentTextDark[project.accent]}`} />
                  How I handled it
                </h2>
                <p className="text-muted mt-3 leading-relaxed">{project.hardPart.solution}</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------------------------------------------------------- Proves */}
        <section className="bg-night relative overflow-hidden text-white">
          <Atmosphere intensity={0.6} />
          <div className="relative mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
            <Reveal>
              <span
                className={`font-mono text-xs tracking-[0.18em] uppercase ${accentTextDark[project.accent]}`}
              >
                So what now
              </span>
              <p className="font-display mt-5 max-w-[36ch] text-2xl leading-[1.25] font-semibold tracking-tight text-balance md:text-4xl">
                {project.nowWhat}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------ Prev / next */}
        <nav className="mx-auto w-full max-w-5xl px-6 py-12">
          <div className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/work/${prev.slug}`}
                className="group border-line hover:border-ink/30 rounded-xl border p-5 transition"
              >
                <span className="text-muted flex items-center gap-2 font-mono text-[11px] uppercase">
                  <ArrowLeft className="size-3.5" /> Previous
                </span>
                <span className="font-display-sm mt-2 block font-semibold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/work/${next.slug}`}
                className="group border-line hover:border-ink/30 rounded-xl border p-5 text-right transition sm:col-start-2"
              >
                <span className="text-muted flex items-center justify-end gap-2 font-mono text-[11px] uppercase">
                  Next <ArrowRight className="size-3.5" />
                </span>
                <span className="font-display-sm mt-2 block font-semibold">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}
