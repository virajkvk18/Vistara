"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Clock,
  Lightbulb,
  ShieldAlert,
  Target,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { MitigationAction } from "@/lib/predictive";

interface MitigationRecommendationsProps {
  mitigations: MitigationAction[];
  activeFactors: { id: string; label: string; reduction: number }[];
}

const priorityMeta: Record<string, { chip: string; icon: React.ReactNode }> = {
  critical: {
    chip: "bg-red-400/10 text-red-300 border-red-400/25",
    icon: <ShieldAlert className="h-3 w-3" />,
  },
  high: {
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    icon: <Target className="h-3 w-3" />,
  },
  medium: {
    chip: "bg-sky-400/10 text-sky-300 border-sky-400/25",
    icon: <Lightbulb className="h-3 w-3" />,
  },
};

export function MitigationRecommendations({
  mitigations,
  activeFactors,
}: MitigationRecommendationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <Lightbulb className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Proactive Mitigation Recommendations
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              AI-generated interventions · priority-ranked by impact
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {activeFactors.length > 0 && (
          <div className="mb-4 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.04] px-4 py-3">
            <p className="flex items-center gap-2 text-[12px] text-emerald-300">
              <BadgeCheck className="h-4 w-4" />
              Active simulation: {activeFactors.length} parameter(s) adjusted
              {" — "}
              {activeFactors.map((f) => (
                <span key={f.id} className="font-mono text-[11px] font-semibold">
                  {f.label} (−{f.reduction}d)
                </span>
              ))}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {mitigations
            .sort((a, b) => {
              const po = { critical: 0, high: 1, medium: 2 };
              return po[a.priority] - po[b.priority];
            })
            .map((m, i) => {
              const pm = priorityMeta[m.priority];
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-xl border border-glass-line bg-glass/40 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border",
                        pm.chip,
                      )}
                    >
                      {pm.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold text-slate-200">{m.title}</p>
                        <span
                          className={cn(
                            "rounded-md border px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider",
                            pm.chip,
                          )}
                        >
                          {m.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">
                        {m.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-slate-500">
                          <Clock className="h-3 w-3" />
                          Owner: <span className="text-slate-300">{m.owner}</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-emerald-400">
                          <ArrowRight className="h-3 w-3" />
                          Est. saved: <span className="font-semibold">−{m.estimatedDaysSaved} days</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {mitigations.length === 0 && (
          <div className="rounded-xl border border-glass-line bg-glass/20 px-4 py-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-3 text-[12px] text-slate-400">
              No mitigations available for this project.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}