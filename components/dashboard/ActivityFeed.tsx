"use client";

import React from "react";
import { MessageSquare, DollarSign, FileText, Mail, CheckCircle, UserPlus } from "lucide-react";

interface Activity {
  id: string;
  type: "request" | "payment" | "proposal" | "message" | "task" | "client";
  description: string;
  time: string;
}

const activities: Activity[] = [
  { id: "1", type: "request", description: "New client request from Emily Rodriguez", time: "5 min ago" },
  { id: "2", type: "payment", description: "Invoice #INV-003 paid by TechCorp ($2,500)", time: "1 hour ago" },
  { id: "3", type: "proposal", description: "Proposal accepted by Michael Chen", time: "3 hours ago" },
  { id: "4", type: "message", description: "New message from Lisa Thompson", time: "5 hours ago" },
  { id: "5", type: "task", description: 'Task "Payment Integration" completed', time: "1 day ago" },
  { id: "6", type: "client", description: "New client Sarah Johnson onboarded", time: "2 days ago" },
];

interface ActivityFeedProps {
  title?: string;
  maxItems?: number;
}

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "request": return UserPlus;
    case "payment": return DollarSign;
    case "proposal": return FileText;
    case "message": return Mail;
    case "task": return CheckCircle;
    case "client": return UserPlus;
    default: return MessageSquare;
  }
};

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "request": return "bg-primary-light text-primary";
    case "payment": return "bg-success-light text-success";
    case "proposal": return "bg-accepted-light text-accepted-dark";
    case "message": return "bg-warning-light text-warning-dark";
    case "task": return "bg-success-light text-success-dark";
    case "client": return "bg-primary-light text-primary";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function ActivityFeed({ title = "Recent Activity", maxItems = 5 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        <a href="#" className="text-primary text-sm font-medium hover:opacity-80 transition-opacity" onClick={(e) => e.preventDefault()}>
          View All
        </a>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);

          return (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
              <div className={`p-2 rounded-button flex-shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm font-medium truncate">{activity.description}</p>
                <p className="text-text-secondary text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
