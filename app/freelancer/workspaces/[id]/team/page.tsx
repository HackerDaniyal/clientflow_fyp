import { listWorkspaceMembers } from "@/app/actions/team";
import { Card } from "@/components/ui/Card";
import { TeamInviteForm } from "./team-invite-form";

export default async function FreelancerTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const members = await listWorkspaceMembers(id);

  return (
    <div className="space-y-4">
      <TeamInviteForm workspaceId={id} />
      <Card className="p-4">
        <p className="text-sm font-medium text-neutral-900">Members</p>
        <ul className="mt-2 space-y-1 text-sm text-neutral-700">
          {members.map((m) => (
            <li key={m.id}>
              {(m.profile?.full_name ?? m.profile?.email) ?? m.user_id} — {m.role}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
