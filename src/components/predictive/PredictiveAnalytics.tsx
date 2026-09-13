"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Lightbulb,
  Play,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  PROJECT_RISK_PROFILES,
  computeRiskScore,
  type RiskFactor,
} from "@/lib/predictive";
import { SummaryCards } from "./SummaryCards";
import { RiskTable } from "./RiskTable";
import { RiskGauge } from "./RiskGauge";
import { ExplainabilityPanel } from "./ExplainabilityPanel";
import { ParameterSimulator } from "./ParameterSimulator";
import { MitigationRecommendations } from "./MitigationRecommendations";

export function PredictiveAnalytics() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [factorsMap, setFactorsMap] = useState<Record<string, RiskFactor[]>>(() => {
    const map: Record<string, RiskFactor[]> = {};
    PROJECT_RISK_PROFILES.forEach((p) => {
      map[p.projectId] = p.riskFactors.map((f) => ({ ...f }));
    });
    return map;
  });

  const profiles = PROJECT_RISK_PROFILES.map((p) => ({
    ...p,
    riskFactors: factorsMap[p.projectId] || p.riskFactors,
    riskScore: computeRiskScore(factorsMap[p.projectId] || p.riskFactors),
    delayProbability: Math.round(
      computeRiskScore(factorsMap[p.projectId] || p.riskFactors) *
        (p.delayProbability / Math.max(1, p.riskScore)),
    ),
  }));

  const highRisk = profiles.filter((p) => p.delayProbability >= 50);
  const totalSlippage = profiles.reduce((s, p) => s + p.financialSlippageCr, 0);
  const avgBottleneck = Math.round(
    profiles.reduce((s, p) => s + p.totalEstimatedDelayDays, 0) / profiles.length,
  );

  const active = profiles.find((p) => p.projectId === activeId) ?? null;

  const handleFactorChange = useCallback(
    (factorId: string, value: number) => {
      if (!active) return;
      setFactorsMap((prev) => ({
        ...prev,
        [active.projectId]: (prev[active.projectId] || []).map((f) =>
          f.id === factorId ? { ...f, currentReduction: value } : f,
        ),
      }));
    },
    [active],
  );

  const handleReset = useCallback(() => {
    if (!active) return;
    setFactorsMap((prev) => ({
      ...prev,
      [active.projectId]: (prev[active.projectId] || []).map((f) => ({
        ...f,
        currentReduction: 0,
      })),
    }));
    toast.info("Simulation reset", { description: "All risk factors restored to baseline" });
  }, [active]);

  const handleDemo = useCallback(() => {
    // Auto-select the highest-risk project
    const sorted = [...profiles].sort((a, b) => b.delayProbability - a.delayProbability);
    if (sorted.length > 0) {
      setActiveId(sorted[0].projectId);
      toast.info("Demo mode — loaded highest-risk project", {
        description: `${sorted[0].projectName} · ${sorted[0].delayProbability}% delay probability`,
      });
      // Auto-apply mitigation sliders
      setTimeout(() => {
        setFactorsMap((prev) => {
          const map = { ...prev };
          const pid = sorted[0].projectId;
          if (map[pid]) {
            map[pid] = map[pid].map((f) =>
              f.simulatable
                ? { ...f, currentReduction: Math.round(f.maxReduction * 0.6) }
                : f,
            );
          }
          return map;
        });
        toast.success("Mitigation simulators auto-filled", {
          description: "Risk factors adjusted to model optimal intervention scenario",
        });
      }, 300);
    }
  }, [profiles]);

  const activeFactors = active
    ? active.riskFactors
        .filter((f) => f.currentReduction > 0)
        .map((f) => ({ id: f.id, label: f.label, reduction: f.currentReduction }))
    : [];

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
            <span className="text-accent-soft">Predictive Delay Engine</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gradient-title">
            Predictive Risk & Delay Analytics
          </h1>
          <p className="mt-1 text-[12.5px] text-slate-400">
            SIH26017 — ML-powered delay prediction with explainable risk factors & proactive
            mitigation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDemo}
            className="flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 font-mono text-[10.5px] text-accent-soft transition hover:bg-accent/20"
          >
            <Play className="h-3 w-3" /> Demo Mode
          </button>
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-slate-300">
            <TrendingUp className="h-3.5 w-3.5 text-accent-soft" />
            {profiles.length} projects analysed
          </span>
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-slate-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-300" />
            {active ? "Simulation active" : "Select a project to simulate"}
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <SummaryCards
        highRiskCount={highRisk.length}
        totalSlippageCr={totalSlippage}
        avgBottleneckDays={avgBottleneck}
      />

      {/* Risk table */}
      <RiskTable
        projects={profiles}
        activeId={activeId}
        onSelect={(id) => setActiveId(activeId === id ? null : id)}
      />

      {/* Detail section */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.projectId}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Gauge + Summary strip */}
            <div className="glass-card flex flex-wrap items-center gap-6 p-6">
              <RiskGauge score={active.riskScore} />
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-100">
                    {active.projectName}
                  </h3>
                  <p className="font-mono text-[11px] text-slate-500">
                    {active.code} · {active.ministry} · {active.state}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-lg border border-glass-line bg-glass px-3 py-1.5 font-mono text-[11px] text-slate-300">
                    Delay probability:{" "}
                    <span className="font-semibold text-slate-100">{active.delayProbability}%</span>
                  </span>
                  <span className="rounded-lg border border-glass-line bg-glass px-3 py-1.5 font-mono text-[11px] text-amber-300">
                    Slippage: ₹{active.financialSlippageCr} Cr
                  </span>
                  <span className="rounded-lg border border-glass-line bg-glass px-3 py-1.5 font-mono text-[11px] text-slate-300">
                    Bottleneck:{" "}
                    <span className="text-slate-100">{active.bottleneckStage}</span>
                  </span>
                  <span className="rounded-lg border border-glass-line bg-glass px-3 py-1.5 font-mono text-[11px] text-slate-300">
                    Est. delay:{" "}
                    <span className="text-slate-100">{active.totalEstimatedDelayDays} days</span>
                  </span>
                </div>
                {activeFactors.length > 0 && (
                  <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] px-3 py-2">
                    <p className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                      <Lightbulb className="h-3.5 w-3.5" />
                      Simulation active — total days saved:{" "}
                      <span className="font-semibold">
                        {activeFactors.reduce((s, f) => s + f.reduction, 0)} days
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Explainability + Simulator */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <ExplainabilityPanel
                projectName={active.projectName}
                factors={active.riskFactors}
              />
              <ParameterSimulator
                factors={active.riskFactors}
                onFactorChange={handleFactorChange}
                onReset={handleReset}
              />
            </div>

            {/* Mitigation recommendations */}
            <MitigationRecommendations
              mitigations={active.mitigations}
              activeFactors={activeFactors}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}