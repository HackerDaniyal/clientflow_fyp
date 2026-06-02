"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitRating } from "@/app/actions/ratings";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function RatePageClient({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <Card className="space-y-3 p-4">
      <p className="text-sm font-medium text-neutral-900">Rate your experience</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            className={`h-9 w-9 rounded-full text-sm font-semibold ${
              score === s ? "bg-brand-dark text-white" : "bg-neutral-100 text-neutral-700"
            }`}
            onClick={() => setScore(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <textarea
        className="min-h-[80px] w-full rounded-btn border border-neutral-200 px-3 py-2 text-sm"
        placeholder="Optional comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        type="button"
        onClick={async () => {
          await submitRating(workspaceId, { score, comment });
          start(() => router.push(`/client/workspaces/${workspaceId}`));
        }}
      >
        Submit rating
      </Button>
    </Card>
  );
}
