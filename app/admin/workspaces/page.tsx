import { adminListWorkspaces } from "@/app/actions/admin";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";

export default async function AdminWorkspacesPage() {
  const workspaces = await adminListWorkspaces();

  return (
    <>
      <Topbar title="Workspaces" />
      <div className="flex-1 space-y-2 px-4 py-6 md:px-6">
        {workspaces.map((w) => (
          <Card key={w.id} className="p-4 text-sm">
            <p className="font-medium text-neutral-900">{w.name}</p>
            <p className="text-xs text-neutral-500">
              {w.status} · freelancer {w.freelancer_id} · client {w.client_id}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
