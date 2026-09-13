"use client";

import { cn } from "@/lib/cn";

/* ── Base skeleton primitives ── */

function Bone({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/[0.04] before:via-white/[0.06]",
        className,
      )}
      {...props}
    />
  );
}

/* ── Dashboard Metric Card Skeleton ── */

export function MetricCardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Bone className="h-9 w-9 rounded-lg" />
        <Bone className="h-2 w-2 rounded-full" />
      </div>
      <div className="space-y-2">
        <Bone className="h-3 w-28" />
        <Bone className="h-7 w-20" />
      </div>
      <div className="flex items-center gap-2">
        <Bone className="h-5 w-14 rounded-md" />
        <Bone className="h-3 w-24" />
      </div>
    </div>
  );
}

/* ── Table Row Skeleton ── */

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-glass-line px-5 py-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Bone
          key={i}
          className={cn(
            "h-4 rounded",
            i === 0 ? "w-32" : i === cols - 1 ? "w-16 ml-auto" : "w-20",
          )}
        />
      ))}
    </div>
  );
}

/* ── Risk Table Skeleton ── */

export function RiskTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <Bone className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <Bone className="h-4 w-48" />
            <Bone className="h-3 w-72" />
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-b border-glass-line flex gap-2">
        <Bone className="h-8 w-24 rounded-lg" />
        <Bone className="h-8 w-24 rounded-lg" />
        <Bone className="h-8 w-24 rounded-lg" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-glass-line/50 px-5 py-3.5">
          <Bone className="h-4 w-6 rounded" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-4 w-56" />
            <Bone className="h-3 w-36" />
          </div>
          <Bone className="h-6 w-16 rounded-full" />
          <Bone className="h-6 w-14 rounded-md" />
          <Bone className="h-6 w-14 rounded-md" />
          <Bone className="h-6 w-14 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/* ── Map / Canvas Skeleton ── */

export function MapSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <Bone className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <Bone className="h-4 w-52" />
            <Bone className="h-3 w-80" />
          </div>
        </div>
      </div>
      <div className="relative h-[480px] bg-night-850">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:28px_28px] opacity-30" />
        {/* Fake map shapes */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 480">
          <ellipse cx="300" cy="200" rx="180" ry="100" fill="rgba(52,211,153,0.06)" />
          <ellipse cx="550" cy="280" rx="140" ry="80" fill="rgba(56,189,248,0.05)" />
          <path d="M0,380 Q200,340 400,370 Q600,400 800,360 L800,480 L0,480 Z" fill="rgba(56,189,248,0.04)" />
        </svg>
        {/* Loading shimmer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            <Bone className="h-3 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Form / Card Skeleton ── */

export function FormSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Bone className="h-9 w-9 rounded-lg" />
        <div className="space-y-1.5">
          <Bone className="h-4 w-44" />
          <Bone className="h-3 w-64" />
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <div className="space-y-1.5">
          <Bone className="h-3 w-24" />
          <Bone className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Bone className="h-3 w-32" />
          <Bone className="h-10 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Bone className="h-3 w-20" />
            <Bone className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Bone className="h-3 w-28" />
            <Bone className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Gauge / Chart Skeleton ── */

export function GaugeSkeleton() {
  return (
    <div className="glass-card p-5 flex flex-col items-center">
      <Bone className="h-[120px] w-[180px] rounded-full" />
      <div className="mt-3 space-y-1.5 text-center">
        <Bone className="h-4 w-32 mx-auto" />
        <Bone className="h-3 w-48 mx-auto" />
      </div>
    </div>
  );
}

/* ── Timeline Skeleton ── */

export function TimelineSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-start">
            <div className="flex flex-col items-center">
              <Bone className="h-10 w-10 rounded-xl" />
              <div className="mt-1.5 space-y-1 text-center">
                <Bone className="h-3 w-16 mx-auto" />
                <Bone className="h-2.5 w-24 mx-auto" />
              </div>
            </div>
            {i < 4 && (
              <div className="mt-5 flex flex-1 items-center px-1">
                <Bone className="h-px w-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Full Page Skeleton (loading.tsx pattern) ── */

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      {/* Heading */}
      <div className="space-y-2">
        <Bone className="h-3 w-48" />
        <Bone className="h-7 w-80" />
        <Bone className="h-3.5 w-96" />
      </div>

      {/* Stats bar */}
      <div className="flex gap-3">
        <Bone className="h-10 w-40 rounded-xl" />
        <Bone className="h-10 w-48 rounded-xl" />
        <Bone className="h-10 w-36 rounded-xl" />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      <RiskTableSkeleton />
    </div>
  );
}
