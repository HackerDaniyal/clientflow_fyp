import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = (message: string, userRole: string, workspaceContext: string) => {
  if (workspaceContext) {
    return `(${userRole}) I received your message about "${message.slice(0, 80)}". Context: ${workspaceContext}. Configure GEMINI_API_KEY for full AI responses.`;
  }
  return `(${userRole}) I received: "${message.slice(0, 120)}". Add GEMINI_API_KEY to enable Gemini-powered replies.`;
};

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, workspaceId, userRole } = body as {
      message: string;
      workspaceId?: string;
      userRole?: string;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let workspaceContext = "";
    if (workspaceId) {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("*, client:profiles!workspaces_client_id_fkey(full_name)")
        .eq("id", workspaceId)
        .single();

      if (workspace) {
        workspaceContext = `Workspace: ${workspace.name}, Type: ${workspace.project_type || "N/A"}, Status: ${workspace.status}, Client: ${(workspace as { client?: { full_name?: string } }).client?.full_name || "N/A"}`;
      }
    }

    const { data: history } = await supabase
      .from("ai_conversations")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const role = userRole || "freelancer";
    let response: string;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const historyText = (history ?? [])
        .reverse()
        .map((h) => `${h.role}: ${h.content}`)
        .join("\n");

      const prompt = `You are ClientFlow CRM assistant for a ${role}.
${workspaceContext ? `Workspace context: ${workspaceContext}` : ""}
Recent chat:
${historyText}

User: ${message}

Reply concisely and helpfully. Do not invent private data about other users.`;

      const result = await model.generateContent(prompt);
      response = result.response.text();
    } else {
      response = FALLBACK(message, role, workspaceContext);
    }

    await supabase.from("ai_conversations").insert({
      user_id: user.id,
      workspace_id: workspaceId || null,
      role: "user",
      content: message,
      context: { workspaceId, userRole: role },
    });

    await supabase.from("ai_conversations").insert({
      user_id: user.id,
      workspace_id: workspaceId || null,
      role: "assistant",
      content: response,
      context: { workspaceId, userRole: role },
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
