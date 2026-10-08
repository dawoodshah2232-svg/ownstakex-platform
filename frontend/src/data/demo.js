// Demo fallback content — shown when the Laravel API is unreachable,
// so the UI is fully viewable without a backend. Mirrors the shipped demo data.

export const DEMO_PROJECTS = [
  {
    id: 1,
    slug: "marina-gate-residences",
    name: "Marina Gate Residences",
    tagline: "Waterfront apartments in Dubai Marina",
    category: "Real Estate",
    location: "Dubai Marina, Dubai",
    image: "/hero.jpg",
    status: "funding",
    target_amount: 2500000,
    raised_amount: 1625000,
    min_investment: 5000,
    expected_yield: "7.2%",
    investors_count: 214,
    description:
      "A curated pool of waterfront apartments in Dubai Marina, professionally managed with quarterly rental distributions and transparent reporting.",
  },
  {
    id: 2,
    slug: "azure-yacht-fraction",
    name: "Azure 88 Yacht Fraction",
    tagline: "Co-own a luxury charter yacht",
    category: "Yachts",
    location: "Dubai Harbour, Dubai",
    image: "/hero.jpg",
    status: "funding",
    target_amount: 1800000,
    raised_amount: 990000,
    min_investment: 10000,
    expected_yield: "6.8%",
    investors_count: 96,
    description:
      "Fractional ownership in a luxury charter yacht operating from Dubai Harbour, with charter revenue shared pro-rata among owners.",
  },
  {
    id: 3,
    slug: "palm-hospitality-suites",
    name: "Palm Hospitality Suites",
    tagline: "Serviced suites on Palm Jumeirah",
    category: "Hospitality",
    location: "Palm Jumeirah, Dubai",
    image: "/hero.jpg",
    status: "coming_soon",
    target_amount: 3200000,
    raised_amount: 0,
    min_investment: 10000,
    expected_yield: "8.1%",
    investors_count: 0,
    description:
      "Serviced hospitality suites on Palm Jumeirah targeting short-stay demand, opening for funding soon.",
  },
];

export const DEMO_POSTS = [
  {
    id: 1,
    slug: "what-is-fractional-ownership",
    title: "What Is Fractional Ownership, Really?",
    excerpt:
      "How shared ownership of real assets works, who it suits, and the questions to ask before you invest.",
    category: "Guides",
    published_at: "2026-09-28",
    read_time: "6 min read",
    body: [
      "Fractional ownership lets several investors co-own a single high-value asset — a property, a yacht, a business — through a structured legal entity. Each investor holds a defined stake and shares proportionally in income and costs.",
      "On OwnStakeX, every opportunity is presented with a full breakdown: the asset, the structure, the fees, and the risks. Capital is at risk, and returns are never guaranteed.",
      "Before investing, check three things: the legal structure holding the asset, the fee schedule, and the exit options. If any of the three is unclear, ask — transparency is the whole point.",
    ],
  },
  {
    id: 2,
    slug: "dubai-yield-guide-2026",
    title: "Reading Rental Yields in Dubai (2026)",
    excerpt:
      "Gross vs net yields, service charges, and why the headline number is only the start of the story.",
    category: "Market",
    published_at: "2026-09-21",
    read_time: "8 min read",
    body: [
      "Headline rental yields in Dubai often quote gross figures. The number that matters to you as a part-owner is the net yield: rent minus service charges, management fees, maintenance reserves and vacancy assumptions.",
      "A realistic net yield on a well-managed residential asset typically lands several points below the gross figure. Any projection you see on this platform shows its assumptions — check them.",
      "Capital is at risk. Past performance of an area or asset class is not a guide to future returns.",
    ],
  },
  {
    id: 3,
    slug: "understanding-spv-structures",
    title: "SPVs Explained: How Your Stake Is Held",
    excerpt:
      "Special purpose vehicles sound complex. The idea behind them is simple: ring-fence the asset.",
    category: "Guides",
    published_at: "2026-09-14",
    read_time: "5 min read",
    body: [
      "A special purpose vehicle (SPV) is a company created solely to own one asset. Your investment buys shares in that company, which in turn owns the property, yacht or business.",
      "This ring-fences the asset: its income, costs and liabilities stay separate from everything else. You can see exactly what you own and what it earns.",
      "OwnStakeX publishes the SPV documents for every live opportunity in its document room before funding opens.",
    ],
  },
];

