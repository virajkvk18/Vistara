"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  ChevronRight,
  Droplets,
  Leaf,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { TIME_SERIES, type TimePeriod } from "@/lib/watershed";
import { cn } from "@/lib/cn";

interface TimeSeriesPanelProps {
  activeSite: string;
  activePeriod: TimePeriod;
}

export function TimeSeriesPanel({ activeSite, activePeriod }: TimeSeriesPanelProps) {
  const snapshots = TIME_SERIES[activeSite] || [];
  const current = snapshots.find((s) => s.period === activePeriod);
  const baseline = snapshots.find((s) => s.period === "2022");

  if (!current || !baseline) return null;

  const ndviDelta = current.ndviMean - baseline.ndviMean;
  const coverDelta = current.vegetationCoverPct - baseline.vegetationCoverPct;
  const moistureDelta = current.soilMoistureAnomaly - baseline.soilMoistureAnomaly;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-govgold/25 bg-govgold/10 text-govgold-soft">
            <BarChart3 className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Watershed Time-Series Analysis
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              {activeSite} · baseline (2022) → {current.label}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider",
            current.degradationRisk === "Critical"
              ? "border-red-400/30 bg-red-400/10 text-red-300"
              : current.degradationRisk === "High"
                ? "border-orange-400/30 bg-orange-400/10 text-orange-300"
                : current.degradationRisk === "Moderate"
                  ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                  : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
          )}
        >
          {current.degradationRisk} risk
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 p-5 lg:grid-cols-4">
        <MetricBox
          icon={<Leaf className="h-4 w-4 text-emerald-300" />}
          label="Mean NDVI"
          value={current.ndviMean.toFixed(2)}
          delta={ndviDelta > 0 ? `+${ndviDelta.toFixed(2)}` : ndviDelta.toFixed(2)}
          deltaPositive={ndviDelta > 0}
          sparkColor="#34d399"
          allValues={snapshots.map((s) => s.ndviMean)}
        />
        <MetricBox
          icon={<Sprout className="h-4 w-4 text-green-300" />}
          label="Vegetation Cover"
          value={`${current.vegetationCoverPct}%`}
          delta={coverDelta > 0 ? `+${coverDelta.toFixed(1)}%` : `${coverDelta.toFixed(1)}%`}
          deltaPositive={coverDelta > 0}
          sparkColor="#22c55e"
          allValues={snapshots.map((s) => s.vegetationCoverPct)}
        />
        <MetricBox
          icon={<Droplets className="h-4 w-4 text-sky-300" />}
          label="Soil Moisture Anomaly"
          value={current.soilMoistureAnomaly > 0 ? `+${current.soilMoistureAnomaly}` : String(current.soilMoistureAnomaly)}
          delta={moistureDelta > 0 ? `+${moistureDelta.toFixed(2)}` : moistureDelta.toFixed(2)}
          deltaPositive={moistureDelta > 0}
          sparkColor="#38bdf8"
          allValues={snapshots.map((s) => s.soilMoistureAnomaly)}
        />
        <MetricBox
          icon={<TrendingUp className="h-4 w-4 text-govgold-soft" />}
          label="Water Bodies"
          value={String(current.waterBodies)}
          delta={`${current.waterBodies - baseline.waterBodies}`}
          deltaPositive={current.waterBodies > baseline.waterBodies}
          sparkColor="#eab308"
          allValues={snapshots.map((s) => s.waterBodies)}
        />
      </div>

      {/* Timeline */}
      <div className="border-t border-glass-line px-5 py-4">
        <div className="flex items-start gap-0">
          {snapshots.map((s, i) => {
            const active = s.period === activePeriod;
            const improvement = s.period !== "2022";
            return (
              <div key={s.period} className="flex flex-1 items-start">
                <div className={cn("flex flex-col items-center text-center", active && "scale-105")}>
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border-2 font-mono text-[11px] font-bold transition",
                      active ? "border-accent/60 bg-accent/15 text-accent-soft" : "border-glass-line bg-glass text-slate-500",
                    )}
                  >
                    {s.period.slice(2)}
                  </div>
                  <div className="mt-1.5 max-w-[130px] leading-tight">
                    <p className={cn("text-[10.5px] font-semibold", active ? "text-slate-200" : "text-slate-500")}>
                      {s.label}
                    </p>
                    <p className="font-mono text-[9px] text-slate-500">{s.intervention}</p>
                    {improvement && (
                      <p className="mt-1 font-mono text-[8.5px] text-emerald-400">
                        NDVI: {s.ndviMean} · Cover: {s.vegetationCoverPct}%
                      </p>
                    )}
                  </div>
                </div>
                {i < snapshots.length - 1 && (
                  <div className="mt-5 flex flex-1 items-center px-1">
                    <div className="h-px w-full bg-gradient-to-r from-glass-line to-white/10" />
                    <ChevronRight className="h-3 w-3 shrink-0 -ml-0.5 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function MetricBox({
  icon,
  label,
  value,
  delta,
  deltaPositive,
  sparkColor,
  allValues,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkColor: string;
  allValues: number[];
}) {
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const w = 60;
  const h = 20;
  const points = allValues
    .map((v, i) => {
      const x = (i / (allValues.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl border border-glass-line bg-glass/40 p-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">{label}</p>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-[18px] font-bold text-slate-100">{value}</p>
        <svg viewBox={`0 0 ${w} ${h}`} className="h-5 w-14">
          <polyline points={points} fill="none" stroke={sparkColor} strokeWidth="1.5" />
        </svg>
      </div>
      <p
        className={cn(
          "mt-1 font-mono text-[10.5px] font-semibold",
          deltaPositive ? "text-emerald-400" : "text-red-400",
        )}
      >
        {deltaPositive ? "↑" : "↓"} {delta}
        <span className="ml-1 text-[9px] text-slate-500">vs 2022</span>
      </p>
    </div>
  );
}