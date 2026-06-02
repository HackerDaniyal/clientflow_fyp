"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DocumentType } from "@/types";

export async function listDocuments(workspaceId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getDocument(documentId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (error || !data) throw new Error("Document not found");
  return data;
}

export async function createDocument(
  workspaceId: string,
  type: DocumentType,
  content: object,
  title?: string,
  totalAmount?: number,
  dueDate?: string
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const defaultTitle = `${type.charAt(0).toUpperCase() + type.slice(1)} — ${new Date().toLocaleDateString()}`;

  const { data: doc, error } = await supabase
    .from("documents")
    .insert({
      workspace_id: workspaceId,
      type,
      title: title ?? defaultTitle,
      content,
      total_amount: totalAmount ?? null,
      due_date: dueDate ?? null,
      created_by: user.id,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/freelancer/workspaces/${workspaceId}/documents`);
  revalidatePath(`/client/workspaces/${workspaceId}/documents`);
  return doc;
}

export async function sendDocument(documentId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: doc, error } = await supabase
    .from("documents")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", documentId)
    .select("id, workspace_id, type")
    .single();

  if (error || !doc) throw error;

  const { data: ws } = await supabase
    .from("workspaces")
    .select("client_id, name")
    .eq("id", doc.workspace_id)
    .single();

  if (ws?.client_id) {
    await supabase.from("notifications").insert({
      user_id: ws.client_id,
      type: `${doc.type}_received`,
      title: `New ${doc.type}`,
      body: `You have a new ${doc.type} for ${ws.name}.`,
      link: `/client/workspaces/${doc.workspace_id}/documents/${documentId}`,
      workspace_id: doc.workspace_id,
    });
  }

  revalidatePath(`/freelancer/workspaces/${doc.workspace_id}/documents`);
  revalidatePath(`/client/workspaces/${doc.workspace_id}/documents`);
  return { success: true };
}

export async function markDocumentViewed(documentId: string) {
  const supabase = await createServerSupabaseClient();
  await supabase
    .from("documents")
    .update({ status: "viewed", viewed_at: new Date().toISOString() })
    .eq("id", documentId)
    .in("status", ["sent"]);

  const { data: d } = await supabase
    .from("documents")
    .select("workspace_id")
    .eq("id", documentId)
    .single();

  if (d?.workspace_id) {
    revalidatePath(`/client/workspaces/${d.workspace_id}/documents/${documentId}`);
  }
}

export async function signContract(documentId: string, signatureText: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .update({
      signature_text: signatureText,
      signed_at: new Date().toISOString(),
      status: "approved",
    })
    .eq("id", documentId)
    .eq("type", "contract")
    .select("workspace_id")
    .single();

  if (error) throw error;
  if (data?.workspace_id) {
    revalidatePath(`/client/workspaces/${data.workspace_id}/documents/${documentId}`);
  }
}

export async function markInvoicePaid(documentId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", documentId)
    .eq("type", "invoice")
    .select("workspace_id")
    .single();

  if (error) throw error;
  if (data?.workspace_id) {
    revalidatePath(`/freelancer/workspaces/${data.workspace_id}/documents`);
    revalidatePath(`/client/workspaces/${data.workspace_id}/documents`);
  }
}

export async function markInvoiceOverdue(documentId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("documents")
    .update({ status: "overdue" })
    .eq("id", documentId)
    .select("workspace_id")
    .single();

  if (data?.workspace_id) {
    revalidatePath(`/freelancer/workspaces/${data.workspace_id}/documents`);
  }
}
