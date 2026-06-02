"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { ProfileRole } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<ProfileRole>("freelancer");
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
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
        },
      },
    });
    setLoading(false);
    if (err) {
      const msg = err.message;
      const isNetwork =
        msg === "Failed to fetch" ||
        (err as { name?: string }).name === "AuthRetryableFetchError";
      setError(
        isNetwork
          ? "Cannot reach Supabase. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local from Supabase → Settings → API, then restart `npm run dev`."
          : msg
      );
      return;
    }
    router.replace("/auth/post-login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-10">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-600">Choose how you will use ClientFlow.</p>
        {error && (
          <p className="mt-4 rounded-btn border border-danger/30 bg-[#fde8e6] px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label>I am a</Label>
            <div className="mt-2 flex gap-2">
              {(["freelancer", "client"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 rounded-btn border px-3 py-2 text-sm font-medium ${
                    role === r
                      ? "border-brand-dark bg-brand-faint text-brand-dark"
                      : "border-neutral-200 bg-white text-neutral-600"
                  }`}
                >
                  {r === "freelancer" ? "Freelancer / Agency" : "Client"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Sign up
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link className="font-medium text-brand-dark hover:underline" href="/auth/login">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
