"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Crosshair,
  Layers,
  Locate,
  MapPinned,
  Minus,
  Plus,
  ScanLine,
  Satellite,
} from "lucide-react";
import { cn } from "@/lib/cn";

const W = 920;
const H = 560;

interface Parcel {
  id: string;
  name: string;
  d: string;
  fill: string;
  stroke: string;
  status: "verified" | "in-review" | "risk";
  centroid: [number, number];
}

const PARCELS: Parcel[] = [
  {
    id: "p1",
    name: "Khasra 452/2 · Lucknow",
    d: "M150,150 L300,140 L330,260 L210,300 L120,250 Z",
    fill: "rgba(52,211,153,0.14)",
    stroke: "#34d399",
    status: "verified",
    centroid: [220, 220],
  },
  {
    id: "p2",
    name: "Khasra 1884 · Nashik",
    d: "M420,120 L560,150 L540,240 L430,260 L400,190 Z",
    fill: "rgba(248,113,113,0.16)",
    stroke: "#f87171",
    status: "risk",
    centroid: [475, 195],
  },
  {
    id: "p3",
    name: "Khasra 77/10 · Bhopal",
    d: "M210,380 L330,360 L360,440 L250,480 L190,430 Z",
    fill: "rgba(129,140,248,0.13)",
    stroke: "#818cf8",
    status: "in-review",
    centroid: [272, 420],
  },
  {
    id: "p4",
    name: "Khasra 3401 · Patna",
    d: "M620,300 L740,280 L760,380 L660,410 L610,350 Z",
    fill: "rgba(52,211,153,0.12)",
    stroke: "#34d399",
    status: "verified",
    centroid: [682, 340],
  },
  {
    id: "p5",
    name: "Khasra 2213 · Coimbatore",
    d: "M780,160 L860,180 L850,250 L780,240 Z",
    fill: "rgba(129,140,248,0.13)",
    stroke: "#818cf8",
    status: "in-review",
    centroid: [820, 205],
  },
];

const RISK_ZONES = [
  "M440,140 Q520,130 560,180 Q540,240 470,240 Q430,210 440,140",
  "M640,340 Q700,320 730,360 Q700,410 650,395 Q630,370 640,340",
];

