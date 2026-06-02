import { ChatPanel } from "@/components/workspace/ChatPanel";

export default async function ClientChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatPanel workspaceId={id} />;
}
