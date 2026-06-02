import { Card } from "@/components/ui/Card";
import type { Workspace } from "@/types";

const stages = [
  { key: "kickoff", label: "Lead" },
  { key: "design", label: "Design" },
  { key: "development", label: "Build" },
  { key: "review", label: "Review" },
  { key: "delivery", label: "Delivery" },
  { key: "done", label: "Done" },
];

export function PipelineBoard({ workspaces }: { workspaces: Workspace[] }) {
  const grouped = stages.map((s) => ({
    ...s,
    items: workspaces.filter((w) => w.pipeline_stage === s.key),
  }));

  return (
    <div>
      <h2 className="text-lg font-medium text-neutral-900">Pipeline</h2>
      <p className="text-sm text-neutral-600">Kanban by workspace stage (Coinest DS).</p>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {grouped.map((col) => (
          <div key={col.key} className="min-w-[220px] flex-1">
            <div className="rounded-nav bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-600 shadow-card">
              {col.label}
            </div>
            <div className="mt-2 space-y-2">
              {col.items.length === 0 ? (
                <Card className="border-dashed p-3 text-center text-xs text-neutral-500">
                  Empty
                </Card>
              ) : (
                col.items.map((w) => (
                  <Card key={w.id} className="p-3 text-sm font-medium text-neutral-900">
                    {w.name}
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
