import {
  MetricCardSkeleton,
  MapSkeleton,
} from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-5">
      {/* Heading skeleton */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-48 animate-pulse rounded-lg bg-white/[0.04]" />
          <div className="h-7 w-80 animate-pulse rounded-lg bg-white/[0.04]" />
          <div className="h-3.5 w-96 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>
        <div className="h-10 w-44 animate-pulse rounded-xl bg-white/[0.04]" />
      </div>

      {/* Role banner skeleton */}
      <div className="h-12 w-full animate-pulse rounded-xl bg-white/[0.04]" />

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      {/* GIS + Feed */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MapSkeleton />
        </div>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-glass-line px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.04]" />
              <div className="space-y-1.5">
                <div className="h-4 w-36 animate-pulse rounded bg-white/[0.04]" />
                <div className="h-3 w-52 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-2 w-2 mt-1.5 animate-pulse rounded-full bg-white/[0.06]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-full animate-pulse rounded bg-white/[0.04]" />
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}