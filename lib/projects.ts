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
  /** Long form, renders as the opening paragraphs of the detail page */
  body: string[];
  stats: Stat[];
  stack: string[];
  /** Section heading for the module list, e.g. "The nine modules" */
  modulesTitle?: string;
  modules?: Module[];
  /** The engineering claim. Renders in a pulled-out block. */
  proves: string;
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
export type Build = {
  name: string;
  kind: string;
  category: Category;
  blurb: string;
  href: string;
  domain: string;
  image: string;
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
    summary:
      "Four independent agents trading their own books on a two minute loop, unattended, for months.",
    body: [
      "Four independent AI agents, one each for equities, options, futures, and forex, every one running its own budget, strategy, and risk rules. They scan markets on a two minute loop, open and close their own positions, and write every decision to a live ledger.",
      "Each agent keeps a per instrument track record that feeds back into what it is willing to trade next, so a losing pattern gets down weighted without anyone touching it. The interesting engineering is not the strategy, it is the autonomy: what happens to an agent over months with no human in the loop, and whether it can recover from its own bad decisions.",
    ],
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
    proves:
      "Long running agents that survive real world failure, meaning API outages, bad data, and their own mistakes, and keep operating correctly for months unattended.",
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
    summary:
      "Hybrid search over a quarter million engineering messages, re-embeddable for about the price of a coffee.",
    body: [
      "Every engineering session I run gets ingested into a searchable knowledge base: full text and semantic search over a quarter million messages, AI written summaries, and a visual graph of how the work connects.",
      "It maintains itself. A nightly job ingests, summarizes, embeds, and tiers older data to cold storage without anyone touching it. Summarization and embeddings run on Cloudflare Workers AI rather than a per token API, which is the reason re embedding the entire corpus costs about a dollar forty instead of a monthly invoice.",
    ],
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
    proves:
      "The retrieval stack behind searching a company's own knowledge: embeddings, hybrid search, summarization, and storage tiering, built and running at real scale rather than in a notebook.",
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
    summary:
      "Declarative collection jobs that escalate through heavier fetch strategies only when a source pushes back.",
    body: [
      "The data layer under my lead generation and pricing products. Jobs are declared in config, not code. Each one escalates through progressively heavier fetch strategies only when a source pushes back, governs its own request rate per domain, routes through rotating egress, and keeps dedupe state so a monitor run surfaces only what is genuinely new.",
      "The overwhelming majority of runs complete on the lightest tier against public and government sources, which keeps a full nationwide sweep under a few dollars a month in egress.",
    ],
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
    proves:
      "Collection infrastructure that survives contact with the real internet, meaning rate limits, shape changes, and flaky sources, and stays maintainable because the jobs are declarative.",
    guard: {
      lead: "Cheap on purpose.",
      text: "Sources and evasion methods stay in house. The engineering claim is the architecture, not the target list.",
    },
    accent: "royal",
  },
  {
    slug: "airline-support-agent",
    tier: "system",
    kicker: "Conversational AI · Concept demo",
    title: "WhatsApp Customer-Service Agent",
    summary:
      "An agent that knows the limits of its own authority, with a second AI grading every finished conversation.",
    body: [
      "Built to answer the question airlines lose customers over: what happens when nobody replies. It handles cancellations, refunds, baggage claims, and disruptions over WhatsApp, and every incoming message is classified in real time on four axes at once: the right service desk, how urgent it is, how the customer feels, and whether there is legal or regulatory risk in the wording.",
      "Anything it should not answer alone opens a tracked case and pulls in a human, who can take the conversation over mid thread. A second AI then grades every finished conversation on empathy, accuracy, resolution, efficiency, and compliance, so quality is measured across all of them rather than on a sampled few.",
      "It exists because I spent two days trying to reach a person about cancelling a flight, then waited another forty business days for the refund. That is two months of real time. This is that experience rebuilt as software that answers in seconds.",
    ],
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
    proves:
      "An AI agent that knows the limits of its own authority: it resolves what it can and escalates what it should not touch, with the full conversation handed to the person taking over.",
    guard: {
      lead: "Concept demo, not a client engagement.",
      text: "Built for myself and branded for the airline where the experience happened. They are not a customer, and nothing here uses real passenger data.",
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
    summary:
      "Turning an LLC on a deed into a reachable human, across state registries, where commercial skip trace returns nothing.",
    body: [
      "A pipeline that turns a business entity into a real person you can actually reach. Commercial skip trace services return nothing useful when the owner of record is an LLC, so I built the chain myself: identify the entity across state registries, extract the officer behind it, then resolve that person to current contact details.",
      "Multi state, fully automated, and built on lawful public record. The measure that matters is verified contacts, not rows scraped.",
    ],
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
    proves:
      "Data engineering where the easy path fails: sources that fight automation, records that need real parsing, and results measured in verified contacts rather than rows scraped.",
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
    summary:
      "A creator's full back catalog across four platforms, unified into what performs and when to post.",
    body: [
      "Built to answer the question every creator gets asked by brands: prove your audience. It ingests a creator's entire back catalog across Instagram, TikTok, YouTube, and Threads, then reports what actually performs, when to post, and which comments deserve a reply.",
      "A brand deals tab tracks the partnership pipeline, and a content analyzer takes any video and pulls frames plus a transcript so you can see why a post landed. Clone the repo, drop your exported platform data into the data directory, build, and host the static output anywhere.",
    ],
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
    proves:
      "A full data product end to end, collection through analysis to a shipped interface, and one I was willing to open source rather than describe.",
    links: [
      {
        label: "View the repository",
        href: "https://github.com/financewithphil/fwp-analytics-dashboard",
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
    summary:
      "A receptionist on the channel customers actually use, with language detection and human handoff designed in.",
    body: [
      "A WhatsApp receptionist built for a wellness studio abroad, where WhatsApp rather than phone or email is how customers actually book. It detects which of two languages a customer is writing in and replies in kind, answers from the studio's full service and pricing catalog, hands off into their existing booking system, and escalates anything it should not handle to a human with the conversation attached.",
    ],
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
    proves:
      "Conversational AI on the channel that actually converts, with language handling and human handoff designed in from the start rather than bolted on.",
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
    summary:
      "Web dashboard, native mobile app, and patient portal in one offline-first, trilingual codebase.",
    body: [
      "A complete practice management system for a chiropractic clinic in Rwanda: web dashboard, native mobile app, and patient portal in one codebase. Offline first for unreliable connectivity, trilingual across English, French, and Kinyarwanda, and compliant with Rwanda's tax, ID, and payment rails.",
      "The AI piece is the part clinicians actually feel: a provider dictates a note and it comes back as structured SOAP documentation, charted against an interactive body map rather than typed into a text box.",
    ],
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
    proves:
      "Shipping a real clinical system against real constraints: intermittent connectivity, three languages, and a national tax and identity stack that does not look like the US one.",
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
    summary:
      "An agent that grades thousands of companies against a weighted ICP, then drafts every email for one-click human approval.",
    body: [
      "A sourcing machine for M&A advisors and private equity firms. An AI agent pulls thousands of companies, grades each one against a weighted ideal client profile per industry, runs twelve and eighteen month drip campaigns, and drafts every email and reply for one click human approval.",
      "The design constraint that shaped everything: nothing sends without a human yes. The agent does the volume work and the judgment stays with the principal, who gets an overnight briefing telling them exactly what happened while they slept.",
    ],
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
    proves:
      "An agent workflow with a human approval gate that people actually keep using, because the queue is faster than writing the email yourself.",
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
    summary:
      "One login replacing the spreadsheet sprawl of a growing solo practice, with trust-account-safe payments.",
    body: [
      "An operating system for a solo attorney's entire practice: client intake built from her real questionnaires, a registered agent book managing twenty one business entities, secure client accounts, and payments wired through LawPay.",
      "The build decision worth noting is that she owns the auth and the database. A practice holding client confidences should not have its record of them living inside someone else's SaaS tenant.",
    ],
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
    proves:
      "Domain software built from a practitioner's real paperwork rather than a generic CRM bent into shape, including the compliance edges that make legal payments different.",
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
    summary:
      "Multi-tenant marketing operations on Next.js and Supabase, with row-level-security isolation, in production.",
    body: [
      "My own multi tenant marketing operations platform, running in production. Each client gets an isolated workspace for campaigns, content, and reporting, with row level security doing the isolation at the database rather than in application code.",
      "The same system I use to run engagements is the product itself, which means every rough edge gets found by me before a tenant finds it.",
    ],
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
    proves:
      "Multi tenancy done at the database layer, where a bug is a policy fix rather than an audit of every query in the app.",
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
    blurb:
      "Free prescription savings lookup: searches 75 brand-name medications against manufacturer copay cards and patient assistance programs, so people stop overpaying at the pharmacy counter.",
    href: "https://scriptsaver.io",
    domain: "scriptsaver.io",
    image: "/shots/scriptsaver.jpg",
  },
  {
    name: "FleetAgent",
    kind: "AI fleet sourcing SaaS",
    category: "AI & SaaS",
    blurb:
      "Done-for-you fleet growth engine that sources cars and the rideshare drivers to fill them, live and delivering leads today.",
    href: "https://fleetagent.co",
    domain: "fleetagent.co",
    image: "/shots/fleetagent.jpg",
  },
  {
    name: "Caliber",
    kind: "AI watch-sourcing SaaS",
    category: "AI & SaaS",
    blurb:
      "Secondary-market watch sourcing engine that scans live listings, filters counterfeits, and ranks genuine deals by margin behind a members paywall.",
    href: "https://caliber-web-ten.vercel.app",
    domain: "caliber-web-ten.vercel.app",
    image: "/shots/caliber.jpg",
  },
  {
    name: "PeachFlips",
    kind: "Under-market car deal flow",
    category: "Automotive",
    blurb:
      "Deal-flow platform for car flippers: every under-market car in Georgia, scored and ranked, behind a client portal.",
    href: "https://peachflips.vercel.app",
    domain: "peachflips.vercel.app",
    image: "/shots/peachflips.jpg",
  },
  {
    name: "Marque",
    kind: "Luxury car sourcing SaaS",
    category: "Automotive",
    blurb:
      "Exotic-car sourcing engine: scrapes live nationwide listings, fits a fair-value model per model line, and ranks every car by margin in an operator console.",
    href: "https://marque-demo.vercel.app/dashboard.html",
    domain: "marque-demo.vercel.app",
    image: "/shots/marque.jpg",
  },
  {
    name: "SellerFi",
    kind: "Seller-finance deal scanner",
    category: "Real estate",
    blurb:
      "Pulls owner-financed listings across seven metros, scores each on cash flow, and only calls it a match when the financed payment clears market rent.",
    href: "https://sellerfi-app.vercel.app",
    domain: "sellerfi-app.vercel.app",
    image: "/shots/sellerfi.jpg",
  },
  {
    name: "Freedom Numbers",
    kind: "Financial freedom calculator",
    category: "Fintech",
    blurb:
      "Interactive calculator that hands users their personal financial freedom plan in about 60 seconds.",
    href: "https://freedom-numbers.vercel.app",
    domain: "freedom-numbers.vercel.app",
    image: "/shots/freedom-numbers.jpg",
  },
  {
    name: "Freedom Numbers: Students",
    kind: "Career path comparison tool",
    category: "Fintech",
    blurb: "Career-path router that shows students where each path actually leads, in numbers.",
    href: "https://freedom-numbers-students.vercel.app",
    domain: "freedom-numbers-students.vercel.app",
    image: "/shots/freedom-students.jpg",
  },
  {
    name: "Dream Drives ATL",
    kind: "Exotic car rental funnel",
    category: "Automotive",
    blurb:
      "Exotic car experience site built as a request funnel that turns browsers into booked drives.",
    href: "https://dreamdrivesatl.com",
    domain: "dreamdrivesatl.com",
    image: "/shots/dream-drives.jpg",
  },
  {
    name: "TimeSquared",
    kind: "Corporate concierge brand site",
    category: "Brand & services",
    blurb:
      "Corporate concierge brand with a conversion-first landing page and a live request timeline.",
    href: "https://timesquared-revamp.vercel.app",
    domain: "timesquared-revamp.vercel.app",
    image: "/shots/timesquared.jpg",
  },
  {
    name: "ColorQ",
    kind: "Fine jewelry catalog site",
    category: "Brand & services",
    blurb:
      "Diamond atelier site presenting 500+ signature styles with emerald and gold editorial design and a catalog request flow.",
    href: "https://colorq-mockup.vercel.app",
    domain: "colorq-mockup.vercel.app",
    image: "/shots/colorq.jpg",
  },
  {
    name: "Cinematic Philms",
    kind: "Aerial cinematography booking",
    category: "Brand & services",
    blurb:
      "FAA-licensed aerial cinematography brand where the video does the selling and the booking flow does the rest.",
    href: "https://cinematicphilms.com",
    domain: "cinematicphilms.com",
    image: "/shots/cinematic.jpg",
  },
  {
    name: "Bel4 Vending",
    kind: "Micro-market vending site",
    category: "Brand & services",
    blurb: "Vending services company on a fully custom-coded theme with hardened contact forms.",
    href: "https://bel4vending.com",
    domain: "bel4vending.com",
    image: "/shots/bel4.jpg",
  },
  {
    name: "CKKB Inc",
    kind: "Medical wig studio site",
    category: "Healthcare",
    blurb:
      "Medical wig studio with warm, personal branding and a consultation pipeline wired straight into the owner's inbox.",
    href: "https://ckkbinc.com",
    domain: "ckkbinc.com",
    image: "/shots/ckkb.jpg",
  },
  {
    name: "Erason Partners",
    kind: "Construction estimating site",
    category: "Brand & services",
    blurb: "Construction cost-estimating firm site built to win commercial bids and inquiries.",
    href: "https://erasonpartners.com",
    domain: "erasonpartners.com",
    image: "/shots/erason.jpg",
  },
  {
    name: "Global Abiding Hope",
    kind: "Nonprofit donation site",
    category: "Nonprofit",
    blurb: "501(c)(3) organization site with clear mission storytelling and donation pathways.",
    href: "https://globalabidinghope.org",
    domain: "globalabidinghope.org",
    image: "/shots/abiding-hope.jpg",
  },
  {
    name: "Finance With Phil",
    kind: "Financial education nonprofit",
    category: "Nonprofit",
    blurb: "Financial education nonprofit with programs, community, and a free tools ecosystem.",
    href: "https://financewithphil.org",
    domain: "financewithphil.org",
    image: "/shots/fwp.jpg",
  },
];

/* -------------------------------------------------------------------------- */
/* Open source + the existing case study                                      */
/* -------------------------------------------------------------------------- */

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
