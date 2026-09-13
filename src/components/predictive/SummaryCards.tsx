"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";

interface SummaryCardsProps {
  highRiskCount: number;
  totalSlippageCr: number;
  avgBottleneckDays: number;
}

const cards = [
  {
    key: "high-risk",
    label: "High-Risk Projects",
    tone: "red" as const,
    icon: <AlertTriangle className="h-5 w-5" />,
    suffix: "",
    delta: "+2",
    deltaDir: "up" as const,
    deltaLabel: "since last quarter",
  },
  {
    key: "slippage",
    label: "Est. Financial Slippage",
    tone: "amber" as const,
    icon: <IndianRupee className="h-5 w-5" />,
    prefix: "₹",
    suffix: " Cr",
    delta: "650.8",
    deltaDir: "up" as const,
    deltaLabel: "cumulative exposure",
  },
  {
    key: "bottleneck",
    label: "Avg. Stage Bottleneck",
    tone: "indigo" as const,
    baseLabel: "days",
    icon: <Clock className="h-5 w-5" />,
    suffix: " days",
    delta: "-12",
    deltaDir: "down" as const,
    deltaLabel: "improved cycle time",
  },
  {
    key: "coverage",
    label: "Model Coverage",
    tone: "emerald" as const,
    icon: <TrendingUp className="h-5 w-5" />,
    suffix: "%",
    delta: "97.2%",
    deltaDir: "up" as const,
    deltaLabel: "risk factor coverage",
  },
];

const toneStyles: Record<string, { chip: string; glow: string }> = {
  red: {
    chip: "bg-red-400/10 text-red-300 border-red-400/25",
    glow: "shadow-[0_0_28px_rgba(248,113,113,0.14)]",
  },
  amber: {
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    glow: "shadow-[0_0_28px_rgba(245,158,11,0.14)]",
  },
  indigo: {
    chip: "bg-indigo-400/10 text-indigo-300 border-indigo-400/25",
    glow: "shadow-[0_0_28px_rgba(129,140,248,0.14)]",
  },
  emerald: {
    chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    glow: "shadow-[0_0_28px_rgba(52,211,153,0.14)]",
  },
};

export function SummaryCards({
  highRiskCount,
  totalSlippageCr,
  avgBottleneckDays,
}: SummaryCardsProps) {
  const vals: Record<string, string> = {
    "high-risk": String(highRiskCount),
    slippage: totalSlippageCr.toFixed(1),
    bottleneck: String(avgBottleneckDays),
    coverage: "97.2",
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c, i) => {
        const t = toneStyles[c.tone];
        return (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <GlassCard className={cn("glass-hover p-5", t.glow)}>
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border",
                    t.chip,
                  )}
                >
                  {c.icon}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 bg-current" style={{ color: c.tone === "red" ? "#f87171" : c.tone === "amber" ? "#facc15" : c.tone === "indigo" ? "#818cf8" : "#34d399" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" style={{ color: c.tone === "red" ? "#f87171" : c.tone === "amber" ? "#facc15" : c.tone === "indigo" ? "#818cf8" : "#34d399" }} />
                </span>
              </div>
              <p className="mt-4 text-[12.5px] font-medium text-slate-300">{c.label}</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-50">
                  {c.prefix ?? ""}{vals[c.key]}{c.suffix}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-mono font-semibold",
                    c.deltaDir === "up"
                      ? "bg-red-400/10 text-red-300"
                      : "bg-emerald-400/10 text-emerald-300",
                  )}
                >
                  {c.deltaDir === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {c.delta}
                </span>
                <span className="text-slate-500">{c.deltaLabel}</span>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}