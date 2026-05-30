"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { IconBell, IconCheck } from "@tabler/icons-react";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/notifications/actions";
import type { NotificationRow } from "@/lib/notifications";

export default function NotificationsInbox({
  notifications,
  portalHome,
}: {
  notifications: NotificationRow[];
  portalHome: string;
}) {
  const [isPending, startTransition] = useTransition();

  const unread = notifications.filter((n) => !n.is_read).length;

  const resolveHref = (n: NotificationRow) => {
    const workspaceId = n.data?.workspace_id as string | undefined;
    if (workspaceId) return `/workspace/${workspaceId}`;
    if (n.type?.includes("request")) return portalHome.includes("freelancer") ? "/freelancer/requests" : "/client/dashboard";
    return portalHome;
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-brand-dark flex items-center gap-2">
            <IconBell size={24} />
            Notifications
          </h1>
          <p className="text-sm text-text-secondary">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await markAllNotificationsRead();
              })
            }
            className="pill-btn-outline text-[12px] disabled:opacity-50"
          >
            <IconCheck size={16} />
            Mark all read
          </button>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-2">
          <IconBell size={48} className="mx-auto text-text-tertiary mb-3 opacity-20" />
          <p className="text-text-secondary">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`card flex items-start justify-between gap-4 ${
                !n.is_read ? "border-brand-accent/40 bg-brand-surface" : ""
              }`}
            >
              <div className="flex-1">
                <p className="text-[13px] font-medium text-brand-dark">{n.title}</p>
                {n.body && (
                  <p className="text-[12px] text-text-secondary mt-1">{n.body}</p>
                )}
                <p className="text-[11px] text-text-tertiary mt-2">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link href={resolveHref(n)} className="text-[12px] text-brand-mid font-medium hover:underline">
                  Open
                </Link>
                {!n.is_read && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await markNotificationRead(n.id);
                      })
                    }
                    className="text-[11px] text-text-tertiary hover:text-brand-dark"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
