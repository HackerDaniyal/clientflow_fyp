"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function listMessages(workspaceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(workspaceId: string, content: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("messages").insert({
    workspace_id: workspaceId,
    sender_id: user.id,
    content,
    type: "text",
  });

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/chat`);
  revalidatePath(`/client/workspaces/${workspaceId}/chat`);
}
