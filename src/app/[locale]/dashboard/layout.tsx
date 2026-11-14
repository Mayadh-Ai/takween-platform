import DashboardSidebar from "@/components/dashboard-sidebar";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { authCopy } from "@/lib/auth-copy";

import { isLocale } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentEmployeeFromProfile } from "@/lib/supabase/employee-role";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "./actions";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale: requestedLocale } = await params;
  if (!isLocale(requestedLocale)) notFound();

  const locale = requestedLocale;
  const copy = authCopy[locale];
  const isArabic = locale === "ar";

  if (!isSupabaseConfigured()) {
    return (
      <main className="auth-page" dir={isArabic ? "rtl" : "ltr"} lang={locale}>
        <header className="auth-topbar">
          <Link className="wordmark" href={`/${locale}`}>
            <span className="wordmark-symbol" aria-hidden="true">
              T
            </span>
            <span>TAKWEEN</span>
          </Link>
          <Link className="language-switch" href={isArabic ? "/en/dashboard" : "/ar/dashboard"}>
            {copy.language}
          </Link>
        </header>
        <section className="auth-main">
          <div className="auth-card auth-notice-card">
            <span className="auth-card-mark" aria-hidden="true">
              T
            </span>
            <p className="eyebrow eyebrow-muted">{copy.dashboardLabel}</p>
            <h1>{copy.setupTitle}</h1>
            <p className="auth-description">{copy.setupDescription}</p>
            <Link className="button button-dark auth-submit" href={`/${locale}/login`}>
              {copy.signIn}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { user, role } = await getCurrentEmployeeFromProfile(supabase);
  if (!user) {
    redirect(`/${locale}/login`);
  }

  if (!role) {
    return (
      <main className="auth-page" dir={isArabic ? "rtl" : "ltr"} lang={locale}>
        <header className="auth-topbar">
          <Link className="wordmark" href={`/${locale}`}>
            <span className="wordmark-symbol" aria-hidden="true">
              T
            </span>
            <span>TAKWEEN</span>
          </Link>
          <form action={signOutAction}>
            <input name="locale" type="hidden" value={locale} />
            <button className="auth-back-link auth-plain-button" type="submit">
              {copy.logout}
            </button>
          </form>
        </header>
        <section className="auth-main">
          <div className="auth-card auth-notice-card">
            <p className="eyebrow eyebrow-muted">{copy.dashboardLabel}</p>
            <h1>{copy.roleRequiredTitle}</h1>
            <p className="auth-description">{copy.roleRequiredDescription}</p>
          </div>
        </section>
      </main>
    );
  }

  const roleLabels = {
    super_admin: copy.roleSuperAdmin,
    admin: copy.roleAdmin,
    manager: copy.roleManager,
    employee: copy.roleEmployee,
  };
  
  return (
    <div className="employee-shell" dir={isArabic ? "rtl" : "ltr"} lang={locale}>
     <DashboardSidebar locale={locale} role={role} />
      <div className="employee-main">
        <header className="employee-topbar">
          <div>
            <p className="employee-topbar-kicker">{copy.dashboardLabel}</p>
            <p className="employee-user-email">{user.email}</p>
          </div>
          <div className="employee-topbar-actions">
            <span className="employee-role-badge">{roleLabels[role]}</span>
            <Link
              className="language-switch"
              href={isArabic ? "/en/dashboard" : "/ar/dashboard"}
              lang={isArabic ? "en" : "ar"}
            >
              {copy.language}
            </Link>
            <form action={signOutAction}>
              <input name="locale" type="hidden" value={locale} />
              <button className="employee-logout" type="submit">
                {copy.logout}
              </button>
            </form>
          </div>
        </header>
        <main className="employee-content">
          {children}
        </main>
      </div>
    </div>
  );
}
