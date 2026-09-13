import { APPROVER_ROLES, type NavItem, type Role, ROLES } from "./roles";

/** Whether a role has enough clearance for a given nav tab. */
export function canAccess(role: Role, item: NavItem): boolean {
  return ROLES[role].accessLevel >= item.minLevel;
}

/** Whether a role may approve/authorise formal actions. */
export function canApprove(role: Role): boolean {
  return APPROVER_ROLES.includes(role);
}

/** Whether a role is an internal operator (non read-only). */
export function isOperator(role: Role): boolean {
  const kind = role as Role;
  return kind === "OFFICIAL" || kind === "ADMIN";
}

/** Visible nav items for the given role (sensitive tabs auto-hide). */
export function visibleNavItems(role: Role, items: NavItem[]): NavItem[] {
  return items.filter((item) => ROLES[role].accessLevel >= item.minLevel);
}