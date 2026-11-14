"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/ar");

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function prepareRecovery() {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage(
            isArabic
              ? "انتهت صلاحية رابط الاستعادة. أرسلي رابطًا جديدًا."
              : "The recovery link expired. Request a new link.",
          );
          return;
        }
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setMessage(
          isArabic
            ? "رابط الاستعادة غير صالح أو انتهت صلاحيته."
            : "The recovery link is invalid or has expired.",
        );
        return;
      }

      setReady(true);
    }

    prepareRecovery();
  }, [isArabic]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      isArabic
        ? "تم تغيير كلمة المرور بنجاح."
        : "Password updated successfully.",
    );

    setTimeout(() => router.push(`/${isArabic ? "ar" : "en"}/login`), 2000);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{isArabic ? "تغيير كلمة المرور" : "Reset password"}</h1>

        {ready ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password">
              {isArabic ? "كلمة المرور الجديدة" : "New password"}
            </label>

            <input
              id="new-password"
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isArabic ? "8 أحرف على الأقل" : "At least 8 characters"}
            />

            <button type="submit" disabled={loading}>
              {loading
                ? isArabic
                  ? "جارٍ الحفظ..."
                  : "Saving..."
                : isArabic
                  ? "حفظ كلمة المرور"
                  : "Save password"}
            </button>
          </form>
        ) : (
          <p>
            {message ||
              (isArabic ? "جارٍ التحقق من الرابط..." : "Verifying link...")}
          </p>
        )}

        {ready && message && <p>{message}</p>}
      </section>
    </main>
  );
}