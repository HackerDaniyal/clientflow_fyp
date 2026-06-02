"use client";

import { useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export function useProjectRequestsRealtime(
  freelancerId: string | undefined,
  onInsert?: () => void
) {
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!freelancerId) return;

    const channel = supabase
      .channel(`freelancer-${freelancerId}-requests`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_requests",
          filter: `freelancer_id=eq.${freelancerId}`,
        },
        () => {
          onInsert?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [freelancerId, supabase, onInsert]);
}
