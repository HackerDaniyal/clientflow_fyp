"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { intakeSubmitSchema, type IntakeSubmit } from "@/lib/schemas/intake";
import { revalidatePath } from "next/cache";

export async function submitProjectRequest(payload: IntakeSubmit) {
  const parsed = intakeSubmitSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((e) => e.message).join(", "));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: v } = await supabase.rpc("validate_referral_code", {
    p_code: parsed.data.referral_code.trim(),
  });
  const row = Array.isArray(v) ? v[0] : v;
  if (!row?.valid) throw new Error("Invalid referral code");

  const freelancerId = row.freelancer_id as string;
  const codeId = row.code_id as string;

  const {
    referral_code,
    asset_paths,
    asset_metadata,
    client_notes,
    ...rest
  } = parsed.data;

  const insertPayload: Record<string, unknown> = {
    client_id: user.id,
    freelancer_id: freelancerId,
    referral_code,
    asset_paths,
    asset_metadata,
    client_notes,
    ...rest,
  };
  if (parsed.data.id) insertPayload.id = parsed.data.id;

  const { data: request, error } = await supabase
    .from("project_requests")
    .insert(insertPayload)
    .select()
    .single();

  if (error) throw error;

  await supabase.rpc("increment_referral_use", { code_id: codeId });

  const { data: clientProfile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  await supabase.from("notifications").insert({
    user_id: freelancerId,
    type: "request_received",
    title: "New project request",
    body: `${clientProfile?.full_name ?? clientProfile?.email ?? "A client"} submitted: ${parsed.data.project_name}`,
    link: `/freelancer/requests/${request.id}`,
  });

  revalidatePath("/client");
  revalidatePath("/freelancer/requests");
  return { success: true, requestId: request.id as string };
}

export async function acceptProjectRequest(requestId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("accept_project_request", {
    p_request_id: requestId,
  });

  if (error) throw error;

  const workspaceId = data as string;
  revalidatePath("/freelancer/requests");
  revalidatePath("/freelancer/workspaces");
  revalidatePath("/client");
  return { success: true, workspaceId };
}

export async function rejectProjectRequest(requestId: string, reason: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: reqRow } = await supabase
    .from("project_requests")
    .select("client_id, project_name")
    .eq("id", requestId)
    .eq("freelancer_id", user.id)
    .single();

  if (!reqRow) throw new Error("Request not found");

  const { error } = await supabase
    .from("project_requests")
    .update({
      status: "rejected",
      rejected_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) throw error;

  await supabase.from("notifications").insert({
    user_id: reqRow.client_id,
    type: "request_rejected",
    title: "Project request update",
    body: `Your request "${reqRow.project_name}" was not accepted.`,
    link: "/client",
  });

  revalidatePath("/freelancer/requests");
  revalidatePath("/client");
  return { success: true };
}

export async function listIncomingRequests() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("project_requests")
    .select("*")
    .eq("freelancer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProjectRequest(id: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("project_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Not found");
  if (data.freelancer_id !== user.id && data.client_id !== user.id) {
    throw new Error("Forbidden");
  }
  return data;
}
