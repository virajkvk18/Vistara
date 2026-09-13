"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, LockKeyhole, ServerCog } from "lucide-react";
import { useRoleStore } from "@/store/useRoleStore";
import { NAV_ITEMS, ROLES } from "@/lib/roles";
import { visibleNavItems } from "@/lib/permissions";
import { cn } from "@/lib/cn";

export function Sidebar() {
  const pathname = usePathname();
  const { role, sidebarCollapsed } = useRoleStore();
  const items = visibleNavItems(role, NAV_ITEMS);
  const activeRole = ROLES[role];
  const collapsed = sidebarCollapsed;

  return (
    <aside
      className={cn(
        "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-glass-line bg-night-900/60 backdrop-blur-xl transition-[width] duration-300 lg:flex",
        collapsed ? "w-[72px]" : "w-[264px]",
      )}
    >
      {/* Active role chip */}
      <div className="px-3 pb-3 pt-4">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl border border-glass-line bg-glass px-3 py-2.5",
            collapsed && "justify-center px-0",
          )}
        >
          <span
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: activeRole.accent }}
          >
            <Activity className="h-4 w-4 text-night-950" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-night-900" />
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                key="role-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="min-w-0 overflow-hidden"
              >
                <p className="truncate text-[11px] font-semibold leading-tight text-slate-200">
                  {activeRole.label}
                </p>
                <p className="truncate font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
                  Access L{activeRole.accessLevel}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        <p
          className={cn(
            "mb-2 px-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-slate-600",
            collapsed && "sr-only",
          )}
        >
          Workspace Modules
        </p>

        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13px] font-medium transition-all duration-200",
                collapsed && "justify-center px-0",
                active
                  ? "bg-accent/15 text-white ring-1 ring-accent/40"
                  : "text-slate-400 hover:bg-glass hover:text-slate-100",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent-soft"
                />
              )}
              <Icon
                className={cn("shrink-0", active ? "text-accent-glow" : "text-slate-500 group-hover:text-slate-300")}
                size={17}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    key="nav-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="min-w-0 flex-1 overflow-hidden"
                  >
                    <span className="block truncate">{item.label}</span>
                    <span
                      className={cn(
                        "block font-mono text-[9px] tracking-wider",
                        item.code === "Home" ? "text-slate-600" : "text-accent-soft/70",
                      )}
                    >
                      {item.code}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.sensitive && (
                <span className="flex shrink-0 items-center gap-1 rounded-md border border-amber-400/25 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-amber-300">
                  <LockKeyhole className="h-2.5 w-2.5" />
                  Restricted
                </span>
              )}
            </Link>
          );
        })}

        {/* Locked items for this role */}
        {!collapsed && items.length < NAV_ITEMS.length && (
          <div className="mt-4 space-y-1 px-2">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-slate-600">
              Locked for {activeRole.label}
            </p>
            {NAV_ITEMS.filter((item) => !items.includes(item)).map((item) => (
              <div
                key={item.href}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[12px] text-slate-600"
              >
                <LockKeyhole className="h-3.5 w-3.5" />
                <span className="line-through decoration-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Footer status */}
      <div className="border-t border-glass-line p-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl border border-glass-line bg-glass px-3 py-2.5",
            collapsed && "justify-center px-0",
          )}
        >
          <ServerCog className={cn("h-4 w-4 shrink-0 text-emerald-400", collapsed && "animate-pulse")} />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                key="status-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="min-w-0 overflow-hidden"
              >
                <p className="text-[10.5px] font-medium text-slate-300">National Grid Online</p>
                <p className="font-mono text-[9px] text-slate-500">v0.1.0 · Tile sync up-to-date</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}