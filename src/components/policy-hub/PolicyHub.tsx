"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Dice5,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { RagSearch } from "./RagSearch";
import { ResearchRepository } from "./ResearchRepository";
import { PolicySimulator } from "./PolicySimulator";
import { InnovationPortal } from "./InnovationPortal";

type ModuleTab =
  | "rag"
  | "repository"
  | "simulator"
  | "innovation";

const TABS: { id: ModuleTab; label: string; icon: React.ReactNode; code: string }[] = [
  { id: "rag", label: "AI Knowledge Assistant", icon: <Brain className="h-3.5 w-3.5" />, code: "RAG" },
  { id: "repository", label: "Research Repository", icon: <BookOpen className="h-3.5 w-3.5" />, code: "Library" },
  { id: "simulator", label: "Policy Simulator", icon: <Dice5 className="h-3.5 w-3.5" />, code: "Sandbox" },
  { id: "innovation", label: "Innovation Portal", icon: <Lightbulb className="h-3.5 w-3.5" />, code: "Hub" },
];

export function PolicyHub() {
  const [tab, setTab] = useState<ModuleTab>("rag");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-[1600px] space-y-5"
    >
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500">
            <span>VISTARA</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-accent-soft">Policy Innovation & RAG Research Hub</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gradient-title">
            Policy Innovation & RAG Research Hub
          </h1>
          <p className="mt-1 text-[12.5px] text-slate-400">
            SIH26019 — AI-powered knowledge synthesis, research repository, policy simulation & innovation workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-slate-300">
            12,400+ indexed documents
          </span>
          <span className="rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-accent-soft">
            RAG v2.3 — embedding model active
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass/40 p-1 backdrop-blur-md">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-medium transition",
                tab === t.id
                  ? "bg-accent/15 text-accent-soft ring-1 ring-accent/40"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-glass-line" />

        <span className="font-mono text-[10.5px] text-slate-500">
          {tab === "rag" && "Semantic vector search across government & academic knowledge bases"}
          {tab === "repository" && "Filterable library of case studies, judgments, gazettes & policy papers"}
          {tab === "simulator" && "Adjust policy levers and observe real-time impact projections"}
          {tab === "innovation" && "Hackathons, grants & collaborative inter-agency project workspaces"}
        </span>
      </div>

      {/* Content */}
      {tab === "rag" && <RagSearch />}
      {tab === "repository" && <ResearchRepository />}
      {tab === "simulator" && <PolicySimulator />}
      {tab === "innovation" && <InnovationPortal />}
    </motion.div>
  );
}