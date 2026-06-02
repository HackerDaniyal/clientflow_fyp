import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { listMyWorkspaces } from "@/app/actions/workspaces";
import { Card } from "@/components/ui/Card";

export default async function FreelancerDocumentsHubPage() {
  const workspaces = await listMyWorkspaces();

  return (
    <>
      <Topbar title="Documents" />
      <div className="flex-1 space-y-3 px-4 py-6 md:px-6">
        <p className="text-sm text-neutral-600">Open a workspace to manage proposals, invoices, and contracts.</p>
        {workspaces.map((w) => (
          <Link key={w.id} href={`/freelancer/workspaces/${w.id}/documents`}>
            <Card className="p-4 hover:shadow-modal">
              <p className="font-medium text-neutral-900">{w.name}</p>
              <p className="text-xs text-neutral-500">View documents</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
