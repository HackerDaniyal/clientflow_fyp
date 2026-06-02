"use client";

import { useState } from "react";
import { useWorkspaceChat } from "@/hooks/useWorkspaceChat";
import { sendMessage } from "@/app/actions/messages";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function ChatPanel({ workspaceId }: { workspaceId: string }) {
  const { messages } = useWorkspaceChat(workspaceId);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSend() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      await sendMessage(workspaceId, text.trim());
      setText("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex h-[480px] flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="rounded-btn bg-brand-faint px-3 py-2 text-sm text-neutral-800">
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-neutral-200 p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message your team…"
          onKeyDown={(e) => {
            if (e.key === "Enter") void onSend();
          }}
        />
        <Button type="button" loading={busy} onClick={() => void onSend()}>
          Send
        </Button>
      </div>
    </Card>
  );
}
