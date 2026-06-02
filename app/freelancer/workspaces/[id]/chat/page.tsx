import { ChatPanel } from "@/components/workspace/ChatPanel";

export default async function FreelancerChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatPanel workspaceId={id} />;
}
