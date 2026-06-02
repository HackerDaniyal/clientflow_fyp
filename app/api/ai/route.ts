import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string | undefined;
  if (!role) return NextResponse.json({ error: "Profile missing" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message : "";
  const context = typeof body?.context === "string" ? body.context : "";

  if (!message.trim()) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const systemPrompt =
    role === "freelancer" || role === "admin"
      ? "You are a smart CRM assistant for a freelancer. Help draft proposals, emails, invoice descriptions, scopes, and concise business advice."
      : "You are a helpful assistant for a client portal. Explain status and documents in friendly, clear language.";

  try {
    const model = getGeminiModel();
    const prompt = [systemPrompt, context && `Context: ${context}`, `User: ${message}`]
      .filter(Boolean)
      .join("\n\n");
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Model error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
