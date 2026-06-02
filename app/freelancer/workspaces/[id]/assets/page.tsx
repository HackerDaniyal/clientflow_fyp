import { Card } from "@/components/ui/Card";
import { getProjectRequest } from "@/app/actions/requests";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function WorkspaceAssetsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("request_id")
    .eq("id", id)
    .single();

  if (!workspace?.request_id) {
    return <Card className="p-4 text-sm text-neutral-600">No linked intake request.</Card>;
  }

  const request = await getProjectRequest(workspace.request_id);
  const paths = request.asset_paths ?? [];

  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-neutral-900">Client assets</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
        {paths.length === 0 ? <li>No files uploaded.</li> : null}
        {paths.map((p: string) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-neutral-500">
        Bucket is private — add signed URL download in a follow-up API route.
      </p>
    </Card>
  );
}
