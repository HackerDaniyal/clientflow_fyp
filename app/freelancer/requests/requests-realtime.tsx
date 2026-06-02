"use client";

import { useRouter } from "next/navigation";
import { useProjectRequestsRealtime } from "@/hooks/useProjectRequests";
import { useUser } from "@/hooks/useUser";

export function RequestsRealtime() {
  const router = useRouter();
  const { profile } = useUser();
  useProjectRequestsRealtime(profile?.id, () => router.refresh());
  return null;
}
