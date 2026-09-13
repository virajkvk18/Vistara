"use client";

import { motion } from "framer-motion";
import { Brain, ShieldAlert, TrendingUp } from "lucide-react";
import { categoryMeta, type RiskFactor } from "@/lib/predictive";
import { cn } from "@/lib/cn";

interface ExplainabilityPanelProps {
  projectName: string;
  factors: RiskFactor[];
}

export function ExplainabilityPanel({
  projectName,
  factors,
}: ExplainabilityPanelProps) {
  const sorted = [...factors].sort((a, b) => {
    const aImpact = a.baseImpact - a.currentReduction;
    const bImpact = b.baseImpact - b.currentReduction;
    return bImpact - aImpact;
  });

  const maxImpact = Math.max(...sorted.map((f) => f.baseImpact));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-400/25 bg-indigo-400/10 text-indigo-300">
            <Brain className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Explainable AI Risk Breakdown
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              SHAP-style feature attribution · {projectName}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-400/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wider text-indigo-300">
          <ShieldAlert className="h-3 w-3" />
          Model Explainability
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          <p className="font-mono text-[10.5px] text-slate-400">
            Top contributing risk factors to estimated delay
          </p>
        </div>

        <div className="space-y-3">
          {sorted.map((f, i) => {
            const currentImpact = f.baseImpact - f.currentReduction;
            const pct = (currentImpact / maxImpact) * 100;
            const cat = categoryMeta(f.category);
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-xl border border-glass-line bg-glass/40 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{ backgroundColor: cat.color }}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[12.5px] font-semibold text-slate-200">{f.label}</p>
                      <p className="text-[10.5px] text-slate-500">{f.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[12px] font-semibold text-slate-200">
                      +{currentImpact} {f.unit}
                    </p>
                    <span
                      className={cn(
                        "rounded-md border px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider",
                        cat.chip,
                      )}
                    >
                      {f.category}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[10px] text-slate-500">
                    {Math.round(pct)}%
                  </span>
                </div>

                {f.currentReduction > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-md border border-emerald-400/25 bg-emerald-400/[0.04] px-2.5 py-1.5">
                    <span className="font-mono text-[9.5px] text-emerald-400">
                      Simulated reduction: −{f.currentReduction} {f.unit}
                    </span>
                    <span className="font-mono text-[9px] text-slate-500">
                      (remaining: +{currentImpact} {f.unit})
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}