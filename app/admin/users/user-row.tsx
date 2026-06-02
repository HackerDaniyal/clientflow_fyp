"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminSetSuspended } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";

export function AdminUserRow({
  user,
}: {
  user: {
    id: string;
    full_name: string | null;
    email: string;
    role: string;
    suspended: boolean | null;
  };
}) {
  const router = useRouter();
  const [, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <div>
        <p className="font-medium text-neutral-900">{user.full_name ?? user.email}</p>
        <p className="text-xs text-neutral-500">
          {user.email} · {user.role}
        </p>
      </div>
      <Button
        type="button"
        variant={user.suspended ? "secondary" : "danger"}
        size="sm"
        onClick={async () => {
          await adminSetSuspended(user.id, !user.suspended);
          start(() => router.refresh());
        }}
      >
        {user.suspended ? "Unsuspend" : "Suspend"}
      </Button>
    </div>
  );
}
