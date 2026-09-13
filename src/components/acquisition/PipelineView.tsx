"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CircleCheckBig,
  Clock,
  Gavel,
  Landmark,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  STAGES,
  projectsAtStage,
  type AcquisitionProject,
  type ProjectStatus,
} from "@/lib/acquisition";
import { cn } from "@/lib/cn";

const statusMeta: Record<
  ProjectStatus,
  { label: string; chip: string; icon: React.ReactNode }
> = {
  "on-track": {
    label: "On track",
    chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    icon: <CircleCheckBig className="h-3 w-3" />,
  },
  delayed: {
    label: "Delayed",
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    icon: <Clock className="h-3 w-3" />,
  },
  disputed: {
    label: "Disputed",
    chip: "bg-red-400/10 text-red-300 border-red-400/25",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
};

interface PipelineViewProps {
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  advanceStage: (projectId: string) => void;
}

export function PipelineView({
  activeProjectId,
  onSelectProject,
  advanceStage,
}: PipelineViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Stepper */}
      <div className="glass-card px-5 py-4">
        <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.22em] text-slate-500">
          Acquisition Lifecycle — RFCTLARR Act, 2013
        </p>
        <div className="flex items-start gap-0">
          {STAGES.map((stage, i) => {
            const count = projectsAtStage(stage.id).length;
            return (
              <div key={stage.id} className="flex flex-1 items-start">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border-2 font-mono text-[11px] font-bold",
                      i <= STAGES.findIndex((s) => s.id === "section23")
                        ? `border-[${stage.color}]/40 bg-[${stage.color}]/10`
                        : "border-emerald-400/40 bg-emerald-400/10",
                    )}
                    style={{
                      borderColor: `${stage.color}40`,
                      backgroundColor: `${stage.color}15`,
                      color: stage.color,
                    }}
                  >
                    {stage.order + 1}
                  </div>
                  <div className="mt-1.5 max-w-[120px] leading-tight">
                    <p
                      className="text-[10.5px] font-semibold"
                      style={{ color: stage.color }}
                    >
                      {stage.label}
                    </p>
                    <p className="font-mono text-[8.5px] text-slate-500">
                      {stage.actSection}
                    </p>
                    {count > 0 && (
                      <span className="mt-1 inline-block rounded-full border border-glass-line bg-glass px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                        {count} project{count > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="mt-5 flex flex-1 items-center px-1">
                    <div className="h-px w-full bg-gradient-to-r from-glass-line to-white/10" />
                    <ArrowRight className="h-3 w-3 shrink-0 -ml-0.5 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {STAGES.map((stage) => {
          const projects = projectsAtStage(stage.id);
          return (
            <div key={stage.id} className="space-y-2.5">
              <div className="flex items-center gap-2 px-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <p className="text-[10.5px] font-semibold text-slate-300">
                  {stage.label}
                </p>
                <span className="font-mono text-[9px] text-slate-600">
                  {projects.length}
                </span>
              </div>

              {projects.length === 0 && (
                <div className="rounded-xl border border-dashed border-glass-line bg-glass/20 px-3 py-6 text-center">
                  <p className="font-mono text-[9.5px] text-slate-600">
                    No projects at this stage
                  </p>
                </div>
              )}

              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  active={p.id === activeProjectId}
                  onSelect={() => onSelectProject(p.id)}
                  onAdvance={() => advanceStage(p.id)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ProjectCard({
  project,
  active,
  onSelect,
  onAdvance,
}: {
  project: AcquisitionProject;
  active: boolean;
  onSelect: () => void;
  onAdvance: () => void;
}) {
  const st = statusMeta[project.status];

  return (
    <div
      onClick={onSelect}
      className={cn(
        "glass-card cursor-pointer p-3.5 transition-all duration-200",
        active
          ? "border-accent/50 ring-2 ring-accent/25"
          : "hover:border-white/15 hover:shadow-card",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[9.5px] text-slate-500">{project.code}</p>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider",
            st.chip,
          )}
        >
          {st.icon} {st.label}
        </span>
      </div>

      <h4 className="mt-1.5 text-[12px] font-semibold leading-snug text-slate-100 line-clamp-2">
        {project.name}
      </h4>

      <p className="mt-1 text-[10.5px] leading-snug text-slate-400 line-clamp-1">
        {project.requiringBody}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
          <span className="font-mono text-[9.5px] text-slate-400">
            {project.landAreaHa} Ha
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3 w-3 shrink-0 text-slate-500" />
          <span className="font-mono text-[9.5px] text-slate-400">
            {project.displacedFamilies} families
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Landmark className="h-3 w-3 shrink-0 text-slate-500" />
          <span className="font-mono text-[9.5px] text-slate-400">
            ₹{project.compensationBudgetCr} Cr
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Gavel className="h-3 w-3 shrink-0 text-slate-500" />
          <span className="font-mono text-[9.5px] text-slate-400">
            {project.state}
          </span>
        </div>
      </div>

      {/* Disbursement mini-bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-slate-500">Disbursement</span>
          <span className="font-mono text-[9px] text-slate-400">
            ₹{project.compensationDisbursedCr} / ₹{project.compensationBudgetCr} Cr
          </span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-emerald-400/60"
            style={{
              width: `${(project.compensationDisbursedCr / project.compensationBudgetCr) * 100}%`,
            }}
          />
        </div>
      </div>

      {project.currentStage !== "possession" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdvance();
          }}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-wider text-accent-soft transition hover:bg-accent/20"
        >
          <ShieldCheck className="h-3 w-3" />
          Run Audit & Advance
        </button>
      )}
    </div>
  );
}