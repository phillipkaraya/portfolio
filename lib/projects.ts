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
        "Four platforms, four different export formats, and no usable public way to pull a creator's full back catalogue.",
      solution:
        'Everything is normalized into a single post shape at ingest, so the analysis code never needs to know which platform a row came from and adding a fifth platform touches only the importer. It ships as static output, so anyone can run it on their own numbers without standing up infrastructure.',
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
};

export const operations: Operation[] = [
  {
    slug: "site-generation",
    kicker: "Generation pipeline · At volume",
    title: "A site per business, generated from public listing data",
    summary:
      "Thousands of preview sites, each built from one real business's own listing data, so a cold outreach message could open with the business's finished site instead of a pitch.",
    constraint:
      "Generating a site is easy once. Generating thousands, each genuinely specific to its business, means the input data is the product: name, category, hours, address, rating, review text, and photos all have to be harvested, verified, and matched to the right business before a single page is worth sending. Businesses that already had a site had to be filtered out, because sending a mockup to someone who does not need one burns the list.",
    approach:
      "Harvesting ran across two browser nodes with deliberate pacing, and every candidate was classified before it entered the build queue rather than after. Records carry their own verification state, so the pipeline can be stopped and resumed without rebuilding what it already knows. Multiple layout variants exist so that a category reads correctly rather than every business receiving one template.",
    stats: [
      { value: "3,752", label: "sites generated" },
      { value: "4,904", label: "businesses harvested" },
      { value: "4", label: "layout variants" },
    ],
    stack: [
      "Listing-data harvest",
      "Candidate verification",
      "Per-business generation",
      "Bulk deploy",
      "Resumable queue",
    ],
  },
  {
    slug: "voice-intake",
    kicker: "Voice agents · Live calls",
    title: "A voice agent that runs intake and writes its own call summary",
    summary:
      "An inbound agent that answers, routes the caller to the right lane, runs the intake questions, and writes a structured summary back to the CRM record before the next call comes in.",
    constraint:
      "A voice agent's dangerous failure is not silence, it is sounding successful while doing nothing: telling a caller they are booked when nothing reached the calendar. Prompts also drift once they get long, and a rule buried inside a branch gets skipped under pressure. On top of that, the platform lets an API write the agent's prompt but not attach its booking action, so part of the system is configuration that no script can own.",
    approach:
      "Load-bearing absolutes live in a numbered block at the top of the prompt, ahead of any branch, and branches reference rules by number instead of restating them. The agent is only allowed confident booking language when the booking call actually returned success, and otherwise falls back to an honest promise of a callback, so the failure mode is under-claiming rather than a caller who thinks they have an appointment. Routing is done by asking in the greeting, because contact tags do not render inside a voice prompt.",
    stats: [
      { value: "3", label: "lanes routed by one agent" },
      { value: "100", unit: "%", label: "summaries written to CRM" },
      { value: "0", label: "bookings claimed without one" },
    ],
    stack: [
      "Voice agent",
      "Call transcripts",
      "Post-call summarization",
      "CRM write-back",
      "Calendar booking",
    ],
    guard:
      "Tested adversarially before it ever took a real call, because a guardrail only counts if it holds when the caller wants it crossed.",
  },
  {
    slug: "outbound-messaging",
    kicker: "Outbound · Compliance-bound",
    title: "Outbound messaging built inside a regulatory constraint",
    summary:
      "A qualifying agent for cold outbound where the compliance rules are enforced by code that refuses to send, not by instructions in a prompt.",
    constraint:
      "Cold messaging is regulated, and the carrier registration in place caps daily throughput and charges by segment, so every message over 160 characters costs twice as much and halves throughput. The catch is that length has to be measured on the rendered message against the longest real values a merge field can take, not on the template, or a message that passes today breaks on one unusually long record tomorrow.",
    approach:
      "The rules live in a validator that rejects a message rather than in a prompt that requests good behaviour, and the validator is unit-tested: banned characters, over-length, opt-out handling, quiet hours, and a suppression list are all enforcement rather than intent. A prompt instruction is a hope; something that refuses to send is a guarantee. The qualifying agent itself is a reviewable file rather than platform configuration, because the platform's own AI cannot enforce a deterministic gate.",
    stats: [
      { value: "8,317", label: "contacts in the audience" },
      { value: "160", unit: "char", label: "hard enforced ceiling" },
      { value: "1", label: "segment per message" },
    ],
    stack: [
      "Custom qualifying agent",
      "Compliance validator",
      "Opt-out + quiet hours",
      "Suppression list",
      "Reply loop",
    ],
    guard:
      "Every send path dry-runs against a locked test number first. Compliance posture is reviewed by counsel, never self-authorized.",
  },
];

export const openSource = [
  {
    title: "rag-eval-harness",
    desc: "A reproducible benchmark for RAG retrieval quality across lexical, semantic, and hybrid retrievers, scored on recall, precision, MRR, and nDCG.",
    metric: "dense retriever · 0.957 nDCG@3",
    href: "https://github.com/phillipkaraya/rag-eval-harness",
  },
  {
    title: "rageval-mcp",
    desc: "An MCP server exposing end-to-end RAG evaluation as agent tools: benchmark BM25, TF-IDF, dense, and hybrid retrieval, then score generated answers for faithfulness and correctness with an LLM judge on Cloudflare Workers AI, over a corpus you can swap at runtime.",
    metric: "5 tools · Workers AI judge",
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
  total: systems.length + platforms.length + builds.length,
};
