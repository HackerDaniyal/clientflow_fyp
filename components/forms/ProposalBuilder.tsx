"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function ProposalBuilder({
  onSave,
  busy,
}: {
  onSave: (content: object) => void | Promise<void>;
  busy?: boolean;
}) {
  const [scope, setScope] = useState("");
  const [timeline, setTimeline] = useState("");
  const [investment, setInvestment] = useState("");

  return (
    <Card className="space-y-4 p-4">
      <div>
        <Label>Scope</Label>
        <Textarea value={scope} onChange={(e) => setScope(e.target.value)} />
      </div>
      <div>
        <Label>Timeline</Label>
        <Input value={timeline} onChange={(e) => setTimeline(e.target.value)} />
      </div>
      <div>
        <Label>Investment</Label>
        <Input value={investment} onChange={(e) => setInvestment(e.target.value)} />
      </div>
      <Button type="button" loading={busy} onClick={() => void onSave({ scope, timeline, investment })}>
        Save draft
      </Button>
    </Card>
  );
}
