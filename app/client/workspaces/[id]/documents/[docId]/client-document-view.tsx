"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markDocumentViewed, signContract } from "@/app/actions/documents";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function ClientDocumentView({
  doc,
}: {
  doc: {
    id: string;
    title: string;
    type: string;
    status: string;
    content: unknown;
  };
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [signature, setSignature] = useState("");
  const content = doc.content as Record<string, unknown>;

  useEffect(() => {
    if (doc.status === "sent") {
      void markDocumentViewed(doc.id).then(() => start(() => router.refresh()));
    }
  }, [doc.id, doc.status, router, start]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-xs uppercase text-neutral-500">{doc.type}</p>
        <h2 className="text-lg font-semibold text-neutral-900">{doc.title}</h2>
        <p className="text-xs text-neutral-500">Status: {doc.status}</p>
      </Card>
      <Card className="space-y-2 p-4 text-sm text-neutral-800">
        {Object.entries(content).map(([k, v]) => (
          <div key={k}>
            <p className="text-xs font-semibold uppercase text-neutral-500">{k}</p>
            <p className="whitespace-pre-wrap">{String(v)}</p>
          </div>
        ))}
      </Card>
      {doc.type === "contract" && doc.status !== "approved" && (
        <Card className="space-y-3 p-4">
          <Label>Type your full name to sign</Label>
          <Input value={signature} onChange={(e) => setSignature(e.target.value)} />
          <Button
            type="button"
            onClick={async () => {
              await signContract(doc.id, signature);
              start(() => router.refresh());
            }}
          >
            Sign contract
          </Button>
        </Card>
      )}
    </div>
  );
}
