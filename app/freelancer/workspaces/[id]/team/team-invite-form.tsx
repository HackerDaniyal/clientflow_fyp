"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { inviteWorkspaceMember } from "@/app/actions/team";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function TeamInviteForm({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  return (
    <Card className="space-y-3 p-4">
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label>Role</Label>
        <select
          className="w-full rounded-btn border border-neutral-200 px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      <Button
        type="button"
        onClick={async () => {
          await inviteWorkspaceMember(workspaceId, email, role);
          setEmail("");
          start(() => router.refresh());
        }}
      >
        Invite
      </Button>
    </Card>
  );
}
