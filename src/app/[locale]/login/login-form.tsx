"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  locale: "en" | "ar";
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
  pendingLabel: string;
  errorLabel: string;
  unavailable: boolean;
};

export function LoginForm({
  locale,
  emailLabel,
  passwordLabel,
  submitLabel,
  pendingLabel,
  errorLabel,
  unavailable,
}: LoginFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (unavailable) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setError(errorLabel);
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(errorLabel);
        return;
      }

      router.replace(`/${locale}/dashboard`);
      router.refresh();
    } catch (signInError) {
      console.error("Employee sign-in failed.", signInError);
      setError(errorLabel);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>{emailLabel}</span>
        <input
          autoComplete="username"
          disabled={unavailable || isSubmitting}
          name="email"
          required
          type="email"
        />
      </label>
      <label className="auth-field">
        <span>{passwordLabel}</span>
        <input
          autoComplete="current-password"
          disabled={unavailable || isSubmitting}
          name="password"
          required
          type="password"
        />
      </label>
      {error ? (
        <p className="auth-message auth-message-error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="button button-dark auth-submit"
        disabled={unavailable || isSubmitting}
        type="submit"
      >
        {isSubmitting ? pendingLabel : submitLabel}
        <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
      </button>
    </form>
  );
}
