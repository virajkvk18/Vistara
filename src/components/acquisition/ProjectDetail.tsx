"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Landmark,
  MapPin,
  ShieldCheck,
  TriangleAlert,
  Users,
  XCircle,
} from "lucide-react";
import {
  AUDIT_CHECKS,
  familiesForProject,
  nextStage,
  STAGES,
  type AcquisitionProject,
  type AuditResult,
} from "@/lib/acquisition";
import { cn } from "@/lib/cn";

interface ProjectDetailProps {
  project: AcquisitionProject;
  onClose: () => void;
  onAdvanceStage: (projectId: string) => void;
}

export function ProjectDetail({
  project,
  onClose,
  onAdvanceStage,
}: ProjectDetailProps) {
  const [showAudit, setShowAudit] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);

  const currentStage = STAGES.find((s) => s.id === project.currentStage)!;
  const nxStage = nextStage(project.currentStage);
  const families = familiesForProject(project.id);
  const disbursedFamilies = families.filter((f) => f.compensationDisbursedLakhs > 0).length;
  const disputedFamilies = families.filter(
    (f) => f.disputeStatus === "pending" || f.disputeStatus === "litigation",
  ).length;

  const applicableChecks = AUDIT_CHECKS.filter(
    (c) => c.requiredAtStage === project.currentStage,
  );

  const handleRunAudit = () => {
    const results: AuditResult[] = applicableChecks.map((c) => ({
      checkId: c.id,
      status:
        project.status === "disputed" && c.id === "survey"
          ? ("fail" as const)
          : project.status === "delayed" && c.id === "consent"
            ? ("pending" as const)
            : ("pass" as const),
      note:
        project.status === "disputed" && c.id === "survey"
          ? "SIA boundary survey pending — community consultation incomplete."
          : project.status === "delayed" && c.id === "consent"
            ? "Consent collection at 63% — below 70% threshold."
            : "Cleared — prerequisite satisfied.",
    }));
    setAuditResults(results);
    setShowAudit(true);
  };

  const allPassed = auditResults.length > 0 && auditResults.every((r) => r.status === "pass");
  const hasFailures = auditResults.some((r) => r.status === "fail");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg border"
            style={{
              borderColor: `${currentStage.color}40`,
              backgroundColor: `${currentStage.color}15`,
              color: currentStage.color,
            }}
          >
            <ShieldCheck className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100 line-clamp-1">
              {project.name}
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              {project.code}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg border border-glass-line bg-glass p-2 text-slate-400 transition hover:text-white"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>

      {/* Stage ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-glass-line bg-glass/30 px-5 py-3">
        {STAGES.map((s, i) => {
          const reached =
            STAGES.findIndex((x) => x.id === s.id) <=
            STAGES.findIndex((x) => x.id === project.currentStage);
          return (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider",
                  reached
                    ? "border-white/15 bg-white/5 text-slate-200"
                    : "border-glass-line bg-glass text-slate-500 opacity-40",
                )}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: reached ? s.color : "#64748b" }}
                />
                {s.label}
              </div>
              {i < STAGES.length - 1 && (
                <ChevronRight className="mx-1 h-3 w-3 text-slate-600" />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-5">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { icon: <Landmark className="h-4 w-4 text-indigo-300" />, label: "Requiring Ministry", value: project.requiringMinistry },
            { icon: <MapPin className="h-4 w-4 text-sky-300" />, label: "Affected Area", value: `${project.landAreaHa} Ha` },
            { icon: <Users className="h-4 w-4 text-amber-300" />, label: "Displaced Families", value: project.displacedFamilies.toString() },
            { icon: <Landmark className="h-4 w-4 text-emerald-300" />, label: "Budget", value: `₹${project.compensationBudgetCr} Cr` },
            { icon: <Calendar className="h-4 w-4 text-slate-400" />, label: "Target", value: project.targetCompletion },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-glass-line bg-glass/40 px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                {item.icon}
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  {item.label}
                </p>
              </div>
              <p className="mt-1 truncate text-[12.5px] font-semibold text-slate-100">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          {project.description}
        </p>

        {/* Family summary strip */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-glass-line bg-glass/40 px-4 py-3">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <Users className="h-3.5 w-3.5 text-sky-300" />
            {families.length} families enumerated
          </span>
          <span className="h-4 w-px bg-glass-line" />
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {disbursedFamilies} partially/fully disbursed
          </span>
          <span className="h-4 w-px bg-glass-line" />
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
            <Clock className="h-3.5 w-3.5" />
            {families.length - disbursedFamilies} pending
          </span>
          {disputedFamilies > 0 && (
            <>
              <span className="h-4 w-px bg-glass-line" />
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-red-300">
                <TriangleAlert className="h-3.5 w-3.5" />
                {disputedFamilies} disputed
              </span>
            </>
          )}
        </div>

        {/* Audit section */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-slate-200">
              File Audit Checks
            </h3>
            {!showAudit && (
              <button
                onClick={handleRunAudit}
                className="btn-primary px-3 py-1.5 text-[10.5px]"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Run audit
              </button>
            )}
          </div>

          <AnimatePresence>
            {showAudit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {auditResults.map((r) => {
                    const check = applicableChecks.find((c) => c.id === r.checkId)!;
                    return (
                      <div
                        key={r.checkId}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border px-3.5 py-3",
                          r.status === "pass" && "border-emerald-400/25 bg-emerald-400/[0.04]",
                          r.status === "fail" && "border-red-400/25 bg-red-400/[0.04]",
                          r.status === "pending" && "border-amber-400/25 bg-amber-400/[0.04]",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                            r.status === "pass" && "bg-emerald-400/15 text-emerald-300",
                            r.status === "fail" && "bg-red-400/15 text-red-300",
                            r.status === "pending" && "bg-amber-400/15 text-amber-300",
                          )}
                        >
                          {r.status === "pass" && <CheckCircle2 className="h-3.5 w-3.5" />}
                          {r.status === "fail" && <XCircle className="h-3.5 w-3.5" />}
                          {r.status === "pending" && <Clock className="h-3.5 w-3.5" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold text-slate-200">{check.label}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">{r.note}</p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                            r.status === "pass" && "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
                            r.status === "fail" && "border-red-400/30 bg-red-400/10 text-red-300",
                            r.status === "pending" && "border-amber-400/30 bg-amber-400/10 text-amber-300",
                          )}
                        >
                          {r.status === "pass" ? "Cleared" : r.status === "fail" ? "Failed" : "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progression action */}
                <div className="mt-4 rounded-xl border border-glass-line bg-glass/40 px-4 py-3">
                  {hasFailures ? (
                    <p className="flex items-center gap-2 text-[12px] text-red-300">
                      <XCircle className="h-4 w-4" />
                      Stage cannot be advanced — audit failures detected. Resolve issues above.
                    </p>
                  ) : allPassed ? (
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2 text-[12px] text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        All checks passed — eligible for stage advancement
                      </p>
                      {nxStage && (
                        <button
                          onClick={() => onAdvanceStage(project.id)}
                          className="btn-gold px-3 py-1.5 text-[10.5px]"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Advance to {STAGES.find((s) => s.id === nxStage)?.label}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="flex items-center gap-2 text-[12px] text-amber-300">
                      <Clock className="h-4 w-4" />
                      Audit in progress — resolve pending checks to proceed.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}