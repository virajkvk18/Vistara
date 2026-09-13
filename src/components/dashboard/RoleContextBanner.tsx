"use client";

import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRoleStore } from "@/store/useRoleStore";
import { ROLES } from "@/lib/roles";

export function RoleContextBanner() {
  const { role } = useRoleStore();
  const cfg = ROLES[role];
  const isOperator = role === "OFFICIAL" || role === "ADMIN";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-glass-line bg-glass/60 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: cfg.accent }}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-night-950" />
        </span>
        <div>
          <p className="text-[12.5px] font-semibold leading-tight text-slate-100">
            Workspace: <span style={{ color: cfg.accent }}>{cfg.label}</span>
          </p>
          <p className="text-[10.5px] leading-tight text-slate-500">Clearance L{cfg.accessLevel}</p>
        </div>
      </div>
      <div className="hidden h-6 w-px bg-glass-line sm:block" />
      <p className="text-[11.5px] text-slate-400">
        {cfg.blurb}
        <span className="mx-1.5 text-slate-600">·</span>
        {isOperator ? (
          <span className="inline-flex items-center gap-1 font-medium text-emerald-300">
            <Eye className="h-3 w-3" /> Full operational workspace
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-medium text-amber-300">
            <EyeOff className="h-3 w-3" /> Restricted tabs hidden until higher clearance
          </span>
        )}
      </p>
    </div>
  );
}