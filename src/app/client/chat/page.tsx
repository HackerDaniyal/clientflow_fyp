import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { IconMessageCircle, IconArrowRight, IconInbox } from "@tabler/icons-react";

export default async function ClientChat() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch client's workspaces
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select(`
      *,
      freelancer:profiles!workspaces_freelancer_id_fkey(full_name),
      messages:workspace_messages(content, created_at, sender:profiles(full_name))
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium text-brand-dark">Messages</h1>
        <p className="text-sm text-text-secondary">All your project conversations.</p>
      </header>

      {workspaces && workspaces.length > 0 ? (
        <div className="space-y-4">
          {workspaces.map((workspace) => {
            const lastMessage = workspace.messages?.[workspace.messages.length - 1];
            return (
              <Link
                key={workspace.id}
                href={`/workspace/${workspace.id}`}
                className="card bg-white hover:shadow-md transition-shadow block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-[16px] font-semibold">
                      {workspace.freelancer?.full_name?.charAt(0).toUpperCase() || "F"}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-brand-dark">{workspace.freelancer?.full_name || "Freelancer"}</h3>
                      <p className="text-[12px] text-text-tertiary">
                        {workspace.name}
                      </p>
                      {lastMessage && (
                        <p className="text-[12px] text-text-secondary mt-1 line-clamp-1">
                          {lastMessage.sender?.full_name}: {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                  <IconArrowRight size={18} className="text-text-tertiary" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-16 border-dashed border-2">
          <IconMessageCircle size={64} stroke={1.5} className="mx-auto text-text-tertiary mb-4 opacity-20" />
          <p className="text-text-secondary text-lg">No messages yet</p>
          <p className="text-text-tertiary text-sm mt-2 mb-6">Start chatting in your workspaces.</p>
          <Link href="/client/workspace" className="pill-btn inline-flex items-center gap-2">
            View Workspaces
            <IconArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
