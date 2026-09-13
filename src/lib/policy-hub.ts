export type PolicyTheme =
  | "land-pooling"
  | "compensation"
  | "dispute-resolution"
  | "digitisation"
  | "urban-planning"
  | "tribal-rights"
  | "water-governance";

export type DocumentType =
  | "case-study"
  | "legal-judgment"
  | "gazette"
  | "policy-paper"
  | "research-article"
  | "hackathon-brief";

export type ImpactSeverity = "Minimal" | "Low" | "Moderate" | "High" | "Critical";

export type InnovationStatus =
  | "Open"
  | "In Progress"
  | "Under Review"
  | "Completed"
  | "Archived";

/* ─── RAG Knowledge Assistant ─── */

export interface RagResult {
  id: string;
  query: string;
  summary: string;
  citations: RagCitation[];
  confidence: number;
  responseTimeMs: number;
}

export interface RagCitation {
  id: string;
  title: string;
  authors: string;
  year: number;
  source: string;
  url: string;
  snippet: string;
  type: DocumentType;
  relevanceScore: number;
}

export const RAG_QUERIES: RagResult[] = [
  {
    id: "rag-1",
    query: "Impact of land pooling on peri-urban development in India",
    summary:
      "Land pooling schemes have been deployed across 14 Indian states since 2007, transforming fragmented peri-urban landholdings into planned urban clusters. Delhi's Laluwasane model (2013) and Andhra Pradesh's CRDA pooling (2015) demonstrate that well-designed schemes can yield 30-45% higher land value appreciation for participating farmers versus forced acquisition under the 2013 Act. Key success factors include: (a) transparent formulae for plot restitution ratios, (b) guaranteed infrastructure delivery within 36 months, and (c) community consent thresholds above 70%. However, states with weaker institutional capacity — Bihar, Jharkhand — show displacement of marginal farmers when compensation is delayed beyond 18 months.",
    citations: [
      {
        id: "c1",
        title: "Land Pooling as an Alternative to Land Acquisition: A Critical Assessment",
        authors: "Anjali Sharma, R. Deshpande",
        year: 2023,
        source: "Economic & Political Weekly",
        url: "https://epw.in/land-pooling-critical-assessment",
        snippet:
          "Across 14 states, land pooling has produced higher land value appreciation for participating farmers compared to forced acquisition under the 2013 Act.",
        type: "research-article",
        relevanceScore: 0.94,
      },
      {
        id: "c2",
        title: "Delhi Development (Planning and Management) Act — Land Pooling Scheme Rules",
        authors: "GNCTD Revenue Department",
        year: 2013,
        source: "Delhi Gazette Extraordinary",
        url: "https://delhi.gov/sites/delhi-gazette",
        snippet:
          "Rules for land pooling in Delhi urbanisation zone — Laluwasane model with 70% consent threshold and 36-month infrastructure guarantee.",
        type: "gazette",
        relevanceScore: 0.91,
      },
      {
        id: "c3",
        title: "CRDA Land Pooling Policy: Five-Year Impact Assessment",
        authors: "A. Rao, K. Reddy",
        year: 2021,
        source: "Urban Research & Practice",
        url: "https://doi.org/10.1080/17535069.2021",
        snippet:
          "Andhra Pradesh CRDA's pooling scheme covered 30,000 acres across 29 villages, with infrastructure delivery averaging 42 months.",
        type: "case-study",
        relevanceScore: 0.87,
      },
    ],
    confidence: 0.93,
    responseTimeMs: 342,
  },
  {
    id: "rag-2",
    query: "Compensation adequacy under R&R policies for large infrastructure projects",
    summary:
      "Analysis of 23 major infrastructure projects (2015-2024) reveals that R&R compensation packages under the LARR Act 2013 adequately cover replacement cost in only 41% of cases. Projects in Maharashtra, Karnataka and Gujarat show higher adequacy (55-68%) due to state-level multiplier policies, while projects in UP, MP and Odisha fall below 30%. The most critical gap is livelihood restoration: only 12% of displaced families report equivalent income within 3 years. Multiplier rates of 2x-4x land market value are recommended by NITI Aayog but adopted by only 6 states.",
    citations: [
      {
        id: "c4",
        title: "Rehabilitation & Resettlement in Infrastructure Projects: A Multi-State Assessment",
        authors: "NITI Aayog Displacement Cell",
        year: 2024,
        source: "NITI Aayog Working Paper",
        url: "https://niti.gov.in/rr-assessment-2024",
        snippet:
          "Across 23 projects, R&R compensation adequately covers replacement cost in only 41% of cases. Multiplier rates of 2x-4x are recommended.",
        type: "policy-paper",
        relevanceScore: 0.96,
      },
      {
        id: "c5",
        title: "Land Acquisition, Rehabilitation and Resettlement Act 2013 — Compensation Framework",
        authors: "Legislative Department, MoL&J",
        year: 2013,
        source: "Gazette of India",
        url: "https://legislative.gov.in/larr-act-2013",
        snippet:
          "Section 27-30: Compensation at four times market value in rural areas, two times in urban. Multiplier framework for different land categories.",
        type: "gazette",
        relevanceScore: 0.89,
      },
    ],
    confidence: 0.91,
    responseTimeMs: 287,
  },
  {
    id: "rag-3",
    query: "Digital land records and Aadhaar-linked property registries: privacy implications",
    summary:
      "The convergence of Aadhaar authentication with digital land record systems (DILRMP successor programs) raises significant privacy concerns. While 18 states have mandated Aadhaar-linked property registration, only 3 (Karnataka, Telangana, Andhra Pradesh) have implemented robust data protection frameworks compliant with the DPDP Act 2023. Key risks include: (a) linking of property ownership to biometric identity enabling surveillance, (b) exclusion of informal occupants lacking Aadhaar, and (c) potential for automated cross-referencing of property holdings with income tax data. The Supreme Court's Puttaswamy judgment (2017) mandates proportionality tests for such integrations.",
    citations: [
      {
        id: "c6",
        title: "Privacy and Digital Land Records: Navigating the Aadhaar Integration",
        authors: "Prashant Sharma, L. Mehta",
        year: 2024,
        source: "Journal of Indian Law & Technology",
        url: "https://jilt.in/privacy-digital-land",
        snippet:
          "18 states mandate Aadhaar-linked property registration, but only 3 implement DPDP Act-compliant data protection frameworks.",
        type: "research-article",
        relevanceScore: 0.92,
      },
      {
        id: "c7",
        title: "Digital Personal Data Protection Act 2023 — Land Records Applicability",
        authors: "Ministry of Electronics & IT",
        year: 2023,
        source: "Gazette of India",
        url: "https://meity.gov.in/dpdp-act-2023",
        snippet:
          "Sections 4-8: Consent framework for processing personal data including property and biometric data in government databases.",
        type: "gazette",
        relevanceScore: 0.88,
      },
    ],
    confidence: 0.89,
    responseTimeMs: 312,
  },
];

