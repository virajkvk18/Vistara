"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BellRing,
  CheckCheck,
  ChevronDown,
  Landmark,
  Menu,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRoleStore } from "@/store/useRoleStore";
import { ROLES, ROLE_ORDER, type Role } from "@/lib/roles";
import { NOTIFICATIONS } from "@/lib/data";
import { cn } from "@/lib/cn";

const toneDot: Record<string, string> = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-sky-400",
  neutral: "bg-slate-400",
};

function NationalSeal() {
  return (
    <div className="relative h-10 w-10 shrink-0">
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-govgold-soft via-govgold to-govgold-deep blur-[2px] opacity-60" />
      <div className="relative flex h-full w-full items-center justify-center rounded-full border border-govgold/70 bg-night-900 shadow-glow-gold">
        <Landmark className="h-5 w-5 text-govgold-soft" strokeWidth={1.75} />
        <span className="absolute inset-0 rounded-full border-t-2 border-govgold/60" />
      </div>
    </div>
  );
}

export function Header() {
  const { role, setRole, notificationsOpen, setNotificationsOpen, toggleSidebar } = useRoleStore();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotificationsOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [setNotificationsOpen]);

  const activeRole = ROLES[role];
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-glass-line bg-night-950/75 px-4 backdrop-blur-xl">
      <button
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="rounded-lg border border-glass-line bg-glass p-2 text-slate-300 transition hover:border-white/20 hover:text-white"
      >
        <Menu size={18} />
      </button>

      {/* Platform identity + national seal */}
      <div className="flex min-w-0 items-center gap-3">
        <NationalSeal />
        <div className="hidden leading-tight sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-bold tracking-[0.14em] text-gradient-title">
              VISTARA
            </h1>
            <span className="rounded-md border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent-soft">
              SIH26019
            </span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            नेशनल डिजिटल इन्फ्रास्ट्रक्चर · Land Governance Grid
          </p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Role switcher */}
      <div className="relative" ref={roleRef}>
        <button
          onClick={() => {
            setRoleMenuOpen((v) => !v);
            setNotificationsOpen(false);
          }}
          className={cn(
            "group flex items-center gap-2.5 rounded-xl border border-glass-line bg-glass py-1.5 pl-1.5 pr-3 transition hover:border-white/20",
          )}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-night-950"
            style={{ backgroundColor: activeRole.accent }}
          >
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span className="hidden text-left md:block">
            <span className="block text-[10px] leading-none text-slate-500">Active role</span>
            <span className="block text-[13px] font-semibold leading-tight text-slate-100">
              {activeRole.label}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-500 transition-transform duration-200",
              roleMenuOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {roleMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-2xl border border-glass-line bg-night-850/95 shadow-card backdrop-blur-2xl"
            >
              <div className="border-b border-glass-line px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  View workspace as
                </p>
                <p className="text-[13px] font-medium text-slate-300">
                  Controls tab visibility & approval permissions
                </p>
              </div>
              <div className="p-1.5">
                {ROLE_ORDER.map((r) => {
                  const cfg = ROLES[r as Role];
                  const isActive = role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                        isActive
                          ? "bg-accent/15 ring-1 ring-accent/40"
                          : "hover:bg-glass-strong",
                      )}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: cfg.accent }}
                      >
                        <UserRound className="h-4 w-4 text-night-950" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[13px] font-semibold text-slate-100">
                          {cfg.label}
                        </span>
                        <span className="block text-[11px] text-slate-500">{cfg.blurb}</span>
                      </span>
                      {isActive && (
                        <span className="rounded-md bg-accent/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-soft">
                          active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => {
            setNotificationsOpen(!notificationsOpen);
            setRoleMenuOpen(false);
          }}
          aria-label="Notifications"
          className="relative rounded-xl border border-glass-line bg-glass p-2.5 text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-[18px] w-[18px]" />
          ) : (
            <Bell className="h-[18px] w-[18px]" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[9px] font-bold leading-none text-white ring-2 ring-night-950">
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 top-[calc(100%+10px)] w-80 overflow-hidden rounded-2xl border border-glass-line bg-night-850/95 shadow-card backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-glass-line px-4 py-3">
                <p className="text-[13px] font-semibold text-slate-200">Notifications</p>
                <button className="flex items-center gap-1 text-[11px] font-medium text-accent-soft transition hover:text-accent-glow">
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-1.5">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-3 rounded-xl px-3 py-2.5 transition hover:bg-glass-strong"
                  >
                    <span
                      className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", toneDot[n.tone])}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-[12.5px] font-semibold text-slate-200">
                          {n.title}
                        </p>
                        <span className="shrink-0 font-mono text-[10px] text-slate-500">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11.5px] leading-snug text-slate-400">{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar */}
      <div className="hidden items-center gap-2 rounded-xl border border-govgold/25 bg-govgold/5 px-2.5 py-1.5 lg:flex">
        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-govgold to-govgold-deep" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-govgold-soft">
          GoI · Nodal
        </span>
      </div>
    </header>
  );
}