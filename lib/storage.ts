import { createClient } from "@/lib/supabase/client";

export async function uploadProjectAsset(
  file: File,
  requestId: string
): Promise<{ path: string; metadata: { name: string; size: number; type: string } }> {
  const supabase = createClient();
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `requests/${requestId}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from("project-assets")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;
  return {
    path: data.path,
    metadata: { name: file.name, size: file.size, type: file.type },
  };
}

export function getAssetPublicUrl(path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from("project-assets").getPublicUrl(path);
  return data.publicUrl;
}
