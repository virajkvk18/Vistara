"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import {
  STATES,
  THEMES,
  DOCUMENT_TYPES,
  searchRepository,
  type PolicyTheme,
  type DocumentType,
  type RepositoryEntry,
  docTypeColor,
} from "@/lib/policy-hub";
import { cn } from "@/lib/cn";

export function ResearchRepository() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All States");
  const [theme, setTheme] = useState<PolicyTheme | "all">("all");
  const [docType, setDocType] = useState<DocumentType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const results = searchRepository(query, state, theme, docType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-400/10 text-sky-300">
            <BookOpen className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Research & Legal Repository
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              {results.length} documents · case studies, judgments, gazettes & papers
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "btn-ghost px-2.5 py-1.5 text-[10.5px]",
            showFilters && "border-accent/40 text-accent-soft",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
        </button>
      </div>

      {/* Search bar */}
      <div className="border-b border-glass-line bg-glass/20 px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, abstracts, tags..."
            className="w-full rounded-xl border border-glass-line bg-night-900/80 py-2.5 pl-10 pr-4 text-[13px] text-slate-200 placeholder-slate-500 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-glass-line bg-glass/10"
        >
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
            {/* State */}
            <div>
              <label className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
                State / Region
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-glass-line bg-night-900/80 px-3 py-2 text-[12px] text-slate-200 outline-none focus:border-accent/50"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
                Policy Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as PolicyTheme | "all")}
                className="w-full rounded-lg border border-glass-line bg-night-900/80 px-3 py-2 text-[12px] text-slate-200 outline-none focus:border-accent/50"
              >
                <option value="all">All Themes</option>
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Document type */}
            <div>
              <label className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType | "all")}
                className="w-full rounded-lg border border-glass-line bg-night-900/80 px-3 py-2 text-[12px] text-slate-200 outline-none focus:border-accent/50"
              >
                <option value="all">All Types</option>
                {DOCUMENT_TYPES.map((dt) => (
                  <option key={dt.id} value={dt.id}>{dt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {state !== "All States" && (
              <FilterChip label={state} onRemove={() => setState("All States")} />
            )}
            {theme !== "all" && (
              <FilterChip
                label={THEMES.find((t) => t.id === theme)?.label ?? theme}
                onRemove={() => setTheme("all")}
              />
            )}
            {docType !== "all" && (
              <FilterChip
                label={DOCUMENT_TYPES.find((dt) => dt.id === docType)?.label ?? docType}
                onRemove={() => setDocType("all")}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="divide-y divide-glass-line">
        {results.length === 0 && (
          <div className="py-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-[13px] text-slate-400">
              No documents match your filters
            </p>
          </div>
        )}
        {results.map((entry) => (
          <RepositoryRow key={entry.id} entry={entry} />
        ))}
      </div>
    </motion.div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] text-accent-soft">
      <Tag className="h-3 w-3" />
      {label}
      <button onClick={onRemove} className="ml-0.5 text-accent-soft/60 hover:text-accent-soft">
        ×
      </button>
    </span>
  );
}

function RepositoryRow({ entry }: { entry: RepositoryEntry }) {
  return (
    <div className="group flex items-start gap-4 px-5 py-4 transition hover:bg-glass/30">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider", docTypeColor(entry.type))}>
            {entry.type.replace("-", " ")}
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            {entry.year} · {entry.state}
          </span>
        </div>
        <p className="mt-1.5 text-[13px] font-semibold text-slate-200 leading-snug group-hover:text-accent-soft transition">
          {entry.title}
        </p>
        <p className="mt-0.5 font-mono text-[10.5px] text-slate-500">
          {entry.authors}
        </p>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-400 line-clamp-2">
          {entry.abstract}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-glass-line bg-glass px-2 py-0.5 font-mono text-[9px] text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" /> {entry.downloadCount.toLocaleString()}
          </span>
          <span>{entry.citationCount} citations</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
          <button className="flex items-center gap-1 rounded-lg border border-glass-line bg-glass px-2 py-1 text-[10px] text-slate-400 hover:border-accent/40 hover:text-accent-soft">
            <Download className="h-3 w-3" /> PDF
          </button>
          <button className="flex items-center gap-1 rounded-lg border border-glass-line bg-glass px-2 py-1 text-[10px] text-slate-400 hover:border-accent/40 hover:text-accent-soft">
            <ExternalLink className="h-3 w-3" /> Cite
          </button>
        </div>
      </div>
    </div>
  );
}