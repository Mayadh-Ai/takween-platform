"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import {
  dashboardSections,
  hasEmployeePermission,
  type DashboardSection,
  type EmployeeRole,
} from "@/lib/employee-roles";

type DashboardSidebarProps = {
  locale: Locale;
  role: EmployeeRole;
};

export default function DashboardSidebar({
  locale,
  role,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isArabic = locale === "ar";

  const links: {
    id: string;
    label: string;
    href: string;
    icon: string;
    permission?: DashboardSection;
  }[] = [
    {
      id: "overview",
      label: isArabic ? "نظرة عامة" : "Overview",
      href: `/${locale}/dashboard`,
      icon: "◫",
    },
    {
      id: "tasks",
      label: isArabic ? "المهام" : "Tasks",
      href: `/${locale}/dashboard/tasks`,
      icon: "✓",
      permission: "tasks",
    },
    {
      id: "projects",
      label: isArabic ? "المشاريع" : "Projects",
      href: `/${locale}/dashboard/projects`,
      icon: "◇",
      permission: "projects",
    },
    {
      id: "announcements",
      label: isArabic ? "الإعلانات" : "Announcements",
      href: `/${locale}/dashboard/announcements`,
      icon: "◉",
      permission: "announcements",
    },
    {
      id: "calendar",
      label: isArabic ? "الاجتماعات والتقويم" : "Meetings & Calendar",
      href: `/${locale}/dashboard/calendar`,
      icon: "▦",
      permission: "calendar",
    },
    {
      id: "files",
      label: isArabic ? "مركز الملفات" : "File Center",
      href: `/${locale}/dashboard/files`,
      icon: "▤",
      permission: "files",
    },
    {
      id: "ideas",
      label: isArabic ? "الأفكار والاقتراحات" : "Ideas & Suggestions",
      href: `/${locale}/dashboard/ideas`,
      icon: "✳",
      permission: "ideas",
    },
    {
      id: "team",
      label: isArabic ? "الفريق" : "Team",
      href: `/${locale}/dashboard/team`,
      permission: "team",
      icon: "♧",
    },
    {
      id: "roles",
      label: isArabic ? "إدارة الأدوار" : "Role Management",
      href: `/${locale}/dashboard/roles`,
      icon: "◇",
      permission: "roles",
    },
  ];

  const visibleLinks = links.filter(
    (link) =>
      !link.permission ||
      hasEmployeePermission(role, dashboardSections[link.permission]),
  );

  const activeSection =
    pathname === `/${locale}/dashboard`
      ? "overview"
      : pathname.split("/").pop();

  return (
    <aside className="employee-sidebar">
      <Link className="wordmark employee-brand" href={`/${locale}`}>
        <span className="wordmark-symbol" aria-hidden="true">
          T
        </span>
        <span>TAKWEEN</span>
      </Link>

      <p className="employee-sidebar-label">
        {isArabic ? "مساحة العمل" : "Workspace"}
      </p>

      <nav
        className="employee-nav"
        aria-label={isArabic ? "مساحة العمل" : "Workspace"}
      >
        {visibleLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            aria-current={activeSection === link.id ? "page" : undefined}
            className={
              activeSection === link.id
                ? "employee-nav-link is-active"
                : "employee-nav-link"
            }
          >
            <span className="employee-nav-icon" aria-hidden="true">
              {link.icon}
            </span>
            {link.label}
          </Link>
        ))}
      </nav>

      <Link className="employee-sidebar-site" href={`/${locale}`}>
        {isArabic ? "العودة إلى تكوين" : "Back to TAKWEEN"}
        <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}