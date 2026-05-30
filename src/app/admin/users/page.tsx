import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminUsers() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect(`/${profile?.role || "freelancer"}/dashboard`);

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium text-brand-dark">User Management</h1>
        <p className="text-sm text-text-secondary">All registered platform users.</p>
      </header>

      <div className="card bg-white overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-brand-light text-text-secondary">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-left p-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u) => (
              <tr key={u.id} className="border-b border-brand-light/50 last:border-0">
                <td className="p-3 text-brand-dark">{u.full_name || "—"}</td>
                <td className="p-3 text-text-secondary">{u.email || "—"}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3 text-text-tertiary">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <p className="text-center py-8 text-text-secondary">No users found.</p>
        )}
      </div>
    </div>
  );
}
