"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function listMyWorkspaces() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: memberRows } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id);

  const ids = memberRows?.map((m) => m.workspace_id) ?? [];
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .in("id", ids)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getWorkspace(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Workspace not found");
  return data;
}

export async function updateWorkspacePipeline(
  workspaceId: string,
  pipeline_stage: string,
  progress_percent?: number
) {
  const supabase = await createServerSupabaseClient();
  const patch: Record<string, unknown> = { pipeline_stage };
  if (typeof progress_percent === "number") patch.progress_percent = progress_percent;

  const { error } = await supabase
    .from("workspaces")
    .update(patch)
    .eq("id", workspaceId);

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}`);
  revalidatePath(`/client/workspaces/${workspaceId}`);
}

export async function getWorkspaceByAccessToken(token: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, name, status, pipeline_stage, progress_percent")
    .eq("access_token", token)
    .single();

  if (error || !data) return null;
  return data;
}
