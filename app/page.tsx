import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  FileText,
  FlaskConical,
  Mail,
  Workflow,
} from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";

const proof = [
  "Next.js + Supabase in prod",
  "RAG eval harness",
  "Claude API & MCP servers",
  "20+ shipped deployments",
];

const work = [
  {
    tag: "Case study · growth automation",
    title: "Ad to signed contract in 14 days",
    desc: "Designed the creative, launched a Marketplace ad, and built an applicant-scoring and daily-digest pipeline that turned cold inbound into a signed, delivered deal.",
    metric: "$1,400/mo recurring · 14-day cycle",
    cta: "Read the case study",
    href: "/work/tesla-rental-funnel",
    accent: "royal" as const,
  },
  {
    tag: "Open source · applied AI",
    title: "rag-eval-harness",
    desc: "A reproducible benchmark for RAG retrieval quality across lexical, semantic, and hybrid retrievers, scored on recall, precision, MRR, and nDCG.",
    metric: "dense retriever · 0.957 nDCG@3",
    cta: "View on GitHub",
    href: "https://github.com/phillipkaraya/rag-eval-harness",
    accent: "red" as const,
  },
  {
    tag: "Open source · MCP server",
    title: "rageval-mcp",
    desc: "An MCP server that exposes end-to-end RAG evaluation as agent tools: benchmark BM25, TF-IDF, dense, and hybrid retrieval, then score the answers a model generates for faithfulness and correctness with an LLM judge running on Cloudflare Workers AI (no Anthropic key), over a corpus you can swap at runtime.",
    metric: "5 tools · Cloudflare Workers AI judge",
    cta: "View on GitHub",
    href: "https://github.com/phillipkaraya/rageval-mcp",
    accent: "red" as const,
  },
  {
    tag: "Product · multi-tenant SaaS",
    title: "Intellovate Command",
    desc: "A multi-tenant marketing operations platform on Next.js and Supabase with row-level-security isolation, shipped to production.",
    metric: "Next.js 16 · Supabase RLS · live",
    cta: "About the build",
    href: "#contact",
    accent: "royal" as const,
  },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.74 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.2 1.18a11 11 0 0 1 5.82 0c2.23-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div>
      <header className="relative overflow-hidden bg-night text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55rem 28rem at 82% -12%, rgba(31,68,224,0.28), transparent 60%), radial-gradient(38rem 20rem at -5% 0%, rgba(225,29,42,0.12), transparent 55%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <nav className="relative flex items-center justify-between py-6">
            <span className="font-display text-lg font-bold tracking-tight">Phillip Karaya</span>
            <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
              <a href="#work" className="transition hover:text-white">Work</a>
              <a href="#approach" className="transition hover:text-white">Approach</a>
              <a href="#hiring" className="transition hover:text-white">For hiring teams</a>
              <a href="#contact" className="transition hover:text-white">Contact</a>
            </div>
            <a
              href="#contact"
              className="hidden rounded-lg bg-royal px-4 py-2 text-sm font-medium text-white transition hover:bg-royal-dark md:inline-flex"
            >
              Book a call
            </a>
            <MobileNav />
          </nav>

          <div className="py-20 md:py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-royal-light">
              AI solutions engineer · forward-deployed
            </p>
            <h1 className="mt-6 max-w-[16ch] font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              I build AI systems that{" "}
              <span className="relative inline-block">
                ship to production
                <span aria-hidden className="absolute -bottom-1 left-0 h-1 w-full bg-red" />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg text-white/65">
              Two ways to work with me: embedded as an engineer on your team, or done-for-you AI
              projects for your business.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-lg bg-royal px-5 py-3 text-sm font-medium text-white transition hover:bg-royal-dark"
              >
                See the work <ArrowRight className="size-4" />
              </a>
              <a
                href="#hiring"
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:border-white/60"
              >
                For hiring teams
              </a>
            </div>
            <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-white/55">
              {proof.map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-royal-light" />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section id="work" className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-red">Selected work</p>
        <h2 className="mt-3 max-w-[20ch] font-display text-3xl font-bold tracking-tight md:text-4xl">
          Shipped, measured, in production
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {work.map((w) => (
            <a
              key={w.title}
              href={w.href}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-paper p-6 transition duration-300 hover:-translate-y-1 hover:border-ink/20"
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 ${w.accent === "red" ? "bg-red" : "bg-royal"}`}
              />
              <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
                {w.tag}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold tracking-tight">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.desc}</p>
              <span className="mt-5 font-mono text-sm text-royal">{w.metric}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink">
                {w.cta}
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="approach" className="bg-surface">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-red">Two ways to work</p>
          <h2 className="mt-3 max-w-[22ch] font-display text-3xl font-bold tracking-tight md:text-4xl">
            Embedded engineer, or done-for-you
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-line bg-paper p-7">
              <Workflow className="size-6 text-royal" />
              <h3 className="mt-4 font-display text-xl font-bold">Embedded engineer</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Drop in as a forward-deployed engineer: scope the problem with your customers, build
                the POC, and ship it to production. RAG, agents, evals, and the integrations that
                make it real.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-7">
              <Boxes className="size-6 text-red" />
              <h3 className="mt-4 font-display text-xl font-bold">Done-for-you projects</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A fixed-scope AI build for your business: a workflow automation, an assistant over
                your data, or an internal tool, delivered end to end and live in weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="hiring" className="bg-royal text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="max-w-[24ch] font-display text-2xl font-bold tracking-tight md:text-3xl">
                For hiring teams: production code, evals, and shipped systems.
              </h2>
              <p className="mt-3 max-w-[50ch] text-sm text-white/75">
                Forward-deployed and AI solutions engineering. Remote, US. Read the work, then the
                résumé.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/phillipkaraya"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-royal transition hover:bg-white/90"
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
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-night text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <h2 className="max-w-[14ch] font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Let’s build something that ships.
          </h2>
          <p className="mt-4 max-w-[46ch] text-white/65">
            Available for remote AI engineering contracts and project work. Atlanta, GA, working
            across US time zones.
          </p>
          <a
            href="mailto:pnkaraya@gmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-royal px-5 py-3 text-sm font-medium text-white transition hover:bg-royal-dark"
          >
            <Mail className="size-4" />
            pnkaraya@gmail.com
          </a>
          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row md:items-center">
            <span className="font-display font-bold text-white/80">Phillip Karaya</span>
            <div className="flex gap-6">
              <a href="https://github.com/phillipkaraya" className="transition hover:text-white">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/phillip-karaya" className="transition hover:text-white">
                LinkedIn
              </a>
              <a href="https://instagram.com/phillip.karaya" className="transition hover:text-white">
                Instagram
              </a>
            </div>
            <span>© 2026 Phillip Karaya</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
