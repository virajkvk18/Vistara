export interface Metric {
  key: string;
  label: string;
  value: number;
  format: "area" | "count" | "integer";
  suffix?: string;
  delta: number;
  deltaLabel: string;
  tone: "emerald" | "indigo" | "red" | "gold";
  spark: number[];
}

export const METRICS: Metric[] = [
  {
    key: "area",
    label: "Total Land Area Digitized",
    value: 312.47,
    format: "area",
    suffix: "M Ha",
    delta: 2.4,
    deltaLabel: "vs last quarter",
    tone: "emerald",
    spark: [1.0, 1.15, 1.1, 1.28, 1.35, 1.5, 1.62, 1.8, 2.05, 2.31, 2.58, 2.4],
  },
  {
    key: "projects",
    label: "Active Acquisition Projects",
    value: 128,
    format: "count",
    delta: 6,
    deltaLabel: "new this month",
    tone: "indigo",
    spark: [62, 70, 66, 78, 84, 81, 92, 97, 102, 110, 120, 128],
  },
  {
    key: "risk",
    label: "National High-Risk Alerts",
    value: 34,
    format: "count",
    delta: -12,
    deltaLabel: "reduced since June",
    tone: "red",
    spark: [58, 55, 49, 51, 44, 47, 41, 40, 38, 42, 36, 34],
  },
  {
    key: "policy",
    label: "Policy Papers Indexed",
    value: 1864,
    format: "integer",
    delta: 52,
    deltaLabel: "added this quarter",
    tone: "gold",
    spark: [820, 940, 1010, 1130, 1210, 1340, 1420, 1510, 1620, 1705, 1812, 1864],
  },
];

export type ActivityTone = "success" | "info" | "warning" | "danger" | "neutral";

export interface Activity {
  id: string;
  title: string;
  detail: string;
  source: string;
  tone: ActivityTone;
  time: string;
}

export const ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    title: "Parcel boundary re-verified",
    detail: "UP / Lucknow circle — Khasra 452/2 boundary aligned with SOI sheet 64A.",
    source: "Land Digitizer · SIH26018",
    tone: "success",
    time: "just now",
  },
  {
    id: "act-2",
    title: "High-risk alert raised",
    detail: "Maharashtra / Nashik — fractional ownership variance 18.4% triggered model V2.",
    source: "Predictive Risk Engine · SIH26017",
    tone: "danger",
    time: "4 min ago",
  },
  {
    id: "act-3",
    title: "Acquisition dossier compiled",
    detail: "NH-44 widening corridor — 142 parcels packed into award stage C.",
    source: "Acquisition Workflow · SIH26016",
    tone: "info",
    time: "19 min ago",
  },
  {
    id: "act-4",
    title: "Watershed boundary updated",
    detail: "Krishna basin — sub-catchment KRN-017 refreshed from LISS-IV imagery.",
    source: "Geospatial Lab · SIH26015",
    tone: "neutral",
    time: "42 min ago",
  },
  {
    id: "act-5",
    title: "Policy paper indexed",
    detail: "Urban Land Ceiling (Repeal) impact study — 12,400 docs vectorised.",
    source: "Research & Policy Hub · SIH26019",
    tone: "warning",
    time: "1 hr ago",
  },
];

export type QueueStatus = "queued" | "ocr" | "verifying" | "approved" | "flagged";

export interface QueueItem {
  id: string;
  district: string;
  state: string;
  khasra: string;
  areaHa: number;
  status: QueueStatus;
  progress: number;
  priority: "high" | "medium" | "low";
  owner: string;
}

export const QUEUE: QueueItem[] = [
  {
    id: "Q-90213",
    district: "Lucknow",
    state: "Uttar Pradesh",
    khasra: "452/2",
    areaHa: 1.42,
    status: "ocr",
    progress: 74,
    priority: "high",
    owner: "Sharma K.",
  },
  {
    id: "Q-90212",
    district: "Nashik",
    state: "Maharashtra",
    khasra: "1884",
    areaHa: 3.9,
    status: "verifying",
    progress: 91,
    priority: "high",
    owner: "Patil R.",
  },
  {
    id: "Q-90211",
    district: "Bhopal",
    state: "Madhya Pradesh",
    khasra: "77/10",
    areaHa: 0.76,
    status: "queued",
    progress: 12,
    priority: "medium",
    owner: "Khan A.",
  },
  {
    id: "Q-90210",
    district: "Patna",
    state: "Bihar",
    khasra: "3401",
    areaHa: 2.1,
    status: "flagged",
    progress: 48,
    priority: "high",
    owner: "Singh V.",
  },
  {
    id: "Q-90209",
    district: "Kota",
    state: "Rajasthan",
    khasra: "529/11",
    areaHa: 5.3,
    status: "approved",
    progress: 100,
    priority: "low",
    owner: "Jain P.",
  },
  {
    id: "Q-90208",
    district: "Coimbatore",
    state: "Tamil Nadu",
    khasra: "2213",
    areaHa: 1.05,
    status: "queued",
    progress: 6,
    priority: "low",
    owner: "Murugan S.",
  },
];

export interface Notification {
  id: string;
  title: string;
  body: string;
  tone: ActivityTone;
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    title: "Approval request pending",
    body: "Dossier NAC-90214 requires section officer clearance.",
    tone: "warning",
    time: "5 min",
    unread: true,
  },
  {
    id: "n-2",
    title: "OCR batch succeeded",
    body: "3,210 records vectorised from district records office.",
    tone: "success",
    time: "26 min",
    unread: true,
  },
  {
    id: "n-3",
    title: "Risk window opened",
    body: "High-risk cluster detected in Krishna basin (KRN-017).",
    tone: "danger",
    time: "1 hr",
    unread: true,
  },
  {
    id: "n-4",
    title: "Nightly sync complete",
    body: "Spatial tiles published to national tile cache.",
    tone: "neutral",
    time: "3 hr",
    unread: false,
  },
];