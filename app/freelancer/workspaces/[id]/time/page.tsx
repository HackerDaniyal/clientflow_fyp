import { listTimeLogs } from "@/app/actions/time-logs";
import { Card } from "@/components/ui/Card";
import { TimeLogForm } from "./time-log-form";

export default async function FreelancerTimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const logs = await listTimeLogs(id);
  const total = logs.reduce((acc, l) => acc + (l.minutes ?? 0), 0);

  return (
    <div className="space-y-4">
      <TimeLogForm workspaceId={id} />
      <Card className="p-4">
        <p className="text-sm font-medium text-neutral-900">Total minutes: {total}</p>
        <ul className="mt-2 space-y-1 text-sm text-neutral-700">
          {logs.map((l) => (
            <li key={l.id}>
              {l.logged_date}: {l.minutes}m — {l.description ?? "—"}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
