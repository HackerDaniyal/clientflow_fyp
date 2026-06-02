import { createServiceRoleClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function PublicPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createServiceRoleClient();
  const { data } = await admin
    .from("workspaces")
    .select("name, status, pipeline_stage, progress_percent")
    .eq("access_token", token)
    .single();

  if (!data) {
    return (
      <div className="min-h-screen bg-brand-bg px-4 py-16 text-center text-sm text-neutral-600">
        Invalid or expired link.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg px-4 py-10">
      <Card className="mx-auto max-w-xl p-6">
        <p className="text-xs uppercase text-neutral-500">Public view</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">{data.name}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Status {data.status} · Stage {data.pipeline_stage}
        </p>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#e8f5ee]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-dark to-brand-light"
            style={{ width: `${data.progress_percent}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
