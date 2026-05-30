import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionRole } from "./get-session-role";
import { dashboardPath, type AppRole } from "./role";

export async function requireRole(allowed: AppRole | AppRole[]) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const role = await getSessionRole(supabase, user);
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  if (!role || !allowedRoles.includes(role)) {
    redirect(role ? dashboardPath(role) : "/auth/signup");
  }

  return { user, role };
}
