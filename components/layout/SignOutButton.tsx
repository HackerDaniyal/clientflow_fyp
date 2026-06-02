"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <Card className="p-4">
      <Button
        type="button"
        variant="danger"
        onClick={async () => {
          await supabase.auth.signOut();
          router.replace("/");
          router.refresh();
        }}
      >
        Sign out
      </Button>
    </Card>
  );
}
