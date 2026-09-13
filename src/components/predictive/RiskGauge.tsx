"use client";

import { motion } from "framer-motion";
import { riskBand } from "@/lib/predictive";

interface RiskGaugeProps {
  score: number;
  size?: number;
}

export function RiskGauge({ score, size = 180 }: RiskGaugeProps) {
  const band = riskBand(score);
  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2 + 8;
  const startAngle = Math.PI;
  const endAngle = 0;
  const totalArc = startAngle - endAngle;
  const scoreAngle = startAngle - (score / 100) * totalArc;

  const arcPath = (angle: number, radius: number) => {
    const x = cx + radius * Math.cos(angle);
    const y = cy - radius * Math.sin(angle);
    return `${x},${y}`;
  };

  const describeArc = (radius: number) => {
    const start = startAngle;
    const end = endAngle;
    const largeArc = start - end > Math.PI ? 1 : 0;
    return `M ${arcPath(start, radius)} A ${radius} ${radius} 0 ${largeArc} 0 ${arcPath(end, radius)}`;
  };

  const needleX = cx + (r - 4) * Math.cos(scoreAngle);
  const needleY = cy - (r - 4) * Math.sin(scoreAngle);

  const gradientId = "gauge-grad";

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size * 0.62}
        viewBox={`0 0 ${size} ${size * 0.62}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="33%" stopColor="#facc15" />
            <stop offset="66%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
        </defs>

        {/* background arc */}
        <path
          d={describeArc(r)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* colored arc */}
        <motion.path
          d={describeArc(r)}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = startAngle - (tick / 100) * totalArc;
          const inner = r - 18;
          const outer = r + 18;
          return (
            <g key={tick}>
              <line
                x1={cx + inner * Math.cos(angle)}
                y1={cy - inner * Math.sin(angle)}
                x2={cx + outer * Math.cos(angle)}
                y2={cy - outer * Math.sin(angle)}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              <text
                x={cx + (outer + 10) * Math.cos(angle)}
                y={cy - (outer + 10) * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-500"
                fontSize="9"
                fontFamily="var(--font-geist-mono)"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={band.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ x2: cx, y2: cy }}
          animate={{ x2: needleX, y2: needleY }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <circle cx={cx} cy={cy} r="5" fill={band.color} />
        <circle cx={cx} cy={cy} r="2.5" fill="#070a13" />

        {/* center score */}
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          className="fill-slate-100"
          fontSize="22"
          fontWeight="700"
          fontFamily="var(--font-geist-mono)"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 35}
          textAnchor="middle"
          className="fill-slate-500"
          fontSize="9"
          fontFamily="var(--font-geist-mono)"
          letterSpacing="0.15em"
        >
          RISK SCORE
        </text>
      </svg>

      <span
        className="mt-1 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider"
        style={{
          borderColor: `${band.color}40`,
          backgroundColor: `${band.color}15`,
          color: band.color,
        }}
      >
        {band.label}
      </span>
    </div>
  );
}