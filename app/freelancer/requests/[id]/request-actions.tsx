"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptProjectRequest, rejectProjectRequest } from "@/app/actions/requests";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

export function RequestActions({
  requestId,
  status,
}: {
  requestId: string;
  status: string;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  if (status !== "pending") {
    return <p className="text-sm text-neutral-600">No actions available for {status} requests.</p>;
  }

  async function onAccept() {
    setBusy(true);
    try {
      const res = await acceptProjectRequest(requestId);
      router.push(`/freelancer/workspaces/${res.workspaceId}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onReject() {
    setBusy(true);
    try {
      await rejectProjectRequest(requestId, reason || "Not a fit right now.");
      router.push("/freelancer/requests");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={() => void onAccept()} loading={busy}>
        Accept & create workspace
      </Button>
      <div className="rounded-card border border-neutral-200 bg-brand-faint p-3">
        <p className="text-xs font-medium uppercase text-neutral-600">Reject</p>
        <Textarea
          className="mt-2"
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button className="mt-2" variant="danger" type="button" onClick={() => void onReject()} loading={busy}>
          Reject request
        </Button>
      </div>
    </div>
  );
}
