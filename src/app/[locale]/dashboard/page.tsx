import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authCopy } from "@/lib/auth-copy";
import { isLocale } from "@/lib/i18n";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({
  params,
}: DashboardPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  if (!isLocale(requestedLocale)) notFound();

  return {
    title: authCopy[requestedLocale].dashboardLabel,
    robots: { index: false, follow: false },
  };
}

export default async function DashboardPage({
  params,
  searchParams,
}: DashboardPageProps) {
  const [{ locale: requestedLocale }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  if (!isLocale(requestedLocale)) notFound();

  const copy = authCopy[requestedLocale];

  return (
    <section className="dashboard-overview">
      {query.error === "signout" ? (
        <p className="auth-message auth-message-error" role="alert">
          {copy.logoutError}
        </p>
      ) : null}
      <p className="eyebrow eyebrow-muted">{copy.dashboardLabel}</p>
      <h1>{copy.dashboardTitle}</h1>
      <p className="dashboard-description">{copy.dashboardDescription}</p>
      <article className="dashboard-welcome-card">
        <span className="dashboard-welcome-icon" aria-hidden="true">
          ✳
        </span>
        <div>
          <h2>{copy.dashboardWelcome}</h2>
          <p>{copy.dashboardReady}</p>
        </div>
      </article>
    </section>
  );
}
