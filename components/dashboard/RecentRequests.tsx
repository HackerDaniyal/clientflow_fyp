import Link from "next/link";
import { Card } from "@/components/ui/Card";

type Req = {
  id: string;
  project_name: string;
  status: string;
  created_at: string;
};

export function RecentRequests({ requests }: { requests: Req[] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-neutral-900">Recent requests</h2>
        <Link href="/freelancer/requests" className="text-sm font-medium text-brand-dark hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-3 space-y-2">
        {requests.length === 0 ? (
          <Card className="p-4 text-sm text-neutral-600">No recent requests.</Card>
        ) : (
          requests.map((r) => (
            <Link key={r.id} href={`/freelancer/requests/${r.id}`}>
              <Card className="p-4 text-sm hover:shadow-modal">
                <p className="font-medium text-neutral-900">{r.project_name}</p>
                <p className="text-xs text-neutral-500">{r.status}</p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
