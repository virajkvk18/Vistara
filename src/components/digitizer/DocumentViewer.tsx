"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileScan,
  Languages,
  Maximize2,
  Minus,
  MoveHorizontal,
  Plus,
  ScanLine,
  UploadCloud,
} from "lucide-react";
import {
  OCR_STEPS,
  SAMPLE_DOCUMENT,
  bandFor,
  confidenceMeta,
  type ExtractedField,
} from "@/lib/digitizer";
import { cn } from "@/lib/cn";

interface DocumentViewerProps {
  fileName: string | null;
  phase: "idle" | "processing" | "done";
  stepIndex: number;
  progressPct: number;
  extraction: ExtractedField[] | null;
  onFile: (file: File) => void;
}

export function DocumentViewer({
  fileName,
  phase,
  stepIndex,
  progressPct,
  extraction,
  onFile,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [overlays, setOverlays] = useState(true);
  const [labels, setLabels] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const pageScale = Math.min(1.5, Math.max(0.42, 0.58 * zoom));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-400/10 text-sky-300">
            <FileScan className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">Legacy Record Viewer</h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              {fileName ?? "Drop a legacy PDF / scanned image"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOverlays((v) => !v)}
            className={cn(
              "btn-ghost px-2.5 py-1.5 text-[11px]",
              overlays && "border-sky-400/40 text-sky-300",
            )}
          >
            <ScanLine className="h-3.5 w-3.5" /> Bounding boxes
          </button>
          <button
            onClick={() => setLabels((v) => !v)}
            className={cn(
              "btn-ghost px-2.5 py-1.5 text-[11px]",
              labels && "border-sky-400/40 text-sky-300",
            )}
          >
            <Languages className="h-3.5 w-3.5" /> Hindi / EN
          </button>
          <div className="flex items-center overflow-hidden rounded-lg border border-glass-line bg-glass">
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              className="p-2 text-slate-300 transition hover:text-white"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-[10.5px] text-slate-400">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2.6, z + 0.15))}
              className="p-2 text-slate-300 transition hover:text-white"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={() => setZoom(1.6)}
            className="btn-ghost px-2.5 py-1.5 text-[11px]"
            aria-label="Fit to screen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative h-[640px] overflow-auto bg-night-850 bg-grid-pattern bg-[size:28px_28px] p-6">
        {/* Upload zone */}
        {phase === "idle" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) onFile(file);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "absolute inset-6 z-10 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-all duration-300",
              dragOver
                ? "scale-[1.01] border-accent-soft bg-accent/10"
                : "border-glass-line bg-glass/40 hover:border-accent/60 hover:bg-accent/5",
            )}
          >
            <UploadCloud className="h-14 w-14 text-accent-soft" />
            <p className="mt-4 text-[15px] font-semibold text-slate-200">
              Drop legacy land record here
            </p>
            <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-slate-500">
              Multi-lingual support — Devanagari (Hindi) and English. Accepts{" "}
              <span className="font-mono text-slate-400">PDF</span>,{" "}
              <span className="font-mono text-slate-400">JPG</span>,{" "}
              <span className="font-mono text-slate-400">PNG</span>,{" "}
              <span className="font-mono text-slate-400">TIFF</span>
            </p>
            <button className="btn-primary mt-5">Browse files</button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,image/*,.tiff,.tif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFile(file);
              }}
            />
            <p className="mt-5 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider text-slate-600">
              <MoveHorizontal className="h-3 w-3" />
              Sample: {SAMPLE_DOCUMENT.name}
            </p>
          </div>
        )}

        {/* Document page */}
        <div
          className={cn(
            "relative mx-auto aspect-[3/4] w-full max-w-[520px] overflow-hidden rounded-md bg-[#f5efe3] text-night-900 shadow-2xl transition-all duration-500",
            phase === "done" ? "opacity-100" : "pointer-events-none opacity-30",
          )}
          style={{ transform: `scale(${pageScale})`, transformOrigin: "top left" }}
        >
          <div className="p-5">
            <div className="flex items-center justify-between border-b-2 border-double border-night-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-night-800 text-[15px] font-bold">
                  🇮🇳
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] font-bold">भारत सरकार · उत्तर प्रदेश राजस्व विभाग</p>
                  <p className="text-[9.5px] text-night-700/70">
                    Government of India · Uttar Pradesh Revenue Department
                  </p>
                </div>
              </div>
              <span className="border-2 border-red-700 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-red-700">
                Digitized Copy
              </span>
            </div>

            <p className="mt-3 text-center text-[13px] font-bold underline underline-offset-4">
              खतौनी · खाता विवरण — Record of Rights
            </p>

            <div className="mt-3 space-y-[7px] font-mono text-[10.5px]">
              {[
                ["खाता संख्या / Khata No.", "KH-0114"],
                ["खसरा संख्या / Khasra No.", "452/2"],
                ["स्वामी का नाम / Owner", "राम सिंह यादव, पु० हरदेव सिंह"],
                ["क्षेत्रफल / Area", "01.42 एकड़ (1.42 acres) — बिरवाही"],
                ["ग्राम / Village", "मोहम्मदपुर खाला"],
                ["तहसील / Tehsil", "लखनऊ · जनपद / District लखनऊ"],
                ["संपत्ति का प्रकार / Type", "व्यक्तिगत · Individual / कृषि भूमि"],
              ].map(([k, v], i) => (
                <div key={i} className="grid grid-cols-[110px_1fr] items-center gap-2">
                  <span className="text-night-700/70">{k}</span>
                  <span className="rounded-sm border border-night-800/40 bg-white/60 px-1.5 py-0.5">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div className="text-[9px] leading-snug text-night-700/70">
                ज़िला प्रशासन, लखनऊ
                <br />
                वर्ष 1984 · लेखपाल अभिलेख
              </div>
              <div className="flex h-14 w-14 -rotate-6 items-center justify-center rounded-full border-2 border-red-800/70 text-center text-[7.5px] leading-tight text-red-800">
                जिला
                <br />
                लखनऊ
                <br />
                प्रमाणित
              </div>
            </div>
          </div>

          {/* Bounding boxes */}
          {phase === "done" && overlays && extraction && (
            <div className="absolute inset-0">
              {extraction.map((f) => {
                if (!f.box) return null;
                const band = bandFor(f.confidence);
                const color = confidenceMeta[band].color;
                return (
                  <div
                    key={f.key}
                    className="absolute rounded-[3px]"
                    style={{
                      left: `${f.box.left}%`,
                      top: `${f.box.top}%`,
                      width: `${f.box.width}%`,
                      height: `${f.box.height}%`,
                      border: `1.5px solid ${color}`,
                      background: `${color}14`,
                    }}
                  >
                    {labels && (
                      <span
                        className="absolute -top-5 left-0 whitespace-nowrap rounded px-1 py-px font-mono text-[8.5px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: color }}
                      >
                        {f.label.slice(0, 12)} · {f.confidence}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* OCR pipeline progress */}
        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-1/2 flex w-[min(92%,560px)] -translate-x-1/2 flex-col gap-2 rounded-2xl border border-glass-line bg-night-900/90 p-4 shadow-card backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-slate-200">
                  {phase === "done"
                    ? "Extraction complete — review confidence below"
                    : `EasyOCR / PaddleOCR worker ${fileName ? `· ${fileName}` : ""}`}
                </p>
                <span className="font-mono text-[11px] text-accent-soft">{progressPct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>
              <div className="grid grid-cols-1 gap-1.5 pt-1 sm:grid-cols-5">
                {OCR_STEPS.map((s, i) => {
                  const state =
                    phase === "done" || i < stepIndex
                      ? "done"
                      : i === stepIndex
                        ? "active"
                        : "pending";
                  return (
                    <div
                      key={s.id}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-2 py-1.5",
                        state === "done" && "border-emerald-400/25 bg-emerald-400/10",
                        state === "active" && "border-accent/40 bg-accent/10",
                        state === "pending" && "border-glass-line bg-glass/30 opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          state === "done" && "bg-emerald-400",
                          state === "active" && "animate-pulse bg-accent-soft",
                          state === "pending" && "bg-slate-500",
                        )}
                      />
                      <span
                        className={cn(
                          "font-mono text-[8.5px] leading-tight",
                          state === "done" && "text-emerald-300",
                          state === "active" && "text-accent-soft",
                          state === "pending" && "text-slate-500",
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}