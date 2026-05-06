"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Inbox,
  FolderKanban,
  FileText,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  ArrowUpCircle,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const freelancerNav: NavSection[] = [
  {
    title: "MAIN MENU",
    items: [
      { label: "Dashboard", href: "/freelancer/dashboard", icon: LayoutDashboard },
      { label: "Clients", href: "/freelancer/clients", icon: Users },
      { label: "Leads", href: "/freelancer/leads", icon: UserPlus },
      { label: "Requests", href: "/freelancer/requests", icon: Inbox },
    ],
  },
  {
    title: "WORKSPACE",
    items: [
      { label: "Active Workspace", href: "/freelancer/workspaces/1/overview", icon: FolderKanban },
    ],
  },
  {
    title: "TOOLS",
    items: [
      { label: "Proposals", href: "/freelancer/proposals", icon: FileText },
      { label: "Invoices", href: "/freelancer/invoices", icon: FileSpreadsheet },
    ],
  },
];

const clientNav: NavSection[] = [
  {
    title: "MAIN MENU",
    items: [
      { label: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
      { label: "My Workspace", href: "/client/workspace/1/overview", icon: Briefcase },
    ],
  },
];

const adminNav: NavSection[] = [
  {
    title: "MAIN MENU",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Freelancers", href: "/admin/freelancers", icon: Users },
      { label: "Clients", href: "/admin/clients", icon: UserPlus },
      { label: "Workspaces", href: "/admin/workspaces", icon: FolderKanban },
    ],
  },
];

interface SidebarProps {
  role: "freelancer" | "client" | "admin";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const navSections = role === "freelancer" ? freelancerNav : role === "client" ? clientNav : adminNav;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar-bg border-r border-border transition-all duration-300 z-30 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
      style={{ width: sidebarCollapsed ? '4rem' : '15rem' }}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!sidebarCollapsed && (
          <Link href={`/${role}/dashboard`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="font-bold text-text-primary">ClientFlow</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-text-secondary" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!sidebarCollapsed && (
              <h3 className="text-[11px] font-medium text-text-secondary uppercase tracking-wider mb-2 px-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "sidebar-item group",
                      isActive && "sidebar-item-active",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
                    )} />
                    {!sidebarCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-2 space-y-1">
        {!sidebarCollapsed && (
          <>
            <Link href={`/${role}/settings`} className="sidebar-item">
              <Settings className="w-5 h-5 text-text-secondary" />
              <span className="text-sm">Settings</span>
            </Link>
            <button className="sidebar-item w-full">
              <HelpCircle className="w-5 h-5 text-text-secondary" />
              <span className="text-sm">Help & Support</span>
            </button>
            {role === "freelancer" && (
              <button className="sidebar-item w-full text-primary hover:bg-primary-light">
                <ArrowUpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Upgrade to Pro</span>
              </button>
            )}
          </>
        )}
        {sidebarCollapsed && (
          <>
            <Link href={`/${role}/settings`} className="sidebar-item justify-center px-2">
              <Settings className="w-5 h-5 text-text-secondary" />
            </Link>
            <button className="sidebar-item justify-center px-2 w-full">
              <HelpCircle className="w-5 h-5 text-text-secondary" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
