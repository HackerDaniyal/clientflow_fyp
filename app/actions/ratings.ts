"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitRating(
  workspaceId: string,
  input: { score: number; milestone_id?: string; comment?: string }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("ratings").insert({
    workspace_id: workspaceId,
    client_id: user.id,
    milestone_id: input.milestone_id ?? null,
    score: input.score,
    comment: input.comment,
  });

  if (error) throw error;
  revalidatePath(`/client/workspaces/${workspaceId}`);
}
