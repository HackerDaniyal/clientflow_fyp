"use client";

import React from "react";
import { Check, MessageSquare, FileText, DollarSign, UserPlus } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  onClose: () => void;
}

const mockNotifications = [
  {
    id: "1",
    type: "new_request" as const,
    title: "New Client Request",
    body: "Sarah Miller submitted a project request for Website Design",
    time: "5 min ago",
    is_read: false,
  },
  {
    id: "2",
    type: "invoice_paid" as const,
    title: "Invoice Paid",
    body: "Invoice #INV-003 has been paid by TechCorp ($2,500)",
    time: "1 hour ago",
    is_read: false,
  },
  {
    id: "3",
    type: "message" as const,
    title: "New Message",
    body: "John Doe sent you a message in workspace: Mobile App Dev",
    time: "2 hours ago",
    is_read: false,
  },
  {
    id: "4",
    type: "contract_signed" as const,
    title: "Contract Signed",
    body: "Emily Chen signed the contract for Brand Identity Project",
    time: "1 day ago",
    is_read: true,
  },
];

const iconMap = {
  new_request: UserPlus,
  message: MessageSquare,
  invoice_paid: DollarSign,
  contract_signed: FileText,
  task_due: Check,
};

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { markAllNotificationsRead } = useAppStore();

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-background-card border border-border rounded-card shadow-dropdown z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-text-primary">Notifications</h3>
        <button
          onClick={markAllNotificationsRead}
          className="text-sm text-primary hover:underline"
        >
          Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.map((notification) => {
          const Icon = iconMap[notification.type];
          
          return (
            <div
              key={notification.id}
              className={cn(
                "p-4 border-b border-border hover:bg-gray-50 cursor-pointer transition-colors",
                !notification.is_read && "bg-primary-light/30"
              )}
            >
              <div className="flex gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  !notification.is_read ? "bg-primary-light" : "bg-gray-100"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    !notification.is_read ? "text-primary" : "text-text-secondary"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {notification.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {notification.body}
                  </p>
                  <p className="text-xs text-text-secondary mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <button className="w-full text-center text-sm text-primary hover:underline">
          View all notifications
        </button>
      </div>
    </div>
  );
}
