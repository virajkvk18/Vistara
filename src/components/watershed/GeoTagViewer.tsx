"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Clock,
  Compass,
  FileImage,
  MapPinned,
  Maximize2,
  Satellite,
  UploadCloud,
  Zap,
} from "lucide-react";
import {
  GEO_TAGGED_IMAGES,
  analyzeImage,
  type AiAnalysis,
  type GeoTaggedImage,
} from "@/lib/watershed";
import { cn } from "@/lib/cn";

export function GeoTagViewer() {
  const [selected, setSelected] = useState<GeoTaggedImage | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const analysis = selected ? analyzeImage(selected.id) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-400/10 text-sky-300">
            <FileImage className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Geo-Coded Field Photos
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              GPS-tagged field images · side-by-side satellite mapping
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className={cn("btn-ghost px-2.5 py-1.5 text-[10.5px]", showUpload && "border-accent/40 text-accent-soft")}
        >
          <UploadCloud className="h-3.5 w-3.5" /> Upload
        </button>
      </div>

      {/* Upload zone */}
      {showUpload && (
        <div className="border-b border-glass-line bg-glass/20 px-5 py-4">
          <div className="rounded-xl border-2 border-dashed border-glass-line bg-glass/40 p-6 text-center transition hover:border-accent/40 hover:bg-accent/5">
            <UploadCloud className="mx-auto h-10 w-10 text-accent-soft" />
            <p className="mt-3 text-[13px] font-semibold text-slate-200">
              Drop geo-tagged field photos
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              EXIF GPS data extracted automatically · JPG, PNG, HEIC supported
            </p>
          </div>
        </div>
      )}

      {/* Thumbnails grid */}
      <div className="border-b border-glass-line p-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {GEO_TAGGED_IMAGES.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelected(img)}
              className={cn(
                "group relative w-36 shrink-0 overflow-hidden rounded-xl border-2 transition",
                selected?.id === img.id
                  ? "border-accent/60 ring-2 ring-accent/20"
                  : "border-glass-line hover:border-white/20",
              )}
            >
              <div
                className={cn(
                  "flex h-24 w-full items-center justify-center bg-gradient-to-br",
                  img.thumbnailColor,
                )}
              >
                <FileImage className="h-8 w-8 text-white/70" />
              </div>
              <div className="bg-night-900/90 p-2">
                <p className="truncate text-[10.5px] font-medium text-slate-200">{img.fileName}</p>
                <p className="mt-0.5 flex items-center gap-1 font-mono text-[9px] text-slate-500">
                  <MapPinned className="h-2.5 w-2.5" />
                  {img.lat.toFixed(4)}°N {img.lng.toFixed(4)}°E
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side comparison */}
      {selected && (
        <div className="grid grid-cols-1 border-b border-glass-line md:grid-cols-2">
          {/* Field image */}
          <div className="border-b border-glass-line p-4 md:border-b-0 md:border-r">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] font-semibold text-slate-200">Field Image</p>
              <span className="flex items-center gap-1 font-mono text-[9.5px] text-slate-500">
                <Clock className="h-3 w-3" /> {selected.capturedAt}
              </span>
            </div>
            <div
              className={cn(
                "flex h-48 items-center justify-center rounded-xl bg-gradient-to-br",
                selected.thumbnailColor,
              )}
            >
              <FileImage className="h-16 w-16 text-white/50" />
            </div>
            <p className="mt-2 text-[12px] text-slate-300">{selected.caption}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-md border border-glass-line bg-glass px-2 py-1 font-mono text-[9.5px] text-slate-400">
                <Compass className="h-3 w-3" /> ±{selected.accuracy}m
              </span>
              <span className="flex items-center gap-1 rounded-md border border-glass-line bg-glass px-2 py-1 font-mono text-[9.5px] text-slate-400">
                📐 {selected.altitude}m ASL
              </span>
            </div>
          </div>

          {/* Satellite tile with pin */}
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] font-semibold text-slate-200">Satellite Tile</p>
              <span className="flex items-center gap-1 font-mono text-[9.5px] text-slate-500">
                <Satellite className="h-3 w-3" /> Sentinel-2 composite
              </span>
            </div>
            <div className="relative h-48 overflow-hidden rounded-xl bg-night-850 bg-grid-pattern bg-[size:20px_20px]">
              <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full">
                {/* fake terrain */}
                <rect width="200" height="120" fill="#0d1a10" />
                <ellipse cx="80" cy="50" rx="45" ry="25" fill="rgba(52,211,153,0.12)" />
                <ellipse cx="140" cy="70" rx="35" ry="20" fill="rgba(52,211,153,0.08)" />
                <path d="M0,90 Q50,80 100,88 Q150,95 200,85 L200,120 L0,120 Z" fill="rgba(56,189,248,0.1)" />
                {/* pin */}
                <circle cx="100" cy="55" r="6" fill="#f87171" fillOpacity="0.3" />
                <circle cx="100" cy="55" r="3" fill="#f87171" />
                <line x1="100" y1="58" x2="100" y2="72" stroke="#f87171" strokeWidth="1.5" />
                <text x="100" y="80" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="var(--font-geist-mono)">
                  {selected.lat.toFixed(4)}°N, {selected.lng.toFixed(4)}°E
                </text>
              </svg>
              <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-glass-line bg-night-900/85 backdrop-blur-md">
                <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-400">
              <MapPinned className="h-3 w-3 text-red-400" />
              GPS pin mapped to satellite coordinate — spatial accuracy: {selected.accuracy}m
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis card */}
      {selected && analysis && (
        <AiAnalysisCard analysis={analysis} />
      )}
    </motion.div>
  );
}

