import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, CircleAlert, Cpu, Settings2, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Operating map: content operations at an IT asset recovery firm",
  description:
    "A real audit deliverable. How the work was actually being done, where intelligence belonged and where it did not, what shipped, what broke, and what is still unproven.",
};

/* ------------------------------------------------------------------ types */

type Accent = "royal" | "red" | "violet";

const accentText: Record<Accent, string> = {
  royal: "text-royal",
  red: "text-red",
  violet: "text-violet",
};

/* --------------------------------------------------------------- sections */

function Section({
  index,
  label,
  title,
  accent,
  children,
}: {
  index: string;
  label: string;
  title: string;
  accent: Accent;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-11 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className={`font-mono text-xs tracking-[0.18em] ${accentText[accent]}`}>{index}</span>
        <p className={`font-mono text-xs uppercase tracking-[0.18em] ${accentText[accent]}`}>
          {label}
        </p>
      </div>
      <h2 className="font-display mt-3 text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------- current state */

const currentState = [
  {
    step: "Source material is drafted",
    detail:
      "Posts written against the firm's proof bank and voice guide, held as flat files referenced by row.",
  },
  {
    step: "Owner reviews every item in a spreadsheet",
    detail:
      "A single approval queue spanning three brand identities. Approve, hold, or delete, one row at a time.",
  },
  {
    step: "Approved rows are scheduled by hand",
    detail:
      "Copy and paste into the scheduler, pick a slot, repeat. The step everyone assumed was small.",
  },
  {
    step: "Posts go out across four channels",
    detail:
      "Two LinkedIn company pages, one personal LinkedIn, one X account. Different cadences, different voices.",
  },
  {
    step: "Long-form articles are published separately",
    detail: "The scheduler has no API for LinkedIn Articles, so those never fit the pipeline at all.",
  },
];

/* --------------------------------------------------------- judgment split */

const judgment = [
  {
    icon: Settings2,
    accent: "royal" as Accent,
    kind: "Deterministic software",
    rule: "When the rules and inputs are predictable.",
    items: [
      "Cadence slot computation per channel",
      "Duplicate detection across the queue",
      "Prohibited-phrase audit before anything schedules",
      "Scheduler API calls and retry on refusal",
      "Post-schedule verification against what is live",
    ],
  },
  {
    icon: Cpu,
    accent: "violet" as Accent,
    kind: "An agent",
    rule: "When the objective is clear but the inputs and path vary.",
    items: [
      "Drafting post copy from source material",
      "Adapting one idea across three brand voices",
      "Proposing angles from competitive research",
    ],
  },
  {
    icon: UserCheck,
    accent: "red" as Accent,
    kind: "A human in control",
    rule: "When the decision carries material risk or is irreversible.",
    items: [
      "Owner approves every single post before it can schedule",
      "Any factual claim about the physical service",
      "Anything naming a customer",
      "Removing third-party content the owner may have authorized",
    ],
  },
];

/* ------------------------------------------------------------- the gates */

const gates = [
  {
    gate: "Prohibited-claim audit",
    catches: "Marketing copy asserting photo evidence of each pickup.",
    why: "The firm does not photograph pickups. The real chain is in-person pickup, professional carrier packing, then receipt and tracking. A claim that pleasant and that wrong is exactly what an agent invents and a reviewer skims past.",
  },
  {
    gate: "House style audit",
    catches: "Dashes, hype adjectives, unverifiable percentage claims.",
    why: "The client has a hard no-dash rule and a firm ban on ROI figures that cannot be sourced. Style rules that are actually compliance rules belong in code, not in a reviewer's memory.",
  },
  {
    gate: "Duplicate and collision check",
    catches: "The same text queued twice, or two posts landing in one slot.",
    why: "Verifying by slot alone is wrong, because one timestamp can legitimately hold several posts. Identity is channel plus time plus text.",
  },
  {
    gate: "Post-schedule read-back",
    catches: "Anything the scheduler accepted but did not actually queue.",
    why: "Writing succeeded is not the same as it is live. Every write is read back before the run is called done.",
  },
];

/* ------------------------------------------------------------- run log */

const runLog: { line: string; state: "ok" | "warn" | "fail" }[] = [
  { line: "audit    51 approved posts, prohibited-claim scan", state: "ok" },
  { line: "audit    2 posts asserting photo evidence, rewritten", state: "warn" },
  { line: "audit    8 dash violations in owner-voice posts, fixed", state: "ok" },
  { line: "schedule 39 of 51 accepted", state: "ok" },
  { line: "refused  12 rejected, dueAt must be in the future", state: "fail" },
  { line: "cause    slots computed against an unverified date", state: "fail" },
  { line: "recover  12 re-slotted onto appended cadence, accepted", state: "ok" },
  { line: "verify   51/51 confirmed by channel + time + text", state: "ok" },
  { line: "flag     611 unattributed posts found in the same queue", state: "warn" },
];

const runLogTone: Record<"ok" | "warn" | "fail", string> = {
  ok: "text-white/55",
  warn: "text-amber-300/90",
  fail: "text-red-light",
};

/* ----------------------------------------------------------------- page */

export default function Page() {
  return (
    <div className="bg-paper text-ink">
      {/* ------------------------------------------------------------ head */}
      <header className="bg-night relative overflow-hidden text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(45rem 24rem at 85% -10%, rgba(111,139,255,0.22), transparent 62%), radial-gradient(32rem 20rem at 8% 110%, rgba(225,29,42,0.16), transparent 60%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
          <p className="text-royal-light mt-8 font-mono text-xs tracking-[0.2em] uppercase">
            Audit sample · Forward-deployed engineering
          </p>
          <h1 className="font-display mt-4 text-4xl leading-[1.08] font-bold tracking-tight md:text-5xl">
            Operating map: content operations at an IT asset recovery firm
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg text-white/65">
            What the work actually looked like, where intelligence belonged and where it did not, what
            shipped, what broke on the first run, and what I still cannot claim.
          </p>
          <p className="mt-6 font-mono text-xs text-white/45">
            Phillip Karaya · engagement June to August 2026
          </p>
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl px-6 py-14 md:py-20">
        {/* ------------------------------------------------------- preamble */}
        <div className="space-y-4 text-[15px] leading-relaxed text-ink/80">
          <p>
            I have spent most of my working life as a business and finance consultant. I started that
            practice ten years ago, long before I was shipping AI systems. The reason I put this
            document on a portfolio site rather than a case study is that the audit, not the code, is
            the part of this job that is hard to fake. Anyone can wire an API. Deciding which of a
            company&apos;s steps deserve a model, which deserve a rule, and which must never leave a
            human is a judgment call, and it is made with business reasoning before it is made with
            engineering.
          </p>
          <p>
            The client is a national IT asset recovery firm. When a company lays people off or
            refreshes hardware, this firm collects the laptops. It is owner-operated, and the owner
            had one thing working: her own organic content. Cold email had converted at zero. Roughly
            nine in ten of her wins came from posting. So the workflow worth rebuilding was not sales
            outreach. It was the content operation that fed it.
          </p>
        </div>

        <div className="mt-10">
          {/* --------------------------------------------------- 1. context */}
          <Section index="01" label="Collect context" title="Watch how the work is really done" accent="royal">
            <p>
              I did not start from a spec. I started from her actual artifacts: the approval
              spreadsheet, the scheduler account, the live profiles, the voice guide, and the proof
              bank of past recoveries. The useful findings were all in the gaps between what the
              process was supposed to be and what it was.
            </p>
            <p>
              Three brands ran through one queue. A hundred and twenty items sat in it, fifty-eight
              approved and sixty-two never reviewed. Long-form articles had quietly been excluded from
              the whole pipeline because the scheduler could not post them. And nobody had a number
              for how long the manual scheduling step took, which is itself the finding: the step that
              is not instrumented is usually the step that is eating the week.
            </p>
          </Section>

          {/* ---------------------------------------------- 2. current state */}
          <Section index="02" label="Current state" title="The workflow as it existed" accent="royal">
            <ol className="not-prose space-y-0">
              {currentState.map((s, i) => (
                <li key={s.step} className="border-line flex gap-4 border-b py-4 last:border-b-0">
                  <span className="text-muted mt-0.5 font-mono text-xs tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-ink text-[15px] font-medium">{s.step}</p>
                    <p className="text-muted mt-1 text-sm leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p>
              Step three is the bottleneck, and step five is the leak. Neither shows up on an org
              chart. Both show up immediately if you sit with the person doing the work.
            </p>
          </Section>

          {/* -------------------------------------------------- 3. judgment */}
          <Section
            index="03"
            label="The judgment"
            title="Where intelligence belongs, and where it does not"
            accent="violet"
          >
            <p>
              This is the part of the job I would defend hardest. The instinct on an AI engagement is
              to reach for a model at every step. Most of this workflow did not need one. Of the five
              stages, exactly one benefits from a language model, one must stay human forever, and the
              rest are ordinary deterministic code that simply nobody had written.
            </p>
            <div className="not-prose mt-6 grid gap-4 md:grid-cols-3">
              {judgment.map((col) => {
                const Icon = col.icon;
                return (
                  <div
                    key={col.kind}
                    className="border-line bg-surface flex flex-col rounded-xl border p-5"
                  >
                    <Icon className={`size-5 ${accentText[col.accent]}`} />
                    <p className="font-display text-ink mt-3 text-base font-semibold">{col.kind}</p>
                    <p className="text-muted mt-1 text-xs leading-relaxed italic">{col.rule}</p>
                    <ul className="mt-4 space-y-2">
                      {col.items.map((item) => (
                        <li key={item} className="text-ink/75 flex gap-2 text-[13px] leading-relaxed">
                          <Check className={`mt-0.5 size-3.5 shrink-0 ${accentText[col.accent]}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="mt-6">
              The approval gate is the load-bearing decision. It would have been easy, and would have
              demoed better, to let approved drafts flow straight to publication. But this is an
              owner&apos;s personal reputation attached to claims about a physical service she is
              liable for. A wrong post is not a bad output, it is a public statement she has to
              retract. So the system drafts and schedules, and she still approves every item. The
              automation removed the typing, not the accountability.
            </p>
          </Section>

          {/* ------------------------------------------------------ 4. evals */}
          <Section index="04" label="Evals" title="Turn non-determinism into gates" accent="red">
            <p>
              Generated copy cannot be spot-checked at volume, so the checks run on every item before
              anything reaches a queue. Each gate below exists because of a specific way this
              workflow can embarrass the client.
            </p>
            <div className="not-prose mt-5 space-y-3">
              {gates.map((g) => (
                <div key={g.gate} className="border-line rounded-xl border p-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="font-display text-ink text-base font-semibold">{g.gate}</p>
                    <p className="text-red font-mono text-xs">{g.catches}</p>
                  </div>
                  <p className="text-muted mt-2 text-sm leading-relaxed">{g.why}</p>
                </div>
              ))}
            </div>
            <p className="mt-6">
              The first gate is the one worth dwelling on. Draft copy described the service as
              photographing every pickup for chain of custody. It reads well and it is false. The
              firm hands devices to a carrier who packs them professionally, and the evidence is the
              receipt and tracking number. Nobody lied. A plausible detail got written once and then
              propagated into a website, a sales cadence, and a stack of scheduled posts, because
              there was no gate between plausible and true.
            </p>
          </Section>

          {/* ----------------------------------------------------- 5. deploy */}
          <Section index="05" label="Deploy" title="What actually ran, including what broke" accent="royal">
            <p>
              Fifty-one approved posts went live across three channels on a seven-week cadence. Here
              is the first production run, honestly.
            </p>
            <div className="not-prose bg-night mt-5 overflow-x-auto rounded-xl p-5">
              <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                Run log
              </p>
              <pre className="font-mono text-xs leading-relaxed">
                {runLog.map((l) => (
                  <div key={l.line} className={runLogTone[l.state]}>
                    {l.line}
                  </div>
                ))}
              </pre>
            </div>
            <p className="mt-6">
              Twelve of fifty-one were refused on the first attempt. I had computed the cadence slots
              against an assumed current date rather than a verified one, so a quarter of the schedule
              was quietly being written into the past. The scheduler rejected them, which was lucky.
              The rule that came out of it is now permanent: anchor every schedule on a verified
              current date, never an assumed one.
            </p>
            <p>
              The worse bug was the one that did not error. Querying the scheduler for posts across
              several statuses at once returns zero results rather than failing, so a verification
              pass can come back clean while actually being blind. Verification that cannot fail is
              not verification. Every status is now queried separately, and every write is read back
              and matched on channel, time, and text together.
            </p>
          </Section>

          {/* ------------------------------------------------------- 6. find */}
          <Section
            index="06"
            label="The finding"
            title="The thing no spec would have contained"
            accent="red"
          >
            <div className="border-red/25 bg-red/5 not-prose flex gap-3 rounded-xl border p-5">
              <CircleAlert className="text-red mt-0.5 size-5 shrink-0" />
              <p className="text-ink/80 text-sm leading-relaxed">
                A third-party autoposting service had been injecting roughly four posts a day into the
                same queue since April. Six hundred and eleven posts were scheduled out to the end of
                December across all of the firm&apos;s channels, a large share of it generic content
                that did not match the brand at all.
              </p>
            </div>
            <p className="mt-5">
              Nobody had noticed, because each individual post looked like something someone might
              have queued. It only surfaced because I was reading the raw queue rather than the
              calendar view. I did not delete any of it. I could not rule out that the owner had
              authorized the tool herself, and deleting six hundred posts on that assumption is
              exactly the irreversible act that belongs to a human. It was escalated with the counts
              per channel and a recommendation.
            </p>
            <p>
              This is the entire argument for doing the work from inside the business. No brief would
              have contained it. No spec would have described it. It came from sitting with the actual
              system for long enough to notice that the numbers did not add up.
            </p>
          </Section>

          {/* --------------------------------------------------- 7. what now */}
          <Section index="07" label="Business value" title="What I can claim, and what I cannot" accent="royal">
            <p>Honest accounting, because the unproven half matters more than the proven half.</p>
            <div className="not-prose border-line mt-5 grid gap-px overflow-hidden rounded-xl border bg-line sm:grid-cols-2">
              <div className="bg-paper p-5">
                <p className="text-royal font-mono text-[10px] tracking-[0.16em] uppercase">
                  Demonstrated
                </p>
                <ul className="text-ink/75 mt-3 space-y-2 text-sm leading-relaxed">
                  <li>51 posts scheduled and verified live across 3 channels</li>
                  <li>7 weeks of cadence running without manual scheduling</li>
                  <li>10 false or off-style claims caught before publication</li>
                  <li>611 unattributed posts surfaced and escalated</li>
                  <li>A 12-day channel blackout closed and made not repeatable</li>
                </ul>
              </div>
              <div className="bg-paper p-5">
                <p className="text-red font-mono text-[10px] tracking-[0.16em] uppercase">
                  Not yet proven
                </p>
                <ul className="text-ink/75 mt-3 space-y-2 text-sm leading-relaxed">
                  <li>Pipeline or revenue attributed to the content</li>
                  <li>Hours saved, because the manual step was never instrumented</li>
                  <li>Whether the cadence outperforms her old organic rhythm</li>
                  <li>Long-form articles, still published by hand</li>
                </ul>
              </div>
            </div>
            <p className="mt-6">
              I could have put a percentage on the second column. Every number in that column would
              have been invented, and inventing them is the specific failure the first gate in this
              system exists to prevent. The instrumentation to earn those numbers is the next phase of
              the work, not a claim I get to make now.
            </p>
          </Section>
        </div>

        {/* ------------------------------------------------------- guardrail */}
        <div className="border-line bg-surface mt-4 rounded-xl border p-5">
          <p className="font-display text-ink text-sm font-semibold">
            Client details are deliberately withheld.
          </p>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            This is a live engagement. The firm and its owner are not named, no customer is
            identified, and the proprietary parts of the outreach and content system stay in house.
            Every number here is real. What is described is the reasoning, not the recipe.
          </p>
        </div>

        {/* ------------------------------------------------------------ ctas */}
        <div className="border-line mt-14 flex flex-wrap gap-3 border-t pt-10">
          <Link
            href="/#contact"
            className="bg-royal hover:bg-royal-dark inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white transition"
          >
            Want this run on your workflow? <ArrowUpRight className="size-4" />
          </Link>
          <Link
            href="/writing/faithful-but-wrong"
            className="border-line hover:border-ink/20 inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition"
          >
            How I measure AI output
          </Link>
        </div>
      </article>
    </div>
  );
}
