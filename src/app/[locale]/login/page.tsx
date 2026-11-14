import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { authCopy } from "@/lib/auth-copy";
import { isLocale } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingSupabaseSessionError } from "@/lib/supabase/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  if (!isLocale(requestedLocale)) notFound();

  return {
    title: authCopy[requestedLocale].loginTitle,
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale: requestedLocale } = await params;
  if (!isLocale(requestedLocale)) notFound();

  const locale = requestedLocale;
  const copy = authCopy[locale];
  const configured = isSupabaseConfigured();

  if (configured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error && !isMissingSupabaseSessionError(error)) {
      console.error("Unable to check employee session.", error);
    } else if (user) {
      redirect(`/${locale}/dashboard`);
    }
  }

  return (
    <main className="auth-page" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
      <header className="auth-topbar">
        <Link className="wordmark" href={`/${locale}`} aria-label="TAKWEEN">
          <span className="wordmark-symbol" aria-hidden="true">
            T
          </span>
          <span>TAKWEEN</span>
        </Link>
        <div className="auth-topbar-actions">
          <Link className="auth-back-link" href={`/${locale}`}>
            {copy.backToSite}
          </Link>
          <Link className="language-switch" href={locale === "ar" ? "/en/login" : "/ar/login"}>
            {copy.language}
          </Link>
        </div>
      </header>
      <section className="auth-main">
        <div className="auth-card">
          <span className="auth-card-mark" aria-hidden="true">
            T
          </span>
          <p className="eyebrow eyebrow-muted">{copy.dashboardLabel}</p>
          <h1>{copy.loginTitle}</h1>
          <p className="auth-description">{copy.loginDescription}</p>
          {configured ? (
            <LoginForm
              emailLabel={copy.email}
              errorLabel={copy.loginError}
              locale={locale}
              passwordLabel={copy.password}
              pendingLabel={copy.signingIn}
              submitLabel={copy.signIn}
              unavailable={false}
            />
          ) : (
            <p className="auth-message auth-message-info" role="status">
              {copy.loginUnavailable}
            </p>
          )}
          <p className="auth-secure-note">
            <span aria-hidden="true">⌑</span>
            {locale === "ar"
              ? "دخول آمن للموظفين المعتمدين فقط"
              : "Secure access for authorized employees only"}
          </p>
        </div>
      </section>
    </main>
  );
}
