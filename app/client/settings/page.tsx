import { Topbar } from "@/components/layout/Topbar";
import { SignOutButton } from "@/components/layout/SignOutButton";

export default function ClientSettingsPage() {
  return (
    <>
      <Topbar title="Settings" />
      <div className="flex-1 px-4 py-6 md:px-6">
        <SignOutButton />
      </div>
    </>
  );
}
