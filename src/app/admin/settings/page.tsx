import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IconSettings, IconShield } from "@tabler/icons-react";

export default async function AdminSettings() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role, full_name, email").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect(`/${profile?.role || "freelancer"}/dashboard`);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium text-brand-dark">Admin Settings</h1>
        <p className="text-sm text-text-secondary">Platform administration preferences.</p>
      </header>

      <div className="card bg-white max-w-lg">
        <h3 className="text-lg font-semibold text-brand-dark mb-4 flex items-center gap-2">
          <IconShield size={20} />
          Administrator
        </h3>
        <p className="text-[13px] text-text-secondary mb-2">{profile?.full_name}</p>
        <p className="text-[13px] text-text-tertiary">{profile?.email || user.email}</p>
        <p className="text-[12px] text-text-tertiary mt-4 flex items-center gap-1">
          <IconSettings size={14} />
          Advanced platform configuration is managed in Supabase.
        </p>
      </div>
    </div>
  );
}
