"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Construction,
  Droplets,
  LockKeyhole,
  ScanEye,
  ScrollText,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useRoleStore } from "@/store/useRoleStore";
import { NAV_ITEMS } from "@/lib/roles";
import { canAccess } from "@/lib/permissions";
import { GlassCard } from "@/components/ui/GlassCard";

const ICON_MAP: Record<string, LucideIcon> = {
  book: BookOpen,
  scan: ScanEye,
  scroll: ScrollText,
  drop: Droplets,
  trend: TrendingUp,
};

interface ModulePlaceholderProps {
  href: string;
  icon: keyof typeof ICON_MAP;
  title: string;
  description: string;
}

export function ModulePlaceholder({
  href,
  icon,
  title,
  description,
}: ModulePlaceholderProps) {
  const { role } = useRoleStore();
  const item = NAV_ITEMS.find((n) => n.href === href);
  const Icon = ICON_MAP[icon];
  const allowed = item ? canAccess(role, item) : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-[1400px] space-y-6"
    >
      <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500">
        <span>VISTARA</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-accent-soft">{title}</span>
      </div>

      {allowed ? (
        <GlassCard className="flex min-h-[480px] flex-col items-center justify-center p-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 shadow-glow">
            <Icon className="h-8 w-8 text-accent-soft" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-slate-100">{title}</h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-slate-400">
            {description}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-mono text-[10.5px] tracking-wider text-accent-soft">
            <Construction className="h-3.5 w-3.5" />
            Module scaffolded — wire to problem statement deliverables
          </span>
        </GlassCard>
      ) : (
        <GlassCard className="flex min-h-[480px] flex-col items-center justify-center p-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10">
            <LockKeyhole className="h-8 w-8 text-amber-300" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-slate-100">Access restricted</h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-slate-400">
            {title} requires higher security clearance. Switch your role to{" "}
            <span className="font-semibold text-slate-200">
              {item?.minLevel === 3 ? "Department Official" : "Researcher"}
            </span>{" "}
            or above via the header role switcher to preview this workspace.
          </p>
        </GlassCard>
      )}
    </motion.div>
  );
}