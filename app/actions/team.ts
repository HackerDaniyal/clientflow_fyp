"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function inviteWorkspaceMember(workspaceId: string, email: string, role: string) {
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (!profile) {
    throw new Error("No user with that email. They must sign up first.");
  }

  const { error } = await supabase.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: profile.id,
    role: role || "member",
  });

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/team`);
}

export async function listWorkspaceMembers(workspaceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .select("id, role, user_id, joined_at")
    .eq("workspace_id", workspaceId);

  if (error) throw error;
  const ids = [...new Set((data ?? []).map((m) => m.user_id))];
  if (ids.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .in("id", ids);

  const map = new Map((profiles ?? []).map((p) => [p.id, p]));
  return (data ?? []).map((m) => ({
    ...m,
    profile: map.get(m.user_id) ?? null,
  }));
}
