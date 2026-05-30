import { createClient } from "@/lib/supabase/server";

export type NotificationRow = {
  id: string;
  type: string | null;
  title: string;
  body: string | null;
  is_read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
};

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  return count ?? 0;
}

export async function getNotifications(userId: string, limit = 30): Promise<NotificationRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, type, title, body, is_read, data, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as NotificationRow[];
}
