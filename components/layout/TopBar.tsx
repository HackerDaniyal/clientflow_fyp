"use client";

import React, { useState } from "react";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { NotificationPanel } from "./NotificationPanel";
import { cn } from "@/lib/utils";

interface TopBarProps {
  role: "freelancer" | "client" | "admin";
}

export function TopBar({ role }: TopBarProps) {
  const { sidebarCollapsed } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: null,
  };

  const unreadCount = 3; // Mock unread notifications

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 bg-background-card border-b border-border flex items-center justify-between px-6 z-40 transition-all duration-300",
        sidebarCollapsed ? "left-16 w-[calc(100%-4rem)]" : "left-60 w-[calc(100%-15rem)]"
      )}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search clients, projects, invoices..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-button transition-colors"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-button transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-text-primary hidden md:block">
              {user.name}
            </span>
            <ChevronDown className="w-4 h-4 text-text-secondary hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-background-card border border-border rounded-card shadow-dropdown z-50">
              <div className="p-4 border-b border-border">
                <p className="font-medium text-text-primary">{user.name}</p>
                <p className="text-sm text-text-secondary">{user.email}</p>
                <p className="text-xs text-text-secondary capitalize mt-1">{role}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    window.location.href = `/${role}/settings`;
                    setShowProfile(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-button transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/login";
                    setShowProfile(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left text-error hover:bg-error-light rounded-button transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
