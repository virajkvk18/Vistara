export type StageId =
  | "proposal"
  | "section11"
  | "section16"
  | "section23"
  | "possession";

export interface StageDef {
  id: StageId;
  label: string;
  actSection: string;
  description: string;
  color: string;
  chip: string;
  order: number;
}

export const STAGES: StageDef[] = [
  {
    id: "proposal",
    label: "Proposal",
    actSection: "§4(1)",
    description: "Preliminary notification under Section 4(1) published in Gazette with social impact assessment.",
    color: "#818cf8",
    chip: "bg-indigo-400/10 text-indigo-300 border-indigo-400/25",
    order: 0,
  },
  {
    id: "section11",
    label: "Section 11 Notification",
    actSection: "§11",
    description: "Formal declaration under Section 11 published in Official Gazette, triggering acquisition proceedings.",
    color: "#38bdf8",
    chip: "bg-sky-400/10 text-sky-300 border-sky-400/25",
    order: 1,
  },
  {
    id: "section16",
    label: "§16 R&R Scrutiny",
    actSection: "§16",
    description: "Rehabilitation & Resettlement survey. Affected families list prepared; compensation & R&R package computed.",
    color: "#facc15",
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    order: 2,
  },
  {
    id: "section23",
    label: "§23 Award Declaration",
    actSection: "§23",
    description: "Collector's award declaring compensation per family; dispute resolution window open for 30 days.",
    color: "#f97316",
    chip: "bg-orange-400/10 text-orange-300 border-orange-400/25",
    order: 3,
  },
  {
    id: "possession",
    label: "Final Possession",
    actSection: "§31",
    description: "Land transferred. Compensation disbursed. Possession taken by requiring body. Acquisition complete.",
    color: "#34d399",
    chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    order: 4,
  },
];

export type ProjectStatus = "on-track" | "delayed" | "disputed";

export interface AcquisitionProject {
  id: string;
  code: string;
  name: string;
  requiringMinistry: string;
  requiringBody: string;
  landAreaHa: number;
  displacedFamilies: number;
  compensationBudgetCr: number;
  compensationDisbursedCr: number;
  currentStage: StageId;
  status: ProjectStatus;
  state: string;
  district: string;
  description: string;
  startedAt: string;
  targetCompletion: string;
}

export interface AffectedFamily {
  id: string;
  projectId: string;
  name: string;
  headOfHouse: string;
  village: string;
  landHeldHa: number;
  landType: string;
  compensationAssessedLakhs: number;
  compensationDisbursedLakhs: number;
  rrPackageLakhs: number;
  disputeStatus: "none" | "pending" | "resolved" | "litigation";
  disputeNote: string;
  bankAccount: string;
  rationCard: string;
}

export type AuditCheckId =
  | "sia"
  | "gazette"
  | "consent"
  | "survey"
  | "rr-plan"
  | "award-passed"
  | "comp-verified"
  | "possession-order";

export interface AuditCheck {
  id: AuditCheckId;
  label: string;
  requiredAtStage: StageId;
  description: string;
}

export const AUDIT_CHECKS: AuditCheck[] = [
  { id: "sia", label: "Social Impact Assessment (SIA) report approved", requiredAtStage: "proposal", description: "SIA report cleared by expert group under §4(2)." },
  { id: "gazette", label: "Gazette notification published", requiredAtStage: "proposal", description: "Section 4(1) preliminary notification in official gazette." },
  { id: "consent", label: "70% consent from project-affected families", requiredAtStage: "section11", description: "Written consent from ≥70% of affected families per §7." },
  { id: "survey", label: "Complete family & land survey", requiredAtStage: "section16", description: "Full enumeration of affected families, assets, land holdings." },
  { id: "rr-plan", label: "R&R entitlement plan gazetted", requiredAtStage: "section16", description: "Rehabilitation & resettlement package published under §16(3)." },
  { id: "award-passed", label: "Collector's award order signed", requiredAtStage: "section23", description: "Formal award under §23 declaring compensation per family." },
  { id: "comp-verified", label: "Compensation amount verified by bank", requiredAtStage: "section23", description: "Financial institution confirms disbursement readiness." },
  { id: "possession-order", label: "Final possession order (§31)", requiredAtStage: "possession", description: "Deed of transfer executed; possession formally taken." },
];

