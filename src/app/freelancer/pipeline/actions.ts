"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  normalizePipelineStage,
  PIPELINE_STAGES,
  type PipelineStage,
} from "./constants";

export async function updateWorkspaceStage(workspaceId: string, pipelineStage: string) {
  const stage = normalizePipelineStage(pipelineStage);
  if (!PIPELINE_STAGES.includes(stage)) {
    throw new Error("Invalid pipeline stage");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("workspaces")
    .update({ pipeline_stage: stage })
    .eq("id", workspaceId)
    .eq("freelancer_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/freelancer/pipeline");
  revalidatePath("/freelancer/dashboard");
  return { success: true };
}
