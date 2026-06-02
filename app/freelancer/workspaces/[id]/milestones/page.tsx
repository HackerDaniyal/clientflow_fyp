import { listMilestones } from "@/app/actions/milestones";
import { MilestonesManager } from "@/components/workspace/MilestonesManager";

export default async function FreelancerMilestonesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const milestones = await listMilestones(id);
  return <MilestonesManager workspaceId={id} milestones={milestones} mode="freelancer" />;
}
