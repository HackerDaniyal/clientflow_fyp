import Link from "next/link";
import { listMyWorkspaces } from "@/app/actions/workspaces";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";

export default async function FreelancerWorkspacesPage() {
  const workspaces = await listMyWorkspaces();

  return (
    <>
      <Topbar title="Workspaces" />
      <div className="flex-1 space-y-3 px-4 py-6 md:px-6">
        {workspaces.length === 0 ? (
          <Card className="p-6 text-sm text-neutral-600">No workspaces yet. Accept a request to create one.</Card>
        ) : (
          workspaces.map((w) => (
            <Link key={w.id} href={`/freelancer/workspaces/${w.id}`}>
              <Card className="p-4 hover:shadow-modal">
                <p className="font-medium text-neutral-900">{w.name}</p>
                <p className="text-xs text-neutral-500">
                  {w.status} · {w.pipeline_stage}
                </p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
