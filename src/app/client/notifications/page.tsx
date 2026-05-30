import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNotifications } from "@/lib/notifications";
import NotificationsInbox from "@/components/NotificationsInbox";

export default async function ClientNotificationsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const notifications = await getNotifications(user.id);

  return (
    <NotificationsInbox notifications={notifications} portalHome="/client/dashboard" />
  );
}
