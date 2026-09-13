"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  ExternalLink,
  Play,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  RAG_QUERIES,
  type RagCitation,
  type RagResult,
  docTypeColor,
} from "@/lib/policy-hub";
import { cn } from "@/lib/cn";

const SUGGESTED_QUERIES = [
  "Impact of land pooling on peri-urban development in India",
  "Compensation adequacy under R&R policies for large infrastructure projects",
  "Digital land records and Aadhaar-linked property registries: privacy implications",
];

export function RagSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<RagResult | null>(null);

  const handleSearch = (q: string) => {
    setQuery(q);
    setLoading(true);
    setActiveResult(null);
    setTimeout(() => {
      const match = RAG_QUERIES.find(
        (r) => r.query.toLowerCase() === q.toLowerCase(),
      );
      setActiveResult(match ?? RAG_QUERIES[0]);
      setLoading(false);
      toast.success("RAG search complete", {
        description: `${(match ?? RAG_QUERIES[0]).citations.length} citations found · ${(match ?? RAG_QUERIES[0]).confidence * 100}% confidence`,
      });
    }, 600);
  };

  const handleDemo = () => {
    const demoQuery = SUGGESTED_QUERIES[0];
    toast.info("Demo mode — running ideal RAG query");
    handleSearch(demoQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-glass-line px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent-soft">
          <Brain className="h-[18px] w-[18px]" />
        </span>
        <div>
          <h2 className="text-[14px] font-semibold text-slate-100">
            AI Knowledge Assistant
          </h2>
          <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
            RAG-powered vector search · academic & government knowledge base
          </p>
        </div>
        {activeResult && (
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] text-emerald-300">
            <Sparkles className="h-3 w-3" />
            {activeResult.confidence * 100}% confidence
          </span>
        )}
        <button
          onClick={handleDemo}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-[10.5px] text-accent-soft transition hover:bg-accent/20 disabled:opacity-50"
        >
          <Play className="h-3 w-3" /> Demo
        </button>
      </div>

      {/* Search bar */}
      <div className="border-b border-glass-line bg-glass/20 px-5 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && query.trim() && handleSearch(query)}
            placeholder="Ask about land policy, compensation, digitisation..."
            className="w-full rounded-xl border border-glass-line bg-night-900/80 py-3 pl-10 pr-32 text-[13px] text-slate-200 placeholder-slate-500 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
          />
          <button
            onClick={() => query.trim() && handleSearch(query)}
            disabled={!query.trim() || loading}
            className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-[11px]"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Searching...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Zap className="h-3 w-3" /> Search
              </span>
            )}
          </button>
        </div>

        {/* Suggested queries */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[10.5px] text-slate-500">Try:</span>
          {SUGGESTED_QUERIES.map((sq) => (
            <button
              key={sq}
              onClick={() => handleSearch(sq)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-[10.5px] transition",
                query === sq
                  ? "border-accent/40 bg-accent/10 text-accent-soft"
                  : "border-glass-line bg-glass text-slate-400 hover:border-white/20 hover:text-slate-200",
              )}
            >
              {sq.length > 45 ? sq.slice(0, 45) + "..." : sq}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 py-12"
          >
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            <span className="text-[12px] text-slate-400">
              Querying vector embeddings across 12,400 documents...
            </span>
          </motion.div>
        )}

        {!loading && activeResult && (
          <motion.div
            key={activeResult.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5"
          >
            {/* AI Summary */}
            <div className="mb-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent-soft" />
                <p className="text-[12.5px] font-semibold text-accent-soft">
                  AI-Synthesised Summary
                </p>
                <span className="ml-auto flex items-center gap-1 font-mono text-[9.5px] text-slate-500">
                  <Clock className="h-3 w-3" /> {activeResult.responseTimeMs}ms
                </span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-slate-300">
                {activeResult.summary}
              </p>
            </div>

            {/* Citations */}
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-slate-400" />
              <p className="text-[12.5px] font-semibold text-slate-200">
                Inline Citations ({activeResult.citations.length})
              </p>
            </div>
            <div className="space-y-3">
              {activeResult.citations.map((cit) => (
                <CitationCard key={cit.id} citation={cit} />
              ))}
            </div>
          </motion.div>
        )}

        {!loading && !activeResult && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <Brain className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-[13px] text-slate-400">
              Enter a query to search across 12,400 indexed documents
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Covers academic papers, government gazettes, legal judgments & policy briefs
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CitationCard({ citation }: { citation: RagCitation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-glass-line bg-glass/40 p-3 transition hover:border-white/15">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider", docTypeColor(citation.type))}>
              {citation.type.replace("-", " ")}
            </span>
            <span className="font-mono text-[9.5px] text-slate-500">
              {citation.authors} ({citation.year})
            </span>
          </div>
          <p className="mt-1.5 text-[12.5px] font-semibold text-slate-200 leading-snug">
            {citation.title}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-slate-500">
            {citation.source}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="rounded-md border border-glass-line bg-glass px-2 py-0.5 font-mono text-[9px] text-slate-400">
            {(citation.relevanceScore * 100).toFixed(0)}% match
          </span>
        </div>
      </div>

      {/* Snippet */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 flex items-center gap-1 text-[10.5px] text-slate-500 hover:text-slate-300 transition"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {expanded ? "Hide" : "Show"} excerpt
      </button>
      {expanded && (
        <div className="mt-2 rounded-lg border border-glass-line bg-glass/60 p-2.5">
          <p className="text-[11.5px] leading-relaxed text-slate-300 italic">
            &ldquo;{citation.snippet}&rdquo;
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-2 flex items-center gap-2">
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-lg border border-glass-line bg-glass px-2.5 py-1 text-[10.5px] text-slate-400 transition hover:border-accent/40 hover:text-accent-soft"
        >
          <ExternalLink className="h-3 w-3" /> Open Source
        </a>
        <button className="flex items-center gap-1 rounded-lg border border-glass-line bg-glass px-2.5 py-1 text-[10.5px] text-slate-400 transition hover:border-accent/40 hover:text-accent-soft">
          <Download className="h-3 w-3" /> Download PDF
        </button>
      </div>
    </div>
  );
}