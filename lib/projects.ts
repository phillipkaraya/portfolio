/**
 * Single source of truth for every project on the site.
 *
 * Three tiers, ordered by how much engineering story they carry:
 *   1. `systems`  - in-house R&D, built and operated by me
 *   2. `platforms`- multi-app client platforms shipped end to end
 *   3. `builds`   - live client sites and tools
 *
 * Tiers 1 and 2 get routed detail pages at /work/[slug].
 * Tier 3 renders as cards linking straight to the live site.
 *
 * NOTE ON COPY: no em dashes or double hyphens anywhere in user-facing
 * strings. Use commas, colons, or periods.
 */

export type Accent = "royal" | "red" | "violet";

export type Stat = {
  /** Headline figure, e.g. "71,600" */
  value: string;
  /** Trailing unit rendered smaller, e.g. "+" or "%" or "min" */
  unit?: string;
  label: string;
};

export type Module = {
  name: string;
  detail: string;
};

export type Link = {
  label: string;
  href: string;
  /** Primary renders as a filled button, secondary as an outline */
  kind?: "primary" | "secondary";
};

/** A project deep enough to justify its own page. */
export type DeepProject = {
  slug: string;
  tier: "system" | "platform";
  kicker: string;
  title: string;
  /** One line used on cards and in the page sub-head */
  summary: string;

  /*
   * WHAT / SO WHAT / NOW WHAT.
   *
   * Three required fields rather than one free-form body, because a prose
   * field drifts back into a feature list. Every project must answer all
   * three, and all three must land for two readers at once: someone with no
   * technical background, and a technical hiring manager. That means plain
   * words in the sentences; the precision lives in `stats` and `stack`.
   */

  /** Plain language: what the thing is and what it does. No jargon. */
  what: string;
  /** Why it matters: the real cost, risk, or constraint it addresses. */
  soWhat: string;
  /** What it proves or unlocks. Renders in the pulled-out dark band. */
  nowWhat: string;

  /*
   * The hard part of actually shipping it, and how it was handled.
   *
   * Deliberately pitched at the level of REASONING, not recipe. The failure
   * mode designed against and the principle applied are the credential; the
   * implementation is the asset and stays private. If a sentence here would
   * let a competitor skip the work, cut it.
   */
  hardPart: { problem: string; solution: string };

  /**
   * The load-bearing architectural decision, stated technically.
   *
   * Exists because `hardPart.problem` is framed as an obstacle, and seven
   * obstacles in a row reads as a list of things that went wrong rather than a
   * body of engineering. This field names the mechanism instead: what the
   * system does structurally, in the vocabulary an engineer would use.
   */
  mechanism?: { label: string; detail: string };

  stats: Stat[];
  stack: string[];
  /** Section heading for the module list, e.g. "The nine modules" */
  modulesTitle?: string;
  modules?: Module[];
  /**
   * Non-negotiable honesty or compliance note. Rendered on both the card
   * and the detail page. Never remove one of these without asking Phil.
   */
  guard?: { lead: string; text: string };
  links?: Link[];
  image?: string;
  accent: Accent;
};

/** A live client site. Card only, links straight out. */
/**
 * Applications have engineering behind them: ingest, scoring, matching, or a
 * real model. Sites are presentation layers. The split matters because a
 * scoring engine and a brochure page should not carry the same visual weight,
 * and lumping them together makes the applications look smaller than they are.
 */
export type BuildTier = "application" | "site";

export type Build = {
  name: string;
  kind: string;
  category: Category;
  buildTier: BuildTier;
  blurb: string;
  href: string;
  domain: string;
  image: string;
  /**
   * Optional technical breakdown. Only the builds that are real applications
   * carry these: a marketing site does not need a stack list, and padding one
   * onto a brochure page would overstate what it is. The card renders the
   * extra detail only when these are present.
   */
  detail?: string;
  tech?: string[];
};

export type Category =
  | "AI & SaaS"
  | "Automotive"
  | "Real estate"
  | "Fintech"
  | "Healthcare"
  | "Brand & services"
  | "Nonprofit";

/* -------------------------------------------------------------------------- */
/* TIER 1: systems I built and run                                            */
/* -------------------------------------------------------------------------- */

