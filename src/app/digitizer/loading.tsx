import { FormSkeleton } from "@/components/ui/Skeleton";

export default function DigitizerLoading() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-5">
      {/* Heading */}
      <div className="space-y-2">
        <div className="h-3 w-44 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-7 w-72 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-3.5 w-[540px] animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* Status bar */}
      <div className="flex gap-3">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-52 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-44 animate-pulse rounded-xl bg-white/[0.04]" />
      </div>

      {/* Permission strip */}
      <div className="h-12 w-full animate-pulse rounded-xl bg-white/[0.04]" />

      {/* Two-column workspace */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">
        {/* Document viewer skeleton */}
        <div className="glass-card overflow-hidden">
          <div className="border-b border-glass-line px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.04]" />
              <div className="space-y-1.5">
                <div className="h-4 w-44 animate-pulse rounded bg-white/[0.04]" />
                <div className="h-3 w-56 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>
          <div className="relative h-[640px] bg-night-850">
            <div className="absolute inset-0 bg-grid-pattern bg-[size:28px_28px] opacity-30" />
            <div className="absolute inset-6 flex items-center justify-center rounded-2xl border-2 border-dashed border-glass-line bg-glass/20">
              <div className="flex flex-col items-center gap-3">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-white/[0.04]" />
                <div className="h-4 w-48 animate-pulse rounded bg-white/[0.04]" />
                <div className="h-3 w-64 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>
        </div>

        {/* Extraction form skeleton */}
        <FormSkeleton />
      </div>
    </div>
  );
}