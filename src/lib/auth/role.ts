export type AppRole = "admin" | "freelancer" | "client" | "member";

export function normalizeRole(
  value: string | null | undefined
): AppRole | null {
  if (value === "admin" || value === "freelancer" || value === "client" || value === "member") {
    return value;
  }
  return null;
}

export function dashboardPath(role: AppRole): string {
  return `/${role}/dashboard`;
}
