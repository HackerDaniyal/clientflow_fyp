import Link from "next/link";
import { listMyWorkspaces } from "@/app/actions/workspaces";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";

export default async function ClientDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const sp = await searchParams;
  const workspaces = await listMyWorkspaces();

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="flex-1 space-y-4 px-4 py-6 md:px-6">
        {sp.submitted && (
          <Card className="border-brand-surface bg-brand-faint p-4 text-sm text-brand-dark">
            Your project request was submitted. You will be notified when the freelancer responds.
          </Card>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">Your workspaces</p>
          <Link href="/client/onboarding/connect" className="text-sm font-medium text-brand-dark hover:underline">
            New request
          </Link>
        </div>
        {workspaces.length === 0 ? (
          <Card className="p-6 text-sm text-neutral-600">
            No workspaces yet. Connect with a referral code to submit your intake.
          </Card>
        ) : (
          workspaces.map((w) => (
            <Link key={w.id} href={`/client/workspaces/${w.id}`}>
              <Card className="p-4 hover:shadow-modal">
                <p className="font-medium text-neutral-900">{w.name}</p>
                <p className="text-xs text-neutral-500">{w.pipeline_stage}</p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
