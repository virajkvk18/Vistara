"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Droplets,
  Leaf,
  MapPinned,
  Mountain,
  TreePine,
} from "lucide-react";
import {
  WATERSHED_SITES,
  WATERSHED_METRICS,
  type TimePeriod,
} from "@/lib/watershed";
import { cn } from "@/lib/cn";
import { GisCanvas } from "./GisCanvas";
import { GeoTagViewer } from "./GeoTagViewer";
import { TimeSeriesPanel } from "./TimeSeriesPanel";

type ViewMode = "gis" | "imagery" | "timeseries";

export function WatershedLab() {
  const [site, setSite] = useState(WATERSHED_SITES[0]);
  const [period, setPeriod] = useState<TimePeriod>("2026");
  const [view, setView] = useState<ViewMode>("gis");

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
            <span className="text-accent-soft">Watershed & Geospatial Lab</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gradient-title">
            Geospatial & Watershed Lab
          </h1>
          <p className="mt-1 text-[12.5px] text-slate-400">
            SIH26015 — satellite-imagery driven watershed delineation, LULC classification &
            terrain analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-slate-300">
            <MapPinned className="h-3.5 w-3.5 text-emerald-300" />
            {WATERSHED_METRICS.totalAreaHa.toLocaleString()} Ha total
          </span>
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-emerald-300">
            <TreePine className="h-3.5 w-3.5" />
            {WATERSHED_METRICS.structuresBuilt} structures
          </span>
          <span className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass px-3 py-2 font-mono text-[10.5px] text-govgold-soft">
            <Leaf className="h-3.5 w-3.5" />
            NDVI +{WATERSHED_METRICS.ndviChange}
          </span>
        </div>
      </div>

      {/* Site selector + view tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-glass-line bg-glass/40 p-1 backdrop-blur-md">
          {WATERSHED_SITES.map((s) => (
            <button
              key={s}
              onClick={() => setSite(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[11.5px] font-medium transition",
                site === s
                  ? "bg-accent/15 text-accent-soft ring-1 ring-accent/40"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              {s.split("(")[0].trim()}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-glass-line" />

        <div className="flex items-center gap-1.5 rounded-xl border border-glass-line bg-glass/40 p-1 backdrop-blur-md">
          {([
            { id: "gis" as ViewMode, label: "GIS Canvas", icon: <Mountain className="h-3.5 w-3.5" /> },
            { id: "imagery" as ViewMode, label: "Field Photos", icon: <MapPinned className="h-3.5 w-3.5" /> },
            { id: "timeseries" as ViewMode, label: "Time-Series", icon: <Droplets className="h-3.5 w-3.5" /> },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-medium transition",
                view === tab.id
                  ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {view === "gis" && (
        <GisCanvas activeSite={site} activePeriod={period} onPeriodChange={setPeriod} />
      )}

      {view === "imagery" && <GeoTagViewer />}

      {view === "timeseries" && (
        <TimeSeriesPanel activeSite={site} activePeriod={period} />
      )}

      {/* Always-visible time-series strip when on GIS */}
      {view === "gis" && <TimeSeriesPanel activeSite={site} activePeriod={period} />}
    </motion.div>
  );
}