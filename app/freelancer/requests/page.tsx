import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { listIncomingRequests } from "@/app/actions/requests";
import { RequestsRealtime } from "./requests-realtime";

export default async function FreelancerRequestsPage() {
  const requests = await listIncomingRequests();

  return (
    <>
      <Topbar title="Requests" />
      <div className="flex-1 space-y-4 px-4 py-6 md:px-6">
        <RequestsRealtime />
        <div className="grid gap-4">
          {requests.length === 0 ? (
            <Card className="p-8 text-center text-sm text-neutral-600">
              No requests yet. Share your referral code from the Referral page.
            </Card>
          ) : (
            requests.map((r) => (
              <Link key={r.id} href={`/freelancer/requests/${r.id}`}>
                <Card className="p-4 transition-shadow hover:shadow-modal">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{r.project_name}</p>
                      <p className="text-xs text-neutral-600">{r.project_type ?? "General"}</p>
                    </div>
                    <Badge
                      status={
                        r.status === "accepted"
                          ? "success"
                          : r.status === "rejected"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {r.status}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
