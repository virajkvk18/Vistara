"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  ExternalLink,
  Flame,
  FolderKanban,
  GraduationCap,
  Lightbulb,
  Trophy,
  Users,
} from "lucide-react";
import {
  INNOVATIONS,
  type InnovationItem,
  type InnovationType,
  innovationTypeColor,
  innovationStatusColor,
} from "@/lib/policy-hub";
import { cn } from "@/lib/cn";

type FilterType = "all" | InnovationType;

export function InnovationPortal() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items = filter === "all" ? INNOVATIONS : INNOVATIONS.filter((i) => i.type === filter);

  const stats = {
    hackathons: INNOVATIONS.filter((i) => i.type === "hackathon").length,
    grants: INNOVATIONS.filter((i) => i.type === "grant").length,
    projects: INNOVATIONS.filter((i) => i.type === "project").length,
    totalParticipants: INNOVATIONS.reduce((sum, i) => sum + i.participants, 0),
    totalFunding: INNOVATIONS.reduce((sum, i) => sum + (i.prizeCr ?? i.fundingCr ?? 0), 0),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-400/25 bg-purple-400/10 text-purple-300">
            <Lightbulb className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Innovation Portal & Workspace
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              Hackathons, research grants & collaborative project workspaces
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 border-b border-glass-line p-4 sm:grid-cols-4">
        <div className="rounded-xl border border-glass-line bg-glass/40 p-3 text-center">
          <Flame className="mx-auto h-4 w-4 text-orange-300" />
          <p className="mt-1 text-[16px] font-bold text-slate-100">{stats.hackathons}</p>
          <p className="font-mono text-[9.5px] text-slate-500">Active Hackathons</p>
        </div>
        <div className="rounded-xl border border-glass-line bg-glass/40 p-3 text-center">
          <GraduationCap className="mx-auto h-4 w-4 text-emerald-300" />
          <p className="mt-1 text-[16px] font-bold text-slate-100">{stats.grants}</p>
          <p className="font-mono text-[9.5px] text-slate-500">Research Grants</p>
        </div>
        <div className="rounded-xl border border-glass-line bg-glass/40 p-3 text-center">
          <FolderKanban className="mx-auto h-4 w-4 text-sky-300" />
          <p className="mt-1 text-[16px] font-bold text-slate-100">{stats.projects}</p>
          <p className="font-mono text-[9.5px] text-slate-500">Active Projects</p>
        </div>
        <div className="rounded-xl border border-glass-line bg-glass/40 p-3 text-center">
          <Trophy className="mx-auto h-4 w-4 text-govgold-soft" />
          <p className="mt-1 text-[16px] font-bold text-slate-100">
            {stats.totalFunding} Cr
          </p>
          <p className="font-mono text-[9.5px] text-slate-500">Total Funding Pool</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-glass-line px-5 py-3">
        {([
          { id: "all" as FilterType, label: "All", icon: <Lightbulb className="h-3.5 w-3.5" /> },
          { id: "hackathon" as FilterType, label: "Hackathons", icon: <Flame className="h-3.5 w-3.5" /> },
          { id: "grant" as FilterType, label: "Grants", icon: <GraduationCap className="h-3.5 w-3.5" /> },
          { id: "project" as FilterType, label: "Projects", icon: <FolderKanban className="h-3.5 w-3.5" /> },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-medium transition",
              filter === tab.id
                ? "bg-accent/15 text-accent-soft ring-1 ring-accent/40"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="divide-y divide-glass-line">
        {items.map((item) => (
          <InnovationRow
            key={item.id}
            item={item}
            expanded={expandedId === item.id}
            onToggle={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
          />
        ))}
      </div>
    </motion.div>
  );
}

function InnovationRow({
  item,
  expanded,
  onToggle,
}: {
  item: InnovationItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const TypeIcon = item.type === "hackathon" ? Flame : item.type === "grant" ? GraduationCap : FolderKanban;

  return (
    <div className="px-5 py-4 transition hover:bg-glass/30">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", innovationTypeColor(item.type))}>
          <TypeIcon className="h-5 w-5" />
        </span>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider", innovationTypeColor(item.type))}>
              {item.type}
            </span>
            <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider", innovationStatusColor(item.status))}>
              {item.status}
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              by {item.organizer}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] font-semibold text-slate-200 leading-snug">
            {item.title}
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400 line-clamp-2">
            {item.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-glass-line bg-glass px-2 py-0.5 font-mono text-[9px] text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats + expand */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {item.participants}/{item.maxParticipants}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {item.deadline}
            </span>
          </div>
          {(item.prizeCr || item.fundingCr) && (
            <span className="rounded-md border border-govgold/30 bg-govgold/10 px-2 py-0.5 font-mono text-[10px] font-bold text-govgold-soft">
              {item.prizeCr ? `₹${item.prizeCr} Cr Prize` : `₹${item.fundingCr} Cr Funding`}
            </span>
          )}
          <button
            onClick={onToggle}
            className="flex items-center gap-1 text-[10.5px] text-slate-500 hover:text-slate-300 transition"
          >
            {expanded ? "Less" : "Details"}
            <ChevronRight className={cn("h-3 w-3 transition", expanded && "rotate-90")} />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-3 ml-14 overflow-hidden"
        >
          <div className="rounded-xl border border-glass-line bg-glass/40 p-4">
            <div className="grid grid-cols-2 gap-4 text-[11.5px] sm:grid-cols-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Lead Agency</p>
                <p className="mt-0.5 text-slate-300">{item.leadAgency}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Deadline</p>
                <p className="mt-0.5 text-slate-300">{item.deadline}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Participation</p>
                <p className="mt-0.5 text-slate-300">
                  {item.participants} / {item.maxParticipants} ({Math.round((item.participants / item.maxParticipants) * 100)}% filled)
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Funding</p>
                <p className="mt-0.5 text-slate-300">
                  {item.prizeCr ? `₹${item.prizeCr} Cr prize pool` : item.fundingCr ? `₹${item.fundingCr} Cr grant` : "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-primary px-3 py-1.5 text-[10.5px]">
                <ExternalLink className="mr-1 h-3 w-3" /> Apply / Register
              </button>
              <button className="btn-ghost px-3 py-1.5 text-[10.5px]">
                View Workspace
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}