import { NewDocumentPageClient } from "./new-document-client";

export default async function NewDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewDocumentPageClient workspaceId={id} />;
}