export const DEMO_FAQS = [
  {
    q: "What is OwnStakeX?",
    a: "OwnStakeX is an investment platform offering fractional ownership in curated real-world assets — real estate, yachts, hospitality and operating businesses. OwnStakeX.com is owned by Bridging Investment LLC, Dubai, UAE.",
  },
  {
    q: "What is the minimum investment?",
    a: "Minimums vary per opportunity and typically start from AED 5,000. Each project page lists its own minimum.",
  },
  {
    q: "How do I earn returns?",
    a: "Income-generating assets distribute rental or operating income pro-rata, usually quarterly. Capital growth depends on the asset's value at exit. Capital is at risk and returns are never guaranteed.",
  },
  {
    q: "Can I sell my stake?",
    a: "Stakes can be listed for resale once any initial lock-in period for that project has passed, subject to demand from other investors.",
  },
  {
    q: "Is my money protected?",
    a: "No investment is risk-free. Assets are held in dedicated SPVs with published documents, but capital is at risk and you may get back less than you invest.",
  },
  {
    q: "How do I get started?",
    a: "Create an account, complete verification, browse projects, and reserve your stake. You can start exploring without funding your wallet.",
  },
];

export const DEMO_INVESTOR = {
  overview: {
    total_invested: 45000,
    active_stakes: 3,
    lifetime_earnings: 2850,
    pending_reservations: 1,
  },
  reservations: [
    { id: "RSV-1001", project: "Marina Gate Residences", units: 2, amount: 10000, status: "confirmed", date: "2026-09-20" },
    { id: "RSV-1002", project: "Azure 88 Yacht Fraction", units: 1, amount: 10000, status: "pending", date: "2026-10-02" },
  ],
  payments: [
    { id: "PAY-9001", date: "2026-09-20", amount: 10000, method: "Bank transfer", status: "completed" },
    { id: "PAY-9002", date: "2026-10-02", amount: 10000, method: "Card", status: "pending" },
  ],
  investments: [
    { project: "Marina Gate Residences", stake: "2.0%", invested: 25000, current_value: 25600, earnings: 1400 },
    { project: "Azure 88 Yacht Fraction", stake: "1.1%", invested: 20000, current_value: 19800, earnings: 1450 },
  ],
  documents: [
    { name: "Marina Gate Residences — Share Certificate", type: "Certificate", date: "2026-09-22" },
    { name: "Q3 2026 Performance Report", type: "Report", date: "2026-10-01" },
    { name: "KYC Verification Confirmation", type: "Compliance", date: "2026-09-15" },
  ],
  ownership: [
    {
      id: "OWN-1",
      project: { code: "MG-RS-01", name: "Marina Gate Residences" },
      units: 5, amount: 25000, ownership_pct: "1.00",
      acquired_at: "2026-09-12",
      certificate: { id: "CRT-2026-0912", cert_no: "CRT-2026-0912", issued_at: "2026-09-22" },
    },
    {
      id: "OWN-2",
      project: { code: "AZ-YT-02", name: "Azure 88 Yacht Fraction" },
      units: 2, amount: 20000, ownership_pct: "1.10",
      acquired_at: "2026-09-05",
      certificate: { id: "CRT-2026-0877", cert_no: "CRT-2026-0877", issued_at: "2026-09-20" },
    },
  ],
  statements: [
    { id: "ST-093", project_name: "All holdings", period: "September 2026", version: 2, correction_of_id: "ST-092", created_at: "2026-10-07" },
    { id: "ST-092", project_name: "All holdings", period: "September 2026", version: 1, correction_of_id: null, created_at: "2026-10-01" },
    { id: "ST-081", project_name: "All holdings", period: "August 2026", version: 1, correction_of_id: null, created_at: "2026-09-05" },
  ],
  polls: [
    {
      id: "VOTE-31", project_code: "AZ-YT-02", project_name: "Azure 88 Yacht Fraction",
      question: "Approve Q4 2026 charter rate card",
      options: ["Approve", "Reject", "Abstain"], closes_at: "2026-10-20", my_vote: null, votes: [12, 2, 1],
    },
    {
      id: "VOTE-28", project_code: "MG-RS-01", project_name: "Marina Gate Residences",
      question: "Approve August distribution of AED 84,000",
      options: ["Approve", "Reject", "Abstain"], closes_at: "2026-09-12", my_vote: 0, votes: [92, 5, 3],
    },
  ],
};