/* ─── Research Repository ─── */

export interface RepositoryEntry {
  id: string;
  title: string;
  authors: string;
  year: number;
  type: DocumentType;
  theme: PolicyTheme;
  state: string;
  tags: string[];
  abstract: string;
  downloadCount: number;
  citationCount: number;
  url: string;
}

export const STATES: string[] = [
  "All States",
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Madhya Pradesh",
  "Odisha",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
];

export const THEMES: { id: PolicyTheme; label: string }[] = [
  { id: "land-pooling", label: "Land Pooling" },
  { id: "compensation", label: "Compensation & R&R" },
  { id: "dispute-resolution", label: "Dispute Resolution" },
  { id: "digitisation", label: "Land Digitisation" },
  { id: "urban-planning", label: "Urban Planning" },
  { id: "tribal-rights", label: "Tribal & Forest Rights" },
  { id: "water-governance", label: "Water Governance" },
];

export const DOCUMENT_TYPES: { id: DocumentType; label: string }[] = [
  { id: "case-study", label: "Case Study" },
  { id: "legal-judgment", label: "Legal Judgment" },
  { id: "gazette", label: "Policy Gazette" },
  { id: "policy-paper", label: "Policy Paper" },
  { id: "research-article", label: "Research Article" },
  { id: "hackathon-brief", label: "Hackathon Brief" },
];

