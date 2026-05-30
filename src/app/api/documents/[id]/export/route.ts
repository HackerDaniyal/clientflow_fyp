import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: doc, error } = await supabase
    .from("workspace_documents")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, freelancer_id, client_id")
    .eq("id", doc.workspace_id)
    .single();

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const { data: member } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const allowed =
    workspace.freelancer_id === user.id ||
    workspace.client_id === user.id ||
    !!member;

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const content = doc.content as Record<string, unknown> | null;
  const lines = [
    `ClientFlow — ${String(doc.type).toUpperCase()}`,
    `Workspace: ${workspace.name}`,
    `Title: ${doc.title || "Untitled"}`,
    `Status: ${doc.status}`,
    `Amount: ${doc.amount ?? "N/A"}`,
    "",
    "--- Content ---",
    JSON.stringify(content, null, 2),
  ];

  const body = lines.join("\n");
  const filename = `${doc.type}-${doc.id.slice(0, 8)}.txt`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
