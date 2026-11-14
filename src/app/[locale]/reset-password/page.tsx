"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "checking" | "request" | "update";

export default function ResetPasswordPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "ar";
  const isArabic = locale === "ar";

  const [mode, setMode] = useState<Mode>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setMessage(
          isArabic
            ? "تعذر التحقق من الجلسة. حاولي مرة أخرى."
            : "Could not verify your session. Please try again.",
        );
        setMode("request");
        return;
      }

      setMode(data.session ? "update" : "request");
    }

    checkSession();
  }, [isArabic]);

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const redirectTo =
        `${window.location.origin}/auth/callback?next=/${locale}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setMessage(
          isArabic
            ? "تعذر إرسال رابط الاستعادة. تحققي من الإعدادات وحاولي مرة أخرى."
            : "Could not send the recovery link. Check the settings and try again.",
        );
        return;
      }

      setMessage(
        isArabic
          ? "إذا كان البريد مسجلًا، فسيصلك رابط استعادة كلمة المرور. تحققي من بريدك."
          : "If the email is registered, you will receive a password recovery link. Check your inbox.",
      );
    } catch {
      setMessage(
        isArabic
          ? "حدث خطأ أثناء إرسال الرابط."
          : "An error occurred while sending the link.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage(
          isArabic
            ? "تعذر تغيير كلمة المرور. حاولي مرة أخرى."
            : "Could not update the password. Please try again.",
        );
        return;
      }

      setMessage(
        isArabic
          ? "تم تغيير كلمة المرور بنجاح."
          : "Password updated successfully.",
      );

      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch {
      setMessage(
        isArabic
          ? "حدث خطأ أثناء تغيير كلمة المرور."
          : "An error occurred while updating the password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>
          {mode === "update"
            ? isArabic
              ? "تغيير كلمة المرور"
              : "Reset password"
            : isArabic
              ? "استعادة كلمة المرور"
              : "Recover password"}
        </h1>

        {mode === "checking" ? (
          <p>
            {isArabic ? "جارٍ التحقق..." : "Checking..."}
          </p>
        ) : mode === "request" ? (
          <form className="auth-form" onSubmit={handleRequest}>
            <label className="auth-field">
              <span>{isArabic ? "البريد الإلكتروني" : "Email address"}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </label>

            <button
              className="button button-dark auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? isArabic
                  ? "جارٍ الإرسال..."
                  : "Sending..."
                : isArabic
                  ? "إرسال رابط الاستعادة"
                  : "Send recovery link"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleUpdate}>
            <label className="auth-field">
              <span>
                {isArabic ? "كلمة المرور الجديدة" : "New password"}
              </span>
              <input
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={
                  isArabic ? "8 أحرف على الأقل" : "At least 8 characters"
                }
                autoComplete="new-password"
                disabled={loading}
              />
            </label>

            <button
              className="button button-dark auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? isArabic
                  ? "جارٍ الحفظ..."
                  : "Saving..."
                : isArabic
                  ? "حفظ كلمة المرور"
                  : "Save password"}
            </button>
          </form>
        )}

        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}