export const REPOSITORY_ENTRIES: RepositoryEntry[] = [
  {
    id: "rep-1",
    title: "Land Pooling in Delhi: A Five-Year Post-Implementation Study",
    authors: "Anjali Sharma, R. Deshpande",
    year: 2023,
    type: "case-study",
    theme: "land-pooling",
    state: "Delhi",
    tags: ["peri-urban", "consent", "infrastructure", "farmer-restitution"],
    abstract:
      "Comprehensive assessment of Delhi's land pooling scheme across 95 villages, evaluating infrastructure delivery timelines, farmer compensation adequacy, and urbanisation outcomes.",
    downloadCount: 1842,
    citationCount: 34,
    url: "#",
  },
  {
    id: "rep-2",
    title: "Narmada Valley Development: Displacement and Rehabilitation Disputes",
    authors: "Supreme Court of India",
    year: 2017,
    type: "legal-judgment",
    theme: "compensation",
    state: "Madhya Pradesh",
    tags: ["tribal-rights", "dam-displacement", "Narmada", "Supreme-Court"],
    abstract:
      "Landmark judgment addressing adequacy of R&R for 3,50,000+ persons displaced by Sardar Sarovar Dam, establishing proportionality principles for compensation.",
    downloadCount: 5231,
    citationCount: 127,
    url: "#",
  },
  {
    id: "rep-3",
    title: "Telangana Land Records Digitalisation Policy — Gazette Notification",
    authors: "Revenue & Land Records Department, Telangana",
    year: 2022,
    type: "gazette",
    theme: "digitisation",
    state: "Telangangana",
    tags: ["DILRMP", "Aadhaar", "digital-registry", "Dharani"],
    abstract:
      "Official gazette notification for Telangana's Dharani portal integration with Aadhaar, establishing the framework for 100% digital land record management.",
    downloadCount: 3104,
    citationCount: 12,
    url: "#",
  },
  {
    id: "rep-4",
    title: "Climate Adaptation through Land Pooling: A Comparative Framework",
    authors: "K. Rajan, P. Iyer",
    year: 2024,
    type: "research-article",
    theme: "land-pooling",
    state: "Gujarat",
    tags: ["climate-adaptation", "peri-urban", "flood-zones", "resilience"],
    abstract:
      "Proposes integrating climate resilience criteria into land pooling design, with case studies from Gujarat's coastal zones and Gujarat CRDA's revised pooling policy.",
    downloadCount: 764,
    citationCount: 8,
    url: "#",
  },
  {
    id: "rep-5",
    title: "Forest Rights Act Implementation: Telangana Community Forest Rights Mapping",
    authors: "Tribal Welfare Department, Telangana",
    year: 2023,
    type: "policy-paper",
    theme: "tribal-rights",
    state: "Telangana",
    tags: ["FRA", "forest-rights", "ITDA", "community-rights", "GIS"],
    abstract:
      "Statewide GIS-based mapping of individual and community forest rights claims under the Forest Rights Act, covering 4,200+ gram sabhas across 10 ITDA areas.",
    downloadCount: 1205,
    citationCount: 6,
    url: "#",
  },
  {
    id: "rep-6",
    title: "Inter-State Water Dispute Resolution: Modernising the Tribunal Framework",
    authors: "Venkatesh Rao, Meera Iyer",
    year: 2024,
    type: "research-article",
    theme: "water-governance",
    state: "Karnataka",
    tags: ["water-disputes", "Cauvery", "tribunal", "inter-state"],
    abstract:
      "Analysis of delays in inter-state water dispute resolution, proposing real-time data integration and AI-assisted allocation models with case study of Cauvery Tribunal.",
    downloadCount: 923,
    citationCount: 15,
    url: "#",
  },
  {
    id: "rep-7",
    title: "Bengaluru Urban Land Pooling: Failed Promises and Reform Pathways",
    authors: "BDA & Urban Land Institute India",
    year: 2022,
    type: "case-study",
    theme: "land-pooling",
    state: "Karnataka",
    tags: ["BDA", "urban-expansion", "implementation-gap", "reform"],
    abstract:
      "Critical evaluation of Bengaluru's land pooling scheme implementation, identifying governance bottlenecks, delayed infrastructure, and farmer dissatisfaction.",
    downloadCount: 2411,
    citationCount: 41,
    url: "#",
  },
  {
    id: "rep-8",
    title: "Odisha Land Records Modernisation — Geo-Referencing Protocol",
    authors: "Revenue Division Commissionerate, Odisha",
    year: 2023,
    type: "gazette",
    theme: "digitisation",
    state: "Odisha",
    tags: ["geo-referencing", "survey", "cadastral", "Bhulekh"],
    abstract:
      "Official protocol for geo-referencing of village cadastral maps under Odisha's Bhulekh system, covering 51,000+ villages with satellite imagery integration.",
    downloadCount: 1567,
    citationCount: 4,
    url: "#",
  },
  {
    id: "rep-9",
    title: "Tribal Displacement by Mining: Compensation Adequacy in Odisha and Jharkhand",
    authors: "Amita Shah, Sunil Kumar",
    year: 2024,
    type: "research-article",
    theme: "compensation",
    state: "Odisha",
    tags: ["mining-displacement", "tribal", "compensation", "livelihood"],
    abstract:
      "Empirical study of 2,400 displaced families across 12 mining sites in Odisha and Jharkhand, revealing that only 18% received adequate compensation and 6% achieved livelihood restoration.",
    downloadCount: 3890,
    citationCount: 52,
    url: "#",
  },
  {
    id: "rep-10",
    title: "Maharashtra Urban Land (Ceiling & Regulation) Act Repeal — Gazette Notification",
    authors: "Legislative Department, Maharashtra",
    year: 2019,
    type: "gazette",
    theme: "urban-planning",
    state: "Maharashtra",
    tags: ["ULCRA", "repeal", "urban-planning", "surplus-land"],
    abstract:
      "Official notification repealing the Maharashtra Urban Land (Ceiling & Regulation) Act 1976, releasing 19,000+ acres of surplus land for affordable housing.",
    downloadCount: 2876,
    citationCount: 9,
    url: "#",
  },
];

