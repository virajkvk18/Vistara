import { FormSkeleton } from "@/components/ui/Skeleton";

export default function AcquisitionLoading() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      {/* Heading */}
      <div className="space-y-2">
        <div className="h-3 w-52 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-7 w-72 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-3.5 w-[620px] animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* Stats bar */}
      <div className="flex gap-3">
        <div className="h-10 w-44 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-56 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-40 animate-pulse rounded-xl bg-white/[0.04]" />
      </div>

      {/* Pipeline */}
      <div className="glass-card overflow-hidden">
        <div className="border-b border-glass-line px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-white/[0.04]" />
            <div className="space-y-1.5">
              <div className="h-4 w-52 animate-pulse rounded bg-white/[0.04]" />
              <div className="h-3 w-72 animate-pulse rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="h-12 w-full max-w-[120px] animate-pulse rounded-xl bg-white/[0.04]" />
                <div className="h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <FormSkeleton />
    </div>
  );
}