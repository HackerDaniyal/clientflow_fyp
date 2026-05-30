import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RequestsClient from "./requests-client";
import type { ProjectRequestRow } from "./types";

type FilterStatus = "all" | "pending" | "accepted" | "rejected";

function parseFilter(status: string | undefined): FilterStatus {
  if (status === "pending" || status === "accepted" || status === "rejected") {
    return status;
  }
  return "all";
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const filter = parseFilter(searchParams.status);

  let query = supabase
    .from("project_requests")
    .select(
      `
      *,
      client:profiles!project_requests_client_id_fkey(full_name)
    `
    )
    .eq("freelancer_id", user.id)
    .order("submitted_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;

  const requests: ProjectRequestRow[] = (data ?? []).map((row) => {
    const client = row.client as
      | { full_name: string | null; email?: string | null }
      | { full_name: string | null; email?: string | null }[]
      | null;
    const clientObj = Array.isArray(client) ? client[0] ?? null : client;
    return {
      id: row.id,
      client_id: row.client_id,
      freelancer_id: row.freelancer_id,
      status: row.status,
      form_data: row.form_data,
      submitted_at: row.submitted_at,
      responded_at: row.responded_at,
      client: clientObj,
    };
  });

  return (
    <RequestsClient
      requests={requests}
      fetchError={error?.message ?? null}
      initialFilter={filter}
    />
  );
}
