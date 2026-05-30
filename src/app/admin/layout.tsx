import React from "react";
import Sidebar from "@/components/Sidebar";
import { requireRole } from "@/lib/auth/require-role";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return (
    <div className="flex min-h-screen bg-brand-surface">
      <Sidebar role="admin" />
      <main className="flex-1 overflow-y-auto px-[28px] py-[32px] md:px-[32px]">
        {children}
      </main>
    </div>
  );
}
