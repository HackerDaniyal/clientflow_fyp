"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function ContractBuilder({
  onSave,
  busy,
}: {
  onSave: (content: object) => void | Promise<void>;
  busy?: boolean;
}) {
  const [terms, setTerms] = useState(
    "Payment terms, deliverables, and revision limits as agreed between parties."
  );

  return (
    <Card className="space-y-4 p-4">
      <div>
        <Label>Contract terms</Label>
        <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} />
      </div>
      <Button type="button" loading={busy} onClick={() => void onSave({ terms })}>
        Save draft
      </Button>
    </Card>
  );
}
