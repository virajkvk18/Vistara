/**
 * API Fallback Layer — returns cached mock data when backend is unreachable.
 *
 * Wraps fetch() with a timeout + fallback so the UI never white-screens
 * during demos or when FastAPI is offline.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const TIMEOUT_MS = 4000;

/* ── Generic fetch with fallback ── */

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  fallbackData?: T,
): Promise<{ data: T; isFromCache: boolean }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { data, isFromCache: false };
  } catch {
    if (fallbackData !== undefined) {
      return { data: fallbackData, isFromCache: true };
    }
    throw new Error(`API unavailable and no fallback for ${path}`);
  }
}

/* ── Module-specific fallback data ── */

export const FALLBACK_ACQUISITION_PROJECTS = [
  {
    id: "demo-1",
    projectCode: "NH-44-MP-2024",
    projectName: "NH-44 Highway Expansion — Indore to Dewas",
    state: "Madhya Pradesh",
    district: "Indore",
    ministry: "MoRTH",
    currentStage: "section19",
    totalFamilies: 845,
    familiesRehabilitated: 312,
    projectAreaHa: 420.5,
    totalBudgetCr: 1850,
    compensationPaidCr: 285,
    riskScore: 0.72,
    delayProbability: 0.68,
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2026-01-20T14:30:00Z",
  },
  {
    id: "demo-2",
    projectCode: "DFC-UP-2023",
    projectName: "Dedicated Freight Corridor — Partapur to Khurja",
    state: "Uttar Pradesh",
    district: "Meerut",
    ministry: "MoRTH",
    currentStage: "section24",
    totalFamilies: 2340,
    familiesRehabilitated: 890,
    projectAreaHa: 890.2,
    totalBudgetCr: 4200,
    compensationPaidCr: 650,
    riskScore: 0.85,
    delayProbability: 0.82,
    createdAt: "2023-08-01T08:00:00Z",
    updatedAt: "2026-02-10T11:15:00Z",
  },
  {
    id: "demo-3",
    projectCode: "Mumbai-Metro-3-MH",
    projectName: "Mumbai Metro Line 3 — Colaba-Bandra-SEEPZ",
    state: "Maharashtra",
    district: "Mumbai Suburban",
    ministry: "MoHUA",
    currentStage: "section41",
    totalFamilies: 1230,
    familiesRehabilitated: 1100,
    projectAreaHa: 156.8,
    totalBudgetCr: 3727,
    compensationPaidCr: 1240,
    riskScore: 0.58,
    delayProbability: 0.45,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2026-03-01T16:45:00Z",
  },
];

export const FALLBACK_DIGITIZE_RESULT = {
  recordId: "demo-rec-001",
  ocrEngine: "easyocr",
  rawText:
    "DEED OF SALE — REGISTERED DOCUMENT\nDate: 15-March-2018\nVendor: Ramesh Kumar, S/o Sh. Hari Singh\nVillage: Laluwasane, Tehsil: Kanjhawala\nDistrict: South West Delhi, State: Delhi\nKhasra No: 7/3, Khata No: 45/B\nArea: 3.12 Acres | Type: Agricultural\nSale Consideration: Rs. 31,20,000/-",
  extractedFields: {
    khasra_number: "7/3",
    khata_number: "45/B",
    survey_number: "14/2",
    owner_name: "Ramesh Kumar",
    area_acres: 3.12,
    village: "Laluwasane",
    tehsil: "Kanjhawala",
    district: "South West Delhi",
    state: "Delhi",
    land_type: "Agricultural",
    date_of_deed: "2018-11-05",
  },
  confidenceScores: {
    khasra_number: 0.94,
    khata_number: 0.89,
    owner_name: 0.85,
    area_acres: 0.78,
    village: 0.92,
    district: 0.96,
    state: 0.99,
    land_type: 0.76,
    date_of_deed: 0.68,
  },
  overallConfidence: 0.86,
  requiresHumanReview: false,
  processingTimeMs: 1847,
  status: "completed",
  createdAt: "2026-01-15T10:30:00Z",
};

