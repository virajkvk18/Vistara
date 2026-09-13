"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-night-950 text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-radial-accent" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.6] bg-grid-pattern bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
        aria-hidden
      />

      <Header />

      <div className="relative flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}