"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { mockWorkspaces, getWorkspaceById } from "@/lib/mock/workspaces";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  FolderOpen,
  FileText,
  DollarSign,
  FileSignature,
  Clock,
  ArrowLeft,
  Calendar
} from "lucide-react";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "proposals", label: "Proposals", icon: FileText },
  { id: "invoices", label: "Invoices", icon: DollarSign },
  { id: "contracts", label: "Contracts", icon: FileSignature },
  { id: "time-log", label: "Time Log", icon: Clock },
];

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params?.id as string;
  const workspace = getWorkspaceById(workspaceId);

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Workspace Not Found</h2>
          <p className="text-text-secondary">The workspace you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  const currentTab = pathname.split("/").pop() || "overview";

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "error" | "draft"> = {
      active: "success",
      on_hold: "warning",
      completed: "draft",
      archived: "draft",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/freelancer/dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Workspace Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {workspace.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">{workspace.project_type}</span>
              {getStatusBadge(workspace.status)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary mb-1">Client</p>
            <p className="font-semibold text-text-primary">{workspace.client_name}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Progress</span>
            <span className="text-sm font-bold text-text-primary">{workspace.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all"
              style={{ width: `${workspace.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
            <span>Created: {workspace.created_at}</span>
            <span>{workspace.progress}% Complete</span>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.id}
                href={`/freelancer/workspaces/${workspaceId}/${tab.id}`}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
}
