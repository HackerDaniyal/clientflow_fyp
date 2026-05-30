"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconBell } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase";

export default function NotificationsBell({ href }: { href: string }) {
  const [unread, setUnread] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      setUnread(count ?? 0);
    };
    load();

    const channel = supabase
      .channel("notifications-bell")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <Link
      href={href}
      className="relative p-2 text-text-secondary hover:bg-brand-light/30 rounded-lg transition-colors"
      aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
    >
      <IconBell size={18} stroke={2} />
      {unread > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-status-danger text-white text-[9px] font-medium rounded-full flex items-center justify-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
