"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

export async function generateReferralCode() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const code = `CF-${nanoid()}`;

  const { data, error } = await supabase
    .from("referral_codes")
    .insert({ code, freelancer_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function validateReferralCode(code: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("validate_referral_code", {
    p_code: code.trim(),
  });

  if (error) return { valid: false as const, error: error.message };
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.valid) return { valid: false as const };

  const { data: freelancer } = await supabase
    .from("profiles")
    .select("id, full_name, email, company_name")
    .eq("id", row.freelancer_id)
    .single();

  return {
    valid: true as const,
    freelancer,
    codeId: row.code_id as string,
  };
}

export async function listMyReferralCodes() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("referral_codes")
    .select("*")
    .eq("freelancer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function toggleReferralCodeActive(id: string, is_active: boolean) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("referral_codes")
    .update({ is_active })
    .eq("id", id);

  if (error) throw error;
}
