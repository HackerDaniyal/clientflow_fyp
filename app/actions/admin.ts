"use server";

import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");
  return user;
}

export async function adminListUsers() {
  await requireAdmin();
  const admin = createServiceRoleClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, full_name, role, created_at, suspended")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function adminListWorkspaces() {
  await requireAdmin();
  const admin = createServiceRoleClient();
  const { data, error } = await admin
    .from("workspaces")
    .select("id, name, status, freelancer_id, client_id, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function adminSetSuspended(userId: string, suspended: boolean) {
  await requireAdmin();
  const admin = createServiceRoleClient();
  const { error } = await admin
    .from("profiles")
    .update({ suspended })
    .eq("id", userId);

  if (error) throw error;
}
