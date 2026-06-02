"use client";

import { IconSparkles } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AiAssistant({
  portal,
  context,
}: {
  portal: "freelancer" | "client";
  context?: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    setReply(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context, role: portal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setReply(data.reply as string);
    } catch (e) {
      setReply(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-white shadow-modal"
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
      >
        <IconSparkles size={22} />
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 z-40 flex w-[min(100vw-2rem,380px)] flex-col rounded-modal border border-neutral-200 bg-white shadow-modal">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">Gemini assistant</p>
            <button type="button" className="text-sm text-neutral-500" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto px-4 py-3 text-sm text-neutral-800">
            {reply ? <p className="whitespace-pre-wrap">{reply}</p> : <p className="text-neutral-500">Ask anything…</p>}
          </div>
          <div className="flex gap-2 border-t border-neutral-200 p-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={portal === "freelancer" ? "Draft a proposal intro…" : "Explain my invoice…"}
              onKeyDown={(e) => {
                if (e.key === "Enter") void send();
              }}
            />
            <Button type="button" loading={busy} onClick={() => void send()}>
              Send
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
