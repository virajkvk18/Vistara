export type LayerId =
  | "cadastral"
  | "vegetation"
  | "drainage"
  | "soil-moisture"
  | "climate"
  | "imagery";

export interface GisLayer {
  id: LayerId;
  label: string;
  description: string;
  color: string;
  icon: string;
  defaultOn: boolean;
  category: "boundary" | "ecological" | "hydrological" | "risk" | "base";
}

export const GIS_LAYERS: GisLayer[] = [
  { id: "imagery", label: "Satellite Imagery", description: "Base layer — Sentinel-2 true colour composite", color: "#64748b", icon: "🛰️", defaultOn: true, category: "base" },
  { id: "cadastral", label: "Cadastral Boundaries", description: "Village & parcel boundaries from land records", color: "#818cf8", icon: "📋", defaultOn: true, category: "boundary" },
  { id: "vegetation", label: "30m Vegetation Cover (SRISHTI-DRISHTI)", description: "NDVI from Sentinel-2 at 30m resolution — classified green/yellow/bare", color: "#34d399", icon: "🌿", defaultOn: false, category: "ecological" },
  { id: "drainage", label: "Drainage Networks", description: "Seasonal & perennial streams from SOI topographic sheets", color: "#38bdf8", icon: "💧", defaultOn: false, category: "hydrological" },
  { id: "soil-moisture", label: "Soil Moisture Heatmap", description: "SMAP L-band soil moisture anomaly — dry/wet zones", color: "#f97316", icon: "🌡️", defaultOn: false, category: "hydrological" },
  { id: "climate", label: "Climate Vulnerability Index", description: "Composite drought/flood risk from IMD + CRIDA", color: "#f87171", icon: "⚡", defaultOn: false, category: "risk" },
];

export type TimePeriod = "2022" | "2024" | "2026";

export interface TimeSeriesSnapshot {
  period: TimePeriod;
  label: string;
  ndviMean: number;
  vegetationCoverPct: number;
  soilMoistureAnomaly: number;
  waterBodies: number;
  drainageDensity: number;
  degradationRisk: string;
  intervention: string;
}

export const TIME_SERIES: Record<string, TimeSeriesSnapshot[]> = {
  "Krishna Basin (KRN-017)": [
    { period: "2022", label: "2022 — Baseline", ndviMean: 0.34, vegetationCoverPct: 28.4, soilMoistureAnomaly: -0.12, waterBodies: 7, drainageDensity: 1.82, degradationRisk: "High", intervention: "Pre-intervention baseline" },
    { period: "2024", label: "2024 — Mid-programme", ndviMean: 0.41, vegetationCoverPct: 34.7, soilMoistureAnomaly: 0.04, waterBodies: 12, drainageDensity: 2.14, degradationRisk: "Moderate", intervention: "Check-dam construction (14 nos.)" },
    { period: "2026", label: "2026 — Current", ndviMean: 0.52, vegetationCoverPct: 42.1, soilMoistureAnomaly: 0.18, waterBodies: 18, drainageDensity: 2.56, degradationRisk: "Low", intervention: "Farm-pond watershed (22 nos.)" },
  ],
  "Narmada Valley (NAR-009)": [
    { period: "2022", label: "2022 — Baseline", ndviMean: 0.29, vegetationCoverPct: 22.1, soilMoistureAnomaly: -0.18, waterBodies: 4, drainageDensity: 1.45, degradationRisk: "Critical", intervention: "Pre-intervention — severe erosion" },
    { period: "2024", label: "2024 — Mid-programme", ndviMean: 0.36, vegetationCoverPct: 30.5, soilMoistureAnomaly: -0.06, waterBodies: 9, drainageDensity: 1.92, degradationRisk: "High", intervention: "Contour bunding (38 km)" },
    { period: "2026", label: "2026 — Current", ndviMean: 0.47, vegetationCoverPct: 39.8, soilMoistureAnomaly: 0.11, waterBodies: 15, drainageDensity: 2.38, degradationRisk: "Moderate", intervention: "Afforestation drive (1,200 Ha)" },
  ],
  "Yamuna Floodplain (YAM-003)": [
    { period: "2022", label: "2022 — Baseline", ndviMean: 0.42, vegetationCoverPct: 36.2, soilMoistureAnomaly: 0.08, waterBodies: 11, drainageDensity: 2.68, degradationRisk: "Moderate", intervention: "Urban encroachment mapping" },
    { period: "2024", label: "2024 — Mid-programme", ndviMean: 0.39, vegetationCoverPct: 33.8, soilMoistureAnomaly: 0.02, waterBodies: 9, drainageDensity: 2.52, degradationRisk: "High", intervention: "Encroachment removal — 340 Ha" },
    { period: "2026", label: "2026 — Current", ndviMean: 0.44, vegetationCoverPct: 38.5, soilMoistureAnomaly: 0.14, waterBodies: 13, drainageDensity: 2.71, degradationRisk: "Moderate", intervention: "Riparian buffer restoration (12 km)" },
  ],
};

export const WATERSHED_SITES = Object.keys(TIME_SERIES);

export interface GeoTaggedImage {
  id: string;
  fileName: string;
  caption: string;
  lat: number;
  lng: number;
  capturedAt: string;
  altitude: number;
  accuracy: number;
  thumbnailColor: string;
}

