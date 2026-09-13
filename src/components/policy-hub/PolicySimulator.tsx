"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Building2,
  CircleDollarSign,
  Dice5,
  Landmark,
  Scale,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  BASELINE_PARAMS,
  REGIONS,
  runSimulation,
  getSeverity,
  severityBorder,
  severityColor,
  type SimulationParams,
} from "@/lib/policy-hub";
import { cn } from "@/lib/cn";

export function PolicySimulator() {
  const [params, setParams] = useState<SimulationParams>(BASELINE_PARAMS);
  const result = useMemo(() => runSimulation(params), [params]);

  const updateParam = <K extends keyof SimulationParams>(
    key: K,
    value: SimulationParams[K],
  ) => setParams((p) => ({ ...p, [key]: value }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.16 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-glass-line px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-govgold/25 bg-govgold/10 text-govgold-soft">
          <Dice5 className="h-[18px] w-[18px]" />
        </span>
        <div>
          <h2 className="text-[14px] font-semibold text-slate-100">
            Policy Experimentation Sandbox
          </h2>
          <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
            Adjust parameters · visual impact matrix · real-time projection
          </p>
        </div>
        <button
          onClick={() => setParams(BASELINE_PARAMS)}
          className="ml-auto btn-ghost px-2.5 py-1.5 text-[10.5px]"
        >
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        {/* ─── LEFT: Slider controls ─── */}
        <div className="space-y-4 border-r border-glass-line p-5">
          {/* Region selector */}
          <div>
            <label className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
              <Landmark className="mr-1 inline h-3 w-3" /> Target Region
            </label>
            <select
              value={params.region}
              onChange={(e) => updateParam("region", e.target.value)}
              className="w-full rounded-lg border border-glass-line bg-night-900/80 px-3 py-2 text-[12px] text-slate-200 outline-none focus:border-accent/50"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Land pooling ratio */}
          <SliderControl
            icon={<BarChart3 className="h-3.5 w-3.5 text-accent-soft" />}
            label="Land Pooling Ratio"
            value={params.landPoolingRatio}
            min={10}
            max={90}
            step={5}
            unit="%"
            onChange={(v) => updateParam("landPoolingRatio", v)}
          />

          {/* Compensation multiplier */}
          <SliderControl
            icon={<CircleDollarSign className="h-3.5 w-3.5 text-emerald-300" />}
            label="Compensation Multiplier"
            value={params.compensationMultiplier}
            min={1}
            max={6}
            step={0.5}
            unit="×"
            onChange={(v) => updateParam("compensationMultiplier", v)}
          />

          {/* Infrastructure budget */}
          <SliderControl
            icon={<Building2 className="h-3.5 w-3.5 text-sky-300" />}
            label="Infrastructure Budget"
            value={params.infrastructureBudgetCr}
            min={500}
            max={15000}
            step={500}
            unit=" Cr"
            onChange={(v) => updateParam("infrastructureBudgetCr", v)}
          />

          {/* Consent threshold */}
          <SliderControl
            icon={<Users className="h-3.5 w-3.5 text-purple-300" />}
            label="Consent Threshold"
            value={params.consentThreshold}
            min={50}
            max={90}
            step={5}
            unit="%"
            onChange={(v) => updateParam("consentThreshold", v)}
          />

          {/* Displacement risk */}
          <SliderControl
            icon={<Scale className="h-3.5 w-3.5 text-orange-300" />}
            label="Displacement Risk Factor"
            value={params.displacementRiskFactor}
            min={0}
            max={80}
            step={5}
            unit=""
            onChange={(v) => updateParam("displacementRiskFactor", v)}
          />
        </div>

        {/* ─── RIGHT: Impact matrix ─── */}
        <div className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-govgold-soft" />
            <p className="text-[13px] font-semibold text-slate-200">
              Visual Impact Matrix — {params.region}
            </p>
          </div>

          {/* Primary metrics grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-5">
            <ImpactCard
              icon={<TrendingUp className="h-4 w-4 text-emerald-300" />}
              label="Economic Growth"
              value={`${result.economicGrowthPct}%`}
              severity={getSeverity(result.economicGrowthPct * 12)}
              barValue={Math.min(100, result.economicGrowthPct * 12)}
              barColor="bg-emerald-400"
            />
            <ImpactCard
              icon={<Activity className="h-4 w-4 text-orange-300" />}
              label="Land Dispute Likelihood"
              value={`${result.landDisputeLikelihood}%`}
              severity={getSeverity(result.landDisputeLikelihood, true)}
              barValue={100 - result.landDisputeLikelihood}
              barColor="bg-orange-400"
            />
            <ImpactCard
              icon={<Users className="h-4 w-4 text-red-300" />}
              label="Displacement Impact"
              value={`${result.displacementImpactScore}`}
              severity={getSeverity(result.displacementImpactScore, true)}
              barValue={100 - result.displacementImpactScore}
              barColor="bg-red-400"
            />
            <ImpactCard
              icon={<Zap className="h-4 w-4 text-accent-soft" />}
              label="Farmer Satisfaction"
              value={`${result.farmerSatisfactionIndex}%`}
              severity={getSeverity(result.farmerSatisfactionIndex)}
              barValue={result.farmerSatisfactionIndex}
              barColor="bg-accent"
            />
            <ImpactCard
              icon={<Building2 className="h-4 w-4 text-sky-300" />}
              label="Urbanisation Efficiency"
              value={`${result.urbanisationEfficiency}%`}
              severity={getSeverity(result.urbanisationEfficiency)}
              barValue={result.urbanisationEfficiency}
              barColor="bg-sky-400"
            />
            <ImpactCard
              icon={<Scale className="h-4 w-4 text-purple-300" />}
              label="Fiscal Sustainability"
              value={`${result.fiscalSustainabilityIndex}%`}
              severity={getSeverity(result.fiscalSustainabilityIndex)}
              barValue={result.fiscalSustainabilityIndex}
              barColor="bg-purple-400"
            />
          </div>

          {/* Bar chart visual */}
          <div className="rounded-xl border border-glass-line bg-glass/40 p-4">
            <p className="mb-3 font-mono text-[10.5px] uppercase tracking-wider text-slate-500">
              Comparative Impact Radar
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Economic Growth", value: Math.min(100, result.economicGrowthPct * 12), color: "bg-emerald-400" },
                { label: "Dispute-Free Zone", value: 100 - result.landDisputeLikelihood, color: "bg-orange-400" },
                { label: "Low Displacement", value: 100 - result.displacementImpactScore, color: "bg-red-400" },
                { label: "Farmer Satisfaction", value: result.farmerSatisfactionIndex, color: "bg-accent" },
                { label: "Urban Efficiency", value: result.urbanisationEfficiency, color: "bg-sky-400" },
                { label: "Fiscal Health", value: result.fiscalSustainabilityIndex, color: "bg-purple-400" },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-3">
                  <p className="w-36 shrink-0 text-[11px] text-slate-400 text-right">{bar.label}</p>
                  <div className="relative flex-1 h-5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(2, bar.value)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={cn("h-full rounded-full", bar.color)}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9.5px] text-slate-200">
                      {bar.value.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight callout */}
          <div className="mt-4 rounded-xl border border-govgold/25 bg-govgold/5 p-4">
            <div className="flex items-start gap-2">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-govgold-soft" />
              <div>
                <p className="text-[12px] font-semibold text-govgold-soft">
                  Simulation Insight
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-slate-300">
                  {result.economicGrowthPct > 6
                    ? `Strong economic projection (+${result.economicGrowthPct}%) — this configuration balances growth with farmer welfare. Consider reducing displacement risk below ${params.displacementRiskFactor} for optimal outcomes.`
                    : result.landDisputeLikelihood > 40
                      ? `Dispute risk remains elevated (${result.landDisputeLikelihood}%) — increase consent threshold to ${Math.min(90, params.consentThreshold + 10)}% and compensation multiplier to ${(params.compensationMultiplier + 0.5).toFixed(1)}× to reduce litigation exposure.`
                      : `Balanced configuration — economic growth at ${result.economicGrowthPct}% with manageable dispute risk. Fiscal sustainability at ${result.fiscalSustainabilityIndex}% supports long-term viability.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SliderControl({
  icon,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-slate-400">
          {icon} {label}
        </span>
        <span className="font-mono text-[12px] font-bold text-slate-200">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
      <div className="mt-0.5 flex justify-between font-mono text-[8.5px] text-slate-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function ImpactCard({
  icon,
  label,
  value,
  severity,
  barValue,
  barColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  severity: ReturnType<typeof getSeverity>;
  barValue: number;
  barColor: string;
}) {
  return (
    <div className="rounded-xl border border-glass-line bg-glass/40 p-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-[18px] font-bold text-slate-100">{value}</p>
        <span className={cn(
          "flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold",
          severityBorder(severity),
          severityColor(severity),
        )}>
          {severity}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(3, barValue)}%` }}
          transition={{ duration: 0.5 }}
          className={cn("h-full rounded-full", barColor)}
        />
      </div>
    </div>
  );
}