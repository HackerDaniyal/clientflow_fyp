import { Suspense } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { IntakeWizard } from "@/components/forms/IntakeWizard";

export default function IntakePage() {
  return (
    <>
      <Topbar title="Project intake" />
      <div className="flex-1 px-4 py-6 md:px-6">
        <Suspense fallback={<p className="text-sm text-neutral-600">Loading wizard…</p>}>
          <IntakeWizard />
        </Suspense>
      </div>
    </>
  );
}