export function searchRepository(
  query: string,
  state: string,
  theme: PolicyTheme | "all",
  docType: DocumentType | "all",
): RepositoryEntry[] {
  let results = REPOSITORY_ENTRIES;

  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.abstract.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (state !== "All States") {
    results = results.filter((e) => e.state === state);
  }
  if (theme !== "all") {
    results = results.filter((e) => e.theme === theme);
  }
  if (docType !== "all") {
    results = results.filter((e) => e.type === docType);
  }
  return results;
}

/* ─── Policy Simulator ─── */

export interface SimulationParams {
  region: string;
  landPoolingRatio: number;
  compensationMultiplier: number;
  infrastructureBudgetCr: number;
  consentThreshold: number;
  displacementRiskFactor: number;
}

export interface SimulationResult {
  economicGrowthPct: number;
  landDisputeLikelihood: number;
  displacementImpactScore: number;
  farmerSatisfactionIndex: number;
  urbanisationEfficiency: number;
  fiscalSustainabilityIndex: number;
}

export const REGIONS: string[] = [
  "Delhi NCR",
  "Andhra Pradesh CRDA",
  "Bengaluru BMR",
  "Pune-Mumbai Corridor",
  "Gujarat CRDA",
  "Hyderabad MMTS",
];

export const BASELINE_PARAMS: SimulationParams = {
  region: "Delhi NCR",
  landPoolingRatio: 60,
  compensationMultiplier: 2.0,
  infrastructureBudgetCr: 5000,
  consentThreshold: 70,
  displacementRiskFactor: 30,
};

