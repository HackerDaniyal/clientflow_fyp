import { adminListUsers } from "@/app/actions/admin";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { AdminUserRow } from "./user-row";

export default async function AdminUsersPage() {
  const users = await adminListUsers();

  return (
    <>
      <Topbar title="Users" />
      <div className="flex-1 space-y-2 px-4 py-6 md:px-6">
        {users.map((u) => (
          <Card key={u.id} className="p-4">
            <AdminUserRow user={u} />
          </Card>
        ))}
      </div>
    </>
  );
}
