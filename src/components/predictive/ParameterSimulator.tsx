"use client";

import { motion } from "framer-motion";
import { Gauge, RotateCcw, SlidersHorizontal } from "lucide-react";
import { categoryMeta, type RiskFactor } from "@/lib/predictive";
import { cn } from "@/lib/cn";

interface ParameterSimulatorProps {
  factors: RiskFactor[];
  onFactorChange: (factorId: string, value: number) => void;
  onReset: () => void;
}

export function ParameterSimulator({
  factors,
  onFactorChange,
  onReset,
}: ParameterSimulatorProps) {
  const simulatable = factors.filter((f) => f.simulatable);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-400/25 bg-amber-400/10 text-amber-300">
            <SlidersHorizontal className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Parameter Simulation Lab
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              Adjust sliders to simulate mitigation interventions
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="btn-ghost px-2.5 py-1.5 text-[10.5px]"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset all
        </button>
      </div>

      <div className="p-5">
        <div className="mb-4 rounded-xl border border-accent/25 bg-accent/5 px-4 py-3">
          <p className="flex items-center gap-2 text-[12px] text-accent-soft">
            <Gauge className="h-4 w-4" />
            Drag sliders to model the effect of accelerating each risk factor. The risk score and
            delay probability recalculate in real time.
          </p>
        </div>

        <div className="space-y-4">
          {simulatable.map((f, i) => {
            const cat = categoryMeta(f.category);
            const maxReduction = f.maxReduction;
            const remainingImpact = f.baseImpact - f.currentReduction;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="rounded-xl border border-glass-line bg-glass/40 p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[12.5px] font-semibold text-slate-200">{f.label}</p>
                      <span
                        className={cn(
                          "rounded-md border px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider",
                          cat.chip,
                        )}
                      >
                        {f.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10.5px] text-slate-500">{f.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[11px] text-slate-300">
                      Base: <span className="text-red-300">+{f.baseImpact}d</span>
                    </p>
                    {f.currentReduction > 0 && (
                      <p className="font-mono text-[11px] text-emerald-300">
                        Saved: <span className="font-semibold">−{f.currentReduction}d</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="w-8 text-right font-mono text-[10px] text-slate-500">0</span>
                  <input
                    type="range"
                    min={0}
                    max={maxReduction}
                    step={1}
                    value={f.currentReduction}
                    onChange={(e) => onFactorChange(f.id, Number(e.target.value))}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-400 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                  />
                  <span className="w-12 text-right font-mono text-[11px] font-semibold text-emerald-300">
                    −{f.currentReduction}d
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-500">
                    Remaining impact: <span className="text-slate-300">+{remainingImpact} days</span>
                  </span>
                  <span className="font-mono text-slate-500">
                    Max reduction: {maxReduction} days
                  </span>
                </div>
              </motion.div>
            );
          })}

          {simulatable.length === 0 && (
            <div className="rounded-xl border border-glass-line bg-glass/20 px-4 py-8 text-center">
              <p className="text-[12px] text-slate-400">No simulatable factors for this project.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}