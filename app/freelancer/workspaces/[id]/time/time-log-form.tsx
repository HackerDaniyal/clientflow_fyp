"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logTime } from "@/app/actions/time-logs";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function TimeLogForm({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [minutes, setMinutes] = useState(60);
  const [description, setDescription] = useState("");

  return (
    <Card className="space-y-3 p-4">
      <div>
        <Label>Minutes</Label>
        <Input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
      </div>
      <div>
        <Label>Description</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button
        type="button"
        onClick={async () => {
          await logTime(workspaceId, { minutes, description });
          start(() => router.refresh());
        }}
      >
        Log time
      </Button>
    </Card>
  );
}
