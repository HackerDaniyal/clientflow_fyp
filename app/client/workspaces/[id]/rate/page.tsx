import { RatePageClient } from "./rate-client";

export default async function ClientRatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RatePageClient workspaceId={id} />;
}
