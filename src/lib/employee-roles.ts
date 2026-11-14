export const employeeRoles = [
  "super_admin",
  "admin",
  "manager",
  "employee",
] as const;

export type EmployeeRole = (typeof employeeRoles)[number];

export type EmployeePermission =
  | "access_dashboard"
  | "view_tasks"
  | "manage_tasks"
  | "view_projects"
  | "manage_projects"
  | "view_announcements"
  | "manage_announcements"
  | "view_calendar"
  | "manage_meetings"
  | "view_files"
  | "manage_files"
  | "view_ideas"
  | "manage_ideas"
  | "manage_employees"
  | "manage_roles";

export const dashboardSections = {
  tasks: "view_tasks",
  projects: "view_projects",
  announcements: "view_announcements",
  calendar: "view_calendar",
  files: "view_files",
  ideas: "view_ideas",
  team: "manage_employees",
  roles: "manage_roles",
} as const satisfies Record<string, EmployeePermission>;

export type DashboardSection = keyof typeof dashboardSections;

const rolePermissions: Record<EmployeeRole, readonly EmployeePermission[]> = {
  super_admin: [
    "access_dashboard",
    "view_tasks",
    "manage_tasks",
    "view_projects",
    "manage_projects",
    "view_announcements",
    "manage_announcements",
    "view_calendar",
    "manage_meetings",
    "view_files",
    "manage_files",
    "view_ideas",
    "manage_ideas",
    "manage_employees",
    "manage_roles",
  ],
  admin: [
    "access_dashboard",
    "view_tasks",
    "manage_tasks",
    "view_projects",
    "manage_projects",
    "view_announcements",
    "manage_announcements",
    "view_calendar",
    "manage_meetings",
    "view_files",
    "manage_files",
    "view_ideas",
    "manage_ideas",
    "manage_employees",
  ],
  manager: [
    "access_dashboard",
    "view_tasks",
    "manage_tasks",
    "view_projects",
    "view_announcements",
    "view_calendar",
    "manage_meetings",
    "view_files",
    "view_ideas",
    "manage_ideas",
  ],
  employee: [
    "access_dashboard",
    "view_tasks",
    "view_projects",
    "view_announcements",
    "view_calendar",
    "view_files",
    "view_ideas",
    "manage_ideas",
  ],
};

export function isEmployeeRole(value: unknown): value is EmployeeRole {
  return (
    typeof value === "string" &&
    employeeRoles.some((role) => role === value)
  );
}

export function hasEmployeePermission(
  role: EmployeeRole,
  permission: EmployeePermission,
) {
  return rolePermissions[role].includes(permission);
}

export function isDashboardSection(value: string): value is DashboardSection {
  return Object.hasOwn(dashboardSections, value);
}