export const FALLBACK_DELAY_PREDICTION = {
  predictionId: "demo-pred-001",
  projectId: "demo-1",
  projectCode: "NH-44-MP-2024",
  projectName: "NH-44 Highway Expansion — Indore to Dewas",
  predictedDelayDays: 485,
  delayProbability: 0.78,
  confidence: 0.89,
  riskCategory: "High",
  shapFeatures: [
    { feature: "bureaucratic_delay", label: "Bureaucratic Bottleneck", impact: 0.34, direction: "positive", description: "Multi-department coordination delays" },
    { feature: "environmental_clearance", label: "Environmental Clearance", impact: 0.22, direction: "positive", description: "EC delays from MoEFCC" },
    { feature: "legal_challenges", label: "Legal Challenges", impact: 0.18, direction: "positive", description: "Writ petitions in High Court" },
    { feature: "consent_deficit", label: "Consent Threshold Gap", impact: 0.12, direction: "positive", description: "Gap between 70% required and actual" },
    { feature: "consent_rate", label: "Consent Rate", impact: -0.15, direction: "negative", description: "Consent rate at 68% — below threshold" },
  ],
  riskBreakdown: { bureaucratic_delay: 0.34, environmental_clearance: 0.22, legal_challenges: 0.18, consent_deficit: 0.12, rr_inadequacy: 0.08 },
  mitigationAdvice: [
    { action: "Fast-track Section 19 hearing via District Collector", priority: "critical", estimatedDaysSaved: 45 },
    { action: "Deploy inter-agency coordination committee", priority: "critical", estimatedDaysSaved: 38 },
    { action: "Accelerate R&R disbursement through DBT", priority: "high", estimatedDaysSaved: 30 },
  ],
  modelVersion: "v1.0-heuristic",
  inferenceTimeMs: 245,
  createdAt: "2026-01-15T10:30:00Z",
};

export const FALLBACK_RAG_RESULT = {
  query: "",
  summary:
    "Land pooling schemes have been deployed across 14 Indian states since 2007, transforming fragmented peri-urban landholdings into planned urban clusters. Delhi's Laluwasane model (2013) and Andhra Pradesh's CRDA pooling (2015) demonstrate that well-designed schemes can yield 30-45% higher land value appreciation for participating farmers versus forced acquisition under the 2013 Act.",
  citations: [
    {
      id: "c1",
      title: "Land Pooling as an Alternative to Land Acquisition: A Critical Assessment",
      authors: "Anjali Sharma, R. Deshpande",
      year: 2023,
      source: "Economic & Political Weekly",
      url: "#",
      snippet: "Across 14 states, land pooling has produced higher land value appreciation for participating farmers.",
      type: "research-article",
      relevanceScore: 0.94,
    },
    {
      id: "c2",
      title: "Delhi Development Act — Land Pooling Scheme Rules",
      authors: "GNCTD Revenue Department",
      year: 2013,
      source: "Delhi Gazette Extraordinary",
      url: "#",
      snippet: "Rules for land pooling in Delhi with 70% consent threshold.",
      type: "gazette",
      relevanceScore: 0.91,
    },
  ],
  confidence: 0.93,
  responseTimeMs: 342,
  documentsSearched: 12400,
};

export const FALLBACK_GEOTAG_RESULT = {
  imageId: "demo-img-001",
  latitude: 28.6139,
  longitude: 77.209,
  linkedBoundary: "Acquisition Zone — Laluwasane Cluster A",
  nearestLayer: "Vegetation Cover (NDVI)",
  landDegradation: { severity: "Low", areaHa: 4.2, trend: "stable", confidence: 82 },
  waterStructures: { detected: 2, type: "check dam", condition: "functional", confidence: 76 },
  vegetationIndex: { ndvi: 0.58, change: 0.04, classification: "moderate", confidence: 88 },
  soilErosion: { risk: "Low", estimatedLossHaYr: 0.8, confidence: 71 },
  recommendation: "Current land cover appears healthy. Consider check dam construction to improve water retention.",
  analysisTimeMs: 1240,
  createdAt: "2026-01-15T10:30:00Z",
};
