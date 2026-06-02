"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendDocument, markInvoicePaid, markInvoiceOverdue } from "@/app/actions/documents";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function DocumentEditor({
  doc,
}: {
  doc: {
    id: string;
    title: string;
    type: string;
    status: string;
    content: unknown;
    total_amount: number | null;
    due_date: string | null;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const content = doc.content as Record<string, unknown>;

  async function onSend() {
    setBusy(true);
    try {
      await sendDocument(doc.id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-xs uppercase text-neutral-500">Status</p>
        <p className="text-lg font-semibold text-neutral-900">{doc.status}</p>
        <p className="mt-1 text-sm text-neutral-700">{doc.title}</p>
      </Card>
      <Card className="space-y-2 p-4 text-sm text-neutral-800">
        {Object.entries(content).map(([k, v]) => (
          <div key={k}>
            <p className="text-xs font-semibold uppercase text-neutral-500">{k}</p>
            <p className="whitespace-pre-wrap">{String(v)}</p>
          </div>
        ))}
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button type="button" loading={busy} onClick={() => void onSend()}>
          Send to client
        </Button>
        {doc.type === "invoice" && (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                setBusy(true);
                try {
                  await markInvoicePaid(doc.id);
                  router.refresh();
                } finally {
                  setBusy(false);
                }
              }}
            >
              Mark paid
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={async () => {
                setBusy(true);
                try {
                  await markInvoiceOverdue(doc.id);
                  router.refresh();
                } finally {
                  setBusy(false);
                }
              }}
            >
              Mark overdue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
