"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  CircleCheckBig,
  Clock,
  Gavel,
  Hash,
  Landmark,
  Wallet,
} from "lucide-react";
import {
  familiesForProject,
  type AffectedFamily,
  type AcquisitionProject,
} from "@/lib/acquisition";
import { cn } from "@/lib/cn";

const disputeMeta: Record<
  AffectedFamily["disputeStatus"],
  { label: string; chip: string; icon: React.ReactNode }
> = {
  none: {
    label: "None",
    chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    icon: <CircleCheckBig className="h-3 w-3" />,
  },
  pending: {
    label: "Pending",
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    icon: <Clock className="h-3 w-3" />,
  },
  resolved: {
    label: "Resolved",
    chip: "bg-sky-400/10 text-sky-300 border-sky-400/25",
    icon: <BadgeCheck className="h-3 w-3" />,
  },
  litigation: {
    label: "In litigation",
    chip: "bg-red-400/10 text-red-300 border-red-400/25",
    icon: <Gavel className="h-3 w-3" />,
  },
};

interface DisbursementLedgerProps {
  project: AcquisitionProject;
}

export function DisbursementLedger({ project }: DisbursementLedgerProps) {
  const families = familiesForProject(project.id);
  const totalAssessed = families.reduce((s, f) => s + f.compensationAssessedLakhs, 0);
  const totalDisbursed = families.reduce((s, f) => s + f.compensationDisbursedLakhs, 0);
  const totalRr = families.reduce((s, f) => s + f.rrPackageLakhs, 0);

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
            <Banknote className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-100">
              Affected Families & Disbursement Ledger
            </h2>
            <p className="font-mono text-[10.5px] tracking-wide text-slate-500">
              {project.code} · {families.length} families enumerated
            </p>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-3 border-b border-glass-line bg-glass/30 px-5 py-3">
        {[
          {
            icon: <Wallet className="h-4 w-4 text-amber-300" />,
            label: "Total assessed",
            value: `₹${totalAssessed.toFixed(1)} L`,
          },
          {
            icon: <Banknote className="h-4 w-4 text-emerald-300" />,
            label: "Disbursed",
            value: `₹${totalDisbursed.toFixed(1)} L`,
          },
          {
            icon: <Landmark className="h-4 w-4 text-sky-300" />,
            value: `₹${totalRr.toFixed(1)} L`,
            label: "R&R packages",
          },
          {
            icon: <Hash className="h-4 w-4 text-slate-400" />,
            label: "Completion",
            value: `${Math.round((totalDisbursed / totalAssessed) * 100)}%`,
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-lg border border-glass-line bg-glass px-3 py-2">
            {item.icon}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                {item.label}
              </p>
              <p className="text-[12.5px] font-semibold text-slate-200">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="border-b border-glass-line bg-glass/40 font-mono text-[9.5px] uppercase tracking-[0.18em] text-slate-500">
              <th className="px-5 py-3 font-medium">Family</th>
              <th className="px-4 py-3 font-medium">Village</th>
              <th className="px-4 py-3 font-medium">Land</th>
              <th className="px-4 py-3 font-medium">Assessed</th>
              <th className="px-4 py-3 font-medium">Disbursed</th>
              <th className="px-4 py-3 font-medium">R&R</th>
              <th className="px-4 py-3 font-medium">Dispute</th>
              <th className="px-5 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-line">
            {families.map((f) => {
              const dm = disputeMeta[f.disputeStatus];
              const pct = f.compensationAssessedLakhs
                ? (f.compensationDisbursedLakhs / f.compensationAssessedLakhs) * 100
                : 0;
              return (
                <tr key={f.id} className="transition-colors hover:bg-glass/40">
                  <td className="px-5 py-3">
                    <p className="text-[12.5px] font-semibold text-slate-200">{f.name}</p>
                    <p className="font-mono text-[10px] text-slate-500">{f.headOfHouse}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-300">{f.village}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-[12px] text-slate-300">{f.landHeldHa} Ha</p>
                    <p className="text-[10.5px] text-slate-500">{f.landType}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-slate-300">
                    ₹{f.compensationAssessedLakhs} L
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-[12px] text-slate-300">
                      ₹{f.compensationDisbursedLakhs} L
                    </p>
                    <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-white/8">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          pct >= 100
                            ? "bg-emerald-400"
                            : pct > 0
                              ? "bg-amber-400"
                              : "bg-slate-500",
                        )}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-slate-300">
                    ₹{f.rrPackageLakhs} L
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold",
                        dm.chip,
                      )}
                    >
                      {dm.icon} {dm.label}
                    </span>
                  </td>
                  <td className="max-w-[180px] px-5 py-3">
                    {f.disputeNote ? (
                      <p className="text-[10.5px] leading-snug text-slate-400">
                        {f.disputeNote}
                      </p>
                    ) : (
                      <span className="text-[10.5px] text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-glass-line bg-glass/50 font-mono text-[10.5px]">
              <td className="px-5 py-2.5 font-semibold text-slate-300">
                {families.length} families
              </td>
              <td colSpan={2} />
              <td className="px-4 py-2.5 font-semibold text-slate-200">
                ₹{totalAssessed.toFixed(1)} L
              </td>
              <td className="px-4 py-2.5 font-semibold text-emerald-300">
                ₹{totalDisbursed.toFixed(1)} L
              </td>
              <td className="px-4 py-2.5 font-semibold text-sky-300">
                ₹{totalRr.toFixed(1)} L
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
}