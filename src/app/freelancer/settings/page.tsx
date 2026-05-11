import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IconSettings, IconUser, IconMail, IconBuilding } from "@tabler/icons-react";

export default async function FreelancerSettings() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium text-brand-dark">Settings</h1>
        <p className="text-sm text-text-secondary">Manage your account and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="card bg-white">
          <h3 className="text-lg font-semibold text-brand-dark mb-4 flex items-center gap-2">
            <IconUser size={20} />
            Profile Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-1 block">Full Name</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-surface rounded-lg border border-brand-light">
                <IconUser size={16} className="text-text-tertiary" />
                <span className="text-[13px] text-brand-dark">{profile?.full_name || "Not set"}</span>
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-1 block">Email</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-surface rounded-lg border border-brand-light">
                <IconMail size={16} className="text-text-tertiary" />
                <span className="text-[13px] text-brand-dark">{profile?.email || user.email}</span>
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-1 block">Role</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-surface rounded-lg border border-brand-light">
                <IconBuilding size={16} className="text-text-tertiary" />
                <span className="text-[13px] text-brand-dark capitalize">{profile?.role || "Freelancer"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="card bg-white">
          <h3 className="text-lg font-semibold text-brand-dark mb-4 flex items-center gap-2">
            <IconSettings size={20} />
            Account Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-brand-surface rounded-lg">
              <span className="text-[13px] text-text-secondary">Member Since</span>
              <span className="text-[13px] font-medium text-brand-dark">
                {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-brand-surface rounded-lg">
              <span className="text-[13px] text-text-secondary">Account ID</span>
              <span className="text-[13px] font-medium text-brand-dark font-mono">
                {user.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
