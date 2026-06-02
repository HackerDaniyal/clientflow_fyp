import { Topbar } from "@/components/layout/Topbar";
import { SignOutButton } from "@/components/layout/SignOutButton";

export default function AdminSettingsPage() {
  return (
    <>
      <Topbar title="Admin settings" />
      <div className="flex-1 px-4 py-6 md:px-6">
        <SignOutButton />
      </div>
    </>
  );
}
