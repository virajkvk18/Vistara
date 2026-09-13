"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { riskBand, type ProjectRiskProfile } from "@/lib/predictive";
import { cn } from "@/lib/cn";

interface RiskTableProps {
  projects: ProjectRiskProfile[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function RiskTable({ projects, activeId, onSelect }: RiskTableProps) {
  const sorted = [...projects].sort((a, b) => b.delayProbability - a.delayProbability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/25 bg-red-400/10 text-red-300">
            <AlertTriangle className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              High-Risk Project Alert Dashboard
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              Sorted by predicted delay probability · ML model v3.2
            </p>
          </div>
        </div>
        <span className="rounded-lg border border-red-400/25 bg-red-400/10 px-2.5 py-1.5 font-mono text-[10.5px] text-red-300">
          {projects.filter((p) => p.delayProbability >= 50).length} projects ≥50% risk
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-glass-line bg-glass/40 font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">State</th>
              <th className="px-4 py-3 font-medium">Bottleneck</th>
              <th className="px-4 py-3 font-medium">Delay Prob.</th>
              <th className="px-4 py-3 font-medium">Risk Score</th>
              <th className="px-4 py-3 font-medium">Slippage</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-line">
            {sorted.map((p) => {
              const band = riskBand(p.riskScore);
              return (
                <tr
                  key={p.projectId}
                  onClick={() => onSelect(p.projectId)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-glass/40",
                    activeId === p.projectId && "bg-accent/5 ring-y-0 ring-x-2 ring-accent/30",
                  )}
                >
                  <td className="px-5 py-3.5">
                    <p className="text-[12.5px] font-semibold text-slate-200 line-clamp-1">
                      {p.projectName}
                    </p>
                    <p className="font-mono text-[10px] text-slate-500">
                      {p.code} · {p.ministry}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5 text-[12px] text-slate-300">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
                      {p.state}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[12px] text-slate-300">{p.bottleneckStage}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              p.delayProbability >= 75
                                ? "#f87171"
                                : p.delayProbability >= 50
                                  ? "#f97316"
                                  : p.delayProbability >= 25
                                    ? "#facc15"
                                    : "#34d399",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${p.delayProbability}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-200">
                        {p.delayProbability}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold",
                        band.chip,
                      )}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: band.color }}
                      />
                      {band.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[12px] text-amber-300">
                      ₹{p.financialSlippageCr} Cr
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="btn-ghost inline-flex items-center gap-1 px-2.5 py-1.5 text-[10.5px]">
                      Explain <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}