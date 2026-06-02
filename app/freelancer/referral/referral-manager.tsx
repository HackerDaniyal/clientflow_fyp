"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateReferralCode, toggleReferralCodeActive } from "@/app/actions/referral";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Code = {
  id: string;
  code: string;
  use_count: number;
  is_active: boolean;
};

export function ReferralManager({ initial }: { initial: Code[] }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [codes, setCodes] = useState(initial);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={async () => {
          const row = await generateReferralCode();
          setCodes((c) => [row as Code, ...c]);
          start(() => router.refresh());
        }}
      >
        Generate new code
      </Button>
      <div className="space-y-2">
        {codes.map((c) => (
          <Card key={c.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <div>
              <p className="font-mono text-base font-semibold text-neutral-900">{c.code}</p>
              <p className="text-xs text-neutral-500">Uses: {c.use_count}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={async () => {
                await toggleReferralCodeActive(c.id, !c.is_active);
                setCodes((prev) =>
                  prev.map((x) => (x.id === c.id ? { ...x, is_active: !x.is_active } : x))
                );
              }}
            >
              {c.is_active ? "Deactivate" : "Activate"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
