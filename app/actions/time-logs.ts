"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function listTimeLogs(workspaceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("time_logs")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("logged_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function logTime(
  workspaceId: string,
  input: { minutes: number; description?: string; milestone_id?: string; logged_date?: string }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("time_logs").insert({
    workspace_id: workspaceId,
    user_id: user.id,
    minutes: input.minutes,
    description: input.description,
    milestone_id: input.milestone_id ?? null,
    logged_date: input.logged_date ?? new Date().toISOString().slice(0, 10),
  });

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/time`);
}
