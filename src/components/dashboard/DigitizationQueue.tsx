"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  HardDriveDownload,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { QUEUE, type QueueItem, type QueueStatus } from "@/lib/data";
import { canApprove } from "@/lib/permissions";
import { useRoleStore } from "@/store/useRoleStore";
import { ROLES } from "@/lib/roles";
import { cn } from "@/lib/cn";

const statusMeta: Record<
  QueueStatus,
  { label: string; chip: string; bar: string; icon: React.ReactNode }
> = {
  queued: {
    label: "Queued",
    chip: "bg-slate-400/10 text-slate-300 border-slate-400/25",
    bar: "bg-slate-400",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  ocr: {
    label: "OCR Vectorising",
    chip: "bg-sky-400/10 text-sky-300 border-sky-400/25",
    bar: "bg-sky-400",
    icon: <HardDriveDownload className="h-3 w-3" />,
  },
  verifying: {
    label: "Verifying",
    chip: "bg-indigo-400/10 text-indigo-300 border-indigo-400/25",
    bar: "bg-indigo-400",
    icon: <RefreshCw className="h-3 w-3 animate-[spin_1.8s_linear_infinite]" />,
  },
  approved: {
    label: "Approved",
    chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    bar: "bg-emerald-400",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  flagged: {
    label: "Flagged",
    chip: "bg-red-400/10 text-red-300 border-red-400/25",
    bar: "bg-red-400",
    icon: <TriangleAlert className="h-3 w-3" />,
  },
};

const priorityChip: Record<QueueItem["priority"], string> = {
  high: "text-red-300 border-red-400/30 bg-red-400/10",
  medium: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  low: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
};

export function DigitizationQueue() {
  const { role } = useRoleStore();
  const approver = canApprove(role);

  const inFlight = QUEUE.filter((q) => q.status !== "approved").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.24 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-400/25 bg-indigo-400/10 text-indigo-300">
            <HardDriveDownload className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              National Digitization Queue
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              Cadastral record vectorisation pipeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-glass-line bg-glass px-2.5 py-1.5 font-mono text-[10.5px] text-slate-300">
            {inFlight} in-flight · {QUEUE.length} total
          </span>
          <button className="btn-ghost px-2.5 py-1.5 text-[11px]">
            <RefreshCw className="h-3.5 w-3.5" /> Poll
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-glass-line bg-glass/40 font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-3 font-medium">Record</th>
              <th className="px-4 py-3 font-medium">District / State</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-line">
            {QUEUE.map((q) => {
              const sm = statusMeta[q.status];
              return (
                <tr key={q.id} className="transition-colors hover:bg-glass/40">
                  <td className="px-5 py-3">
                    <p className="font-mono text-[12px] font-semibold text-slate-200">{q.id}</p>
                    <p className="font-mono text-[10px] text-slate-500">Khasra {q.khasra}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12.5px] font-medium text-slate-200">{q.district}</p>
                    <p className="text-[10.5px] text-slate-500">{q.state}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-slate-300">
                    {q.areaHa.toFixed(2)} Ha
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold",
                        sm.chip,
                      )}
                    >
                      {sm.icon} {sm.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className={cn("h-full rounded-full", sm.bar)}
                          initial={{ width: 0 }}
                          animate={{ width: `${q.progress}%` }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{q.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-md border px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider",
                        priorityChip[q.priority],
                      )}
                    >
                      {q.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {approver ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          className="btn-gold px-2.5 py-1.5 text-[10.5px] disabled:opacity-40"
                          disabled={q.status === "approved"}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          Approve
                        </button>
                        <button
                          className="btn-ghost px-2.5 py-1.5 text-[10.5px]"
                          aria-label={`Inspect ${q.id}`}
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-glass-line bg-glass px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
                        <Eye className="h-3 w-3" />
                        Read-only · {ROLES.OFFICIAL.label} only
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-glass-line px-5 py-3">
        <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-600">
          Action column gated by {ROLES.OFFICIAL.label} / {ROLES.ADMIN.label} clearance
        </p>
        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Auto-refresh every 60s
        </span>
      </div>
    </motion.div>
  );
}