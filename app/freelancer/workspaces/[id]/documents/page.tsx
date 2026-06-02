import Link from "next/link";
import { listDocuments } from "@/app/actions/documents";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function WorkspaceDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const docs = await listDocuments(id);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-neutral-600">Proposals, invoices, and contracts.</p>
        <Link href={`/freelancer/workspaces/${id}/documents/new`}>
          <Button type="button">New document</Button>
        </Link>
      </div>
      <div className="space-y-2">
        {docs.length === 0 ? (
          <Card className="p-4 text-sm text-neutral-600">No documents yet.</Card>
        ) : (
          docs.map((d) => (
            <Link key={d.id} href={`/freelancer/workspaces/${id}/documents/${d.id}`}>
              <Card className="p-4 text-sm hover:shadow-modal">
                <p className="font-medium text-neutral-900">{d.title}</p>
                <p className="text-xs text-neutral-500">
                  {d.type} · {d.status}
                </p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
