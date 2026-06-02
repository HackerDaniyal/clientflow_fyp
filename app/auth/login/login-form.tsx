"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function LoginForm({ nextHref }: { nextHref: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let supabase;
    try {
      supabase = createClient();
    } catch (configErr) {
      setLoading(false);
      setError(
        configErr instanceof Error ? configErr.message : "Supabase is not configured."
      );
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      const msg = err.message;
      const isNetwork =
        msg === "Failed to fetch" ||
        (err as { name?: string }).name === "AuthRetryableFetchError";
      setError(
        isNetwork
          ? "Cannot reach Supabase. Fix: (1) In .env.local set NEXT_PUBLIC_SUPABASE_URL to https://YOUR-PROJECT.supabase.co and the anon key from Supabase → Settings → API. (2) Restart `npm run dev` after saving .env.local. (3) Confirm the project is not paused and your network allows HTTPS."
          : msg
      );
      return;
    }
    router.replace(nextHref);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Welcome back</h1>
        <p className="mt-1 text-sm text-neutral-600">Log in to ClientFlow.</p>
        {error && (
          <p className="mt-4 rounded-btn border border-danger/30 bg-[#fde8e6] px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Continue
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-neutral-600">
          No account?{" "}
          <Link className="font-medium text-brand-dark hover:underline" href="/auth/signup">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