export const systems: DeepProject[] = [
  {
    slug: "trading-simulator",
    tier: "system",
    kicker: "Autonomous agents · Research",
    title: "Multi-Agent Trading Simulator",
    summary: "Four AI traders left alone for months, to find out what breaks.",
    what: "Four AI traders, each with its own money, its own rules, and its own market: stocks, options, futures, and currencies. Every two minutes they check prices, decide what to buy or sell, and write down every decision they make. Nobody supervises them.",
    soWhat:
      "Most AI demos run for a minute with a person watching. The hard part is month three, when a data feed goes bad, an API goes down, or the agent makes a run of bad calls. This is a rig built to find out what happens then. Each agent keeps its own scorecard, so a losing pattern gets down-weighted automatically without anyone stepping in.",
    nowWhat:
      "It shows that agents can run unattended for months and recover from real failures, including their own mistakes. That is the line between an AI demo and an AI system you can leave running.",
    hardPart: {
      problem:
        'An agent left running for months will eventually be handed bad data or hit an API outage mid decision. The dangerous failure is not crashing, it is carrying on confidently against stale prices.',
      solution:
        'Every decision is written to a ledger before it is acted on, so state can be rebuilt from the record after any interruption, and each agent scores its own past calls per instrument so a losing pattern loses weight without anyone intervening. Recovery is a normal code path rather than an exception handler. The strategies themselves stay private.',
    },
    mechanism: {
      label: "Write-ahead ledger, idempotent replay",
      detail:
        "Every intent is appended to a durable ledger before execution, so process state is derived from the log rather than held in memory. Restart replays from the last checkpoint, which makes crash recovery the same code path as a cold boot instead of a separate error handler.",
    },
    stats: [
      { value: "4", label: "autonomous agents" },
      { value: "24/7", label: "unattended uptime" },
      { value: "2", unit: "min", label: "decision loop" },
    ],
    stack: [
      "Long-running agents",
      "Per-agent risk rules",
      "Decision ledger",
      "Feedback weighting",
      "Failure recovery",
    ],
    guard: {
      lead: "Simulated capital, by design.",
      text: "This is a research rig for agent autonomy: how agents behave over months without a human, how they recover from their own bad decisions, and how they self correct. It is not a financial product, and I do not sell trading advice.",
    },
    accent: "royal",
  },
  {
    slug: "memory-graph",
    tier: "system",
    kicker: "RAG · Knowledge graph",
    title: "Operational Memory Graph",
    summary: "A searchable memory of a quarter million engineering messages, for about a dollar.",
    what: "A searchable memory of every engineering session I run. Around a quarter million messages, findable both by exact words and by meaning, with AI-written summaries and a map showing how the work connects. A nightly job keeps it current and moves older material to cheap storage on its own.",
    soWhat:
      "Most companies sit on years of conversations and documents nobody can find. The usual fix is to pay an AI provider by the word, which gets expensive the moment the archive is large enough to be worth searching. This one runs on Cloudflare's edge instead, so re-reading and re-indexing the entire archive costs about a dollar forty rather than a recurring invoice.",
    nowWhat:
      "This is the exact stack behind the phrase everyone wants, search your company's knowledge: embeddings, hybrid search, summarization, and storage tiering. Built and running at real scale, not sketched in a notebook.",
    hardPart: {
      problem:
        'Embedding a quarter million messages through a per-token API costs more than the system is worth, and any future model change means paying the whole bill again. Separately, the full-text index behaved differently on a clean rebuild than on the nightly incremental run, which is the class of bug that only shows up once the corpus is big enough to matter.',
      solution:
        'Inference moved to a fixed-cost edge provider, which turned a full re-embed from a budget conversation into a dollar forty decision, and older material tiers itself to cold storage. The index problem was caught by rebuilding from scratch on a schedule and comparing, rather than trusting incremental runs to stay correct forever.',
    },
    mechanism: {
      label: "Hybrid retrieval, FTS5 first with vector rerank",
      detail:
        "Lexical search over an FTS5 index runs first and cheaply, and dense vectors only rerank that candidate set. Embeddings run on edge inference at fixed cost rather than per token, so re-indexing the whole corpus is a bounded expense instead of a recurring bill.",
    },
    stats: [
      { value: "212K", unit: "+", label: "messages indexed" },
      { value: "65,924", label: "vector embeddings" },
      { value: "~$1.40", label: "to embed the corpus" },
    ],
    stack: [
      "Cloudflare Workers AI",
      "BGE-large embeddings",
      "Hybrid search",
      "SQLite FTS5",
      "Storage tiering",
      "Nightly ingest",
    ],
    guard: {
      lead: "Runs on edge inference, not per-token API bills.",
      text: "No screenshots of this one. The corpus holds real engineering session transcripts, so the system is described rather than shown.",
    },
    accent: "violet",
  },
  {
    slug: "acquisition-engine",
    tier: "system",
    kicker: "Infrastructure · Data acquisition",
    title: "Resilient Acquisition Engine",
    summary: "Daily public-record collection across 30 markets, for a few dollars a month.",
    what: "The data collection layer underneath my lead-generation and pricing products. It gathers public listings from 30 markets every day, keeps 1,406 records current, and only reports what has actually changed since the last run.",
    soWhat:
      "Websites push back on automated collection, and the common answer is to use the heaviest, most expensive method on every single request. This one starts with the lightest approach and only escalates when a source actually resists, paces itself per site, and remembers what it has already seen. Nearly every run finishes on the cheapest tier, which is why a nationwide daily sweep costs a few dollars a month instead of hundreds.",
    nowWhat:
      "New sources are added by writing a config entry, not new code, and 87 tests keep it honest. It is collection infrastructure that survives contact with the real internet and stays maintainable a year later.",
    hardPart: {
      problem:
        'Public sources change shape without warning and actively resist automation. The obvious answer, reaching for the heaviest retrieval method on every request, is expensive and still breaks the moment a page is restructured.',
      solution:
        'Requests escalate through progressively heavier strategies, and only once a source has actually pushed back, so nearly everything finishes on the cheapest tier. Jobs are declared as configuration rather than code, so a source changing shape is an edit instead of a deploy, and 87 tests catch drift before a customer notices. Which sources and which methods stay in house.',
    },
    mechanism: {
      label: "Tiered fetch with per-domain rate governance",
      detail:
        "Requests escalate through cost tiers, starting with plain HTTP and only reaching a real browser when a cheaper tier fails. Each domain carries its own rate budget and backoff state, so one hostile source throttles itself without stalling the other twenty-nine.",
    },
    stats: [
      { value: "30", label: "markets, daily" },
      { value: "1,406", label: "live records maintained" },
      { value: "87", label: "tests in the suite" },
    ],
    stack: [
      "Declarative job config",
      "Tiered fetch escalation",
      "Per-domain rate governance",
      "Rotating egress",
      "Dedupe state",
    ],
    guard: {
      lead: "Cheap on purpose.",
      text: "Sources and evasion methods stay in house. The engineering claim is the architecture, not the target list.",
    },
    accent: "royal",
  },
  {
    slug: "airline-support-agent",
    tier: "system",
    kicker: "Conversational AI · Built on spec",
    title: "WhatsApp Customer-Service Agent",
    summary: "An agent that answers in seconds, and knows when to hand you to a human.",
    what: "A support agent that answers airline customers on WhatsApp: cancellations, refunds, lost bags, delays. It reads each message and works out four things at once. Which desk should handle this, how urgent is it, how upset is this person, and is there legal risk in how they worded it. Anything it should not answer alone opens a case and pulls in a human, who can take over mid conversation with the full thread attached.",
    soWhat:
      "I spent two days trying to reach a person about cancelling a flight, then waited another forty business days for the refund. Two months of real time. This agent replies in about 1.8 seconds. And because a second AI grades every finished conversation on empathy, accuracy, resolution, efficiency, and compliance, quality gets measured on all of them instead of the handful a supervisor happens to sample.",
    nowWhat:
      "The useful part is not that it answers. It is that it knows when to stop. An agent that recognizes the limit of its own authority is the difference between one you can put in front of customers and one you cannot.",
    hardPart: {
      problem:
        'An agent confident enough to be useful is also confident enough to promise a refund it has no authority to approve. On top of that there was no paid inference budget for it, so it had to run well on a free tier.',
      solution:
        'Legal and regulatory risk is scored as its own signal, separate from what the customer is asking for, so a risky message escalates even when the intent looks routine. Escalation opens a tracked case carrying the entire thread rather than dead-ending in a queue. The free-tier constraint forced short, disciplined prompts, which improved reply quality rather than hurting it.',
    },
    mechanism: {
      label: "Intent classification gated behind an authority boundary",
      detail:
        "Classification and drafting are separated from action. The model proposes an intent and a reply, but anything with financial or contractual consequence requires a human decision, so the agent cannot commit the business to something it has no authority to approve.",
    },
    stats: [
      { value: "8", label: "service desks routed" },
      { value: "1.8", unit: "s", label: "average first reply" },
      { value: "9", unit: "/10", label: "AI-graded quality" },
    ],
    stack: [
      "WhatsApp Business API",
      "Real-time classification",
      "Escalation & case tracking",
      "Human takeover mid-thread",
      "LLM-as-judge grading",
      "Groq inference",
    ],
    guard: {
      lead: "Built unprompted, then sent to their team.",
      text: "Nobody asked for this. After my own refund ordeal I built it, branded the demo for the airline it happened with, and sent it to their team to see what comes back. They are not a client, and nothing here uses real passenger data.",
    },
    links: [
      {
        label: "Open the live demo",
        href: "https://kq-cs-bot.vercel.app/dashboard",
        kind: "primary",
      },
    ],
    image: "/shots/kq-agent.jpg",
    accent: "red",
  },
  {
    slug: "contact-resolution",
    tier: "system",
    kicker: "Data engineering · Entity resolution",
    title: "Public-Records Contact Resolution",
    summary: "Turning a company name on a public record into a person you can actually call.",
    what: "A pipeline that turns a company name on a public record into a real person you can pick up the phone and call. When a property is owned by an LLC rather than a human being, this works out who is actually behind it.",
    soWhat:
      "Paid lookup services return nothing useful the moment the owner is an LLC, which describes most of the records worth looking at. So I built the chain myself: find the company in state business registries, pull the name of the officer behind it, then match that person to current contact details. Across one batch of 2,746 records it resolved 64% and produced 562 verified phone numbers.",
    nowWhat:
      "This is data engineering where the easy path fails: sources that resist automation, records that need real parsing, and a result measured in people you can actually reach rather than rows downloaded.",
    hardPart: {
      problem:
        'Paid lookup services return nothing the moment the owner of record is a company rather than a person, and the registries that do hold the answer are inconsistent from one state to the next.',
      solution:
        'Treated as entity resolution rather than lookup: company to officer to person, three separate matches each carrying its own confidence, so a weak link fails loudly instead of handing back a confident wrong phone number. That discipline is why the honest figure is 64% rather than a claim of full coverage. Sources and methods stay in house.',
    },
    mechanism: {
      label: "Entity resolution across registries, confidence-scored",
      detail:
        "Corporate records are joined to individuals through officer extraction and fuzzy identity matching, with each link carrying a confidence score. Low-confidence matches are held back rather than merged, because a wrong join is more expensive downstream than a missing one.",
    },
    stats: [
      { value: "2,746", label: "leads in one batch" },
      { value: "562", label: "verified phone numbers" },
      { value: "64", unit: "%", label: "entity resolution rate" },
    ],
    stack: [
      "State registry resolution",
      "Officer extraction",
      "Identity matching",
      "DNC scrubbing",
      "TCPA-aware rules",
    ],
    guard: {
      lead: "Compliance built in, not bolted on.",
      text: "Do not call scrubbing, opt out handling, and TCPA aware outreach rules are part of the pipeline, because gathering the data and contacting the person are two very different legal questions. Methods and sources stay in house.",
    },
    accent: "violet",
  },
  {
    slug: "social-analytics",
    tier: "system",
    kicker: "Open source · Creator analytics",
    title: "Social Analytics Command Center",
    summary: "Four platforms, 2,000 posts, one answer to “prove your audience.”",
    what: "A dashboard that pulls a creator's entire posting history off Instagram, TikTok, YouTube, and Threads, then shows what actually performs, when to post, and which comments are worth answering. A separate tab tracks brand deals through the pipeline.",
    soWhat:
      "Every creator eventually gets asked by a brand to prove their audience, and the honest answer is usually scattered across four apps that do not talk to each other. This puts 2,000 posts and 11.2 million views in one place. Feed it any video and it pulls the frames and a transcript, so you can see why a post landed rather than guessing.",
    nowWhat:
      "It is open source. Clone it, drop in your own exported data, build, and host it anywhere. A complete data product end to end, collection through analysis to a shipped interface, and one I was willing to publish rather than just describe.",
    hardPart: {
      problem:
        "Threads does not publish a view count at all. Forcing all four platforms into one metric meant 564 real posts silently dropped out of every chart, which quietly changed the denominator on numbers a brand would be shown.",
      solution:
        "Rather than hide the gap, each platform reports the strongest number it can actually stand behind, and the interface says which one it used. Threads measures reach as likes and engagement against followers instead of views, labelled as such everywhere it appears. Nothing is silently substituted, so a number on screen always means what it says.",
    },
    mechanism: {
      label: "One schema at ingest, honest metrics per platform",
      detail:
        "Each export is mapped into one canonical post shape at ingest, so adding a fifth platform touches only the importer. Where a platform cannot supply a metric, the fix happens at the source rather than in the display layer, and the interface names the substitution instead of showing a zero. The output is a static build with no runtime dependency, so the whole dashboard can be handed to someone else and rehosted anywhere.",
    },
    stats: [
      { value: "4", label: "platforms unified" },
      { value: "2.0K", label: "posts analyzed" },
      { value: "11.2M", label: "views accounted for" },
    ],
    stack: [
      "Multi-platform ingest",
      "Static site output",
      "Frame + transcript analysis",
      "Pipeline tracking",
      "pnpm",
    ],
    links: [
      {
        label: "View the repository",
        href: "https://github.com/phillipkaraya/fwp-analytics-dashboard",
        kind: "primary",
      },
    ],
    accent: "royal",
  },
  {
    slug: "whatsapp-booking-agent",
    tier: "system",
    kicker: "Client pilot · Concluded",
    title: "Bilingual WhatsApp Booking Agent",
    summary: "A receptionist on WhatsApp that answers in whichever language you write in.",
    what: "A receptionist for a wellness studio that works entirely over WhatsApp, because that is how their customers actually book. It notices which of two languages someone is writing in and answers in that one, quotes from the studio's full service and price list, and passes confirmed bookings into the system they already use.",
    soWhat:
      "The studio was losing bookings to slow replies on the single channel their customers care about. Phone and email were not the problem to solve. Anything unusual goes to a person with the conversation attached, so nobody has to ask the customer to repeat themselves.",
    nowWhat:
      "Language handling and human handoff were designed in from the start rather than bolted on later, which is the difference between a bot customers tolerate and one they actually use. This pattern, the channel your customers already use answered instantly, is what most service businesses are really asking for.",
    hardPart: {
      problem:
        'Language detection is unreliable on short messages, and real customers switch languages mid conversation. Getting it wrong on a one word reply means answering someone in a language they did not use.',
      solution:
        'Detection runs on every message but carries the last confident choice forward, so a bare “ok” cannot flip the conversation. Anything outside the service catalogue goes to a person with the thread attached rather than being guessed at.',
    },
    mechanism: {
      label: "Catalog-grounded generation with per-turn language detection",
      detail:
        "Replies are constrained to a structured service catalog rather than generated freely, so the model cannot invent a service or a price. Language is detected per message rather than per conversation, which is what allows a customer to switch languages mid-thread without resetting state.",
    },
    stats: [
      { value: "2", label: "languages, auto-detected" },
      { value: "30", unit: "+", label: "services in catalog" },
      { value: "1", label: "tap to human takeover" },
    ],
    stack: [
      "WhatsApp Business API",
      "Language detection",
      "Catalog grounding",
      "Booking handoff",
      "Human escalation",
    ],
    guard: {
      lead: "Ran in production with real customers.",
      text: "A pilot engagement that has since concluded, kept anonymous at the client's level of permission. Included because it is the pattern most service businesses ask for: the channel your customers already use, answered instantly, with a human always one tap away.",
    },
    accent: "red",
  },
];

