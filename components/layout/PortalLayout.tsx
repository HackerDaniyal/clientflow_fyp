"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AISidebar } from "@/components/ai/AISidebar";
import { useAppStore } from "@/lib/store/useAppStore";
import { cn } from "@/lib/utils";

interface PortalLayoutProps {
  children: React.ReactNode;
  role: "freelancer" | "client" | "admin";
}

export function PortalLayout({ children, role }: PortalLayoutProps) {
  const { sidebarCollapsed } = useAppStore();
  
  return (
    <div className="min-h-screen bg-background relative">
      <Sidebar role={role} />
      <TopBar role={role} />
      
      {/* Main Content */}
      <main
        className={cn(
          "pt-16 transition-all duration-300 relative z-0",
          sidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        <div className="p-6 min-h-screen">
          {children}
        </div>
      </main>

      {/* AI Sidebar (Freelancer & Client only) */}
      {role !== "admin" && <AISidebar />}
    </div>
  );
}
