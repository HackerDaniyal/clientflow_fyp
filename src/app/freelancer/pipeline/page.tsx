import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PipelineBoard, { type PipelineWorkspace } from "./pipeline-board";

export default async function PipelinePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select(
      `
      id,
      name,
      project_type,
      pipeline_stage,
      status,
      client:profiles!workspaces_client_id_fkey(full_name)
    `
    )
    .eq("freelancer_id", user.id)
    .order("created_at", { ascending: false });

  const mapped: PipelineWorkspace[] = (workspaces ?? []).map((w) => {
    const client = w.client as { full_name: string | null } | { full_name: string | null }[] | null;
    const clientObj = Array.isArray(client) ? client[0] ?? null : client;
    return {
      id: w.id,
      name: w.name,
      project_type: w.project_type,
      pipeline_stage: w.pipeline_stage,
      status: w.status,
      client: clientObj,
    };
  });

  return (
    <div className="space-y-8 max-w-[1600px]">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-brand-dark">Client Pipeline</h1>
          <p className="mt-1 text-sm text-text-secondary max-w-xl">
            Use list view for a single scroll, or board view for a compact kanban. Empty stages are
            hidden by default.
          </p>
        </div>
        <p className="text-[13px] text-text-tertiary shrink-0">
          {mapped.length} workspace{mapped.length === 1 ? "" : "s"}
        </p>
      </header>
      <PipelineBoard workspaces={mapped} />
    </div>
  );
}
