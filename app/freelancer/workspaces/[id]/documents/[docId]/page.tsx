import { notFound } from "next/navigation";
import { getDocument } from "@/app/actions/documents";
import { DocumentEditor } from "./document-editor";

export default async function FreelancerDocumentDetailPage({
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

  return <DocumentEditor doc={doc} />;
}