export function runSimulation(params: SimulationParams): SimulationResult {
  const { landPoolingRatio, compensationMultiplier, infrastructureBudgetCr, consentThreshold, displacementRiskFactor } = params;

  const economicGrowthPct =
    2.4 +
    landPoolingRatio * 0.04 +
    compensationMultiplier * 0.8 +
    Math.log10(infrastructureBudgetCr + 1) * 1.2 -
    displacementRiskFactor * 0.03;

  const landDisputeLikelihood =
    Math.max(0, 100 -
      consentThreshold * 0.6 -
      compensationMultiplier * 12 -
      landPoolingRatio * 0.15 +
      displacementRiskFactor * 0.4);

  const displacementImpactScore =
    Math.max(0, Math.min(100,
      displacementRiskFactor * 1.8 -
      compensationMultiplier * 8 -
      landPoolingRatio * 0.1));

  const farmerSatisfactionIndex =
    Math.min(100,
      compensationMultiplier * 22 +
      consentThreshold * 0.3 -
      displacementRiskFactor * 0.5 +
      10);

  const urbanisationEfficiency =
    Math.min(100,
      landPoolingRatio * 0.8 +
      Math.log10(infrastructureBudgetCr + 1) * 8 +
      consentThreshold * 0.2 - 15);

  const fiscalSustainabilityIndex =
    Math.min(100,
      100 -
      (infrastructureBudgetCr / 200) -
      compensationMultiplier * 5 +
      landPoolingRatio * 0.3 +
      consentThreshold * 0.1);

  return {
    economicGrowthPct: Math.round(economicGrowthPct * 10) / 10,
    landDisputeLikelihood: Math.round(landDisputeLikelihood * 10) / 10,
    displacementImpactScore: Math.round(displacementImpactScore * 10) / 10,
    farmerSatisfactionIndex: Math.round(farmerSatisfactionIndex * 10) / 10,
    urbanisationEfficiency: Math.round(urbanisationEfficiency * 10) / 10,
    fiscalSustainabilityIndex: Math.round(fiscalSustainabilityIndex * 10) / 10,
  };
}

/* ─── Innovation Portal ─── */

export type InnovationType = "hackathon" | "grant" | "project";

export interface InnovationItem {
  id: string;
  type: InnovationType;
  title: string;
  description: string;
  organizer: string;
  status: InnovationStatus;
  deadline: string;
  participants: number;
  maxParticipants: number;
  tags: string[];
  prizeCr?: number;
  fundingCr?: number;
  leadAgency: string;
}

export const INNOVATIONS: InnovationItem[] = [
  {
    id: "inn-1",
    type: "hackathon",
    title: "VISTARA GovTech Hackathon 2026",
    description:
      "Build AI-powered land record verification, automated dispute resolution chatbots, or geospatial parcel mapping tools for India's land governance stack.",
    organizer: "MoHUA & MeitY",
    status: "Open",
    deadline: "2026-03-15",
    participants: 234,
    maxParticipants: 500,
    tags: ["AI", "land-records", "geospatial", "civic-tech"],
    prizeCr: 25,
    leadAgency: "MoHUA",
  },
  {
    id: "inn-2",
    type: "grant",
    title: "Land Governance Research Grant — Phase III",
    description:
      "Research grants for studying land pooling impact, compensation adequacy, and digital land record systems across Indian states.",
    organizer: "NITI Aayog",
    status: "Open",
    deadline: "2026-04-30",
    participants: 67,
    maxParticipants: 120,
    tags: ["research", "land-pooling", "policy-analysis", "data-science"],
    fundingCr: 50,
    leadAgency: "NITI Aayog",
  },
  {
    id: "inn-3",
    type: "project",
    title: "National Land Dispute Resolution Platform",
    description:
      "Multi-agency collaboration to build an integrated platform connecting gram panchayats, district courts, and revenue departments for AI-assisted mediation.",
    organizer: "DoLR & NIC",
    status: "In Progress",
    deadline: "2026-09-30",
    participants: 42,
    maxParticipants: 80,
    tags: ["dispute-resolution", "AI", "multi-agency", "platform"],
    leadAgency: "DoLR",
  },
  {
    id: "inn-4",
    type: "hackathon",
    title: "SIH26019 — VISTARA Policy Sandbox Challenge",
    description:
      "Design policy simulation models for land pooling ratio optimisation using real cadastral data, satellite imagery, and economic indicators.",
    organizer: "Smart India Hackathon",
    status: "In Progress",
    deadline: "2026-02-28",
    participants: 156,
    maxParticipants: 200,
    tags: ["simulation", "policy", "land-pooling", "data-visualisation"],
    prizeCr: 15,
    leadAgency: "MoHUA",
  },
  {
    id: "inn-5",
    type: "project",
    title: "Odisha Tribal Land Rights Digital Mapping Initiative",
    description:
      "Collaborative project to create GIS-based community forest rights maps across 10 ITDA regions using drone surveys and participatory GIS.",
    organizer: "ST Department & Bhuvan",
    status: "Under Review",
    deadline: "2026-12-31",
    participants: 28,
    maxParticipants: 60,
    tags: ["tribal-rights", "GIS", "drone-survey", "participatory-mapping"],
    leadAgency: "ST Department, Odisha",
  },
  {
    id: "inn-6",
    type: "grant",
    title: "Climate-Resilient Land Pooling Design Fellowship",
    description:
      "Fellowships for researchers studying integration of climate adaptation criteria — flood zones, sea-level rise, drought risk — into land pooling frameworks.",
    organizer: "NITI Aayog & MoEFCC",
    status: "Open",
    deadline: "2026-05-15",
    participants: 19,
    maxParticipants: 40,
    tags: ["climate", "adaptation", "land-pooling", "resilience"],
    fundingCr: 20,
    leadAgency: "NITI Aayog",
  },
];

