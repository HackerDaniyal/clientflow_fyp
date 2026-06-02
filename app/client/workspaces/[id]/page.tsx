import { getWorkspace } from "@/app/actions/workspaces";
import { Card } from "@/components/ui/Card";
import { listMilestones } from "@/app/actions/milestones";

export default async function ClientWorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getWorkspace(id);
  const milestones = await listMilestones(id);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-xs uppercase text-neutral-500">Progress</p>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#e8f5ee]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-dark to-brand-light"
            style={{ width: `${workspace.progress_percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-neutral-600">
          Stage <strong>{workspace.pipeline_stage}</strong>
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium text-neutral-900">Milestones</p>
        <ul className="mt-2 space-y-1 text-sm text-neutral-700">
          {milestones.map((m) => (
            <li key={m.id}>
              {m.title} — {m.status}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
