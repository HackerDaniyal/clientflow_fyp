"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function listTodos(workspaceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createTodo(
  workspaceId: string,
  input: { title: string; description?: string; due_date?: string; priority?: string }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("todos").insert({
    workspace_id: workspaceId,
    title: input.title,
    description: input.description,
    due_date: input.due_date || null,
    priority: input.priority ?? "normal",
    created_by: user.id,
  });

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/todos`);
  revalidatePath(`/client/workspaces/${workspaceId}/todos`);
}

export async function toggleTodoDone(todoId: string, workspaceId: string, is_done: boolean) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("todos")
    .update({
      is_done,
      done_at: is_done ? new Date().toISOString() : null,
    })
    .eq("id", todoId);

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/todos`);
  revalidatePath(`/client/workspaces/${workspaceId}/todos`);
}

export async function reorderTodos(workspaceId: string, orderedIds: string[]) {
  const supabase = await createServerSupabaseClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("todos").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath(`/freelancer/workspaces/${workspaceId}/todos`);
  revalidatePath(`/client/workspaces/${workspaceId}/todos`);
}
