import { getWorkspace } from "@/app/actions/workspaces";
import { Topbar } from "@/components/layout/Topbar";
import { WorkspaceNav } from "@/components/workspace/WorkspaceNav";

export default async function ClientWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getWorkspace(id);

  return (
    <>
      <Topbar title={workspace.name} />
      <WorkspaceNav workspaceId={id} base="client" />
      <div className="flex-1 space-y-4 px-4 py-4 md:px-6">{children}</div>
    </>
  );
}
