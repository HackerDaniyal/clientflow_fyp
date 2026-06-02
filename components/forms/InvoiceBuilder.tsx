"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function InvoiceBuilder({
  onSave,
  busy,
}: {
  onSave: (content: object, total: number, due: string) => void | Promise<void>;
  busy?: boolean;
}) {
  const [lineItems, setLineItems] = useState("Design & build — milestone 1");
  const [total, setTotal] = useState("1500");
  const [due, setDue] = useState("");

  return (
    <Card className="space-y-4 p-4">
      <div>
        <Label>Line items</Label>
        <Textarea value={lineItems} onChange={(e) => setLineItems(e.target.value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Total (numeric)</Label>
          <Input value={total} onChange={(e) => setTotal(e.target.value)} type="number" />
        </div>
        <div>
          <Label>Due date</Label>
          <Input value={due} onChange={(e) => setDue(e.target.value)} type="date" />
        </div>
      </div>
      <Button
        type="button"
        loading={busy}
        onClick={() =>
          void onSave({ lineItems }, Number(total), due || new Date().toISOString().slice(0, 10))
        }
      >
        Save draft
      </Button>
    </Card>
  );
}
