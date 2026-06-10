"use client";

import React, { useState, useTransition } from "react";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { markAsPaid } from "@/app/workspace/[id]/actions";

export default function MarkPaidButton({
  documentId,
  workspaceId,
  currentStatus,
}: {
  documentId: string;
  workspaceId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [paid, setPaid] = useState(currentStatus === "paid");

  if (paid) {
    return (
      <span className="badge badge-success text-[11px]">
        <IconCheck size={12} />
        Paid
      </span>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await markAsPaid(documentId, workspaceId);
            setPaid(true);
          } catch {
            alert("Failed to mark as paid");
          }
        });
      }}
      className="flex items-center gap-1 text-[11px] font-medium text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      title="Mark as Paid"
    >
      {isPending ? <IconLoader2 size={14} className="animate-spin" /> : <IconCheck size={14} />}
      Mark Paid
    </button>
  );
}
