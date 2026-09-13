import { RiskTableSkeleton, GaugeSkeleton, FormSkeleton } from "@/components/ui/Skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      {/* Heading */}
      <div className="space-y-2">
        <div className="h-3 w-56 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-7 w-80 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-3.5 w-[500px] animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.04]" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-white/[0.06]" />
            </div>
            <div className="h-3 w-28 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-7 w-16 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-4 w-20 animate-pulse rounded-md bg-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* Risk table */}
      <RiskTableSkeleton rows={6} />

      {/* Detail section */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <GaugeSkeleton />
        <FormSkeleton />
      </div>
    </div>
  );
}