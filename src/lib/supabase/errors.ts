export function isMissingSupabaseSessionError(
  error: { name?: string } | null,
) {
  return error?.name === "AuthSessionMissingError";
}