function AiAnalysisCard({ analysis }: { analysis: AiAnalysis }) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-accent-soft" />
        <p className="text-[13px] font-semibold text-slate-200">
          AI Analysis — Geo-Spatial Intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Land degradation */}
        <div className="rounded-xl border border-glass-line bg-glass/40 p-3">
          <p className="mb-1.5 font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
            Land Degradation
          </p>
          <p className={cn(
            "text-[13px] font-bold",
            analysis.landDegradation.severity === "None" ? "text-emerald-300" :
            analysis.landDegradation.severity === "Low" ? "text-amber-300" :
            analysis.landDegradation.severity === "Moderate" ? "text-orange-300" : "text-red-300",
          )}>
            {analysis.landDegradation.severity}
          </p>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            {analysis.landDegradation.area > 0 ? `${analysis.landDegradation.area} Ha affected` : "No degradation"}
          </p>
          <p className="font-mono text-[10px] text-slate-500">
            Trend: {analysis.landDegradation.trend}
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
            <div
              className={cn(
                "h-full rounded-full",
                analysis.landDegradation.severity === "None" ? "bg-emerald-400" :
                analysis.landDegradation.severity === "Low" ? "bg-amber-400" : "bg-red-400",
              )}
              style={{ width: `${analysis.landDegradation.confidence}%` }}
            />
          </div>
          <p className="mt-0.5 font-mono text-[8.5px] text-slate-500">
            Confidence: {analysis.landDegradation.confidence}%
          </p>
        </div>

        {/* Water structures */}
        <div className="rounded-xl border border-glass-line bg-glass/40 p-3">
          <p className="mb-1.5 font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
            Water Structures
          </p>
          <p className="text-[13px] font-bold text-sky-300">
            {analysis.waterStructures.detected} detected
          </p>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            {analysis.waterStructures.type}
          </p>
          <p className="font-mono text-[10px] text-slate-500">
            Condition: {analysis.waterStructures.condition}
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-sky-400" style={{ width: `${analysis.waterStructures.confidence}%` }} />
          </div>
          <p className="mt-0.5 font-mono text-[8.5px] text-slate-500">
            Confidence: {analysis.waterStructures.confidence}%
          </p>
        </div>

        {/* Vegetation index */}
        <div className="rounded-xl border border-glass-line bg-glass/40 p-3">
          <p className="mb-1.5 font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
            Vegetation Index (NDVI)
          </p>
          <p className="text-[13px] font-bold text-emerald-300">
            {analysis.vegetationIndex.ndvi.toFixed(2)}
          </p>
          <p className={cn(
            "mt-1 font-mono text-[10px]",
            analysis.vegetationIndex.change > 0 ? "text-emerald-400" : "text-red-400",
          )}>
            Change: {analysis.vegetationIndex.change > 0 ? "+" : ""}{analysis.vegetationIndex.change.toFixed(2)}
          </p>
          <p className="font-mono text-[10px] text-slate-500">
            Class: {analysis.vegetationIndex.class}
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${analysis.vegetationIndex.confidence}%` }} />
          </div>
          <p className="mt-0.5 font-mono text-[8.5px] text-slate-500">
            Confidence: {analysis.vegetationIndex.confidence}%
          </p>
        </div>

        {/* Soil erosion */}
        <div className="rounded-xl border border-glass-line bg-glass/40 p-3">
          <p className="mb-1.5 font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
            Soil Erosion Risk
          </p>
          <p className={cn(
            "text-[13px] font-bold",
            analysis.soilErosion.risk === "None" ? "text-emerald-300" :
            analysis.soilErosion.risk === "Low" ? "text-amber-300" :
            analysis.soilErosion.risk === "Moderate" ? "text-orange-300" : "text-red-300",
          )}>
            {analysis.soilErosion.risk}
          </p>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            {analysis.soilErosion.estimatedLoss > 0 ? `${analysis.soilErosion.estimatedLoss} Ha/yr loss` : "No loss"}
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
            <div
              className={cn(
                "h-full rounded-full",
                analysis.soilErosion.risk === "None" ? "bg-emerald-400" :
                analysis.soilErosion.risk === "Low" ? "bg-amber-400" : "bg-red-400",
              )}
              style={{ width: `${analysis.soilErosion.confidence}%` }}
            />
          </div>
          <p className="mt-0.5 font-mono text-[8.5px] text-slate-500">
            Confidence: {analysis.soilErosion.confidence}%
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-3 rounded-xl border border-accent/25 bg-accent/5 p-4">
        <div className="flex items-start gap-2">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft" />
          <div>
            <p className="text-[12px] font-semibold text-accent-soft">
              AI Recommendation
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-300">
              {analysis.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}