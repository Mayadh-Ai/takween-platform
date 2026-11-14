import { notFound, redirect } from "next/navigation";
import {
  dashboardSections,
  hasEmployeePermission,
  isDashboardSection,
} from "@/lib/employee-roles";
import { authCopy } from "@/lib/auth-copy";
import { isLocale } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentEmployeeFromProfile } from "@/lib/supabase/employee-role";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DashboardSectionPageProps = {
  params: Promise<{ locale: string; section: string }>;
};

export default async function DashboardSectionPage({
  params,
}: DashboardSectionPageProps) {
  const { locale: requestedLocale, section } = await params;
  if (!isLocale(requestedLocale) || !isDashboardSection(section)) notFound();

  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { user, role } = await getCurrentEmployeeFromProfile(supabase);
  if (!user) redirect(`/${requestedLocale}/login`);

  const copy = authCopy[requestedLocale];
  if (
    !role ||
    !hasEmployeePermission(role, dashboardSections[section])
  ) {
    return (
      <section className="dashboard-overview">
        <p className="eyebrow eyebrow-muted">{copy.dashboardLabel}</p>
        <h1>{copy.permissionDeniedTitle}</h1>
        <p className="dashboard-description">{copy.permissionDeniedDescription}</p>
      </section>
    );
  }

 let projects: {
    id: string;
    name_en: string;
    name_ar: string;
    description_en: string | null;
    description_ar: string | null;
    status: string;
    starts_at: string | null;
    due_at: string | null;
  }[] = [];

  if (section === "projects") {
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, name_en, name_ar, description_en, description_ar, status, starts_at, due_at",
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      projects = data;
    }
  }
  const sectionCopy = {
  tasks: {
    title: copy.tasks,
    description: copy.tasksModuleDescription,
  },
  projects: {
    title: requestedLocale === "ar" ? "المشاريع" : "Projects",
    description:
      requestedLocale === "ar"
        ? "متابعة مشاريع تكوين ونسب الإنجاز."
        : "Track TAKWEEN projects and their progress.",
  },
  announcements: {
    title: requestedLocale === "ar" ? "الإعلانات" : "Announcements",
    description:
      requestedLocale === "ar"
        ? "متابعة أخبار وإعلانات الشركة."
        : "Follow company news and announcements.",
  },
  calendar: {
    title: requestedLocale === "ar" ? "الاجتماعات والتقويم" : "Meetings & Calendar",
    description:
      requestedLocale === "ar"
        ? "متابعة الاجتماعات والمواعيد وطلبات الحجز."
        : "Follow meetings, appointments, and booking requests.",
  },
  files: {
    title: requestedLocale === "ar" ? "مركز الملفات" : "File Center",
    description:
      requestedLocale === "ar"
        ? "الوصول إلى ملفات ومستندات العمل."
        : "Access work files and documents.",
  },
  ideas: {
    title: requestedLocale === "ar" ? "الأفكار والاقتراحات" : "Ideas & Suggestions",
    description:
      requestedLocale === "ar"
        ? "شارك أفكارك واقتراحاتك مع الفريق."
        : "Share your ideas and suggestions with the team.",
  },
  team: {
    title: copy.team,
    description: copy.teamModuleDescription,
  },
  roles: {
    title: copy.roleManagement,
    description: copy.rolesModuleDescription,
  },
}[section];
  if (section === "projects") {
    return (
      <section className="dashboard-overview">
        <p className="eyebrow eyebrow-muted">{copy.dashboardLabel}</p>

        <h1>{requestedLocale === "ar" ? "المشاريع" : "Projects"}</h1>

        <p className="dashboard-description">
          {requestedLocale === "ar"
            ? "تابعي مشاريع تكوين ونسب الإنجاز."
            : "Track TAKWEEN projects and their progress."}
        </p>

        {projects.length === 0 ? (
          <article className="dashboard-welcome-card">
            <div>
              <h2>
                {requestedLocale === "ar"
                  ? "لا توجد مشاريع حتى الآن"
                  : "No projects yet"}
              </h2>
              <p>
                {requestedLocale === "ar"
                  ? "ستظهر المشاريع هنا عند إضافتها."
                  : "Projects will appear here when they are added."}
              </p>
            </div>
          </article>
        ) : (
          <div className="dashboard-grid">
            {projects.map((project) => (
              <article className="dashboard-welcome-card" key={project.id}>
                <div>
                  <h2>
                    {requestedLocale === "ar"
                      ? project.name_ar
                      : project.name_en}
                  </h2>

                  <p>
                    {requestedLocale === "ar"
                      ? project.description_ar
                      : project.description_en}
                  </p>

                  <p>
                    {requestedLocale === "ar" ? "الحالة: " : "Status: "}
                    {project.status}
                  </p>

                  {project.due_at && (
                    <p>
                      {requestedLocale === "ar"
                        ? "تاريخ التسليم: "
                        : "Due date: "}
                      {new Date(project.due_at).toLocaleDateString(
                        requestedLocale === "ar" ? "ar-SA" : "en",
                      )}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="dashboard-overview">
      <p className="eyebrow eyebrow-muted">{copy.dashboardLabel}</p>
      <h1>{sectionCopy.title}</h1>
      <article className="dashboard-welcome-card">
        <span className="dashboard-welcome-icon" aria-hidden="true">
          ◇
        </span>
        <div>
          <h2>{copy.moduleComingSoon}</h2>
          <p>{sectionCopy.description}</p>
        </div>
      </article>
    </section>
  );
}