export const GEO_TAGGED_IMAGES: GeoTaggedImage[] = [
  { id: "gt-1", fileName: "IMG_20260910_103421.jpg", caption: "Check-dam at KRN-017 outlet — upstream view", lat: 17.3850, lng: 78.4867, capturedAt: "2026-09-10 10:34", altitude: 542, accuracy: 4.2, thumbnailColor: "from-sky-400 to-emerald-400" },
  { id: "gt-2", fileName: "IMG_20260910_110247.jpg", caption: "Erosion gully — contour bunding site", lat: 17.3912, lng: 78.4921, capturedAt: "2026-09-10 11:02", altitude: 538, accuracy: 6.1, thumbnailColor: "from-amber-400 to-red-400" },
  { id: "gt-3", fileName: "IMG_20260911_091533.jpg", caption: "Farm-pond completed — 200 m³ capacity", lat: 17.3784, lng: 78.4790, capturedAt: "2026-09-11 09:15", altitude: 551, accuracy: 3.8, thumbnailColor: "from-emerald-400 to-sky-400" },
  { id: "gt-4", fileName: "IMG_20260911_142108.jpg", caption: "Vegetation transect — NDVI calibration site", lat: 17.3958, lng: 78.4985, capturedAt: "2026-09-11 14:21", altitude: 545, accuracy: 5.0, thumbnailColor: "from-green-400 to-emerald-400" },
  { id: "gt-5", fileName: "IMG_20260912_083055.jpg", caption: "Drainage channel — silt trap installed", lat: 17.3820, lng: 78.4812, capturedAt: "2026-09-12 08:30", altitude: 548, accuracy: 3.5, thumbnailColor: "from-sky-400 to-blue-400" },
];

export interface AiAnalysis {
  id: string;
  imageId: string;
  landDegradation: { severity: string; area: number; trend: string; confidence: number };
  waterStructures: { detected: number; type: string; condition: string; confidence: number };
  vegetationIndex: { ndvi: number; change: number; class: string; confidence: number };
  soilErosion: { risk: string; estimatedLoss: number; confidence: number };
  recommendation: string;
}

export const AI_ANALYSES: AiAnalysis[] = [
  {
    id: "ai-1", imageId: "gt-1",
    landDegradation: { severity: "Low", area: 12.4, trend: "Improving", confidence: 91 },
    waterStructures: { detected: 1, type: "Check-dam (masonry)", condition: "Good", confidence: 94 },
    vegetationIndex: { ndvi: 0.54, change: +0.18, class: "Moderate-dense", confidence: 88 },
    soilErosion: { risk: "Low", estimatedLoss: 0.8, confidence: 86 },
    recommendation: "Check-dam functioning well. Sediment trapping at 78% efficiency. Recommend extending check-dam chain 400m downstream to capture remaining runoff.",
  },
  {
    id: "ai-2", imageId: "gt-2",
    landDegradation: { severity: "High", area: 28.6, trend: "Stabilising", confidence: 84 },
    waterStructures: { detected: 0, type: "None — pending construction", condition: "N/A", confidence: 92 },
    vegetationIndex: { ndvi: 0.22, change: -0.08, class: "Sparse", confidence: 90 },
    soilErosion: { risk: "Critical", estimatedLoss: 4.2, confidence: 87 },
    recommendation: "Active gully erosion — 28.6 Ha affected. Priority: install check-dam + contour bund within 60 days before next monsoon. Estimated 4.2 Ha/year topsoil loss.",
  },
  {
    id: "ai-3", imageId: "gt-3",
    landDegradation: { severity: "None", area: 0, trend: "N/A", confidence: 96 },
    waterStructures: { detected: 1, type: "Farm-pond (excavated)", condition: "Excellent", confidence: 97 },
    vegetationIndex: { ndvi: 0.61, change: +0.24, class: "Dense", confidence: 93 },
    soilErosion: { risk: "None", estimatedLoss: 0, confidence: 95 },
    recommendation: "Farm-pond fully operational — 200 m³ capacity, 85% filled post-monsoon. Surrounding area showing 24% NDVI increase. Model watershed success site.",
  },
  {
    id: "ai-4", imageId: "gt-4",
    landDegradation: { severity: "Moderate", area: 8.2, trend: "Improving", confidence: 82 },
    waterStructures: { detected: 0, type: "Natural depression", condition: "Functional", confidence: 78 },
    vegetationIndex: { ndvi: 0.46, change: +0.12, class: "Moderate", confidence: 85 },
    soilErosion: { risk: "Moderate", estimatedLoss: 1.4, confidence: 79 },
    recommendation: "NDVI calibration site — good spatial variability for ground-truthing. Recommend establishing permanent sample plot (20m × 20m) for seasonal monitoring.",
  },
  {
    id: "ai-5", imageId: "gt-5",
    landDegradation: { severity: "Low", area: 5.1, trend: "Improving", confidence: 89 },
    waterStructures: { detected: 1, type: "Silt-trap (earthen)", condition: "Good", confidence: 91 },
    vegetationIndex: { ndvi: 0.48, change: +0.14, class: "Moderate-dense", confidence: 87 },
    soilErosion: { risk: "Low", estimatedLoss: 0.6, confidence: 84 },
    recommendation: "Silt-trap capturing 12 tonnes/season. Channel bank stabilisation successful — 89% reduction in lateral erosion. Extend monitoring to adjacent 1.2 km stretch.",
  },
];

export function analyzeImage(imageId: string): AiAnalysis | undefined {
  return AI_ANALYSES.find((a) => a.imageId === imageId);
}

export interface WatershedMetrics {
  totalAreaHa: number;
  treatedAreaHa: number;
  structuresBuilt: number;
  ndviChange: number;
}

export const WATERSHED_METRICS: WatershedMetrics = {
  totalAreaHa: 24800,
  treatedAreaHa: 8420,
  structuresBuilt: 156,
  ndviChange: 0.14,
};
