import { ClientSidebar } from "@/components/layout/ClientSidebar";
import { AiAssistant } from "@/components/ai/AiAssistant";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <ClientSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
        <AiAssistant portal="client" />
      </div>
    </div>
  );
}
