export type ConfidenceBand = "high" | "medium" | "low";

export interface FieldBox {
  /** position in % of the document page */
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: number;
  /** optional pixel region on the scanned page */
  box?: FieldBox;
}

export interface AuditorLogEntry {
  fieldLabel: string;
  previousValue: string;
  value: string;
  by: string;
  at: string;
}

export const OCR_STEPS = [
  { id: "ingest", label: "Ingestion & normalisation" },
  { id: "prep", label: "Preprocessing — deskew / enhance" },
  { id: "easy", label: "EasyOCR — Devanagari + Latin script detect" },
  { id: "paddle", label: "PaddleOCR — layout & field segmentation" },
  { id: "score", label: "Confidence scoring & export to registry" },
] as const;

export function bandFor(confidence: number): ConfidenceBand {
  if (confidence > 85) return "high";
  if (confidence >= 60) return "medium";
  return "low";
}

export const confidenceMeta: Record<
  ConfidenceBand,
  { color: string; chip: string; label: string }
> = {
  high: { color: "#34d399", chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25", label: "High" },
  medium: {
    color: "#facc15",
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    label: "Medium",
  },
  low: { color: "#f87171", chip: "bg-red-400/10 text-red-300 border-red-400/25", label: "Low" },
};

export const HUMAN_VERIFY_THRESHOLD = 75;
export const DEFAULT_AUDITOR = "AUD-2026-0042";

export const SAMPLE_DOCUMENT = {
  name: "Lucknow_Khatauni_1984.pdf",
  language: "Hindi + English (bilingual)",
  pageCount: 1,
  district: "Lucknow",
};

export const SAMPLE_FIELDS: ExtractedField[] = [
  {
    key: "khasra",
    label: "Khasra Number",
    value: "452/2",
    confidence: 97,
    box: { left: 6, top: 21, width: 30, height: 6.5 },
  },
  {
    key: "khata",
    label: "Khata Number",
    value: "KH-0114",
    confidence: 84,
    box: { left: 40, top: 21, width: 26, height: 6.5 },
  },
  {
    key: "owner",
    label: "Landowner Name",
    value: "राम सिंह यादव · Ram Singh Yadav",
    confidence: 88,
    box: { left: 6, top: 33, width: 62, height: 6.5 },
  },
  {
    key: "area",
    label: "Plot Area (Acres)",
    value: "1.42",
    confidence: 72,
    box: { left: 6, top: 45, width: 30, height: 6.5 },
  },
  {
    key: "village",
    label: "Village",
    value: "मोहम्मदपुर खाला · Mohammadpur Khala",
    confidence: 96,
    box: { left: 6, top: 57, width: 30, height: 6.5 },
  },
  {
    key: "tehsil",
    label: "Tehsil",
    value: "लखनऊ · Lucknow",
    confidence: 93,
    box: { left: 40, top: 57, width: 30, height: 6.5 },
  },
  {
    key: "district",
    label: "District",
    value: "लखनऊ · Lucknow",
    confidence: 97,
    box: { left: 74, top: 57, width: 21, height: 6.5 },
  },
  {
    key: "ownership",
    label: "Ownership Type",
    value: "व्यक्तिगत · Individual / Agricultural",
    confidence: 56,
    box: { left: 6, top: 69, width: 46, height: 6.5 },
  },
];

export type OcrProgressCallback = (stepIndex: number, percent: number) => void;

/**
 * Mock OCR pipeline mirroring a real EasyOCR/PaddleOCR worker action.
 * In production this hits a processor API; here it resolves the sample
 * record after animating through the pipeline steps.
 */
export function runMockOcr(onProgress: OcrProgressCallback): Promise<ExtractedField[]> {
  const TOTAL_MS = 5200;
  const stepCount = OCR_STEPS.length;

  return new Promise((resolve) => {
    const startedAt = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const t = Math.min(1, elapsed / TOTAL_MS);
      const stepIndex = Math.min(stepCount - 1, Math.floor(t * stepCount));
      const percent = Math.round(t * 100);
      onProgress(stepIndex, percent);

      if (t < 1) {
        setTimeout(tick, 120);
      } else {
        onProgress(stepCount - 1, 100);
        resolve(SAMPLE_FIELDS);
      }
    };

    setTimeout(tick, 200);
  });
}