/* -------------------------------------------------------------------------- */
/* TIER 2: platforms shipped end to end                                       */
/* -------------------------------------------------------------------------- */

export const platforms: DeepProject[] = [
  {
    slug: "life-chiro-pms",
    tier: "platform",
    kicker: "Healthcare platform · Kigali, Rwanda",
    title: "Life Chiro PMS",
    summary: "Everything a Rwandan clinic runs on: staff dashboard, phone app, patient portal.",
    what: "The complete software a chiropractic clinic in Rwanda runs on. A dashboard for staff, an app for phones, and a portal for patients, all built from one codebase. Nine modules cover the whole clinic, from booking a visit through to running payroll.",
    soWhat:
      "Clinic software written for the US simply does not work here. The internet drops, so it has to keep working offline and catch up later. Staff and patients speak English, French, and Kinyarwanda, so it speaks all three. People pay by mobile money rather than card, tax filings go to the Rwanda Revenue Authority, and patient identity is read off a national ID card with the phone camera. Every one of those is a requirement, not a nice-to-have.",
    nowWhat:
      "The part clinicians feel every day: a provider talks through a visit out loud and it comes back as a structured medical note, charted on a body map instead of typed into a blank box. 71,600 lines showing what it takes to ship real clinical software against real constraints.",
    hardPart: {
      problem:
        'Offline first is straightforward right up until two people edit the same record on different devices while disconnected. And because one system serves the whole clinic, a mistake in the data access rules is not a bug, it is the wrong staff member reading a patient file.',
      solution:
        'The access rules were tested adversarially rather than assumed correct, which surfaced three real permission bugs before launch. Sync conflicts resolve per record type instead of by one global rule, because a clinical note and a calendar slot should not merge the same way: notes append, scheduling takes the last write and leaves an audit trail.',
    },
    stats: [
      { value: "71,600", unit: "+", label: "lines of code" },
      { value: "9", label: "full modules" },
      { value: "3", label: "apps: web, mobile, portal" },
      { value: "3", label: "languages supported" },
    ],
    stack: [
      "Next.js",
      "React Native / Expo",
      "Supabase · Postgres",
      "Offline sync",
      "Whisper + Claude",
      "Mobile Money",
      "WhatsApp API",
      "NID OCR",
    ],
    modulesTitle: "The nine modules",
    modules: [
      { name: "Patient management", detail: "NID card OCR, 4-step intake, digital consent" },
      { name: "Multi-provider scheduling", detail: "rooms, resources, recurring visits" },
      { name: "Clinical docs & AI SOAP notes", detail: "dictate, then structured chart" },
      { name: "Anatomical assessment", detail: "interactive body-map charting" },
      { name: "Payments & billing", detail: "MTN MoMo, Airtel, card, RRA tax" },
      { name: "HR & payroll", detail: "staff, contracts, leave, payslips" },
      { name: "Communications", detail: "WhatsApp, SMS and email reminders" },
      { name: "Reporting & analytics", detail: "clinical and financial dashboards" },
      { name: "Administration", detail: "roles, permissions, multi-tenant settings" },
    ],
    links: [
      {
        label: "Open the live demo",
        href: "https://intellovate-demos.vercel.app/life-chiro",
        kind: "primary",
      },
    ],
    image: "/shots/cs-life-chiro.jpg",
    accent: "royal",
  },
  {
    slug: "dealflow",
    tier: "platform",
    kicker: "AI · Private equity & M&A",
    title: "DealFlow, AI Deal Origination Engine",
    summary: "An agent that finds and grades acquisition targets, then waits for a human yes.",
    what: "A sourcing machine for firms that buy companies. An AI agent pulls in thousands of businesses, grades each one from A to D against what that particular firm is actually looking for, and writes every outreach email and every reply. A briefing lands each morning covering what happened overnight.",
    soWhat:
      "Deal sourcing is mostly unglamorous volume: find the companies, rank them, stay in touch for a year or more, and respond to every reply. That work is what gets dropped when a principal gets busy, and dropping it is what kills a pipeline. The agent absorbs the volume and the judgment stays with the human.",
    nowWhat:
      "The approval queue is the entire design. Nothing sends without someone clicking yes. An agent that drafts and waits keeps getting used; an agent that sends on its own gets switched off after the first embarrassing email.",
    hardPart: {
      problem:
        'An agent that sends email on its own gets switched off after the first embarrassing message. An agent whose drafts need heavy editing gets abandoned because it is slower than writing the email yourself. Most outreach tools die on one horn or the other.',
      solution:
        'The approval queue had to be genuinely faster than the alternative, so each draft arrives with the full context attached and approving is one click. Nothing sends without a human yes. The overnight briefing exists so the principal starts the day already knowing what happened, instead of opening the tool to find out.',
    },
    stats: [
      { value: "6", label: "industry ICP models" },
      { value: "12, 18", unit: "mo", label: "drip sequence arcs" },
      { value: "100", unit: "%", label: "human-approved outreach" },
    ],
    stack: [
      "AI grading agent",
      "Apollo enrichment",
      "Supabase",
      "Drip engine",
      "Approval queue",
      "Target mapping",
    ],
    modulesTitle: "What the engine does",
    modules: [
      { name: "Target sourcing", detail: "Apollo-enriched company and owner data" },
      { name: "ICP grading", detail: "weighted criteria, A to D fit scores with reasons" },
      { name: "Target map", detail: "coverage and pipeline revenue by state" },
      { name: "Drip campaigns", detail: "emails, white papers, community invites" },
      { name: "Approval queue", detail: "nothing sends without a human yes" },
      { name: "Response inbox", detail: "AI-suggested replies with full context" },
      { name: "Deal pipeline", detail: "first touch through signed engagement letter" },
      { name: "Overnight briefing", detail: "proactive agent report every morning" },
    ],
    links: [
      { label: "Open the live demo", href: "https://dealflow-engine.vercel.app", kind: "primary" },
    ],
    image: "/shots/cs-dealflow.jpg",
    accent: "violet",
  },
  {
    slug: "counsel-stack",
    tier: "platform",
    kicker: "Legal tech · Solo practice",
    title: "Counsel Stack",
    summary: "One login replacing the spreadsheet sprawl of a growing solo law practice.",
    what: "One login that replaces the pile of spreadsheets a growing solo law practice accumulates. Client intake, a register of the 21 business entities she acts as agent for, a dashboard of every open matter, secure document exchange, and payments.",
    soWhat:
      "Her intake questionnaires already existed on paper and already worked, so they were digitized as they were rather than replaced with a generic CRM she would have to fight. Legal payments also carry rules other payments do not: money held in trust for a client cannot be mixed with the firm's own, which is why payments run through LawPay rather than a standard processor.",
    nowWhat:
      "She owns the login system and the database. A practice that holds client confidences should not have the record of them sitting inside a vendor's tenant, and that is a decision far easier to make upfront than to reverse three years in.",
    hardPart: {
      problem:
        "Legal payments carry rules ordinary payments do not: money held in trust for a client cannot be mixed with the firm's own funds. Getting that wrong is not a bug report, it is a bar complaint.",
      solution:
        'Payments run through a processor built specifically for legal trust accounting rather than a general one, so the separation is handled by something already audited for it. Her intake questionnaires were digitized exactly as they already existed rather than replaced with a generic CRM she would spend a year fighting.',
    },
    stats: [
      { value: "21", label: "entities managed" },
      { value: "4", label: "practice areas served" },
      { value: "1", label: "login for the whole firm" },
    ],
    stack: ["Next.js", "Vercel Postgres", "Custom auth", "LawPay", "Document intake"],
    modulesTitle: "Inside the platform",
    modules: [
      { name: "Guided client intake", detail: "her actual questionnaires, digitized" },
      { name: "Registered-agent book", detail: "entities, deadlines, renewals" },
      { name: "Matter dashboard", detail: "every client, status at a glance" },
      { name: "Payments", detail: "trust-account-safe via LawPay" },
      { name: "Client portal", detail: "secure document exchange" },
      { name: "Own auth & database", detail: "her data, not a SaaS vendor's" },
    ],
    guard: {
      lead: "Client system, kept anonymous.",
      text: "The live practice and its client data are not linked or named anywhere. The demo below is an anonymized copy loaded with a fictional firm.",
    },
    links: [
      {
        label: "Open the anonymized demo",
        href: "https://intellovate-demos.vercel.app/counsel-stack",
        kind: "primary",
      },
    ],
    image: "/shots/cs-counsel-stack.jpg",
    accent: "royal",
  },
  {
    slug: "intellovate-command",
    tier: "platform",
    kicker: "SaaS · Marketing operations",
    title: "Intellovate Command",
    summary: "The platform my own client work runs on, with tenant isolation enforced by the database.",
    what: "The marketing operations platform my own client engagements run on. Every client gets their own walled-off workspace for campaigns, content, and reporting, and none of them can see another's.",
    soWhat:
      "In software that serves many customers from one system, the expensive bug is one customer seeing another's data. The usual defence is remembering to add a filter to every single query, which works right up until someone forgets. Here the separation is enforced by the database itself, so a query that would leak data simply returns nothing.",
    nowWhat:
      "That choice means a mistake is one policy to fix rather than an audit of every query in the application. And because I run my own work on it, I find the rough edges before a client does.",
    hardPart: {
      problem:
        "When one system serves many clients, the expensive bug is one client seeing another's data. The usual defence is remembering to add a filter to every query, which holds right up until somebody forgets on a Friday afternoon.",
      solution:
        "Isolation is enforced by the database itself, so a query that would leak simply returns nothing rather than depending on anyone's discipline. Destructive maintenance scripts are gated behind explicit environment checks on the same principle: the fix for that class of mistake is making it impossible, not being careful.",
    },
    stats: [
      { value: "Multi", label: "tenant isolation" },
      { value: "RLS", label: "enforced at the database" },
      { value: "Prod", label: "shipped and operating" },
    ],
    stack: ["Next.js 16", "Postgres · RLS", "Multi-tenant auth", "Campaign engine", "Supabase"],
    modulesTitle: "Inside the platform",
    modules: [
      { name: "Tenant workspaces", detail: "row-level-security isolation" },
      { name: "Campaign management", detail: "plan, launch, log, report" },
      { name: "Content pipeline", detail: "drafts, approval, scheduled" },
      { name: "Client reporting", detail: "white-labeled performance views" },
    ],
    links: [
      {
        label: "Open the live demo",
        href: "https://intellovate-demos.vercel.app",
        kind: "primary",
      },
    ],
    image: "/shots/cs-command.jpg",
    accent: "red",
  },
];

