"use client";

import { create } from "zustand";
import type { Role } from "@/lib/roles";

interface RoleStoreState {
  /** Active user role driving all visibility/permission decisions. */
  role: Role;
  sidebarCollapsed: boolean;
  notificationsOpen: boolean;
  setRole: (role: Role) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
}

export const useRoleStore = create<RoleStoreState>((set) => ({
  role: "OFFICIAL",
  sidebarCollapsed: false,
  notificationsOpen: false,
  setRole: (role) => set({ role }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
}));