import { adminListUsers, adminListWorkspaces } from "@/app/actions/admin";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/ui/Card";

export default async function AdminHomePage() {
  const users = await adminListUsers();
  const workspaces = await adminListWorkspaces();

  const freelancers = users.filter((u) => u.role === "freelancer").length;
  const clients = users.filter((u) => u.role === "client").length;

  return (
    <>
      <Topbar title="Admin overview" />
      <div className="flex-1 space-y-6 px-4 py-6 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Freelancers" value={String(freelancers)} />
          <StatCard label="Clients" value={String(clients)} />
          <StatCard label="Workspaces" value={String(workspaces.length)} />
        </div>
      </div>
    </>
  );
}