/* -------------------------------------------------------------------------- */
/* TIER 3: live client builds                                                 */
/* -------------------------------------------------------------------------- */

export const builds: Build[] = [
  {
    name: "ScriptSaver",
    kind: "Prescription savings lookup",
    category: "Healthcare",
    buildTier: "application",
    blurb:
      "Type in your medication and it checks 75 brand-name drugs against the discount programs the manufacturers already run, so people stop overpaying at the pharmacy counter.",
    href: "https://scriptsaver.io",
    domain: "scriptsaver.io",
    image: "/shots/scriptsaver.jpg",
    detail:
      "A lookup over 75 brand-name drugs and the manufacturer assistance programs attached to them. The matching is the hard part: drug names arrive with dosage, form, and brand-versus-generic variations that all have to normalize to one canonical entry before a program can be attached, and a wrong match here sends someone to a program they do not qualify for.",
    tech: ["Next.js", "Name normalization", "Program registry", "Static generation", "Vercel"],
  },
  {
    name: "FleetAgent",
    kind: "AI fleet sourcing SaaS",
    category: "AI & SaaS",
    buildTier: "application",
    blurb:
      "Finds cars worth buying and the rideshare drivers to put in them, so a fleet owner grows both sides at once. Live and sending leads today.",
    href: "https://fleetagent.co",
    domain: "fleetagent.co",
    image: "/shots/fleetagent.jpg",
    detail:
      "Two matching problems in one product. A sourcing pass scores vehicles on acquisition cost against expected rideshare yield, while a separate driver pipeline qualifies applicants and routes them to the vehicles they are actually approved for. Listings are deduplicated across sources before scoring, so the same car arriving from three feeds is ranked once.",
    tech: ["Next.js", "Supabase", "Scheduled ingest", "Dedupe keys", "Lead routing", "Vercel"],
  },
  {
    name: "Caliber",
    kind: "AI watch-sourcing SaaS",
    category: "AI & SaaS",
    buildTier: "application",
    blurb:
      "Watches the used luxury watch market all day, filters out the fakes, and ranks what is left by how much profit is in it. Members only.",
    href: "https://caliber-web-ten.vercel.app",
    domain: "caliber-web-ten.vercel.app",
    image: "/shots/caliber.jpg",
    detail:
      "Continuous ingest of used luxury watch listings, scored on spread between asking price and realized comparable sales. Authenticity signals are weighted into the rank rather than filtered separately, because the listings most likely to be counterfeit are also the ones that look most profitable on price alone, and a naive margin sort surfaces exactly the wrong inventory first.",
    tech: ["Next.js", "Scheduled ingest", "Comp-based valuation", "Signal weighting", "Vercel"],
  },
  {
    name: "PeachFlips",
    kind: "Under-market car deal flow",
    category: "Automotive",
    buildTier: "application",
    blurb:
      "Every car in Georgia listed for less than it is worth, scored and ranked in one place, so flippers stop refreshing listings all day.",
    href: "https://peachflips.vercel.app",
    domain: "peachflips.vercel.app",
    image: "/shots/peachflips.jpg",
    detail:
      "Statewide listing sweep scored against market value per model and trim. Runs on the tiered-fetch approach from the acquisition engine, so cheap HTTP requests handle most sources and heavier browser-based fetching is reserved for the ones that need it, which keeps a daily statewide sweep affordable rather than rate-limited into uselessness.",
    tech: ["Tiered fetch", "Per-model valuation", "Daily sweep", "Dedupe", "Vercel"],
  },
  {
    name: "Marque",
    kind: "Luxury car sourcing SaaS",
    category: "Automotive",
    buildTier: "application",
    blurb:
      "Tracks exotic cars for sale nationwide, works out what each model is genuinely worth, and ranks every listing by the money left on the table.",
    href: "https://marque-demo.vercel.app/dashboard.html",
    domain: "marque-demo.vercel.app",
    image: "/shots/marque.jpg",
    detail:
      "Nationwide exotic inventory tracked and valued per model, then ranked by the gap between asking price and genuine market value. Thin comparable data is the constraint at this end of the market: a model with four sales in a year cannot be valued the same way as one with four hundred, so confidence in the estimate is carried through to the rank rather than hidden behind a single number.",
    tech: ["Next.js", "Nationwide ingest", "Sparse-comp valuation", "Confidence weighting"],
  },
  {
    name: "SellerFi",
    kind: "Seller-finance deal scanner",
    category: "Real estate",
    buildTier: "application",
    blurb:
      "Finds homes whose owners will finance the sale themselves, across seven cities, and only flags one when the monthly payment lands below what the place would rent for.",
    href: "https://sellerfi-app.vercel.app",
    domain: "sellerfi-app.vercel.app",
    image: "/shots/sellerfi.jpg",
    detail:
      "Scans listings across seven metros for seller-financed terms, then runs an affordability model per property and only surfaces one when the modeled monthly payment clears the local rent baseline. Seller-financing terms are written in prose rather than structured fields, so the extraction has to read them out of listing copy and refuse a listing when the terms are ambiguous instead of guessing.",
    tech: ["Multi-metro ingest", "Terms extraction", "Affordability model", "Rent baselines"],
  },
  {
    name: "Freedom Numbers",
    kind: "Financial freedom calculator",
    category: "Fintech",
    buildTier: "application",
    blurb:
      "Answer a few questions and it gives you the number you need to stop working, and how long it takes to get there. About 60 seconds.",
    href: "https://freedom-numbers.vercel.app",
    domain: "freedom-numbers.vercel.app",
    image: "/shots/freedom-numbers.jpg",
  },
  {
    name: "Freedom Numbers: Students",
    kind: "Career path comparison tool",
    category: "Fintech",
    buildTier: "application",
    blurb: "Shows students what each career path actually pays, what it costs to get there, and where they end up in ten years.",
    href: "https://freedom-numbers-students.vercel.app",
    domain: "freedom-numbers-students.vercel.app",
    image: "/shots/freedom-students.jpg",
  },
  {
    name: "Dream Drives ATL",
    kind: "Exotic car rental funnel",
    category: "Automotive",
    buildTier: "site",
    blurb:
      "An exotic car rental site built as one straight path from browsing to a booked drive.",
    href: "https://dreamdrivesatl.com",
    domain: "dreamdrivesatl.com",
    image: "/shots/dream-drives.jpg",
  },
  {
    name: "TimeSquared",
    kind: "Corporate concierge brand site",
    category: "Brand & services",
    buildTier: "site",
    blurb:
      "A corporate concierge brand where clients watch their request move through each stage instead of wondering where it stands.",
    href: "https://timesquared-revamp.vercel.app",
    domain: "timesquared-revamp.vercel.app",
    image: "/shots/timesquared.jpg",
  },
  {
    name: "ColorQ",
    kind: "Fine jewelry catalog site",
    category: "Brand & services",
    buildTier: "site",
    blurb:
      "A fine jewelry catalog of 500+ styles, designed to read like a magazine spread rather than a storefront.",
    href: "https://colorq-mockup.vercel.app",
    domain: "colorq-mockup.vercel.app",
    image: "/shots/colorq.jpg",
  },
  {
    name: "Cinematic Philms",
    kind: "Aerial cinematography booking",
    category: "Brand & services",
    buildTier: "site",
    blurb:
      "A licensed drone filming business where the reel does the selling and booking takes one step.",
    href: "https://cinematicphilms.com",
    domain: "cinematicphilms.com",
    image: "/shots/cinematic.jpg",
  },
  {
    name: "Bel4 Vending",
    kind: "Micro-market vending site",
    category: "Brand & services",
    buildTier: "site",
    blurb: "A vending company site coded from scratch rather than dropped onto a template, with contact forms that hold up against spam bots.",
    href: "https://bel4vending.com",
    domain: "bel4vending.com",
    image: "/shots/bel4.jpg",
  },
  {
    name: "CKKB Inc",
    kind: "Medical wig studio site",
    category: "Healthcare",
    buildTier: "site",
    blurb:
      "A studio making wigs for people losing their hair to illness. Warm branding, and every consultation request lands straight in the owner's inbox.",
    href: "https://ckkbinc.com",
    domain: "ckkbinc.com",
    image: "/shots/ckkb.jpg",
  },
  {
    name: "Erason Partners",
    kind: "Construction estimating site",
    category: "Brand & services",
    buildTier: "site",
    blurb: "A construction cost-estimating firm's site, built to win commercial bids by putting the numbers and the track record where buyers look first.",
    href: "https://erasonpartners.com",
    domain: "erasonpartners.com",
    image: "/shots/erason.jpg",
  },
  {
    name: "Global Abiding Hope",
    kind: "Nonprofit donation site",
    category: "Nonprofit",
    buildTier: "site",
    blurb: "A nonprofit's site that explains the mission in plain words and makes donating take two clicks.",
    href: "https://globalabidinghope.org",
    domain: "globalabidinghope.org",
    image: "/shots/abiding-hope.jpg",
  },
  {
    name: "Finance With Phil",
    kind: "Financial education nonprofit",
    category: "Nonprofit",
    buildTier: "site",
    blurb: "A nonprofit teaching money basics, with free programs, a community, and calculators anyone can use.",
    href: "https://financewithphil.org",
    domain: "financewithphil.org",
    image: "/shots/fwp.jpg",
  },
];

