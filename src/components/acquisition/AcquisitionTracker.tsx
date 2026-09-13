"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  ChevronRight,
  Landmark,
  MapPinned,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import {
  PROJECTS,
  STAGES,
  nextStage,
} from "@/lib/acquisition";
import { cn } from "@/lib/cn";
import { PipelineView } from "./PipelineView";
import { ProjectDetail } from "./ProjectDetail";
import { DisbursementLedger } from "./DisbursementLedger";

type ViewMode = "pipeline" | "ledger";

export function AcquisitionTracker() {
  const [projects, setProjects] = useState(PROJECTS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("pipeline");

  const active = projects.find((p) => p.id === activeId) ?? null;

  const advanceStage = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nx = nextStage(p.currentStage);
        if (!nx) return p;
        toast.success("Stage advanced", {
          description: `${p.code} moved to ${STAGES.find((s) => s.id === nx)?.label ?? nx}`,
        });
        return { ...p, currentStage: nx, status: nx === "possession" ? "on-track" : p.status };
      }),
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-[1600px] space-y-5"
    >
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500">
            <span>VISTARA</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-accent-soft">Acquisition Workflow</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gradient-title">
            Land Acquisition Tracker
          </h1>
          <p className="mt-1 text-[12.5px] text-slate-400">
            SIH26016 — RFCTLARR Act 2013 pipeline · statutory stage progression · compensation disbursement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-slate-300">
            <Landmark className="h-3.5 w-3.5 text-indigo-300" />
            {projects.length} active projects
          </span>
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-slate-300">
            <MapPinned className="h-3.5 w-3.5 text-sky-300" />
            {projects.reduce((s, p) => s + p.displacedFamilies, 0).toLocaleString()} families affected
          </span>
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-emerald-300">
            <Banknote className="h-3.5 w-3.5" />
            ₹{projects.reduce((s, p) => s + p.compensationBudgetCr, 0).toLocaleString()} Cr total
          </span>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="flex items-center gap-2 rounded-xl border border-glass-line bg-glass/40 p-1 backdrop-blur-md">
        {[
          { id: "pipeline" as ViewMode, label: "Pipeline View", icon: <Workflow className="h-4 w-4" /> },
          { id: "ledger" as ViewMode, label: "Disbursement Ledger", icon: <Banknote className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12px] font-medium transition",
              view === tab.id
                ? "bg-accent/15 text-accent-soft ring-1 ring-accent/40"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === "pipeline" ? (
        <div className="space-y-5">
          <PipelineView
            activeProjectId={activeId}
            onSelectProject={(id) => setActiveId(activeId === id ? null : id)}
            advanceStage={advanceStage}
          />

          <AnimatePresence mode="wait">
            {active && (
              <ProjectDetail
                key={active.id}
                project={active}
                onClose={() => setActiveId(null)}
                onAdvanceStage={advanceStage}
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Ledger project selector */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[10.5px] uppercase tracking-wider text-slate-500">
              Select project for ledger view:
            </p>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveId(activeId === p.id ? null : p.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 font-mono text-[10.5px] transition",
                  activeId === p.id
                    ? "border-accent/50 bg-accent/15 text-accent-soft"
                    : "border-glass-line bg-glass text-slate-400 hover:text-slate-200",
                )}
              >
                {p.code}
              </button>
            ))}
          </div>

          {active ? (
            <DisbursementLedger project={active} />
          ) : (
            <div className="glass-card flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
              <Banknote className="h-10 w-10 text-slate-600" />
              <h3 className="mt-4 text-[14px] font-semibold text-slate-300">
                Select a project
              </h3>
              <p className="mt-1.5 max-w-[280px] text-[12px] leading-relaxed text-slate-500">
                Choose an acquisition project above to view its affected families ledger and
                disbursement tracking.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}