import { CalendarDays, ChevronRight } from "lucide-react";
import { METRICS } from "@/lib/data";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { GisCanvas } from "@/components/dashboard/GisCanvas";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DigitizationQueue } from "@/components/dashboard/DigitizationQueue";
import { RoleContextBanner } from "@/components/dashboard/RoleContextBanner";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500">
            <span>VISTARA</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-accent-soft">Master Overview</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gradient-title">
            National Land Governance — Command Surface
          </h1>
          <p className="mt-1 text-[12.5px] text-slate-400">
            Consolidated telemetry across SIH26019 · 26018 · 26016 · 26015 · 26017 modules
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-glass-line bg-glass px-3.5 py-2">
          <CalendarDays className="h-4 w-4 text-govgold-soft" />
          <span className="font-mono text-[11.5px] text-slate-300">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Role context strip */}
      <RoleContextBanner />

      {/* Executive metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((m) => (
          <MetricCard key={m.key} metric={m} />
        ))}
      </div>

      {/* GIS + Live feed */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <GisCanvas />
        </div>
        <ActivityFeed />
      </div>

      {/* Digitization queue */}
      <DigitizationQueue />
    </div>
  );
}