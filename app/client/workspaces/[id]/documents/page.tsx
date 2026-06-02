import Link from "next/link";
import { listDocuments } from "@/app/actions/documents";
import { Card } from "@/components/ui/Card";

export default async function ClientDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const docs = await listDocuments(id);

  return (
    <div className="space-y-2">
      {docs.length === 0 ? (
        <Card className="p-4 text-sm text-neutral-600">No documents yet.</Card>
      ) : (
        docs.map((d) => (
          <Link key={d.id} href={`/client/workspaces/${id}/documents/${d.id}`}>
            <Card className="p-4 hover:shadow-modal">
              <p className="font-medium text-neutral-900">{d.title}</p>
              <p className="text-xs text-neutral-500">
                {d.type} · {d.status}
              </p>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
