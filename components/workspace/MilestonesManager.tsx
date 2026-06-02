"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  approveMilestone,
  createMilestone,
  updateMilestoneStatus,
} from "@/app/actions/milestones";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type Milestone = {
  id: string;
  title: string;
  status: string;
};

export function MilestonesManager({
  workspaceId,
  milestones,
  mode,
}: {
  workspaceId: string;
  milestones: Milestone[];
  mode: "freelancer" | "client";
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [title, setTitle] = useState("");

  return (
    <div className="space-y-4">
      {mode === "freelancer" && (
        <Card className="space-y-2 p-4">
          <Label>New milestone</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button
            type="button"
            onClick={async () => {
              if (!title.trim()) return;
              await createMilestone(workspaceId, { title });
              setTitle("");
              start(() => router.refresh());
            }}
          >
            Add milestone
          </Button>
        </Card>
      )}
      <div className="space-y-2">
        {milestones.map((m) => (
          <Card key={m.id} className="space-y-2 p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-neutral-900">{m.title}</p>
              <span className="text-xs uppercase text-neutral-500">{m.status}</span>
            </div>
            {mode === "freelancer" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await updateMilestoneStatus(m.id, workspaceId, "in_progress");
                    start(() => router.refresh());
                  }}
                >
                  In progress
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    await updateMilestoneStatus(m.id, workspaceId, "needs_review");
                    start(() => router.refresh());
                  }}
                >
                  Needs review
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await updateMilestoneStatus(m.id, workspaceId, "done");
                    start(() => router.refresh());
                  }}
                >
                  Mark done
                </Button>
              </div>
            )}
            {mode === "client" && m.status === "needs_review" && (
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  await approveMilestone(m.id, workspaceId);
                  start(() => router.refresh());
                }}
              >
                Approve milestone
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
