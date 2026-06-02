import { notFound } from "next/navigation";
import { getDocument } from "@/app/actions/documents";
import { ClientDocumentView } from "./client-document-view";

export default async function ClientDocumentPage({
  params,
}: {
  params: Promise<{ id: string; docId: string }>;
}) {
  const { id, docId } = await params;
  let doc: Awaited<ReturnType<typeof getDocument>>;
  try {
    doc = await getDocument(docId);
  } catch {
    notFound();
  }
  if (doc.workspace_id !== id) notFound();

  return <ClientDocumentView doc={doc} />;
}