/* -------------------------------------------------------------------------- */
/* Open source + the existing case study                                      */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Operations run at volume                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Work whose defining property is scale rather than a single artifact: a
 * generation pipeline, a voice agent handling real calls, an outbound system
 * under regulatory constraint. These are the closest thing on the site to
 * forward-deployed work, so each one leads with the constraint that shaped it
 * rather than the headline number.
 *
 * Figures here are load-bearing and were taken from the operational notes, not
 * estimated. Do not round them upward.
 */
export type Operation = {
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  /** The constraint that actually shaped the build. */
  constraint: string;
  /** What was done about it. Reasoning, not recipe. */
  approach: string;
  stats: Stat[];
  stack: string[];
  guard?: string;
  /**
   * Short, concrete failures worth naming. Each one is a case where the system
   * reported success and was wrong, which is the class of bug this work is
   * actually about.
   */
  caught?: { label: string; detail: string }[];
};

export const operations: Operation[] = [
  {
    slug: "site-generation",
    kicker: "Generation pipeline · At volume",
    title: "A finished site per business, built only from what is verifiably true",
    summary:
      "Thousands of pages, three design variants each, generated from real listing and review data for businesses that had no website, so a cold message could open with the business's own finished site instead of a pitch.",
    constraint:
      "Nothing in this pipeline fails loudly. The lead source has no has-a-website flag, so that had to be established per business by querying search engines, and the first version of that check was wrong 59 percent of the time while returning clean, parseable, successful-looking results. One engine silently relaxes a quoted query when it has no exact match, so a business with a website came back looking like a business without one. Every one of those returned HTTP 200.",
    approach:
      "Yield went from 41 percent to 77 percent by treating a successful-looking response as unproven until the content itself was validated, not the status code. The generator is deterministic rather than a language model, with a truth layer that will only state what the source data supports: an earlier version invented prices and hours, so claims are now filtered by pattern and dropped when unverifiable. Per-business character comes from mining real reviews for a recurring named staff member, a signature item, unusual hours, or longevity, with clustering that resolves the same person spelled several ways.",
    stats: [
      { value: "6,288", unit: "+", label: "pages live" },
      { value: "7,521", label: "leads verified" },
      { value: "41→77", unit: "%", label: "verifier yield" },
    ],
    stack: [
      "Listing + OSM harvest",
      "SERP verification",
      "Deterministic templating",
      "Review mining",
      "Bulk deploy",
    ],
    guard:
      "Real review text only, never invented copy. A negative-keyword filter blocks quotes that would embarrass the business, and a computer-vision check keeps customers out of hero images.",
    caught: [
      {
        label: "A deploy that reported success and shipped nothing",
        detail:
          "Past a file-count ceiling the host stopped publishing new pages while still exiting clean, and the health check was reading pages from the previous successful deploy, so every cycle logged a pass while hundreds of pages returned 404. A check that can pass without the new build present is not a check.",
      },
      {
        label: "A five-star review about roaches",
        detail:
          "Rating is not a proxy for safe text. A negative-keyword pass now reads the quote itself before it can land on a page being sent to the business it describes.",
      },
      {
        label: "A customer's face on a business's own hero",
        detail:
          "Face area alone misses a full-body shot, where the face is tiny and the body fills the frame. Requiring both a face signal and a body signal is what actually catches it.",
      },
    ],
  },
  {
    slug: "voice-intake",
    kicker: "Voice agents · Bake-off",
    title: "Two voice stacks tested against each other, the better one shipped",
    summary:
      "An inbound agent that answers, routes the caller to the right lane, runs intake, and writes a structured summary back to the CRM record. Two platforms were built out and compared on real calls before either was trusted with a lead.",
    constraint:
      "A voice agent's dangerous failure is not silence, it is sounding successful while doing nothing: telling a caller they are booked when nothing ever reached the calendar. Choosing a platform on a demo call hides exactly that. Models also drift once a prompt passes about twelve thousand characters, and a rule buried inside a branch gets skipped precisely when pressure is highest.",
    approach:
      "A custom stack was assembled first, with its own model, voice, and transcription, then compared against the platform's native agent on real calls rather than on marketing pages. The custom build lost: the integrated one held a conversation better and, more importantly, kept the transcript and summary attached to the contact record without a synchronization layer that could silently fall behind. Load-bearing absolutes then moved into a numbered block at the top of the prompt, ahead of every branch, with branches referencing rules by number rather than restating them. Confident booking language is permitted only when the booking call actually returned success, so the failure mode is under-claiming rather than a caller who believes they have an appointment.",
    stats: [
      { value: "2", label: "stacks built and compared" },
      { value: "3", label: "lanes routed by one agent" },
      { value: "12", unit: "k", label: "prompt drift threshold" },
    ],
    stack: [
      "Native voice agent",
      "Call transcripts",
      "Post-call summaries",
      "CRM write-back",
      "Calendar booking",
    ],
    caught: [
      {
        label: "The stack that demoed well and lost on real calls",
        detail:
          "A hand-assembled voice stack sounded fine in isolation but was beaten by the integrated platform once both were put on live calls, mostly because transcripts and summaries landed on the contact record natively instead of through a sync that could quietly drift. Building the loser was what made the choice defensible.",
      },
      {
        label: "Routing that read a tag which never rendered",
        detail:
          "Contact tags do not interpolate inside a voice prompt, so tag-based routing silently fell through to a default. Asking the question in the greeting costs one turn, cannot fail quietly, and sounds more human than a lookup.",
      },
    ],
    guard:
      "Tested with an adversarial caller before it took a real call, because a guardrail only counts if it holds when the caller wants it crossed. The failure mode designed against is an agent that is too helpful: quoting a price, promising work, or faking a transfer.",
  },
  {
    slug: "conversational-outreach",
    kicker: "Conversational outreach · Shipped",
    title: "A messaging pipeline where the model handles replies, not the opener",
    summary:
      "An outreach system that sent a live campaign end to end: contacts deduplicated and normalized on import, sent in controlled waves rather than one blast, with a language model drafting replies on threads that came back and a fixed script on the way out.",
    constraint:
      "The instinct is to let a model write the cold opener, and that is exactly backwards. A first message to a stranger has one job and no context to work from, so generated variation mostly adds ways to sound wrong. Replies are the opposite: every one arrives with real context, a tone to match, and a decision attached, and that is where reading the thread correctly actually changes the outcome. Sending is also unforgiving in a way that build-time testing does not catch, because a duplicate or a malformed number is not an error to retry, it is a real person receiving a second cold message.",
    approach:
      "The opener is a single locked script, deliberately not model-generated, so what goes out is reviewable and identical every time. The model works behind the reply queue instead, drafting a response per thread with a read of what the person actually said, and each one is approved by a human before it sends. Import is where correctness is enforced: duplicates and unusable numbers are dropped before anything is contactable, phone formats are normalized once rather than at send time, and sending runs in bounded waves so a mistake reaches a handful of people rather than the whole list. Recipients carry a long re-contact cadence, because the failure that actually burns a list is contacting the same person twice.",
    stats: [
      { value: "1", label: "locked opener, not generated" },
      { value: "25", label: "contacts per wave" },
      { value: "90", unit: "d", label: "re-contact cadence" },
    ],
    stack: [
      "iMessage automation",
      "Import dedupe + normalization",
      "Wave scheduling",
      "Model-drafted replies",
      "Human approval queue",
    ],
    caught: [
      {
        label: "Generating the cold opener was the wrong instinct",
        detail:
          "Variant generation was built and then deliberately bypassed for the first message. A cold opener has no context to work from, so generated variation mostly produces new ways to sound off to a stranger. The model earns its place on replies, where there is a real thread to read.",
      },
      {
        label: "Sent messages are not reliably readable back",
        detail:
          "Outgoing messages do not consistently land in the local message store, because delivery can route through a separate path depending on the recipient. Reply detection had to be built on incoming messages only, since counting what you believe you sent is not the same as knowing what arrived.",
      },
    ],
    guard:
      "Every reply is drafted for a human and sent by one. Anyone asking not to be contacted is removed rather than re-queued, and sensitive replies are handled personally instead of by the queue.",
  },
  {
    slug: "compliant-sms",
    kicker: "Registered SMS · Compliance-bound",
    title: "Outbound built inside a regulatory ceiling, enforced in code",
    summary:
      "A qualifying agent for cold SMS on a registered carrier campaign, where the compliance rules live in a validator that refuses to send rather than in a prompt that asks for good behaviour.",
    constraint:
      "A registered campaign scales legitimately and bills by segment against a daily cap, which turns message length into a throughput decision: over 160 characters costs twice as much and halves what can go out that day. The trap is measuring that on the template rather than on the rendered message against the longest real value each merge field can take, so copy that passes on today's data breaks on one unusually long record tomorrow. One sending number also serves three separate campaigns, which means a complaint against any of them degrades the reputation of all three.",
    approach:
      "The rules live in a unit-tested validator rather than a prompt: banned characters, over-length, opt-out handling, quiet hours in the recipient's own timezone, and an application-side suppression list are enforcement, not intent. A prompt instruction is a hope; a validator that rejects the message is a guarantee. The qualifying agent is a reviewable file rather than platform configuration, because the platform's own assistant cannot enforce a deterministic gate. It also never opens with the signal that put someone on the list, since leading with the private thing reads as surveillance and earns a spam report.",
    stats: [
      { value: "8,317", label: "contacts in the audience" },
      { value: "160", unit: "char", label: "enforced ceiling" },
      { value: "3", label: "lanes, one reputation" },
    ],
    stack: [
      "Registered carrier campaign",
      "Custom qualifying agent",
      "Compliance validator",
      "Opt-out + quiet hours",
      "Suppression list",
    ],
    caught: [
      {
        label: "Length measured on the template, not the message",
        detail:
          "A message that fits one segment as written crosses into two once a long name and a long address merge in. Validating the rendered worst case rather than the template is the difference between a predictable daily volume and a bill that quietly doubles.",
      },
      {
        label: "A platform assistant cannot hold a hard gate",
        detail:
          "The hosted conversational AI could not enforce a deterministic rule, which is disqualifying when the rule is a legal obligation rather than a preference. Moving the logic into a reviewable, testable file is what made the gate real.",
      },
    ],
    guard:
      "Every send path dry-runs against a locked test number first, and the batch sender stays disarmed unless explicitly armed. Compliance posture is reviewed by counsel and never self-authorized from inside a tool.",
  },
  {
    slug: "tenant-isolation",
    kicker: "Multi-tenant security · Audited",
    title: "Auditing a shared database where the isolation is the product",
    summary:
      "A recurring audit of a Postgres database where several applications and every client tenant share one instance, and row-level security is the only thing keeping them apart.",
    constraint:
      "In a shared database the dangerous state is not an error, it is a permission nobody is using yet. A table can look safe because one control happens to be holding, while the layer underneath it grants far more than anyone intended. That combination fails quietly and stays quiet for as long as nothing changes, which means it is invisible to testing and only surfaces the day someone makes a reasonable-looking change somewhere else.",
    approach:
      "Audit the layers separately rather than trusting the outcome. Enumerate every table for whether row-level security is on and whether policies exist, then enumerate the grants underneath independently, because a table with the right behaviour and the wrong grants is a latent breach rather than a safe one. Probe the live API with a public key to confirm what an outsider can actually reach, since a policy that reads correctly and a policy that holds are different claims. Where a table is written only by a server-side key, the public roles are stripped of privileges entirely, so no future change can widen access by accident.",
    stats: [
      { value: "84", unit: "/84", label: "tables with RLS enabled" },
      { value: "4", label: "admin functions moved off the public API" },
      { value: "0", label: "public grants on lead tables" },
    ],
    stack: [
      "Postgres RLS",
      "Grant auditing",
      "Live API probing",
      "Least privilege",
      "Deny by default",
    ],
    caught: [
      {
        label: "Admin checks reachable with a public key",
        detail:
          "Helper functions used inside policies were defined in the schema the API publishes, so anything holding the public key could call them, including one that answers whether a caller is an administrator. Moving them to a private schema removed the surface. Confirmed fixed by calling all four from outside and getting a not-found rather than an answer.",
      },
      {
        label: "A lead table one policy away from exposure",
        detail:
          "A public contact form's table had row-level security on and no policies, which reads as locked. Underneath, the public role still held select, update and delete grants, held back only by that. Anyone later adding a permissive policy to make a form work would have opened every stored email and phone number in the same motion. The form writes with a server-side key and never needed those grants, so they were revoked.",
      },
      {
        label: "Zero rows is not evidence of a bug",
        detail:
          "The same empty table looked like a form silently failing. Reproducing the failure with a public key confirmed inserts were rejected, but the form does not use that path: it writes server-side, and a live end-to-end submission landed correctly. The table was empty because nobody had filled the form in. Testing the wrong path would have produced a fix for a system that was working.",
      },
    ],
    guard:
      "Read-only enumeration first, and every finding reproduced against the live API before it is called a finding. Nothing is changed on a production database on the strength of a lint result alone.",
  },
];

