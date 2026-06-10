import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = (message: string, userRole: string, workspaceContext: string) => {
  if (workspaceContext) {
    return `(${userRole}) I received your message about "${message.slice(0, 80)}". Context: ${workspaceContext}. Configure GEMINI_API_KEY for full AI responses.`;
  }
  return `(${userRole}) I received: "${message.slice(0, 120)}". Add GEMINI_API_KEY to enable Gemini-powered replies.`;
};

/**
 * Build a rich workspace context string by fetching:
 *   - workspace metadata (name, type, status, client, freelancer)
 *   - last 20 chat messages with sender names
 *   - project request form_data (original client brief)
 *   - task summary (counts by status)
 */
async function buildWorkspaceContext(
  supabase: ReturnType<typeof createClient>,
  workspaceId: string
): Promise<string> {
  const parts: string[] = [];

  // ── 1. Workspace metadata ──
  const { data: workspace } = await supabase
    .from("workspaces")
    .select(
      "*, client:profiles!workspaces_client_id_fkey(full_name), freelancer:profiles!workspaces_freelancer_id_fkey(full_name)"
    )
    .eq("id", workspaceId)
    .single();

  if (!workspace) return "";

  const ws = workspace as typeof workspace & {
    client?: { full_name?: string };
    freelancer?: { full_name?: string };
  };
  parts.push(
    `[Workspace]`,
    `Name: ${workspace.name}`,
    `Type: ${workspace.project_type || "N/A"}`,
    `Status: ${workspace.status}`,
    `Pipeline Stage: ${workspace.pipeline_stage || "N/A"}`,
    `Client: ${ws.client?.full_name || "N/A"}`,
    `Freelancer: ${ws.freelancer?.full_name || "N/A"}`
  );

  // ── 2. Last 20 chat messages ──
  try {
    const { data: recentMessages } = await supabase
      .from("messages")
      .select("content, sender:sender_id(full_name), created_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (recentMessages && recentMessages.length > 0) {
      parts.push(`\n[Recent Chat Messages (last ${recentMessages.length})]`);
      // Reverse so oldest is first for chronological reading
      const reversed = [...recentMessages].reverse();
      for (const msg of reversed) {
        const sender =
          (msg.sender as unknown as { full_name?: string })?.full_name ||
          "Unknown";
        const time = new Date(msg.created_at).toLocaleString();
        // Truncate very long messages to keep prompt manageable
        const content =
          msg.content.length > 200
            ? msg.content.slice(0, 200) + "…"
            : msg.content;
        parts.push(`${sender} (${time}): ${content}`);
      }
    } else {
      parts.push("\n[Chat: No messages yet]");
    }
  } catch {
    // messages table query may fail gracefully
    parts.push("\n[Chat: Unable to load messages]");
  }

  // ── 3. Project request form data (original brief) ──
  if (workspace.request_id) {
    try {
      const { data: request } = await supabase
        .from("project_requests")
        .select("form_data, status")
        .eq("id", workspace.request_id)
        .single();

      if (request?.form_data) {
        const fd = request.form_data as Record<string, unknown>;
        parts.push("\n[Original Project Brief]");
        // Extract key brief fields
        const briefFields = [
          ["project_name", "Project Name"],
          ["project_type", "Project Type"],
          ["description", "Description"],
          ["budget_range", "Budget Range"],
          ["timeline_start", "Timeline Start"],
          ["timeline_end", "Timeline End"],
          ["business_name", "Business Name"],
          ["industry", "Industry"],
          ["target_audience", "Target Audience"],
          ["brand_fonts", "Brand Fonts"],
          ["technology_preferences", "Tech Preferences"],
          ["integrations", "Integrations"],
          ["special_requirements", "Special Requirements"],
          ["social_media", "Social Media"],
        ] as const;

        for (const [key, label] of briefFields) {
          const val = fd[key];
          if (val && val !== "" && !(Array.isArray(val) && val.length === 0)) {
            parts.push(`${label}: ${Array.isArray(val) ? val.join(", ") : val}`);
          }
        }
        // Competitors (array)
        const competitors = fd.competitors as string[] | undefined;
        if (competitors?.length) {
          parts.push(`Competitors: ${competitors.join(", ")}`);
        }
        // Brand colors (array)
        const colors = fd.brand_colors as string[] | undefined;
        if (colors?.length) {
          parts.push(`Brand Colors: ${colors.join(", ")}`);
        }
        // Platforms (array)
        const platforms = fd.platforms as string[] | undefined;
        if (platforms?.length) {
          parts.push(`Platforms: ${platforms.join(", ")}`);
        }
        // Assets summary (don't include URLs, just counts)
        const assets = fd.assets as
          | {
              logo?: unknown;
              references?: unknown[];
              documents?: unknown[];
            }
          | undefined;
        if (assets) {
          const assetParts: string[] = [];
          if (assets.logo) assetParts.push("1 logo");
          if (assets.references?.length)
            assetParts.push(`${assets.references.length} reference images`);
          if (assets.documents?.length)
            assetParts.push(`${assets.documents.length} documents`);
          if (assetParts.length) parts.push(`Assets: ${assetParts.join(", ")}`);
        }
      }
    } catch {
      parts.push("\n[Project Brief: Unable to load]");
    }
  }

  // ── 4. Task summary ──
  try {
    const { data: tasks } = await supabase
      .from("tasks")
      .select("status")
      .eq("workspace_id", workspaceId);

    if (tasks && tasks.length > 0) {
      const counts: Record<string, number> = {};
      for (const t of tasks) {
        counts[t.status] = (counts[t.status] || 0) + 1;
      }
      const summary = Object.entries(counts)
        .map(([status, count]) => `${count} ${status}`)
        .join(", ");
      parts.push(
        `\n[Tasks] ${tasks.length} total: ${summary}`
      );
    } else {
      parts.push("\n[Tasks: None created yet]");
    }
  } catch {
    parts.push("\n[Tasks: Unable to load]");
  }

  return parts.join("\n");
}

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

    // ── Build rich workspace context ──
    let workspaceContext = "";
    if (workspaceId) {
      workspaceContext = await buildWorkspaceContext(supabase, workspaceId);
    }

    // ── AI conversation history (user's past AI chats) ──
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
        .map((h: { role: string; content: string }) => `${h.role}: ${h.content}`)
        .join("\n");

      const prompt = `You are ClientFlow CRM assistant for a ${role}.
You help with project management, proposals, invoices, contracts, client communication, and task tracking.
Be concise and helpful. Use the workspace context below to give informed, specific answers.
Do NOT invent private data about other users that isn't in the context.

${workspaceContext ? `--- WORKSPACE CONTEXT ---\n${workspaceContext}\n--- END CONTEXT ---` : "(No workspace selected)"}

--- RECENT AI CONVERSATION ---
${historyText || "(No prior conversation)"}
--- END CONVERSATION ---

User: ${message}

Reply concisely and helpfully. If the user asks about the workspace, use the context above to give specific, accurate answers.`;

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
