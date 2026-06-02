import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";

export default async function FreelancerClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Topbar title="Client profile" />
      <div className="flex-1 px-4 py-6 md:px-6">
        <Card className="p-6 text-sm text-neutral-600">
          Profile for client <span className="font-mono">{id}</span> — link this page to a profiles query in a
          follow-up.
        </Card>
      </div>
    </>
  );
}