export type AuditStatus = "pass" | "fail" | "pending";

export interface AuditResult {
  checkId: AuditCheckId;
  status: AuditStatus;
  note: string;
}

export const PROJECTS: AcquisitionProject[] = [
  {
    id: "proj-1",
    code: "NAC-MO-2024-0187",
    name: "NH-44 Six-Lane Expansion (Lucknow–Kanpur Segment)",
    requiringMinistry: "Ministry of Road Transport & Highways",
    requiringBody: "National Highways Authority of India (NHAI)",
    landAreaHa: 842.6,
    displacedFamilies: 314,
    compensationBudgetCr: 247.3,
    compensationDisbursedCr: 86.5,
    currentStage: "section16",
    status: "on-track",
    state: "Uttar Pradesh",
    district: "Lucknow / Unnao / Kanpur Nagar",
    description: "Widening of NH-44 to six-lane access-controlled corridor. 68.4 km stretch affecting 14 villages across three districts.",
    startedAt: "2024-03-15",
    targetCompletion: "2026-12-31",
  },
  {
    id: "proj-2",
    code: "NAC-MH-2024-0241",
    name: "Mumbai–Nagpur Samruddhi Mahamarg (Missing Link)",
    requiringMinistry: "Ministry of Road Transport & Highways",
    requiringBody: "Maharashtra State Road Development Corporation (MSRDC)",
    landAreaHa: 1248.3,
    displacedFamilies: 687,
    compensationBudgetCr: 512.1,
    compensationDisbursedCr: 512.1,
    currentStage: "possession",
    status: "on-track",
    state: "Maharashtra",
    district: "Nagpur / Wardha / Amravati",
    description: "701 km Nagpur-Mumbai super-expressway. Phase 3 missing link requiring fresh acquisition of 2,480 hectares.",
    startedAt: "2023-09-01",
    targetCompletion: "2025-06-30",
  },
  {
    id: "proj-3",
    code: "NAC-UP-2024-0093",
    name: "Jewar International Airport (Noida International)",
    requiringMinistry: "Ministry of Civil Aviation",
    requiringBody: "Noida International Airport Ltd (Yamuna Expressway Dev Corp)",
    landAreaHa: 1334.0,
    displacedFamilies: 5412,
    compensationBudgetCr: 4125.7,
    compensationDisbursedCr: 3802.4,
    currentStage: "section23",
    status: "disputed",
    state: "Uttar Pradesh",
    district: "Gautam Buddh Nagar",
    description: "Greenfield international airport at Jewar. Phase 1 — two runways. ~1,334 ha acquired across 6 revenue villages.",
    startedAt: "2022-11-20",
    targetCompletion: "2025-09-30",
  },
  {
    id: "proj-4",
    code: "NAC-TN-2025-0012",
    name: "Chennai–Bengaluru Industrial Corridor (Enclave C)",
    requiringMinistry: "Ministry of Commerce & Industry",
    requiringBody: "National Industrial Corridor Development Corporation (NICDC)",
    landAreaHa: 216.8,
    displacedFamilies: 198,
    compensationBudgetCr: 156.9,
    compensationDisbursedCr: 0,
    currentStage: "proposal",
    status: "delayed",
    state: "Tamil Nadu",
    district: "Chennai / Sriperumbudur",
    description: "Multi-modal logistics hub adjoining Ennore port. SIA clearance pending due to wetland classification dispute.",
    startedAt: "2025-01-10",
    targetCompletion: "2028-03-31",
  },
  {
    id: "proj-5",
    code: "NAC-GJ-2024-0155",
    name: "Mumbai–Ahmedabad Bullet Train (Gujarat Elevated Section)",
    requiringMinistry: "Ministry of Railways",
    requiringBody: "National High Speed Rail Corporation Ltd (NHSRCL)",
    landAreaHa: 423.1,
    displacedFamilies: 876,
    compensationBudgetCr: 1890.5,
    compensationDisbursedCr: 1723.0,
    currentStage: "section23",
    status: "delayed",
    state: "Gujarat",
    district: "Vadodara / Navsari / Valsad",
    description: "352 km elevated high-speed rail corridor through southern Gujarat. Pillar foundations affecting agricultural land.",
    startedAt: "2023-04-12",
    targetCompletion: "2028-12-31",
  },
  {
    id: "proj-6",
    code: "NAC-KA-2025-0078",
    name: "Bengaluru Suburban Rail Project (RR-1 Corridor)",
    requiringMinistry: "Ministry of Railways",
    requiringBody: "South Western Railway / Rail Vikas Nigam Ltd",
    landAreaHa: 94.2,
    displacedFamilies: 127,
    compensationBudgetCr: 78.4,
    compensationDisbursedCr: 0,
    currentStage: "proposal",
    status: "on-track",
    state: "Karnataka",
    district: "Bengaluru Urban",
    description: "48.2 km suburban rail on existing alignment. Minimal displacement. Most acquisition is railway land re-notification.",
    startedAt: "2025-04-01",
    targetCompletion: "2027-06-30",
  },
];

