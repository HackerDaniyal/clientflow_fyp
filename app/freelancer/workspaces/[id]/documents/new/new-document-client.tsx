"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/app/actions/documents";
import { Button } from "@/components/ui/Button";
import { ProposalBuilder } from "@/components/forms/ProposalBuilder";
import { InvoiceBuilder } from "@/components/forms/InvoiceBuilder";
import { ContractBuilder } from "@/components/forms/ContractBuilder";
import type { DocumentType } from "@/types";

export function NewDocumentPageClient({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [type, setType] = useState<DocumentType>("proposal");
  const [busy, setBusy] = useState(false);

  async function save(content: object, extra?: { total?: number; due?: string }) {
    setBusy(true);
    try {
      const doc = await createDocument(
        workspaceId,
        type,
        content,
        undefined,
        extra?.total,
        extra?.due
      );
      router.push(`/freelancer/workspaces/${workspaceId}/documents/${doc.id}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["proposal", "invoice", "contract"] as const).map((t) => (
          <Button
            key={t}
            type="button"
            variant={type === t ? "primary" : "ghost"}
            onClick={() => setType(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      {type === "proposal" && <ProposalBuilder onSave={(c) => void save(c)} busy={busy} />}
      {type === "invoice" && (
        <InvoiceBuilder onSave={(c, total, due) => void save(c, { total, due })} busy={busy} />
      )}
      {type === "contract" && <ContractBuilder onSave={(c) => void save(c)} busy={busy} />}
    </div>
  );
}
