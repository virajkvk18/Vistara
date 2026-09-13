import {
  BookOpen,
  Droplets,
  Globe,
  ScanEye,
  ScrollText,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type Role = "CITIZEN" | "RESEARCHER" | "OFFICIAL" | "ADMIN";

export interface RoleConfig {
  id: Role;
  label: string;
  blurb: string;
  accessLevel: number;
  accent: string;
}

/** Access level ordering — higher = more privileged. */
export const ROLES: Record<Role, RoleConfig> = {
  CITIZEN: {
    id: "CITIZEN",
    label: "Citizen",
    blurb: "Public access to land records, policies & services",
    accessLevel: 1,
    accent: "#38bdf8",
  },
  RESEARCHER: {
    id: "RESEARCHER",
    label: "Researcher",
    blurb: "Anonymised geospatial & policy analytics access",
    accessLevel: 2,
    accent: "#a78bfa",
  },
  OFFICIAL: {
    id: "OFFICIAL",
    label: "Department Official",
    blurb: "Operational workflows, approvals & digitization tasks",
    accessLevel: 3,
    accent: "#34d399",
  },
  ADMIN: {
    id: "ADMIN",
    label: "System Admin",
    blurb: "Full platform control & national configuration",
    accessLevel: 4,
    accent: "#fbbf24",
  },
};

export const ROLE_ORDER: Role[] = ["CITIZEN", "RESEARCHER", "OFFICIAL", "ADMIN"];

/** Roles authorised to execute formal approvals. */
export const APPROVER_ROLES: Role[] = ["OFFICIAL", "ADMIN"];

/** Tabs flagged as operationally sensitive (locked for lower access levels). */
export const SENSITIVE_TABS: string[] = [
  "/acquisition",
  "/predictive-analytics",
  "/digitizer",
];

export interface NavItem {
  href: string;
  label: string;
  code: string;
  icon: LucideIcon;
  minLevel: number;
  sensitive?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Master Overview",
    code: "Home",
    icon: Globe,
    minLevel: 1,
  },
  {
    href: "/policy-hub",
    label: "Policy Innovation Hub",
    code: "SIH26019",
    icon: BookOpen,
    minLevel: 1,
  },
  {
    href: "/digitizer",
    label: "Land Digitizer & OCR",
    code: "SIH26018",
    icon: ScanEye,
    minLevel: 2,
    sensitive: true,
  },
  {
    href: "/acquisition",
    label: "Acquisition Workflow",
    code: "SIH26016",
    icon: ScrollText,
    minLevel: 3,
    sensitive: true,
  },
  {
    href: "/watershed",
    label: "Watershed & Geospatial Lab",
    code: "SIH26015",
    icon: Droplets,
    minLevel: 2,
  },
  {
    href: "/predictive-analytics",
    label: "Predictive Delay Engine",
    code: "SIH26017",
    icon: TrendingUp,
    minLevel: 3,
    sensitive: true,
  },
];