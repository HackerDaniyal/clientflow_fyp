import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IconUsers, IconMail, IconCalendar, IconArrowRight, IconInbox } from "@tabler/icons-react";

export default async function FreelancerClients() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch clients linked to this freelancer via referral_codes
  const { data: clients } = await supabase
    .from("profiles")
    .select("*, referral_codes!referral_codes_client_id_fkey(freelancer_id)")
    .eq("role", "client")
    .eq("referral_codes.freelancer_id", user.id);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium text-brand-dark">My Clients</h1>
        <p className="text-sm text-text-secondary">Manage clients who joined using your referral code.</p>
      </header>

      {clients && clients.length > 0 ? (
        <div className="space-y-4">
          {clients.map((client) => (
            <div key={client.id} className="card bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center text-brand-accent text-[16px] font-semibold">
                    {client.full_name?.charAt(0).toUpperCase() || "C"}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-brand-dark">{client.full_name || "Client"}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[12px] text-text-secondary">
                      <span className="flex items-center gap-1">
                        <IconMail size={12} />
                        {client.email || "No email"}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconCalendar size={12} />
                        Joined {new Date(client.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/freelancer/dashboard`}
                  className="pill-btn-outline text-[12px] px-3 py-1.5"
                >
                  View
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-16 border-dashed border-2">
          <IconUsers size={64} stroke={1.5} className="mx-auto text-text-tertiary mb-4 opacity-20" />
          <p className="text-text-secondary text-lg">No clients yet</p>
          <p className="text-text-tertiary text-sm mt-2 mb-6">Share your referral code to start linking clients.</p>
          <Link href="/freelancer/referrals" className="pill-btn inline-flex items-center gap-2">
            Get Referral Code
            <IconArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
