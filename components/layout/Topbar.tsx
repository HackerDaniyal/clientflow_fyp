"use client";

import { IconBell } from "@tabler/icons-react";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import { markNotificationRead } from "@/app/actions/notifications";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";

export function Topbar({ title }: { title: string }) {
  const { profile } = useUser();
  const userId = profile?.id;
  const { notifications, unreadCount } = useNotifications(userId);
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 md:px-6">
      <div>
        <h1 className="text-[22px] font-medium text-neutral-900">{title}</h1>
      </div>
      <div className="relative flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-nav border border-neutral-200 p-2 text-neutral-600 hover:bg-brand-faint"
          aria-label="Notifications"
          onClick={() => setOpen((o) => !o)}
        >
          <IconBell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        {open && (
          <div className="absolute right-0 top-12 z-50 w-80 rounded-card border border-neutral-200 bg-white shadow-modal">
            <div className="max-h-80 overflow-y-auto py-2">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-neutral-500">
                  No notifications yet.
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="border-b border-neutral-100 px-3 py-2 text-sm last:border-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-neutral-900">{n.title}</p>
                        {n.body && (
                          <p className="mt-0.5 text-xs text-neutral-600">{n.body}</p>
                        )}
                        {n.link && (
                          <Link
                            href={n.link}
                            className="mt-1 inline-block text-xs font-medium text-brand-dark hover:underline"
                            onClick={() => {
                              if (!n.is_read) void markNotificationRead(n.id);
                              setOpen(false);
                            }}
                          >
                            Open
                          </Link>
                        )}
                      </div>
                      {!n.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