export function familiesForProject(projectId: string): AffectedFamily[] {
  return ALL_FAMILIES.filter((f) => f.projectId === projectId);
}

export const ALL_FAMILIES: AffectedFamily[] = [
  // NH-44 families
  { id: "fam-001", projectId: "proj-1", name: "Shri Ram Lalong", headOfHouse: "Ram Lalong", village: "Bakshi Ka Talab", landHeldHa: 1.82, landType: "Agricultural (irrigated)", compensationAssessedLakhs: 32.4, compensationDisbursedLakhs: 32.4, rrPackageLakhs: 8.5, disputeStatus: "none", disputeNote: "", bankAccount: "UBI ****7241", rationCard: "UP/2018/44231" },
  { id: "fam-002", projectId: "proj-1", name: "Smt. Geeta Devi", headOfHouse: "Late Hari Prasad (Estate)", village: "Bakshi Ka Talab", landHeldHa: 0.94, landType: "Agricultural (rainfed)", compensationAssessedLakhs: 14.6, compensationDisbursedLakhs: 14.6, rrPackageLakhs: 5.2, disputeStatus: "none", disputeNote: "", bankAccount: "SBI ****3198", rationCard: "UP/2018/44237" },
  { id: "fam-003", projectId: "proj-1", name: "Shri Mohd. Aqil Khan", headOfHouse: "Mohd. Aqil Khan", village: "Gosaiganj", landHeldHa: 2.31, landType: "Agricultural (mixed)", compensationAssessedLakhs: 48.7, compensationDisbursedLakhs: 0, rrPackageLakhs: 11.4, disputeStatus: "pending", disputeNote: "Heirship dispute — two competing succession claims on surveyed parcel.", bankAccount: "PNB ****5520", rationCard: "UP/2019/12008" },
  { id: "fam-004", projectId: "proj-1", name: "Shri Deepak Verma", headOfHouse: "Deepak Verma", village: "Gosaiganj", landHeldHa: 0.56, landType: "Homestead", compensationAssessedLakhs: 18.2, compensationDisbursedLakhs: 18.2, rrPackageLakhs: 6.0, disputeStatus: "none", disputeNote: "", bankAccount: "BOI ****8812", rationCard: "UP/2019/12015" },
  { id: "fam-005", projectId: "proj-1", name: "Smt. Kusum Sharma", headOfHouse: "Shri Virendra Sharma (Estate)", village: "Mohanlalganj", landHeldHa: 3.15, landType: "Agricultural (sugarcane)", compensationAssessedLakhs: 72.1, compensationDisbursedLakhs: 0, rrPackageLakhs: 14.3, disputeStatus: "litigation", disputeNote: "Writ petition in Allahabad HC — challenge to SIA methodology (WP-2025/1187).", bankAccount: "Canara ****2201", rationCard: "UP/2020/08442" },
  { id: "fam-006", projectId: "proj-1", name: "Shri Anil Kumar Yadav", headOfHouse: "Anil Kumar Yadav", village: "Mohanlalganj", landHeldHa: 1.08, landType: "Agricultural (paddy)", compensationAssessedLakhs: 19.5, compensationDisbursedLakhs: 19.5, rrPackageLakhs: 5.8, disputeStatus: "resolved", disputeNote: "Boundary dispute resolved via tehsildar mediation — survey updated.", bankAccount: "PNB ****7734", rationCard: "UP/2020/08455" },

  // Jewar families
  { id: "fam-010", projectId: "proj-3", name: "Shri Rajveer Singh Gurjar", headOfHouse: "Rajveer Singh Gurjar", village: "Jewar", landHeldHa: 4.23, landType: "Agricultural (multi-crop)", compensationAssessedLakhs: 142.5, compensationDisbursedLakhs: 142.5, rrPackageLakhs: 28.0, disputeStatus: "none", disputeNote: "", bankAccount: "SBI ****1104", rationCard: "UP/2016/99012" },
  { id: "fam-011", projectId: "proj-3", name: "Shri Jitendra Phogat", headOfHouse: "Jitendra Phogat", village: "Dayanatpur", landHeldHa: 2.87, landType: "Agricultural (wheat)", compensationAssessedLakhs: 96.8, compensationDisbursedLakhs: 96.8, rrPackageLakhs: 18.5, disputeStatus: "pending", disputeNote: "Compensation rate dispute — farmer demands 4× circle rate.", bankAccount: "Axis ****3302", rationCard: "UP/2016/99025" },
  { id: "fam-012", projectId: "proj-3", name: "Smt. Rekha Tomar", headOfHouse: "Shri Sunil Tomar (Estate)", village: "Rohi", landHeldHa: 1.55, landType: "Agricultural (mixed)", compensationAssessedLakhs: 52.4, compensationDisbursedLakhs: 0, rrPackageLakhs: 10.2, disputeStatus: "litigation", disputeNote: "Succession challenge — three claimants; civil suit pending in GNIDA court.", bankAccount: "ICICI ****8847", rationCard: "UP/2017/22301" },
  { id: "fam-013", projectId: "proj-3", name: "Shri Satish Kumar", headOfHouse: "Satish Kumar", village: "Kishorpur", landHeldHa: 0.78, landType: "Homestead", compensationAssessedLakhs: 26.0, compensationDisbursedLakhs: 26.0, rrPackageLakhs: 8.0, disputeStatus: "resolved", disputeNote: "Raised concern about R&R housing; resolved with plot allotment in GB Nagar.", bankAccount: "BOB ****4421", rationCard: "UP/2017/22315" },

  // Bullet Train families
  { id: "fam-020", projectId: "proj-5", name: "Shri Bharatbhai Patel", headOfHouse: "Bharatbhai Patel", village: "Valsad rural", landHeldHa: 2.14, landType: "Agricultural (banana plantation)", compensationAssessedLakhs: 68.3, compensationDisbursedLakhs: 68.3, rrPackageLakhs: 14.0, disputeStatus: "none", disputeNote: "", bankAccount: "SBI ****6612", rationCard: "GJ/2018/55201" },
  { id: "fam-021", projectId: "proj-5", name: "Shri Manoj Thakor", headOfHouse: "Manoj Thakor", village: "Navsari", landHeldHa: 1.38, landType: "Agricultural (cotton)", compensationAssessedLakhs: 44.1, compensationDisbursedLakhs: 44.1, rrPackageLakhs: 9.8, disputeStatus: "pending", disputeNote: "Railway pillar placement affects 40% of remaining agricultural land — seeking additional R&R.", bankAccount: "HDFC ****9903", rationCard: "GJ/2019/33140" },
  { id: "fam-022", projectId: "proj-5", name: "Smt. Darshana Jardosh", headOfHouse: "Shri Paresh Jardosh (Estate)", village: "Vadodara", landHeldHa: 3.02, landType: "Agricultural (sugarcane)", compensationAssessedLakhs: 96.5, compensationDisbursedLakhs: 0, rrPackageLakhs: 18.0, disputeStatus: "litigation", disputeNote: "High Court stay on possession — environmental clearance challenge (SC/2025/4412).", bankAccount: "ICICI ****7734", rationCard: "GJ/2019/33155" },
  { id: "fam-023", projectId: "proj-5", name: "Shri Nikunj Shah", headOfHouse: "Nikunj Shah", village: "Valsad rural", landHeldHa: 0.64, landType: "Homestead", compensationAssessedLakhs: 21.2, compensationDisbursedLakhs: 21.2, rrPackageLakhs: 5.5, disputeStatus: "none", disputeNote: "", bankAccount: "Axis ****2201", rationCard: "GJ/2019/33162" },

  // Chennai-Bengaluru Corridor families
  { id: "fam-030", projectId: "proj-4", name: "Shri K. Balaji", headOfHouse: "K. Balaji", village: "Sriperumbudur", landHeldHa: 1.45, landType: "Agricultural (paddy)", compensationAssessedLakhs: 38.2, compensationDisbursedLakhs: 0, rrPackageLakhs: 7.5, disputeStatus: "pending", disputeNote: "SIA report not yet published — awaiting community consultation.", bankAccount: "IOB ****4451", rationCard: "TN/2020/11234" },

  // Bengaluru Suburban Rail families
  { id: "fam-040", projectId: "proj-6", name: "Smt. Prema R.", headOfHouse: "Prema R.", village: "Yelahanka", landHeldHa: 0.32, landType: "Homestead", compensationAssessedLakhs: 12.8, compensationDisbursedLakhs: 0, rrPackageLakhs: 4.2, disputeStatus: "none", disputeNote: "Railway land re-notification — structures on encroached land.", bankAccount: "Karnataka Bank ****3301", rationCard: "KA/2021/08812" },

  // Samruddhi families (possession stage — fully disbursed)
  { id: "fam-050", projectId: "proj-2", name: "Shri Prakash Wankhede", headOfHouse: "Prakash Wankhede", village: "Wardha", landHeldHa: 5.12, landType: "Agricultural (soybean)", compensationAssessedLakhs: 128.4, compensationDisbursedLakhs: 128.4, rrPackageLakhs: 22.0, disputeStatus: "none", disputeNote: "", bankAccount: "SBI ****8821", rationCard: "MH/2017/66230" },
  { id: "fam-051", projectId: "proj-2", name: "Smt. Sunita Jaiswal", headOfHouse: "Late Rajesh Jaiswal (Estate)", village: "Amravati", landHeldHa: 2.83, landType: "Agricultural (cotton)", compensationAssessedLakhs: 70.5, compensationDisbursedLakhs: 70.5, rrPackageLakhs: 15.0, disputeStatus: "none", disputeNote: "", bankAccount: "Bank of Maharashtra ****5543", rationCard: "MH/2017/66245" },
  { id: "fam-052", projectId: "proj-2", name: "Shri Dhananjay Meshram", headOfHouse: "Dhananjay Meshram", village: "Nagpur", landHeldHa: 1.98, landType: "Agricultural (turmeric)", compensationAssessedLakhs: 52.1, compensationDisbursedLakhs: 52.1, rrPackageLakhs: 11.0, disputeStatus: "resolved", disputeNote: "Initially disputed R&R housing location; resolved with alternative plot.", bankAccount: "UCO Bank ****2298", rationCard: "MH/2018/44102" },
];

export function stageProgress(project: AcquisitionProject): number {
  const idx = STAGES.findIndex((s) => s.id === project.currentStage);
  return ((idx + 1) / STAGES.length) * 100;
}

export function canAdvanceStage(project: AcquisitionProject): boolean {
  return project.currentStage !== "possession";
}

export function nextStage(current: StageId): StageId | null {
  const idx = STAGES.findIndex((s) => s.id === current);
  if (idx >= STAGES.length - 1) return null;
  return STAGES[idx + 1].id;
}

export function projectsAtStage(stage: StageId): AcquisitionProject[] {
  return PROJECTS.filter((p) => p.currentStage === stage);
}

export function totalDisbursed(project: AcquisitionProject): number {
  const families = familiesForProject(project.id);
  return families.reduce((sum, f) => sum + f.compensationDisbursedLakhs, 0);
}
