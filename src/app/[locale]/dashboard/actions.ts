"use server";

import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signOutAction(formData: FormData) {
  const requestedLocale = formData.get("locale");
  const locale =
    typeof requestedLocale === "string" && isLocale(requestedLocale)
      ? requestedLocale
      : "en";
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Employee sign-out failed.", error);
    redirect(`/${locale}/dashboard?error=signout`);
  }

  redirect(`/${locale}/login`);
}
