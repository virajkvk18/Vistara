"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  BellRing,
  ChevronRight,
  CloudUpload,
  Play,
  ScanEye,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import {
  HUMAN_VERIFY_THRESHOLD,
  runMockOcr,
  type AuditorLogEntry,
  type ExtractedField,
} from "@/lib/digitizer";
import { ROLES } from "@/lib/roles";
import { useRoleStore } from "@/store/useRoleStore";
import { DocumentViewer } from "./DocumentViewer";
import { ExtractionForm } from "./ExtractionForm";

type Phase = "idle" | "processing" | "done";

const auditorFor = (role: string) =>
  role === "ADMIN"
    ? "ADM-2026-0001"
    : role === "OFFICIAL"
      ? "OFF-2026-0342"
      : `${role.slice(0, 3)}-2026-${Math.floor(100 + Math.random() * 900)}`;

export function DigitizerWorkspace() {
  const { role } = useRoleStore();
  const canVerify = ROLES[role].accessLevel >= 2;
  const canExport = ROLES[role].accessLevel >= 3;

  const [fileName, setFileName] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [extraction, setExtraction] = useState<ExtractedField[] | null>(null);
  const [verifiedKeys, setVerifiedKeys] = useState<Set<string>>(new Set());
  const [log, setLog] = useState<AuditorLogEntry[]>([]);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setPhase("processing");
    setStepIndex(0);
    setProgressPct(0);
    setExtraction(null);
    setVerifiedKeys(new Set());
    setLog([]);

    const fields = await runMockOcr((step, pct) => {
      setStepIndex(step);
      setProgressPct(pct);
    });

    setExtraction(fields);
    setPhase("done");
    toast.success("OCR extraction complete", {
      description: `${fields.length} fields extracted · overall confidence: ${Math.round(fields.reduce((s, f) => s + f.confidence, 0) / fields.length)}%`,
    });
  }, []);

  const handleDemo = useCallback(async () => {
    setFileName("demo_khasra_7-3_scan.jpg");
    setPhase("processing");
    setStepIndex(0);
    setProgressPct(0);
    setExtraction(null);
    setVerifiedKeys(new Set());
    setLog([]);
    toast.info("Demo mode — running ideal OCR pipeline");

    const fields = await runMockOcr((step, pct) => {
      setStepIndex(step);
      setProgressPct(pct);
    });

    setExtraction(fields);
    setPhase("done");
    toast.success("Demo extraction complete", {
      description: `${fields.length} fields extracted · Khasra 7/3, Owner: Ramesh Kumar`,
    });
  }, []);

  const handleVerify = useCallback(
    (key: string, value: string) => {
      if (!canVerify) return;
      setExtraction((prev) =>
        prev
          ? prev.map((f) =>
              f.key === key ? { ...f, value, confidence: 100 } : f,
            )
          : prev,
      );
      setVerifiedKeys((prev) => {
        const next = new Set(prev);
        next.add(key);
        return next;
      });
      const field = extraction?.find((f) => f.key === key);
      if (field) {
        setLog((prev) => [
          {
            fieldLabel: field.label,
            previousValue: field.value,
            value,
            by: auditorFor(role),
            at: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev,
        ]);
        toast.success("Record verified", {
          description: `${field.label} confirmed by ${auditorFor(role)}`,
        });
      }
    },
    [canVerify, extraction, role],
  );

  const unverified = extraction
    ? extraction.filter((f) => !verifiedKeys.has(f.key) && f.confidence < HUMAN_VERIFY_THRESHOLD)
        .length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-[1500px] space-y-5"
    >
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500">
            <span>VISTARA</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-accent-soft">Land Digitizer & OCR</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gradient-title">
            AI Land Record Digitizer
          </h1>
          <p className="mt-1 text-[12.5px] text-slate-400">
            SIH26018 — vectorise legacy bilingual records into a structured, confidence-scored
            parcel registry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDemo}
            disabled={phase === "processing"}
            className="flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 font-mono text-[10.5px] text-accent-soft transition hover:bg-accent/20 disabled:opacity-50"
          >
            <Play className="h-3 w-3" /> Demo Mode
          </button>
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-slate-300">
            <ScanEye className="h-3.5 w-3.5 text-sky-300" />
            {phase === "done" && fileName
              ? `${fileName} · extracted`
              : phase === "processing"
                ? "Worker running…"
                : "Awaiting document"}
          </span>
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-slate-300">
            <BellRing className="h-3.5 w-3.5 text-amber-300" />
            {unverified} field{unverified === 1 ? "" : "s"} need human review
          </span>
          <button
            className="btn-primary"
            disabled={phase !== "done" || extraction === null || !canExport}
            onClick={() => {
              if (canExport) {
                toast.success("Exported to parcel registry", {
                  description: "Record committed to national land database",
                });
              }
            }}
            title={
              !canExport
                ? `${ROLES.OFFICIAL.label} clearance required to publish`
                : undefined
            }
          >
            <Send className="h-3.5 w-3.5" />
            {canExport ? "Export to parcel registry" : "Publish gated"}
          </button>
        </div>
      </div>

      {/* Permission strip */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-glass-line bg-glass/60 px-4 py-3 backdrop-blur-md">
        <span className="flex items-center gap-2 text-[11.5px] text-slate-400">
          <CloudUpload className="h-3.5 w-3.5 text-accent-soft" />
          Workspace clearance: {ROLES[role].label} (L{ROLES[role].accessLevel})
        </span>
        <span className="h-4 w-px bg-glass-line" />
        {!canVerify ? (
          <span className="text-[11px] text-amber-300">
            Editing locked — field verification requires {ROLES.RESEARCHER.label} clearance or
            higher.
          </span>
        ) : (
          <span className="text-[11px] text-emerald-300">
            Field verification unlocked — auditor ID will be stamped on save.
          </span>
        )}
        <span className="h-4 w-px bg-glass-line" />
        {canExport ? (
          <span className="text-[11px] text-emerald-300">
            Registry export unlocked — final ingest requires official confirmation.
          </span>
        ) : (
          <span className="text-[11px] text-slate-500">
            Registry export locked — {ROLES.OFFICIAL.label} clearance required.
          </span>
        )}
      </div>

      {/* Two-column workspace */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">
        <DocumentViewer
          fileName={fileName}
          phase={phase}
          stepIndex={stepIndex}
          progressPct={progressPct}
          extraction={extraction}
          onFile={handleFile}
        />
        <ExtractionForm
          extraction={extraction}
          verifiedKeys={verifiedKeys}
          log={log}
          onVerify={handleVerify}
        />
      </div>
    </motion.div>
  );
}