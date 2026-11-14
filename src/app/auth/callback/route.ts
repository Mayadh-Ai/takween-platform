import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  const locale = next?.startsWith("/en") ? "en" : "ar";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL(`/${locale}/reset-password`, requestUrl.origin),
      );
    }
  }

  return NextResponse.redirect(
    new URL(`/${locale}/login?error=recovery_failed`, requestUrl.origin),
  );
}