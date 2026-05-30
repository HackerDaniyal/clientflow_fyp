import React from "react";
import ClientTopBar from "@/components/ClientTopBar";
import AIAssistant from "@/components/AIAssistantLazy";
import { requireRole } from "@/lib/auth/require-role";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("client");

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col">
      <ClientTopBar />
      <main className="flex-1 overflow-y-auto px-[28px] py-[32px] md:px-[32px]">
        {children}
      </main>
      <AIAssistant userRole="client" />
    </div>
  );
}
