import { Topbar } from "@/components/layout/Topbar";
import { listMyReferralCodes } from "@/app/actions/referral";
import { ReferralManager } from "./referral-manager";

export default async function FreelancerReferralPage() {
  const codes = await listMyReferralCodes();
  return (
    <>
      <Topbar title="Referral codes" />
      <div className="flex-1 px-4 py-6 md:px-6">
        <ReferralManager initial={codes} />
      </div>
    </>
  );
}