export const DEMO_ADMIN = {
  overview: { users: 1284, projects: 12, total_raised: 8450000, pending_kyc: 23 },
  investors: [
    { id: 1, name: "Ahmed K.", email: "ahmed@example.com", invested: 45000, kyc: "verified", joined: "2026-06-14" },
    { id: 2, name: "Sara M.", email: "sara@example.com", invested: 120000, kyc: "verified", joined: "2026-05-02" },
    { id: 3, name: "Omar R.", email: "omar@example.com", invested: 15000, kyc: "pending", joined: "2026-09-30" },
  ],
  announcements: [
    { id: 1, title: "Q3 2026 reports published", audience: "All investors", date: "2026-10-01" },
    { id: 2, title: "New project: Palm Hospitality Suites", audience: "All investors", date: "2026-09-25" },
  ],
  library: [
    { id: 1, name: "Platform Terms of Use", type: "Legal", size: "184 KB", updated: "2026-08-01" },
    { id: 2, name: "Risk Disclosure Statement", type: "Legal", size: "96 KB", updated: "2026-08-01" },
    { id: 3, name: "Marina Gate — Information Memorandum", type: "Project", size: "2.4 MB", updated: "2026-09-10" },
  ],
};

export const CATEGORIES = [
  { name: "Real Estate", desc: "Residential & commercial property", icon: "building" },
  { name: "Yachts", desc: "Crewed & charter yachts", icon: "anchor" },
  { name: "Hospitality", desc: "Hotels & serviced suites", icon: "bed" },
  { name: "Businesses", desc: "Operating companies", icon: "briefcase" },
];

export const STEPS = [
  { n: "01", title: "Create account", text: "Sign up and verify your identity in minutes." },
  { n: "02", title: "Browse projects", text: "Explore curated, documented opportunities." },
  { n: "03", title: "Reserve a stake", text: "Choose your amount and confirm your reservation." },
  { n: "04", title: "Track & earn", text: "Follow performance and receive distributions." },
  { n: "05", title: "Exit anytime", text: "List your stake for resale after lock-in." },
];

export const DEMO_CAMPAIGNS = [
  { id: 1, project: "Marina Gate Residences", raised: 1625000, target: 2500000, investors: 214, status: "funding", ends: "2026-11-30" },
  { id: 2, project: "Azure 88 Yacht Fraction", raised: 990000, target: 1800000, investors: 96, status: "funding", ends: "2026-12-15" },
  { id: 3, project: "Palm Hospitality Suites", raised: 0, target: 3200000, investors: 0, status: "coming_soon", ends: "2027-01-20" },
];

export const DEMO_TREASURY = {
  total_raised: 8450000,
  pending_payouts: 128400,
  paid_out: 312050,
  transactions: [
    { id: "TXN-301", date: "2026-10-05", type: "Investment", project: "Marina Gate Residences", amount: 25000, status: "completed" },
    { id: "TXN-302", date: "2026-10-04", type: "Distribution", project: "Azure 88 Yacht Fraction", amount: 18400, status: "completed" },
    { id: "TXN-303", date: "2026-10-03", type: "Investment", project: "Azure 88 Yacht Fraction", amount: 10000, status: "pending" },
    { id: "TXN-304", date: "2026-10-02", type: "Refund", project: "Palm Hospitality Suites", amount: 5000, status: "completed" },
  ],
};

export const DEMO_AUDIT = [
  { id: 1, time: "2026-10-07 09:42", actor: "S. Iqbal (admin)", action: "Project updated", detail: "Marina Gate Residences — target raised" },
  { id: 2, time: "2026-10-07 09:15", actor: "System", action: "KYC approved", detail: "Sara M. — documents verified" },
  { id: 3, time: "2026-10-06 16:03", actor: "S. Iqbal (admin)", action: "Document published", detail: "Q3 2026 Performance Report" },
  { id: 4, time: "2026-10-06 11:28", actor: "System", action: "Payout executed", detail: "AED 18,400 — Azure 88 Yacht Fraction" },
  { id: 5, time: "2026-10-05 14:51", actor: "S. Iqbal (admin)", action: "Announcement sent", detail: "Q3 2026 reports published" },
];
