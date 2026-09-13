"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  ClipboardCheck,
  FilePenLine,
  Lock,
  Pencil,
  Save,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  HUMAN_VERIFY_THRESHOLD,
  bandFor,
  confidenceMeta,
  type AuditorLogEntry,
  type ExtractedField,
} from "@/lib/digitizer";
import { ROLES } from "@/lib/roles";
import { useRoleStore } from "@/store/useRoleStore";
import { cn } from "@/lib/cn";

interface ExtractionFormProps {
  extraction: ExtractedField[] | null;
  verifiedKeys: Set<string>;
  log: AuditorLogEntry[];
  onVerify: (key: string, value: string) => void;
}

export function ExtractionForm({ extraction, verifiedKeys, log, onVerify }: ExtractionFormProps) {
  const { role } = useRoleStore();
  const canVerify = ROLES[role].accessLevel >= 2;
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  if (!extraction || extraction.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-center"
      >
        <ClipboardCheck className="h-10 w-10 text-slate-600" />
        <h3 className="mt-4 text-[14px] font-semibold text-slate-300">No extraction yet</h3>
        <p className="mt-1.5 max-w-[260px] text-[12px] leading-relaxed text-slate-500">
          Drop a legacy land record on the left panel to run the OCR pipeline and populate this
          structured form.
        </p>
      </motion.div>
    );
  }

  const verifiedCount = extraction.filter((f) => verifiedKeys.has(f.key)).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.14 }}
      className="glass-card flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <ClipboardCheck className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Extracted Structured Data
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              Inline confidence · audit trail
            </p>
          </div>
        </div>
        <span className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1.5 font-mono text-[10.5px] text-emerald-300">
          {verifiedCount}/{extraction.length} verified
        </span>
      </div>

      <div className="flex-1 space-y-2.5 p-4">
        {extraction.map((f) => {
          const band = bandFor(f.confidence);
          const cm = confidenceMeta[band];
          const verified = verifiedKeys.has(f.key);
          const needsHuman = f.confidence < HUMAN_VERIFY_THRESHOLD && !verified;
          const isEditing = editing === f.key;

          return (
            <div
              key={f.key}
              className={cn(
                "rounded-xl border p-3 transition-colors",
                verified
                  ? "border-emerald-400/30 bg-emerald-400/[0.05]"
                  : band === "low"
                    ? "border-red-400/25 bg-red-400/[0.04]"
                    : band === "medium"
                      ? "border-amber-400/25 bg-amber-400/[0.03]"
                      : "border-glass-line bg-glass/40",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {f.label}
                </p>
                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {needsHuman && (
                      <motion.span
                        key="verify-badge"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-300"
                      >
                        <TriangleAlert className="h-2.5 w-2.5" />
                        Human Verification Required
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span
                    className={cn(
                      "rounded-md border px-1.5 py-0.5 font-mono text-[9.5px] font-bold",
                      cm.chip,
                    )}
                  >
                    {verified ? "100% · Verified" : `${f.confidence}% · ${cm.label}`}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2.5">
                {isEditing ? (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-accent/50 bg-night-900/80 px-2.5 py-1.5 text-[12.5px] font-medium text-white outline-none ring-2 ring-accent/20"
                  />
                ) : (
                  <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-100">
                    {f.value}
                  </p>
                )}

                {verified ? (
                  <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Audit logged
                  </span>
                ) : canVerify ? (
                  isEditing ? (
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => {
                          onVerify(f.key, draft.trim() || f.value);
                          setEditing(null);
                        }}
                        className="btn-gold px-2.5 py-1.5 text-[10.5px]"
                      >
                        <Save className="h-3 w-3" /> Save & Verify (100%)
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="btn-ghost px-2 py-1.5 text-[10.5px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setDraft(f.value);
                        setEditing(f.key);
                      }}
                      className="btn-primary px-2.5 py-1.5 text-[10.5px]"
                    >
                      <FilePenLine className="h-3 w-3" /> Edit & Verify
                    </button>
                  )
                ) : (
                  <span className="flex shrink-0 items-center gap-1 rounded-md border border-glass-line bg-glass px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    <Lock className="h-3 w-3" />
                    Auditor only
                  </span>
                )}
              </div>

              {/* Confidence bar */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={cn("h-full rounded-full", band === "high" && "bg-emerald-400", band === "medium" && "bg-amber-400", band === "low" && "bg-red-400")}
                    initial={{ width: 0 }}
                    animate={{ width: `${verified ? 100 : f.confidence}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="font-mono text-[9.5px] text-slate-500">
                  {verified ? "Verified by auditor" : `OCR confidence`}
                </span>
              </div>
            </div>
          );
        })}

        {!canVerify && (
          <p className="flex items-center gap-2 rounded-lg border border-glass-line bg-glass px-3 py-2 text-[11px] text-slate-400">
            <Pencil className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            Verification locked — {ROLES[role].label} cannot edit records. Switch to{" "}
            {ROLES.RESEARCHER.label}+ to run audit QA.
          </p>
        )}
      </div>

      {/* Audit log */}
      <div className="border-t border-glass-line px-5 py-3">
        <p className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-slate-500">
          Auditor trail · {log.length} entries
        </p>
        <div className="max-h-40 space-y-1.5 overflow-y-auto">
          {log.length === 0 ? (
            <p className="text-[11px] text-slate-600">No edits logged yet.</p>
          ) : (
            log.map((entry, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] px-2.5 py-1.5"
              >
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-300">
                    <span className="font-semibold">{entry.fieldLabel}</span> →{" "}
                    <span className="font-medium text-emerald-300">{entry.value}</span>
                  </p>
                  <p className="font-mono text-[9px] text-slate-500">
                    by {entry.by} · {entry.at}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}