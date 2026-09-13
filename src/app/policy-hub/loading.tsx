import { FormSkeleton } from "@/components/ui/Skeleton";

export default function PolicyHubLoading() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      {/* Heading */}
      <div className="space-y-2">
        <div className="h-3 w-72 animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-7 w-[520px] animate-pulse rounded-lg bg-white/[0.04]" />
        <div className="h-3.5 w-[600px] animate-pulse rounded-lg bg-white/[0.04]" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-40 animate-pulse rounded-lg bg-white/[0.04]" />
        ))}
      </div>

      {/* Search / Content */}
      <FormSkeleton />
    </div>
  );
}