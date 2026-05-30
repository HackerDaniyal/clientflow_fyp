"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const fullName = (formData.get("full_name") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim() || null;

  if (!fullName) throw new Error("Full name is required");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, bio })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/freelancer/settings");
  revalidatePath("/client/settings");
  return { success: true };
}
