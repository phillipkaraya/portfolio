import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  ClipboardList,
  FileText,
  FlaskConical,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BuildCard, DeepCard } from "@/components/project-cards";
import { Atmosphere, GithubIcon, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SignalField } from "@/components/signal-field";
import { SystemAssembly } from "@/components/system-assembly";
import { LiveRack } from "@/components/live-rack";
import { builds, counts, openSource, operations, platforms, systems } from "@/lib/projects";

const proof = [
  `${counts.total} shipped projects`,
  "Autonomous agents in production",
  "RAG eval harness + MCP server",
  "Next.js · Supabase · Cloudflare",
];

/** Shared section intro: mono kicker over a fading rule, then a serif headline. */
function SectionHead({
  kicker,
  title,
  lede,
  tone = "light",
}: {
  kicker: string;
  title: React.ReactNode;
  lede?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Reveal>
      <div className="flex items-center gap-3">
        <span
          className={`font-mono text-xs tracking-[0.18em] uppercase ${tone === "dark" ? "text-royal-light" : "text-red"}`}
        >
          {kicker}
        </span>
        <span
          aria-hidden
          className={`rule-fade h-px flex-1 ${tone === "dark" ? "text-white/25" : "text-line"}`}
        />
      </div>
      {/* text-balance stops headings breaking mid-hyphenate, e.g. "done-for-|you" */}
      <h2
        className={`font-display mt-4 max-w-[26ch] text-3xl leading-[1.08] font-semibold tracking-tight text-balance md:text-5xl ${tone === "dark" ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-4 max-w-[62ch] leading-relaxed ${tone === "dark" ? "text-white/60" : "text-muted"}`}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}

export default function Home() {
  // Applications carry an engine; sites are presentation layers. Splitting them
  // stops a brochure page sitting at the same visual weight as a scoring system.
  const applications = builds.filter((b) => b.buildTier === "application");
  const sites = builds.filter((b) => b.buildTier === "site");
  const featuredApplications = applications.slice(0, 6);

  return (
    <div>
      {/* ---------------------------------------------------------------- Hero */}
      <header className="bg-night relative overflow-hidden text-white">
        <Atmosphere />
        {/* Ambient retrieval-ranking field. Sits above the gradient, below copy. */}
        <SignalField />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <SiteHeader />

          <div className="py-20 md:py-32">
            <p className="text-royal-light font-mono text-xs tracking-[0.2em] uppercase">
              AI solutions engineer · forward-deployed
            </p>
            <h1 className="font-display mt-6 max-w-[17ch] text-5xl leading-[1.03] font-semibold tracking-tight text-balance md:text-7xl">
              I build AI systems that{" "}
              {/*
                A real text-decoration, not an absolutely positioned bar. The
                bar was `inline-block` + `w-full`, so once the phrase wrapped on
                mobile it drew across the full container instead of hugging the
                words. text-decoration wraps per line for free; the offset is
                tuned to clear descenders on "p" so skip-ink never breaks it.
              */}
              <span className="decoration-red underline decoration-[5px] underline-offset-[9px] md:decoration-[7px] md:underline-offset-[16px]">
                solve real problems
              </span>{" "}
              for real businesses.
            </h1>
            <p className="mt-7 max-w-[56ch] text-lg text-white/60">
              Not demos. Agents that have run unattended for months, retrieval stacks measured with
              real evals, and platforms that real teams log into every day. Two ways to work with me:
              embedded as an engineer on your team, or done-for-you builds for your business.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#systems"
                className="bg-royal hover:bg-royal-dark inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white transition"
              >
                See the systems <ArrowRight className="size-4" />
              </a>
              <a
                href="#hiring"
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:border-white/60"
              >
                For hiring teams
              </a>
            </div>
            <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-white/50">
              {proof.map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="bg-royal-light size-1.5 rounded-full" />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ Systems */}
      <section id="systems" className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <SectionHead
          kicker="Built and operated in-house"
          title={
            <>
              I don&rsquo;t just build them. <span className="text-royal">I run them.</span>
            </>
          }
          lede="Systems on my own infrastructure, most built for myself, where the hard problems get solved before a client ever pays for them. Every one of these is live right now."
        />
        {/* Live status rack: proximity-reactive, sparklines drawn per row. */}
        <Reveal className="mt-10">
          <LiveRack />
        </Reveal>
        {/* Scroll-driven assembly replaces the old uniform card grid. */}
        <SystemAssembly projects={systems} />
      </section>

      {/* ---------------------------------------------------------- Platforms */}
      <section id="platforms" className="bg-surface">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <SectionHead
            kicker="Platforms · The big builds"
            title={
              <>
                Beyond websites: <span className="text-royal">full platforms.</span>
              </>
            }
            lede="Multi-app systems with real users, real data, and real operations running through them, designed and shipped end to end."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {platforms.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 80}>
                <DeepCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Open source + CS */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <SectionHead
          kicker="Open source & measured work"
          title={
            <>
              Evals, not <span className="text-red">vibes.</span>
            </>
          }
          lede="Retrieval quality you can reproduce, plus a growth build measured end to end from ad spend to signed contract."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {openSource.map((o, i) => (
            <Reveal key={o.title} delay={i * 80}>
              <a
                href={o.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-line bg-paper flex h-full flex-col rounded-xl border p-6 transition duration-300 hover:-translate-y-1 hover:border-red/30 hover:shadow-[0_16px_44px_-20px_rgba(225,29,42,0.35)]"
              >
                <span aria-hidden className="bg-red mb-4 h-1 w-10 rounded-full" />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{o.title}</h3>
                  <GithubIcon className="text-muted group-hover:text-ink mt-1 size-4 shrink-0 transition" />
                </div>
                <p className="text-muted mt-2 text-sm leading-relaxed">{o.desc}</p>
                <span className="text-red mt-auto pt-5 font-mono text-sm">{o.metric}</span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={160}>
            <Link
              href="/work/tesla-rental-funnel"
              className="group border-line bg-paper flex h-full flex-col rounded-xl border p-6 transition duration-300 hover:-translate-y-1 hover:border-royal/30 hover:shadow-[0_16px_44px_-20px_rgba(31,68,224,0.35)]"
            >
              <span aria-hidden className="bg-royal mb-4 h-1 w-10 rounded-full" />
              <span className="text-muted font-mono text-[11px] tracking-wide uppercase">
                Case study · growth automation
              </span>
              <h3 className="font-display mt-2 text-xl font-semibold tracking-tight">
                Ad to signed contract in 14 days
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                Designed the creative, launched a Marketplace ad, and built an applicant-scoring and
                daily-digest pipeline that turned cold inbound into a signed, delivered deal.
              </p>
              <span className="text-royal mt-auto inline-flex items-center gap-1 pt-5 font-mono text-sm">
                $1,400/mo · 14-day cycle
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- Operations */}
      <section id="operations" className="bg-night relative overflow-hidden text-white">
        <Atmosphere intensity={0.55} />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <SectionHead
            tone="dark"
            kicker="Run at volume"
            title={
              <>
                Systems that had to work <span className="text-royal-light">thousands of times.</span>
              </>
            }
            lede="Generation, voice, and outbound, where the interesting problem is not making one of something work. It is the constraint that shows up once you need it to work at volume, under a cost ceiling or a regulator."
          />
          <div className="mt-12 flex flex-col gap-4">
            {operations.map((op, i) => (
              <Reveal key={op.slug} delay={i * 70}>
                <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                  <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
                    <div>
                      <span className="text-royal-light font-mono text-[10px] tracking-[0.16em] uppercase">
                        {op.kicker}
                      </span>
                      <h3 className="font-display mt-2.5 max-w-[30ch] text-xl leading-snug font-semibold tracking-tight md:text-2xl">
                        {op.title}
                      </h3>
                      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-white/60">
                        {op.summary}
                      </p>

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                          <span className="font-mono text-[9.5px] tracking-[0.16em] text-white/40 uppercase">
                            the constraint
                          </span>
                          <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                            {op.constraint}
                          </p>
                        </div>
                        <div>
                          <span className="text-royal-light font-mono text-[9.5px] tracking-[0.16em] uppercase">
                            what it took
                          </span>
                          <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                            {op.approach}
                          </p>
                        </div>
                      </div>

                      {op.guard && (
                        <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-white/45">
                          <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                          <span>{op.guard}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col justify-between gap-6">
                      <div className="flex flex-col gap-4 border-l border-white/10 pl-5">
                        {op.stats.map((s) => (
                          <div key={s.label}>
                            <span className="font-display block text-2xl leading-none font-semibold tabular-nums md:text-3xl">
                              {s.value}
                              <span className="text-royal-light text-base">{s.unit}</span>
                            </span>
                            <span className="mt-1.5 block font-mono text-[9.5px] tracking-[0.12em] text-white/40 uppercase">
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-5">
                        {op.stack.map((t) => (
                          <span
                            key={t}
                            className="rounded border border-white/12 px-1.5 py-0.5 font-mono text-[9.5px] text-white/50"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Products */}
      <section id="builds" className="bg-surface">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <SectionHead
            kicker="Applications"
            title={
              <>
                Products with an engine <span className="text-royal">behind them.</span>
              </>
            }
            lede="Each of these ingests data on a schedule, scores or matches it, and puts a ranked answer in front of someone. Every link opens the real thing, running in production."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredApplications.map((b, i) => (
              <Reveal key={b.name} delay={(i % 3) * 70}>
                <BuildCard build={b} />
              </Reveal>
            ))}
          </div>
          {/*
            Sites render as a dense link strip rather than image cards. They are
            real shipped work and belong on the page, but giving a brochure site
            the same card as a scoring engine flattens the difference between
            them, which is the thing this section exists to show.
          */}
          <Reveal className="mt-14">
            <div className="border-line flex items-center gap-3 border-t pt-6">
              <span className="text-muted font-mono text-[10px] tracking-[0.16em] uppercase">
                Sites shipped
              </span>
              <span aria-hidden className="rule-fade text-line h-px flex-1" />
              <span className="text-muted font-mono text-[10px] tabular-nums">{sites.length}</span>
            </div>
            <div className="mt-5 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-line/70 flex items-baseline justify-between gap-3 border-b py-2.5 transition"
                >
                  <span className="group-hover:text-royal text-sm font-medium transition">
                    {s.name}
                  </span>
                  <span className="text-muted font-mono text-[10px] tracking-wide">{s.kind}</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <Link
              href="/work"
              className="border-ink/15 hover:border-ink/40 inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition"
            >
              See all {counts.total} projects <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- Approach */}
      <section id="approach" className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <SectionHead
          kicker="Two ways to work"
          title={
            <>
              Embedded engineer, or <span className="text-royal">done-for-you.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="border-line bg-paper h-full rounded-xl border p-7">
              <Workflow className="text-royal size-6" />
              <h3 className="font-display mt-4 text-xl font-semibold">Embedded engineer</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                Drop in as a forward-deployed engineer: scope the problem with your customers, build
                the POC, and ship it to production. RAG, agents, evals, and the integrations that
                make it real.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="border-line bg-paper h-full rounded-xl border p-7">
              <Boxes className="text-red size-6" />
              <h3 className="font-display mt-4 text-xl font-semibold">Done-for-you projects</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                A fixed-scope AI build for your business: a workflow automation, an assistant over
                your data, or an internal tool, delivered end to end and live in weeks.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Hiring */}
      <section id="hiring" className="bg-royal relative overflow-hidden text-white">
        <div
          aria-hidden
          className="grain pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(40rem 20rem at 88% 0%, rgba(255,255,255,0.16), transparent 60%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-display max-w-[26ch] text-2xl leading-tight font-semibold tracking-tight md:text-4xl">
                For hiring teams: production code, evals, and shipped systems.
              </h2>
              <p className="mt-3 max-w-[52ch] text-sm text-white/75">
                Forward-deployed and AI solutions engineering. Remote, US. Read the work, then the
                résumé.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/phillipkaraya"
                className="text-royal inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-white/90"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
              <a
                href="/phillip-karaya-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/70"
              >
                <FileText className="size-4" />
                Résumé
              </a>
              <a
                href="https://github.com/phillipkaraya/rag-eval-harness"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/70"
              >
                <FlaskConical className="size-4" />
                Eval harness
              </a>
              <Link
                href="/audit/content-operations"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/70"
              >
                <ClipboardList className="size-4" />
                Audit sample
              </Link>
              <Link
                href="/writing/faithful-but-wrong"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/70"
              >
                <BookOpen className="size-4" />
                Writeup
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
