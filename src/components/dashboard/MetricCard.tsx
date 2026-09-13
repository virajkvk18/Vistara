"use client";

import { ArrowDownRight, ArrowUpRight, LandPlot, Radio, Scale, TrendingUp } from "lucide-react";
import type { Metric } from "@/lib/data";
import { GlassCard } from "@/components/ui/GlassCard";
import { CountUp } from "@/components/ui/CountUp";
import { Sparkline } from "@/components/ui/Sparkline";
import { cn } from "@/lib/cn";

const toneConfig: Record<
  Metric["tone"],
  { color: string; glow: string; icon: React.ReactNode; chip: string }
> = {
  emerald: {
    color: "#34d399",
    glow: "shadow-[0_0_28px_rgba(52,211,153,0.14)]",
    icon: <LandPlot className="h-5 w-5" />,
    chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
  },
  indigo: {
    color: "#818cf8",
    glow: "shadow-[0_0_28px_rgba(129,140,248,0.14)]",
    icon: <Scale className="h-5 w-5" />,
    chip: "bg-indigo-400/10 text-indigo-300 border-indigo-400/25",
  },
  red: {
    color: "#f87171",
    glow: "shadow-[0_0_28px_rgba(248,113,113,0.14)]",
    icon: <Radio className="h-5 w-5" />,
    chip: "bg-red-400/10 text-red-300 border-red-400/25",
  },
  gold: {
    color: "#facc15",
    glow: "shadow-[0_0_28px_rgba(250,204,21,0.12)]",
    icon: <TrendingUp className="h-5 w-5" />,
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  },
};

export function MetricCard({ metric }: { metric: Metric }) {
  const tone = toneConfig[metric.tone];
  const positive = metric.delta >= 0;

  return (
    <GlassCard className="glass-hover p-5" glow>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border",
              tone.chip,
            )}
          >
            {tone.icon}
          </span>
          <p className="text-[12.5px] font-medium leading-tight text-slate-300">
            {metric.label}
          </p>
        </div>
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
            style={{ backgroundColor: tone.color }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: tone.color }}
          />
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline gap-1.5">
          <CountUp
            value={metric.value}
            decimals={metric.format === "area" ? 2 : 0}
            suffix={metric.suffix ? ` ${metric.suffix}` : ""}
          />
          {metric.format === "area" && <span className="sr-only">million hectares</span>}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11.5px]">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono font-semibold",
              positive
                ? "bg-emerald-400/10 text-emerald-300"
                : "bg-amber-400/10 text-amber-300",
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(metric.delta)}
            {metric.format === "area" ? "%" : ""}
          </span>
          <span className="text-slate-500">{metric.deltaLabel}</span>
        </div>
      </div>

      <div className="mt-4">
        <Sparkline data={metric.spark} color={tone.color} />
      </div>
    </GlassCard>
  );
}