"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateReferralCode } from "@/app/actions/referral";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Topbar } from "@/components/layout/Topbar";

export default function ConnectPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await validateReferralCode(code);
    setBusy(false);
    if (!res.valid) {
      setError("Invalid or inactive referral code.");
      return;
    }
    router.push(`/client/onboarding/intake?code=${encodeURIComponent(code.trim())}`);
  }

  return (
    <>
      <Topbar title="Connect" />
      <div className="flex-1 px-4 py-8 md:px-6">
      <Card className="mx-auto max-w-lg p-6">
        <h1 className="text-xl font-semibold text-neutral-900">Connect to your freelancer</h1>
        <p className="mt-1 text-sm text-neutral-600">Enter the referral code you received.</p>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="code">Referral code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          <Button type="submit" loading={busy}>
            Continue
          </Button>
        </form>
      </Card>
      </div>
    </>
  );
}
