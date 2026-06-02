import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/ui/Card";
import { PipelineBoard } from "@/components/dashboard/PipelineBoard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { listIncomingRequests } from "@/app/actions/requests";
import { listMyWorkspaces } from "@/app/actions/workspaces";

export default async function FreelancerDashboardPage() {
  const requests = await listIncomingRequests();
  const workspaces = await listMyWorkspaces();
  const pending = requests.filter((r) => r.status === "pending").length;
  const activeClients = new Set(workspaces.map((w) => w.client_id)).size;

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="flex-1 space-y-8 px-4 py-6 md:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Active clients" value={String(activeClients || 0)} />
          <StatCard label="Pending requests" value={String(pending)} />
          <StatCard label="Workspaces" value={String(workspaces.length)} />
          <StatCard label="Hours logged" value="—" trend="Connect time logs" trendUp />
        </div>
        <PipelineBoard workspaces={workspaces} />
        <RecentRequests requests={requests.slice(0, 5)} />
      </div>
    </>
  );
}
