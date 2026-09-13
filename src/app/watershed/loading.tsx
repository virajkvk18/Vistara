import { FormSkeleton } from "@/components/ui/Skeleton";

export default function WatershedLoading() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      {/* Heading */}
      <div className="space-y-2">
        <div className="h-3 w-64 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-7 w-96 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-3.5 w-[540px] animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-36 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-32 animate-pulse rounded-xl bg-white/[0.04]" />
      </div>

      {/* View tabs */}
      <div className="h-10 w-[500px] animate-pulse rounded-xl bg-white/[0.04]" />

      {/* Map canvas */}
      <div className="glass-card overflow-hidden">
        <div className="border-b border-glass-line px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.04]" />
            <div className="space-y-1.5">
              <div className="h-4 w-52 animate-pulse rounded bg-white/[0.04]" />
              <div className="h-3 w-80 animate-pulse rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>
        <div className="relative h-[420px] bg-night-850">
          <div className="absolute inset-0 bg-grid-pattern bg-[size:28px_28px] opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
              <div className="h-3 w-40 animate-pulse rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </div>

      {/* Time series panel */}
      <FormSkeleton />
    </div>
  );
}