import { NextResponse } from "next/server";

/** Stub for Supabase database webhooks — verify signature and enqueue email in production. */
export async function POST() {
  return NextResponse.json({ ok: true });
}