/**
 * Open-source work.
 *
 * `metric` is the line a reader sees before they decide whether to click, so it
 * states the finding in plain words rather than the score that produced it. The
 * benchmark names and the actual figures live in each repo's README, which is
 * the right place for someone who wants to check the work.
 */
export const openSource = [
  {
    title: "rag-eval-harness",
    desc: "A test bench for the retrieval step in an AI assistant: given a question, did the system pull up the right source material? It runs four different search methods over the same questions and scores them the same way, so the comparison is reproducible instead of anecdotal.",
    metric: "Meaning-based search beat keyword search by 21%",
    href: "https://github.com/phillipkaraya/rag-eval-harness",
  },
  {
    title: "rageval-mcp",
    desc: "The same evaluation, handed to an AI agent as tools it can run itself. It can test the search methods, then grade the answers that come out for whether they are actually supported by the source and whether they are correct. Point it at your own documents and it re-runs against those.",
    metric: "5 tools an agent can run unattended",
    href: "https://github.com/phillipkaraya/rageval-mcp",
  },
];

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                            */
/* -------------------------------------------------------------------------- */

export const deepProjects: DeepProject[] = [...systems, ...platforms];

export function getDeepProject(slug: string): DeepProject | undefined {
  return deepProjects.find((p) => p.slug === slug);
}

export const categories: Category[] = [
  "AI & SaaS",
  "Automotive",
  "Real estate",
  "Fintech",
  "Healthcare",
  "Brand & services",
  "Nonprofit",
];

/** Counts used in the hero proof strip. Derived so they cannot drift. */
export const counts = {
  systems: systems.length,
  platforms: platforms.length,
  builds: builds.length,
  /** How many are actually written up and shown on this site. */
  total: systems.length + platforms.length + builds.length,
  /**
   * Everything shipped, not just what is featured here.
   *
   * Sourced from the canonical hosting inventory, which counts live sites and
   * applications across every platform: 111 at last audit. Rendered with a
   * trailing "+" and rounded DOWN to 100, because a round number that
   * understates is defensible under questioning and a precise one invites a
   * spreadsheet. This deliberately excludes the several thousand generated
   * preview pages, which are counted and described in their own entry rather
   * than folded in here, since merging them would inflate this figure past
   * what "projects" honestly means.
   */
  shipped: 100,
};
