import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IconUsers, IconMail, IconCalendar, IconArrowRight } from "@tabler/icons-react";

type ClientProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
};

export default async function FreelancerClients() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: links } = await supabase
    .from("client_freelancer_links")
    .select(
      `
      id,
      status,
      created_at,
      client:profiles!client_freelancer_links_client_id_fkey(id, full_name, email, created_at)
    `
    )
    .eq("freelancer_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const clients: ClientProfile[] = [];
  for (const link of links ?? []) {
    const client = link.client as ClientProfile | ClientProfile[] | null;
    if (!client) continue;
    if (Array.isArray(client)) {
      if (client[0]) clients.push(client[0]);
    } else {
      clients.push(client);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium text-brand-dark">My Clients</h1>
        <p className="text-sm text-text-secondary">Manage clients linked via your referral code.</p>
      </header>

      {clients.length > 0 ? (
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
                <Link href="/freelancer/workspaces" className="pill-btn-outline text-[12px] px-3 py-1.5">
                  View Workspaces
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
