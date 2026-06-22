import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Faithful but wrong: where RAG actually breaks — Phillip Karaya",
  description:
    "Most RAG ships on vibes. Measuring retrieval and answer quality as two separate numbers reveals the failure mode a demo will hide.",
};

const rows = [
  { method: "bm25", faithfulness: "0.975", correctness: "0.575" },
  { method: "hybrid", faithfulness: "0.95", correctness: "0.525" },
];

function Section({
  label,
  accent,
  children,
}: {
  label: string;
  accent: "royal" | "red";
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-9 first:border-t-0 first:pt-0">
      <p
        className={`font-mono text-xs uppercase tracking-[0.18em] ${accent === "red" ? "text-red" : "text-royal"}`}
      >
        {label}
      </p>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

export default function Page() {
  return (
    <div className="bg-paper text-ink">
      <header className="bg-night text-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-royal-light">
            Writing · RAG evaluation
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">
            Faithful but wrong: where RAG actually breaks
          </h1>
          <p className="mt-5 max-w-[55ch] text-lg text-white/65">
            Most RAG systems ship on vibes. Measuring retrieval and answer quality as two separate
            numbers shows you the failure mode a quick demo will hide.
          </p>
          <p className="mt-6 font-mono text-xs text-white/45">Phillip Karaya · June 2026</p>
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl px-6 py-14 md:py-20">
        <div className="space-y-4 text-[15px] leading-relaxed text-ink/80">
          <p>
            A team wires up retrieval over their docs, asks the chatbot five questions, the answers
            look good, and it ships. Then it fails on the sixth in front of a customer, because
            retrieval surfaced the wrong document and nobody was measuring that. The model was never
            the problem. The retrieval was.
          </p>
        </div>

        <div className="mt-9">
          <Section label="What I built" accent="royal">
            <p>
              To make that measurable I built two small open-source tools. rag-eval-harness
              benchmarks retrieval (lexical, semantic, and hybrid) on recall, precision, MRR, and
              nDCG over a labeled question set. rageval-mcp exposes that evaluation as agent tools
              over the Model Context Protocol, including an LLM judge that scores answer faithfulness
              and correctness. The judge runs on Cloudflare Workers AI (Llama 3.3 70B), so a full
              evaluation costs effectively nothing and needs no paid API key.
            </p>
          </Section>

          <Section label="The finding" accent="red">
            <p>
              I ran the judge over a 20-question benchmark on a small SaaS knowledge base. Two
              numbers tell the story:
            </p>
            <table className="mt-2 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 pr-4 font-medium">method</th>
                  <th className="py-2 pr-4 font-medium">avg faithfulness</th>
                  <th className="py-2 font-medium">avg correctness</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {rows.map((r) => (
                  <tr key={r.method} className="border-b border-line">
                    <td className="py-2 pr-4">{r.method}</td>
                    <td className="py-2 pr-4 text-royal">{r.faithfulness}</td>
                    <td className="py-2 text-red">{r.correctness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Faithfulness is high. Correctness is much lower. That gap is the finding.</p>
          </Section>

          <Section label="Why the gap matters" accent="royal">
            <p>
              Faithfulness asks whether the answer is grounded in the retrieved text. Correctness
              asks whether the answer is actually right. When the two agree, the system is passing or
              failing cleanly. When they pull apart, you have learned something specific: the model is
              being honest about bad context. On the questions bm25 missed, retrieval returned the
              wrong document, so a well-behaved model answered that the information was not in the
              context. That is faithful (it invented nothing) and incorrect (it could not answer).
            </p>
            <p>
              For example, asked “Can I keep my data in Europe?”, bm25 returns the data-deletion
              article because it shares surface terms, and misses the data-residency article that
              actually answers the question. Semantic retrieval fixes it.
            </p>
            <p>
              The lesson: a faithful but incorrect answer is a retrieval bug, not a generation bug.
              If you only eyeball outputs you would blame the model, reach for a bigger one, and add
              prompt engineering. Splitting the score into two numbers points you at the real fix,
              which is retrieval.
            </p>
          </Section>

          <Section label="How to use this" accent="red">
            <p>
              Before you ship RAG, label a set of real questions with their source documents and
              measure retrieval and answer quality as two separate numbers. Watch the gap between
              faithfulness and correctness. It is the cheapest early-warning system you can build,
              and on Cloudflare Workers AI it is close to free to run on every change.
            </p>
            <p>
              The tools are public. If you are shipping RAG and only testing it by hand, that is the
              first thing I would change.
            </p>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <a
            href="https://github.com/phillipkaraya/rag-eval-harness"
            className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs text-ink transition hover:border-ink/20"
          >
            rag-eval-harness <ArrowUpRight className="size-3.5" />
          </a>
          <a
            href="https://github.com/phillipkaraya/rageval-mcp"
            className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs text-ink transition hover:border-ink/20"
          >
            rageval-mcp <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-lg bg-royal px-5 py-3 text-sm font-medium text-white transition hover:bg-royal-dark"
          >
            Shipping RAG and want it measured? <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
