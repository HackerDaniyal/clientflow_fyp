import { FreelancerSidebar } from "@/components/layout/FreelancerSidebar";
import { AiAssistant } from "@/components/ai/AiAssistant";

export default function FreelancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <FreelancerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
        <AiAssistant portal="freelancer" />
      </div>
    </div>
  );
}
