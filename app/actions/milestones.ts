"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function listMilestones(workspaceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createMilestone(
  workspaceId: string,
  input: { title: string; description?: string; due_date?: string }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("milestones").insert({
    workspace_id: workspaceId,
    title: input.title,
    description: input.description,
    due_date: input.due_date ?? null,
    created_by: user.id,
  });

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/milestones`);
  revalidatePath(`/client/workspaces/${workspaceId}/milestones`);
}

export async function updateMilestoneStatus(
  milestoneId: string,
  workspaceId: string,
  status: string
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("milestones")
    .update({ status })
    .eq("id", milestoneId);

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/milestones`);
  revalidatePath(`/client/workspaces/${workspaceId}/milestones`);
}

export async function approveMilestone(milestoneId: string, workspaceId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("milestones")
    .update({
      status: "approved",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", milestoneId)
    .eq("status", "needs_review");

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/milestones`);
  revalidatePath(`/client/workspaces/${workspaceId}/milestones`);
}
