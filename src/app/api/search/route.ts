import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Only freelancers and admins can use global search
  if (!profile || (profile.role !== "freelancer" && profile.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pattern = `%${q}%`;
  const results: {
    workspaces: { id: string; name: string; type: string; status: string; href: string }[];
    clients: { id: string; name: string; email: string; href: string }[];
    documents: { id: string; title: string; type: string; workspace_id: string; href: string }[];
    referrals: { id: string; code: string; clicks: number; href: string }[];
  } = { workspaces: [], clients: [], documents: [], referrals: [] };

  // Search workspaces the freelancer owns
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("id, name, project_type, status")
    .ilike("name", pattern)
    .eq("freelancer_id", user.id)
    .limit(5);

  if (workspaces) {
    results.workspaces = workspaces.map((w) => ({
      id: w.id,
      name: w.name,
      type: w.project_type,
      status: w.status,
      href: `/workspace/${w.id}`,
    }));
  }

  // Search clients via client_freelancer_links + profiles
  const { data: clientLinks } = await supabase
    .from("client_freelancer_links")
    .select("client_id, profiles:client_id(full_name, email)")
    .eq("freelancer_id", user.id);

  if (clientLinks) {
    const matched = clientLinks.filter((cl: any) => {
      const name = cl.profiles?.full_name || "";
      const email = cl.profiles?.email || "";
      return (
        name.toLowerCase().includes(q.toLowerCase()) ||
        email.toLowerCase().includes(q.toLowerCase())
      );
    });
    results.clients = matched.slice(0, 5).map((cl: any) => ({
      id: cl.client_id,
      name: cl.profiles?.full_name || "Unknown",
      email: cl.profiles?.email || "",
      href: "/freelancer/clients",
    }));
  }

  // Search documents in freelancer's workspaces
  const { data: docs } = await supabase
    .from("workspace_documents")
    .select("id, title, type, workspace_id, workspaces!inner(freelancer_id)")
    .ilike("title", pattern)
    .eq("workspaces.freelancer_id", user.id)
    .limit(5);

  if (docs) {
    results.documents = docs.map((d: any) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      workspace_id: d.workspace_id,
      href: `/workspace/${d.workspace_id}?tab=documents`,
    }));
  }

  // Search referral codes
  const { data: referrals } = await supabase
    .from("referral_codes")
    .select("id, code, clicks")
    .eq("freelancer_id", user.id)
    .ilike("code", pattern)
    .limit(5);

  if (referrals) {
    results.referrals = referrals.map((r) => ({
      id: r.id,
      code: r.code,
      clicks: r.clicks,
      href: "/freelancer/referrals",
    }));
  }

  return NextResponse.json({ results });
}
