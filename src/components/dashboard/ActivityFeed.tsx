"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  FileWarning,
  FolderLock,
  LandPlot,
  Lock,
  ScrollText,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { ACTIVITIES, type Activity, type ActivityTone } from "@/lib/data";
import { canApprove } from "@/lib/permissions";
import { useRoleStore } from "@/store/useRoleStore";
import { ROLES } from "@/lib/roles";
import { cn } from "@/lib/cn";

const toneMap: Record<
  ActivityTone,
  { icon: React.ReactNode; chip: string; bar: string }
> = {
  success: {
    icon: <BadgeCheck className="h-3.5 w-3.5" />,
    chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    bar: "bg-emerald-400",
  },
  danger: {
    icon: <FileWarning className="h-3.5 w-3.5" />,
    chip: "bg-red-400/10 text-red-300 border-red-400/25",
    bar: "bg-red-400",
  },
  info: {
    icon: <ScrollText className="h-3.5 w-3.5" />,
    chip: "bg-sky-400/10 text-sky-300 border-sky-400/25",
    bar: "bg-sky-400",
  },
  warning: {
    icon: <FolderLock className="h-3.5 w-3.5" />,
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    bar: "bg-amber-400",
  },
  neutral: {
    icon: <Waves className="h-3.5 w-3.5" />,
    chip: "bg-slate-400/10 text-slate-300 border-slate-400/25",
    bar: "bg-slate-400",
  },
};

/** Activities that formal workflow approval applies to. */
const APPROVABLE: Record<string, true> = {
  "act-3": true,
};

export function ActivityFeed() {
  const { role } = useRoleStore();
  const approver = canApprove(role);
  const roleCfg = ROLES[role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="glass-card flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-400/10 text-sky-300">
            <LandPlot className="h-[18px] w-[18px]" />
            <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-sky-400" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sky-400" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">Live Activity Feed</h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              Cross-module event stream
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wider text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="flex-1 divide-y divide-glass-line">
        {ACTIVITIES.map((a: Activity) => {
          const tone = toneMap[a.tone];
          const approvable = APPROVABLE[a.id];
          return (
            <div key={a.id} className="group flex gap-3.5 px-5 py-3.5 transition hover:bg-glass/50">
              <div className="relative flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
                    tone.chip,
                  )}
                >
                  {tone.icon}
                </span>
                <span className={cn("mt-2 w-px flex-1", tone.bar, "opacity-20")} />
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-semibold leading-snug text-slate-200">
                    {a.title}
                  </p>
                  <span className="shrink-0 font-mono text-[9.5px] text-slate-500">{a.time}</span>
                </div>
                <p className="mt-0.5 text-[11.5px] leading-snug text-slate-400">{a.detail}</p>
                <p className="mt-1 font-mono text-[9.5px] uppercase tracking-wider text-slate-600">
                  {a.source}
                </p>

                {approvable && (
                  <AnimatePresence mode="wait">
                    {approver ? (
                      <motion.div
                        key="approve"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 overflow-hidden"
                      >
                        <div className="flex gap-2">
                          <button className="btn-gold px-3 py-1.5 text-[11px]">
                            <ShieldCheck className="h-3.5 w-3.5" /> Authorise
                          </button>
                          <button className="btn-ghost px-3 py-1.5 text-[11px]">Escalate</button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 flex items-center gap-1.5 rounded-lg border border-glass-line bg-glass px-2.5 py-1.5 text-[10.5px] text-slate-500"
                      >
                        <Lock className="h-3 w-3" />
                        Approvals restricted — requires {ROLES.OFFICIAL.label} clearance
                      </motion.p>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-glass-line px-5 py-2.5">
        <p className="font-mono text-[9.5px] uppercase tracking-wider text-slate-600">
          Viewing as {roleCfg.label} · approvals {approver ? "enabled" : "hidden"}
        </p>
      </div>
    </motion.div>
  );
}