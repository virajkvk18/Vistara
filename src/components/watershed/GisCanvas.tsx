"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Crosshair,
  Layers,
  MapPinned,
  Minus,
  Plus,
  Satellite,
} from "lucide-react";
import {
  GIS_LAYERS,
  type LayerId,
  type TimePeriod,
} from "@/lib/watershed";
import { cn } from "@/lib/cn";

interface GisCanvasProps {
  activeSite: string;
  activePeriod: TimePeriod;
  onPeriodChange: (p: TimePeriod) => void;
}

const W = 960;
const H = 520;

export function GisCanvas({ activeSite, activePeriod, onPeriodChange }: GisCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayers, setActiveLayers] = useState<Set<LayerId>>(
    new Set(GIS_LAYERS.filter((l) => l.defaultOn).map((l) => l.id)),
  );
  const [zoom, setZoom] = useState(1);
  const [view, setView] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const toggleLayer = (id: LayerId) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pageScale = Math.min(1.5, Math.max(0.45, 0.55 * zoom));

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragStart({ x: e.clientX - view.x, y: e.clientY - view.y });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging) setView({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onPointerUp = () => setDragging(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-glass-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <MapPinned className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Interactive GIS Canvas — Leaflet / Mapbox Placeholder
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              {activeSite} · {activePeriod} · drag to pan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg border border-glass-line bg-glass px-2.5 py-1.5 font-mono text-[10px] text-slate-300">
            <Satellite className="h-3 w-3 text-sky-300" />
            {activeLayers.size} layers active
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Layer panel */}
        <div className="hidden w-60 shrink-0 border-r border-glass-line p-3 lg:block">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-slate-500">
            <Layers className="h-3 w-3" /> Layer Control
          </p>
          <div className="space-y-1.5">
            {GIS_LAYERS.map((layer) => {
              const on = activeLayers.has(layer.id);
              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-[11.5px] transition",
                    on
                      ? "border-white/15 bg-white/5 text-slate-100"
                      : "border-transparent bg-transparent text-slate-500 hover:bg-glass hover:text-slate-300",
                  )}
                >
                  <span className="text-[13px]">{layer.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{layer.label}</p>
                    <p className="truncate text-[9.5px] text-slate-500">{layer.description}</p>
                  </div>
                  <span
                    className={cn(
                      "h-3 w-3 shrink-0 rounded-full border-2 transition",
                      on ? "border-emerald-400 bg-emerald-400" : "border-slate-500 bg-transparent",
                    )}
                    style={on ? { borderColor: layer.color, backgroundColor: layer.color } : {}}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Canvas */}
        <div className="relative min-w-0 flex-1">
          <div
            ref={containerRef}
            className="relative h-[480px] touch-none select-none overflow-hidden bg-night-850 bg-grid-pattern bg-[size:32px_32px]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className={cn(
                "absolute inset-0 h-full w-full transition-transform duration-150",
                dragging && "cursor-grabbing",
              )}
              style={{ touchAction: "none" }}
            >
              <g transform={`translate(${view.x},${view.y}) scale(${pageScale})`}>
                {/* Base terrain */}
                <rect x="0" y="0" width={W} height={H} fill="#0a1a12" />

                {/* Cadastral boundaries */}
                {activeLayers.has("cadastral") && (
                  <g stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.5">
                    {[
                      "M80,60 L240,55 L250,180 L90,190 Z",
                      "M250,50 L420,45 L430,170 L260,175 Z",
                      "M430,55 L580,50 L590,165 L440,170 Z",
                      "M590,48 L740,52 L735,160 L595,155 Z",
                      "M750,55 L900,50 L910,170 L760,165 Z",
                      "M80,195 L240,190 L250,310 L90,315 Z",
                      "M250,185 L420,180 L430,300 L260,305 Z",
                      "M430,175 L580,172 L590,290 L440,293 Z",
                      "M590,168 L740,172 L735,285 L595,280 Z",
                      "M750,170 L900,168 L910,280 L760,282 Z",
                      "M80,320 L240,315 L250,440 L90,445 Z",
                      "M250,310 L420,308 L430,430 L260,432 Z",
                      "M430,295 L580,292 L590,420 L440,423 Z",
                      "M590,288 L740,290 L735,415 L595,412 Z",
                      "M750,290 L900,288 L910,410 L760,412 Z",
                    ].map((d, i) => (
                      <path key={`cad-${i}`} d={d} fill="none" />
                    ))}
                    <g fontSize="8" fill="#818cf8" fillOpacity="0.6" fontFamily="var(--font-geist-mono)">
                      <text x="160" y="130">Khasra 452/2</text>
                      <text x="340" y="120">Khasra 1884</text>
                      <text x="510" y="115">Khasra 77/10</text>
                      <text x="670" y="120">Khasra 3401</text>
                      <text x="830" y="125">Khasra 2213</text>
                      <text x="160" y="260">Parcel B-14</text>
                      <text x="340" y="255">Parcel C-08</text>
                    </g>
                  </g>
                )}

                {/* Vegetation cover (SRISHTI-DRISHTI) */}
                {activeLayers.has("vegetation") && (
                  <g>
                    {[
                      { d: "M120,200 Q200,180 280,220 Q300,280 220,290 Q100,270 120,200", fill: "rgba(52,211,153,0.25)" },
                      { d: "M400,240 Q500,220 560,260 Q540,320 460,310 Q380,290 400,240", fill: "rgba(52,211,153,0.35)" },
                      { d: "M620,200 Q700,185 760,230 Q740,290 660,280 Q600,250 620,200", fill: "rgba(52,211,153,0.20)" },
                      { d: "M150,350 Q240,330 300,370 Q280,430 190,420 Q130,390 150,350", fill: "rgba(250,204,21,0.20)" },
                      { d: "M700,340 Q780,325 840,370 Q820,420 740,410 Q690,380 700,340", fill: "rgba(250,204,21,0.15)" },
                      { d: "M450,360 Q540,345 600,385 Q580,440 500,430 Q430,400 450,360", fill: "rgba(139,92,246,0.20)" },
                    ].map((p, i) => (
                      <path key={`veg-${i}`} d={p.d} fill={p.fill} stroke="rgba(52,211,153,0.4)" strokeWidth="0.8" />
                    ))}
                    <g fontSize="7.5" fill="#34d399" fillOpacity="0.7" fontFamily="var(--font-geist-mono)">
                      <text x="185" y="250">NDVI 0.52</text>
                      <text x="465" y="275">NDVI 0.61</text>
                      <text x="685" y="250">NDVI 0.44</text>
                    </g>
                  </g>
                )}

                {/* Drainage networks */}
                {activeLayers.has("drainage") && (
                  <g>
                    <path d="M0,80 C120,75 200,100 340,85 S520,65 680,80 S840,60 960,75" fill="none" stroke="#38bdf8" strokeWidth="3" strokeOpacity="0.6" strokeLinecap="round" />
                    <path d="M0,80 C120,75 200,100 340,85 S520,65 680,80 S840,60 960,75" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.8" />
                    <path d="M140,0 C135,80 155,140 130,220 S115,320 125,400 S140,460 135,520" fill="none" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
                    <path d="M520,0 C515,70 530,130 510,200 S495,300 505,380 S520,440 515,520" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" />
                    <path d="M800,0 C795,60 810,120 790,190 S775,280 785,360 S800,430 795,520" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeOpacity="0.4" strokeLinecap="round" />
                    <circle cx="340" cy="85" r="5" fill="#38bdf8" fillOpacity="0.6" />
                    <circle cx="520" cy="65" r="4" fill="#38bdf8" fillOpacity="0.5" />
                    <circle cx="510" cy="200" r="4" fill="#38bdf8" fillOpacity="0.5" />
                    <text x="350" y="78" fontSize="8" fill="#38bdf8" fillOpacity="0.7" fontFamily="var(--font-geist-mono)">Confluence</text>
                  </g>
                )}

                {/* Soil moisture heatmap */}
                {activeLayers.has("soil-moisture") && (
                  <g>
                    {[
                      { cx: 160, cy: 150, r: 50, color: "rgba(249,115,22,0.20)" },
                      { cx: 400, cy: 200, r: 60, color: "rgba(56,189,248,0.22)" },
                      { cx: 650, cy: 160, r: 45, color: "rgba(249,115,22,0.25)" },
                      { cx: 820, cy: 220, r: 40, color: "rgba(248,113,113,0.22)" },
                      { cx: 300, cy: 380, r: 55, color: "rgba(56,189,248,0.18)" },
                      { cx: 560, cy: 400, r: 50, color: "rgba(249,115,22,0.18)" },
                      { cx: 750, cy: 380, r: 45, color: "rgba(56,189,248,0.20)" },
                    ].map((c, i) => (
                      <circle key={`sm-${i}`} cx={c.cx} cy={c.cy} r={c.r} fill={c.color} />
                    ))}
                    <g fontSize="8" fontFamily="var(--font-geist-mono)">
                      <text x="140" y="155" fill="#f97316" fillOpacity="0.8">Dry zone</text>
                      <text x="380" y="205" fill="#38bdf8" fillOpacity="0.8">Wet zone</text>
                      <text x="630" y="165" fill="#f97316" fillOpacity="0.8">Dry zone</text>
                      <text x="800" y="225" fill="#f87171" fillOpacity="0.8">Critical</text>
                    </g>
                  </g>
                )}

                {/* Climate vulnerability */}
                {activeLayers.has("climate") && (
                  <g>
                    {[
                      { d: "M60,400 L180,390 L200,480 L80,490 Z", color: "rgba(248,113,113,0.20)" },
                      { d: "M350,410 L500,400 L520,490 L370,495 Z", color: "rgba(250,204,21,0.18)" },
                      { d: "M680,400 L850,395 L870,480 L700,485 Z", color: "rgba(248,113,113,0.22)" },
                    ].map((p, i) => (
                      <g key={`cv-${i}`}>
                        <path d={p.d} fill={p.color} stroke="rgba(248,113,113,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                      </g>
                    ))}
                    <g fontSize="8" fontFamily="var(--font-geist-mono)">
                      <text x="110" y="450" fill="#f87171" fillOpacity="0.7">Flood risk</text>
                      <text x="405" y="450" fill="#facc15" fillOpacity="0.7">Drought risk</text>
                      <text x="745" y="450" fill="#f87171" fillOpacity="0.7">Flood risk</text>
                    </g>
                  </g>
                )}

                {/* Scale */}
                <line x1="780" y1="H-20" x2="900" y2="H-20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x="840" y={H - 8} fontSize="8" fill="rgba(255,255,255,0.4)" textAnchor="middle" fontFamily="var(--font-geist-mono)">
                  5 km
                </text>
              </g>
            </svg>

            {/* Coordinate corners */}
            <span className="absolute left-4 top-4 font-mono text-[10px] text-slate-500">17.3850° N</span>
            <span className="absolute left-4 bottom-4 font-mono text-[10px] text-slate-500">78.4867° E</span>

            {/* Zoom controls */}
            <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-xl border border-glass-line bg-night-900/85 backdrop-blur-md">
              <button onClick={() => setZoom((z) => Math.min(2.8, z + 0.2))} className="p-2 text-slate-300 transition hover:bg-glass-strong hover:text-white" aria-label="Zoom in">
                <Plus className="h-4 w-4" />
              </button>
              <div className="h-px bg-glass-line" />
              <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} className="p-2 text-slate-300 transition hover:bg-glass-strong hover:text-white" aria-label="Zoom out">
                <Minus className="h-4 w-4" />
              </button>
              <div className="h-px bg-glass-line" />
              <button onClick={() => { setZoom(1); setView({ x: 0, y: 0 }); }} className="p-2 text-slate-300 transition hover:bg-glass-strong hover:text-white" aria-label="Recenter">
                <Crosshair className="h-4 w-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 rounded-xl border border-glass-line bg-night-900/90 px-3 py-2.5 backdrop-blur-md">
              <p className="mb-1.5 font-mono text-[8.5px] uppercase tracking-[0.2em] text-slate-500">Legend</p>
              <div className="space-y-1">
                {GIS_LAYERS.filter((l) => activeLayers.has(l.id)).map((l) => (
                  <div key={l.id} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: l.color }} />
                    <span className="text-[9.5px] text-slate-400">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time-series slider */}
          <div className="border-t border-glass-line bg-glass/30 px-5 py-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-slate-400">
                <CalendarDays className="h-3.5 w-3.5 text-govgold-soft" />
                Temporal layer
              </span>
              <div className="flex flex-1 items-center gap-3">
                {(["2022", "2024", "2026"] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => onPeriodChange(p)}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-center font-mono text-[11px] font-medium transition",
                      activePeriod === p
                        ? "border-accent/50 bg-accent/15 text-accent-soft"
                        : "border-glass-line bg-glass text-slate-400 hover:text-slate-200",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[9.5px] text-slate-500">
                {activePeriod === "2022" ? "Pre-intervention" : activePeriod === "2024" ? "Mid-programme" : "Current"}
              </span>
            </div>
            {/* Slider track */}
            <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-300"
                style={{ width: `${(activePeriod === "2022" ? 0 : activePeriod === "2024" ? 50 : 100)}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-1">
                {(["2022", "2024", "2026"] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => onPeriodChange(p)}
                    className={cn(
                      "h-3 w-3 rounded-full border-2 transition",
                      activePeriod === p
                        ? "border-accent bg-accent-soft scale-125"
                        : "border-slate-500 bg-night-900",
                    )}
                    aria-label={`Switch to ${p}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}