export function GisCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<Parcel | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });

  const zoom = (factor: number) => {
    setView((v) => ({
      ...v,
      k: Math.min(3.2, Math.max(0.6, v.k * factor)),
    }));
  };

  const reset = () => setView({ x: 0, y: 0, k: 1 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    setStart({ x: e.clientX - view.x, y: e.clientY - view.y });
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging) {
      setView((v) => ({ ...v, x: e.clientX - start.x, y: e.clientY - start.y }));
    }
  };

  const onPointerUp = () => setDragging(false);

  const onParcelHover = (parcel: Parcel) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const [cx, cy] = parcel.centroid;
    setTooltip({
      x: cx * view.k + view.x + rect.width / 2 - 460 * view.k,
      y: cy * view.k + view.y + rect.height / 2 - 280 * view.k,
    });
    setHovered(parcel);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <MapPinned className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              National Geospatial Canvas
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              Interactive GIS — Leaflet / Mapbox integration slot
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost px-2.5 py-1.5 text-[11px]">
            <Layers className="h-3.5 w-3.5" /> Layers
          </button>
          <button className="btn-ghost px-2.5 py-1.5 text-[11px]">
            <Satellite className="h-3.5 w-3.5" /> Imagery
          </button>
          <button className="btn-ghost px-2.5 py-1.5 text-[11px]">
            <Crosshair className="h-3.5 w-3.5" /> Bounds
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative h-[420px] touch-none select-none overflow-hidden bg-night-850 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:36px_36px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          setDragging(false);
          setHovered(null);
        }}
      >
        {/* scan line effect */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 animate-scan-line bg-gradient-to-b from-transparent via-emerald-400/5 to-transparent" />

        {/* fake river */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={cn(
            "absolute inset-0 h-full w-full transition-transform duration-150",
            dragging && "cursor-grabbing",
          )}
          style={{ touchAction: "none" }}
        >
          <defs>
            <linearGradient id="river" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%" stopColor="rgba(56,189,248,0.5)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0.12)" />
            </linearGradient>
            <filter id="blur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {/* river band */}
            <path
              d="M-40,400 C120,360 180,430 330,410 S560,320 700,360 S860,300 980,330"
              fill="none"
              stroke="url(#river)"
              strokeWidth="26"
              strokeLinecap="round"
              filter="url(#blur)"
            />
            <path
              d="M-40,400 C120,360 180,430 330,410 S560,320 700,360 S860,300 980,330"
              fill="none"
              stroke="rgba(56,189,248,0.55)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="1 10"
            />

            {/* watershed coverage */}
            <path
              d="M-40,430 C140,370 220,450 380,430 S620,350 780,390 S900,340 980,360 L980,560 L-40,560 Z"
              fill="rgba(129,140,248,0.07)"
            />

            {/* roads */}
            <path
              d="M-30,120 C260,140 520,90 800,130 L980,155"
              fill="none"
              stroke="rgba(226,232,240,0.35)"
              strokeWidth="9"
            />
            <path
              d="M-30,120 C260,140 520,90 800,130 L980,155"
              fill="none"
              stroke="rgba(226,232,240,0.6)"
              strokeWidth="2"
              strokeDasharray="12 8"
            />

            {/* parcels */}
            {PARCELS.map((p) => (
              <g
                key={p.id}
                onMouseEnter={() => onParcelHover(p)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <path d={p.d} fill={p.fill} stroke={p.stroke} strokeWidth="1.6" />
                {p.status === "risk" && (
                  <path
                    d={p.d}
                    fill="none"
                    stroke={p.stroke}
                    strokeWidth="2.4"
                    className="animate-pulse"
                    style={{ animationDuration: "2s" }}
                  />
                )}
              </g>
            ))}

            {/* risk zones */}
            {RISK_ZONES.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(248,113,113,0.55)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                className="animate-pulse"
                style={{ animationDuration: "2.4s", animationDelay: `${i * 0.4}s` }}
              />
            ))}
            {RISK_ZONES.map((d, i) => (
              <circle key={`c${i}`} r="4" fill="#f87171" className="animate-pulse">
                <animateMotion dur={`${3 + i * 0.6}s`} repeatCount="indefinite" path={d} />
              </circle>
            ))}

            {/* coordinate ticks */}
            {[120, 240, 360, 480, 600, 720, 840].map((x) => (
              <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}
            {[110, 220, 330, 440].map((y) => (
              <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}
          </g>
        </svg>

        {/* NEVR corners */}
        <span className="absolute left-4 top-4 font-mono text-[10px] text-slate-500">
          27.2046° N
        </span>
        <span className="absolute left-4 bottom-4 font-mono text-[10px] text-slate-500">
          79.4478° E
        </span>
        <span className="absolute right-4 top-4 font-mono text-[10px] text-slate-500">
          Scale 1 : 50,000
        </span>

        {/* legend */}
        <div className="absolute bottom-4 right-4 rounded-xl border border-glass-line bg-night-900/85 px-3 py-2.5 backdrop-blur-md">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
            Legend
          </p>
          <div className="space-y-1.5">
            {[
              ["#34d399", "Verified parcel"],
              ["#818cf8", "In review"],
              ["#f87171", "High-risk zone"],
              ["#38bdf8", "River / watershed"],
            ].map(([c, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: c }} />
                <span className="text-[10.5px] text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* hover tooltip */}
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-glass-line bg-night-900/95 px-3 py-2 shadow-card backdrop-blur-md"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="font-mono text-[10.5px] font-semibold text-slate-100">{hovered.name}</p>
            <p
              className="mt-0.5 font-mono text-[9.5px] uppercase tracking-wider"
              style={{ color: hovered.stroke }}
            >
              {hovered.status === "risk"
                ? "High-risk"
                : hovered.status === "in-review"
                  ? "In review"
                  : "Verified"}
            </p>
          </div>
        )}

        {/* zoom controls */}
        <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-xl border border-glass-line bg-night-900/85 backdrop-blur-md">
          <button
            onClick={() => zoom(1.3)}
            className="p-2 text-slate-300 transition hover:bg-glass-strong hover:text-white"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <div className="h-px bg-glass-line" />
          <button
            onClick={() => zoom(0.75)}
            className="p-2 text-slate-300 transition hover:bg-glass-strong hover:text-white"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="h-px bg-glass-line" />
          <button
            onClick={reset}
            className="p-2 text-slate-300 transition hover:bg-glass-strong hover:text-white"
            aria-label="Recenter"
          >
            <Locate className="h-4 w-4" />
          </button>
        </div>

        {/* pan hint */}
        <div className="pointer-events-none absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-glass-line bg-night-900/80 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-wider text-slate-400 backdrop-blur-md">
          <ScanLine className="h-3 w-3 text-emerald-400" />
          Drag to pan · scroll to zoom placeholder
        </div>
      </div>

      {/* Footer status strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-glass-line px-5 py-3">
        <div className="flex flex-wrap gap-2">
          {["Cadastral", "Ownership", "Land Use", "Risk Index"].map((l) => (
            <span
              key={l}
              className="rounded-md border border-glass-line bg-glass px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider text-slate-400"
            >
              {l}
            </span>
          ))}
        </div>
        <p className="font-mono text-[10px] text-emerald-400">
          ● {Math.round(view.k * 100)}% zoom · {(58 + view.x / 20 + view.y / 30).toFixed(1)}M ha loaded
        </p>
      </div>
    </motion.div>
  );
}