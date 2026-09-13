export type RiskCategory =
  | "legal"
  | "financial"
  | "bureaucratic"
  | "environmental"
  | "social"
  | "technical";

export interface RiskFactor {
  id: string;
  label: string;
  category: RiskCategory;
  baseImpact: number;
  maxReduction: number;
  currentReduction: number;
  unit: string;
  simulatable: boolean;
  description: string;
}

export interface MitigationAction {
  id: string;
  factorId: string;
  title: string;
  description: string;
  owner: string;
  priority: "critical" | "high" | "medium";
  estimatedDaysSaved: number;
}

export interface ProjectRiskProfile {
  projectId: string;
  projectName: string;
  code: string;
  ministry: string;
  state: string;
  riskScore: number;
  delayProbability: number;
  financialSlippageCr: number;
  bottleneckStage: string;
  totalEstimatedDelayDays: number;
  riskFactors: RiskFactor[];
  mitigations: MitigationAction[];
  lastUpdated: string;
}

const CATEGORY_META: Record<RiskCategory, { color: string; chip: string }> = {
  legal: { color: "#f87171", chip: "bg-red-400/10 text-red-300 border-red-400/25" },
  financial: { color: "#facc15", chip: "bg-amber-400/10 text-amber-300 border-amber-400/25" },
  bureaucratic: { color: "#818cf8", chip: "bg-indigo-400/10 text-indigo-300 border-indigo-400/25" },
  environmental: { color: "#34d399", chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25" },
  social: { color: "#fb923c", chip: "bg-orange-400/10 text-orange-300 border-orange-400/25" },
  technical: { color: "#38bdf8", chip: "bg-sky-400/10 text-sky-300 border-sky-400/25" },
};

export function categoryMeta(c: RiskCategory) {
  return CATEGORY_META[c];
}

export function computeRiskScore(factors: RiskFactor[]): number {
  const totalImpact = factors.reduce((s, f) => s + f.baseImpact, 0);
  if (totalImpact === 0) return 0;
  const currentImpact = factors.reduce(
    (s, f) => s + (f.baseImpact - f.currentReduction),
    0,
  );
  return Math.round(Math.max(0, Math.min(100, (currentImpact / totalImpact) * 100)));
}

export function totalDaysSaved(factors: RiskFactor[]): number {
  return factors.reduce((s, f) => s + f.currentReduction, 0);
}

export function riskBand(score: number): { label: string; color: string; chip: string } {
  if (score >= 75)
    return { label: "Critical", color: "#f87171", chip: "bg-red-400/10 text-red-300 border-red-400/25" };
  if (score >= 50)
    return { label: "High", color: "#f97316", chip: "bg-orange-400/10 text-orange-300 border-orange-400/25" };
  if (score >= 25)
    return { label: "Moderate", color: "#facc15", chip: "bg-amber-400/10 text-amber-300 border-amber-400/25" };
  return { label: "Low", color: "#34d399", chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25" };
}

export const PROJECT_RISK_PROFILES: ProjectRiskProfile[] = [
  {
    projectId: "proj-1",
    projectName: "NH-44 Six-Lane Expansion (Lucknow–Kanpur)",
    code: "NAC-MO-2024-0187",
    ministry: "MoRTH",
    state: "Uttar Pradesh",
    riskScore: 62,
    delayProbability: 71,
    financialSlippageCr: 48.2,
    bottleneckStage: "§16 R&R Scrutiny",
    totalEstimatedDelayDays: 185,
    riskFactors: [
      { id: "rf-1a", label: "Pending Legal Disputes", category: "legal", baseImpact: 68, maxReduction: 55, currentReduction: 0, unit: "days", simulatable: true, description: "3 active writ petitions in Allahabad HC challenging SIA methodology" },
      { id: "rf-1b", label: "Compensation Disbursement Lag", category: "financial", baseImpact: 52, maxReduction: 45, currentReduction: 0, unit: "days", simulatable: true, description: "62% families yet to receive first instalment — bank coordination pending" },
      { id: "rf-1c", label: "R&R Approvals Pending", category: "bureaucratic", baseImpact: 35, maxReduction: 30, currentReduction: 0, unit: "days", simulatable: true, description: "State R&R committee meeting delayed 3 cycles" },
      { id: "rf-1d", label: "Environmental Clearance (MoEFCC)", category: "environmental", baseImpact: 22, maxReduction: 18, currentReduction: 0, unit: "days", simulatable: false, description: "Wetland reclassification hearing pending — MoEFCC" },
      { id: "rf-1e", label: "Social Impact Assessment Gap", category: "social", baseImpact: 8, maxReduction: 8, currentReduction: 0, unit: "days", simulatable: true, description: "SIA public hearing for 2 villages incomplete" },
    ],
    mitigations: [
      { id: "m-1a", factorId: "rf-1a", title: "Issue priority alert to District Collector", description: "Request expedited hearing schedule from Allahabad HC bench via fast-track listing.", owner: "Divisional Commissioner, Lucknow", priority: "critical", estimatedDaysSaved: 40 },
      { id: "m-1b", factorId: "rf-1b", title: "Trigger accelerated DBT disbursement", description: "Coordinate with Nodal Bank (SBI) for batch processing of 142 pending compensation warrants.", owner: "Collector, Lucknow", priority: "high", estimatedDaysSaved: 30 },
      { id: "m-1c", factorId: "rf-1c", title: "Escalate to State R&R Committee Chair", description: "Schedule emergency session of State-Level R&R Committee under §16(3).", owner: "Secretary, Revenue Dept, UP", priority: "high", estimatedDaysSaved: 20 },
    ],
    lastUpdated: "2026-09-10",
  },
  {
    projectId: "proj-3",
    projectName: "Jewar International Airport (Noida International)",
    code: "NAC-UP-2024-0093",
    ministry: "MoCA",
    state: "Uttar Pradesh",
    riskScore: 78,
    delayProbability: 84,
    financialSlippageCr: 312.6,
    bottleneckStage: "§23 Award Declaration",
    totalEstimatedDelayDays: 310,
    riskFactors: [
      { id: "rf-3a", label: "Succession Disputes (47 cases)", category: "legal", baseImpact: 95, maxReduction: 80, currentReduction: 0, unit: "days", simulatable: true, description: "47 heirship succession disputes across GNIDA court — average case age 14 months" },
      { id: "rf-3b", label: "Compensation Valuation Challenge", category: "financial", baseImpact: 72, maxReduction: 60, currentReduction: 0, unit: "days", simulatable: true, description: "Farmer collective demands 4× circle rate — negotiation stalled at 2.3×" },
      { id: "rf-3c", label: "Wetland Reclassification", category: "environmental", baseImpact: 55, maxReduction: 40, currentReduction: 0, unit: "days", simulatable: false, description: "320 Ha of notified wetland within project area — MoEFCC hearing 3rd adjournment" },
      { id: "rf-3d", label: "R&R Housing Allocation", category: "bureaucratic", baseImpact: 48, maxReduction: 40, currentReduction: 0, unit: "days", simulatable: true, description: "GB Nagar Development Authority pending plot allocation for 2,100 families" },
      { id: "rf-3e", label: "Protest & Morcha Disruptions", category: "social", baseImpact: 40, maxReduction: 35, currentReduction: 0, unit: "days", simulatable: true, description: "Kisan Mahapanchayat bi-monthly disruptions at site — security escalation needed" },
    ],
    mitigations: [
      { id: "m-3a", factorId: "rf-3a", title: "Fast-track court for succession cases", description: "Request GNIDA District Judge to designate dedicated bench for airport acquisition succession disputes.", owner: "District Judge, GNIDA", priority: "critical", estimatedDaysSaved: 55 },
      { id: "m-3b", factorId: "rf-3b", title: "Convene tripartite negotiation round", description: "Mediate between farmer collective, GNIDA, and project proponent with independent valuation expert.", owner: "MD, Yamuna Expressway Dev Corp", priority: "high", estimatedDaysSaved: 35 },
      { id: "m-3c", factorId: "rf-3d", title: "Accelerate R&R plot survey", description: "Deploy additional survey team to complete plot demarcation within 30 days.", owner: "Vice-Chairman, GB Nagar", priority: "high", estimatedDaysSaved: 25 },
      { id: "m-3d", factorId: "rf-3e", title: "Community engagement program", description: "Deploy 4-member grievance redressal cell with weekly village-level dialogues.", owner: "Sub-Divisional Magistrate, Jewar", priority: "medium", estimatedDaysSaved: 20 },
    ],
    lastUpdated: "2026-09-12",
  },
  {
    projectId: "proj-5",
    projectName: "Mumbai–Ahmedabad Bullet Train (Gujarat Section)",
    code: "NAC-GJ-2024-0155",
    ministry: "MoR",
    state: "Gujarat",
    riskScore: 55,
    delayProbability: 63,
    financialSlippageCr: 167.8,
    bottleneckStage: "§11 Notification",
    totalEstimatedDelayDays: 142,
    riskFactors: [
      { id: "rf-5a", label: "Environmental Clearance Delay", category: "environmental", baseImpact: 48, maxReduction: 40, currentReduction: 0, unit: "days", simulatable: false, description: "Forest diversion proposal pending with MoEFCC for 8 months" },
      { id: "rf-5b", label: "Pillar Foundation Disputes", category: "technical", baseImpact: 38, maxReduction: 32, currentReduction: 0, unit: "days", simulatable: true, description: "Foundation design conflict with irrigation canal alignment — 42 pillars affected" },
      { id: "rf-5c", label: "Agricultural Land Valuation Dispute", category: "financial", baseImpact: 32, maxReduction: 28, currentReduction: 0, unit: "days", simulatable: true, description: "Banana plantation owners demand crop-specific valuation at 3× general rate" },
      { id: "rf-5d", label: "Railway Board Approval", category: "bureaucratic", baseImpact: 24, maxReduction: 20, currentReduction: 0, unit: "days", simulatable: false, description: "Modified alignment needs Railway Board re-approval — 2 committee reviews pending" },
    ],
    mitigations: [
      { id: "m-5a", factorId: "rf-5b", title: "Joint realignment survey", description: "Commission NBCC-led realignment study for 42 affected pillars with irrigation dept jointly.", owner: "Chief Engineer, NHSRCL", priority: "high", estimatedDaysSaved: 25 },
      { id: "m-5b", factorId: "rf-5c", title: "Crop-specific valuation panel", description: "Constitute expert panel with agricultural economist for banana plantation valuation.", owner: "Collector, Navsari", priority: "medium", estimatedDaysSaved: 18 },
    ],
    lastUpdated: "2026-09-11",
  },
  {
    projectId: "proj-4",
    projectName: "Chennai–Bengaluru Industrial Corridor (Enclave C)",
    code: "NAC-TN-2025-0012",
    ministry: "MoCI",
    state: "Tamil Nadu",
    riskScore: 82,
    delayProbability: 88,
    financialSlippageCr: 89.4,
    bottleneckStage: "Proposal",
    totalEstimatedDelayDays: 340,
    riskFactors: [
      { id: "rf-4a", label: "SIA Report Rejection", category: "bureaucratic", baseImpact: 92, maxReduction: 75, currentReduction: 0, unit: "days", simulatable: true, description: "Expert Group rejected initial SIA — 3 defects cited including inadequate public hearing" },
      { id: "rf-4b", label: "Wetland Notification Conflict", category: "environmental", baseImpact: 78, maxReduction: 60, currentReduction: 0, unit: "days", simulatable: false, description: "180 Ha overlapping with State Wetland Authority notification — dual jurisdiction" },
      { id: "rf-4c", label: "Fisheries Community Opposition", category: "social", baseImpact: 65, maxReduction: 55, currentReduction: 0, unit: "days", simulatable: true, description: "Tamil Nadu Fishermen Association filed representation — 4,200 affected families" },
      { id: "rf-4d", label: "Land Registry Data Gaps", category: "technical", baseImpact: 42, maxReduction: 38, currentReduction: 0, unit: "days", simulatable: true, description: "47% of parcels lack updated land records — digital registry incomplete" },
    ],
    mitigations: [
      { id: "m-4a", factorId: "rf-4a", title: "Reconstitute SIA Expert Group", description: "Appoint 5-member Expert Group under §5 with mandatory community hearing schedule.", owner: "Chief Secretary, Tamil Nadu", priority: "critical", estimatedDaysSaved: 60 },
      { id: "m-4b", factorId: "rf-4c", title: "Fisheries rehabilitation package", description: "Design专项 rehabilitation for fishing community with alternative livelihood support.", owner: "Commissioner, Fisheries Dept, TN", priority: "high", estimatedDaysSaved: 40 },
      { id: "m-4c", factorId: "rf-4d", title: "VISTARA OCR pipeline for legacy records", description: "Deploy SIH26018 digitizer module to vectorise 3,200 legacy land records within 45 days.", owner: "District Collector, Sriperumbudur", priority: "medium", estimatedDaysSaved: 30 },
    ],
    lastUpdated: "2026-09-13",
  },
  {
    projectId: "proj-6",
    projectName: "Bengaluru Suburban Rail (RR-1 Corridor)",
    code: "NAC-KA-2025-0078",
    ministry: "MoR",
    state: "Karnataka",
    riskScore: 28,
    delayProbability: 32,
    financialSlippageCr: 8.5,
    bottleneckStage: "§16 R&R Scrutiny",
    totalEstimatedDelayDays: 45,
    riskFactors: [
      { id: "rf-6a", label: "Railway Land Re-notification", category: "bureaucratic", baseImpact: 18, maxReduction: 15, currentReduction: 0, unit: "days", simulatable: true, description: "Railway land re-notification under §3D pending SWR approval" },
      { id: "rf-6b", label: "Encroachment Regularisation", category: "legal", baseImpact: 15, maxReduction: 12, currentReduction: 0, unit: "days", simulatable: true, description: "27 encroachment cases need regularization before possession" },
      { id: "rf-6c", label: "Minor R&R Adjustments", category: "social", baseImpact: 12, maxReduction: 10, currentReduction: 0, unit: "days", simulatable: true, description: "127 families — minor R&R package adjustments pending" },
    ],
    mitigations: [
      { id: "m-6a", factorId: "rf-6a", title: "Fast-track SWR coordination", description: "Schedule fortnightly review with Railway Board for land re-notification.", owner: "GM, South Western Railway", priority: "medium", estimatedDaysSaved: 10 },
      { id: "m-6b", factorId: "rf-6b", title: "Bengaluru Urban DC encroachment cell", description: "Deploy dedicated encroachment regularisation cell at BBMP.", owner: "BBMP Commissioner", priority: "medium", estimatedDaysSaved: 8 },
    ],
    lastUpdated: "2026-09-13",
  },
  {
    projectId: "proj-7",
    projectName: "Delhi–Meerut RRTS (Priority Section)",
    code: "NAC-NC-2023-0042",
    ministry: "MoHUA",
    state: "Uttar Pradesh / Delhi",
    riskScore: 47,
    delayProbability: 54,
    financialSlippageCr: 124.3,
    bottleneckStage: "§23 Award Declaration",
    totalEstimatedDelayDays: 168,
    riskFactors: [
      { id: "rf-7a", label: "High Court Stay Orders (12)", category: "legal", baseImpact: 58, maxReduction: 48, currentReduction: 0, unit: "days", simulatable: true, description: "12 active stay orders from Delhi HC on possession — average stay duration 6 months" },
      { id: "rf-7b", label: "Compensation Revaluation", category: "financial", baseImpact: 45, maxReduction: 40, currentReduction: 0, unit: "days", simulatable: true, description: "Supreme Court directive for compensation revaluation in 3 districts" },
      { id: "rf-7c", label: "Urban Land Ceiling Complexities", category: "bureaucratic", baseImpact: 35, maxReduction: 28, currentReduction: 0, unit: "days", simulatable: false, description: "Pre-1994 urban land ceiling cases need resolution before transfer" },
      { id: "rf-7d", label: "Heritage Zone Overlap", category: "environmental", baseImpact: 30, maxReduction: 22, currentReduction: 0, unit: "days", simulatable: false, description: "8.2 km section overlapping ASI-notified heritage zone" },
    ],
    mitigations: [
      { id: "m-7a", factorId: "rf-7a", title: "Supreme Court fast-track mention", description: "List pending stay matters for early hearing via Chief Justice bench.", owner: "Standing Counsel, MoHUA", priority: "critical", estimatedDaysSaved: 35 },
      { id: "m-7b", factorId: "rf-7b", title: "Revised compensation notification", description: "Issue modified award based on SC directive within 60-day window.", owner: "District Magistrate, Meerut", priority: "high", estimatedDaysSaved: 28 },
    ],
    lastUpdated: "2026-09-09",
  },
];
