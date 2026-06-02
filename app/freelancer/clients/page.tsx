import { listMyWorkspaces } from "@/app/actions/workspaces";
import { Topbar } from "@/components/layout/Topbar";
import { PipelineBoard } from "@/components/dashboard/PipelineBoard";

export default async function FreelancerClientsPage() {
  const workspaces = await listMyWorkspaces();

  return (
    <>
      <Topbar title="Clients pipeline" />
      <div className="flex-1 px-4 py-6 md:px-6">
        <PipelineBoard workspaces={workspaces} />
      </div>
    </>
  );
}
