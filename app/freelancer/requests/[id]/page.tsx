import { notFound } from "next/navigation";
import { getProjectRequest } from "@/app/actions/requests";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RequestActions } from "./request-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let request: Awaited<ReturnType<typeof getProjectRequest>>;
  try {
    request = await getProjectRequest(id);
  } catch {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  const { data: client } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", request.client_id)
    .single();

  return (
    <>
      <Topbar title="Request detail" />
      <div className="flex-1 space-y-4 px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">{request.project_name}</h2>
            <p className="text-sm text-neutral-600">
              From {client?.full_name ?? client?.email ?? "Client"}
            </p>
          </div>
          <Badge
            status={
              request.status === "accepted"
                ? "success"
                : request.status === "rejected"
                  ? "danger"
                  : "warning"
            }
          >
            {request.status}
          </Badge>
        </div>
        <Card className="grid gap-3 p-4 text-sm text-neutral-700 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-neutral-500">Type</p>
            <p>{request.project_type ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-neutral-500">Budget</p>
            <p>
              {request.budget_min ?? "—"} – {request.budget_max ?? "—"} {request.currency}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase text-neutral-500">Description</p>
            <p>{request.description ?? "—"}</p>
          </div>
        </Card>
        <RequestActions requestId={request.id} status={request.status} />
      </div>
    </>
  );
}