/* ─── Simulation helpers ─── */

export function getSeverity(value: number, invert = false): ImpactSeverity {
  const v = invert ? 100 - value : value;
  if (v <= 10) return "Minimal";
  if (v <= 30) return "Low";
  if (v <= 55) return "Moderate";
  if (v <= 75) return "High";
  return "Critical";
}

export function severityColor(s: ImpactSeverity): string {
  switch (s) {
    case "Minimal": return "text-emerald-300";
    case "Low": return "text-amber-300";
    case "Moderate": return "text-orange-300";
    case "High": return "text-red-300";
    case "Critical": return "text-red-400";
  }
}

export function severityBorder(s: ImpactSeverity): string {
  switch (s) {
    case "Minimal": return "border-emerald-400/30 bg-emerald-400/10";
    case "Low": return "border-amber-400/30 bg-amber-400/10";
    case "Moderate": return "border-orange-400/30 bg-orange-400/10";
    case "High": return "border-red-400/30 bg-red-400/10";
    case "Critical": return "border-red-400/30 bg-red-400/10";
  }
}

export function severityBg(s: ImpactSeverity): string {
  switch (s) {
    case "Minimal": return "bg-emerald-400";
    case "Low": return "bg-amber-400";
    case "Moderate": return "bg-orange-400";
    case "High": return "bg-red-400";
    case "Critical": return "bg-red-500";
  }
}

export function docTypeColor(t: DocumentType): string {
  switch (t) {
    case "case-study": return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    case "legal-judgment": return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "gazette": return "border-purple-400/30 bg-purple-400/10 text-purple-300";
    case "policy-paper": return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "research-article": return "border-indigo-400/30 bg-indigo-400/10 text-indigo-300";
    case "hackathon-brief": return "border-orange-400/30 bg-orange-400/10 text-orange-300";
  }
}

export function innovationTypeColor(t: InnovationType): string {
  switch (t) {
    case "hackathon": return "border-accent/30 bg-accent/10 text-accent-soft";
    case "grant": return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "project": return "border-sky-400/30 bg-sky-400/10 text-sky-300";
  }
}

export function innovationStatusColor(s: InnovationStatus): string {
  switch (s) {
    case "Open": return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "In Progress": return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    case "Under Review": return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "Completed": return "border-purple-400/30 bg-purple-400/10 text-purple-300";
    case "Archived": return "border-slate-400/30 bg-slate-400/10 text-slate-300";
  }
}