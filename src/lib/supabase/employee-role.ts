import "server-only";

import type { User } from "@supabase/supabase-js";
import { isEmployeeRole, type EmployeeRole } from "@/lib/employee-roles";
import { isMissingSupabaseSessionError } from "@/lib/supabase/errors";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

export async function getCurrentEmployeeFromProfile(
  supabase: SupabaseServerClient,
): Promise<{ user: User | null; role: EmployeeRole | null }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && !isMissingSupabaseSessionError(authError)) {
    console.error("Unable to verify employee authentication.", authError);
    throw new Error("Unable to verify employee authentication.");
  }

  if (!user) return { user: null, role: null };

  const { data, error } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Unable to read the employee role from the profile.", error);
    throw new Error("Unable to verify employee role.");
  }

  if (!data?.is_active || !isEmployeeRole(data.role)) {
    return { user, role: null };
  }

  return { user, role: data.role };
}
