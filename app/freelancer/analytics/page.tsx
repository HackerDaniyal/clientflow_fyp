import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/ui/Card";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

export default function FreelancerAnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" />
      <div className="flex-1 space-y-6 px-4 py-6 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total earned (demo)" value="$12,400" trend="+8% vs last month" trendUp />
          <StatCard label="Paid invoices" value="18" />
          <StatCard label="Hours billed" value="142" />
        </div>
        <div className="rounded-card border border-neutral-200 bg-white p-4 shadow-card">
          <p className="text-sm font-medium text-neutral-900">Monthly revenue</p>
          <p className="text-xs text-neutral-500">Wire to paid invoices query next.</p>
          <div className="mt-4">
            <RevenueChart />
          </div>
        </div>
      </div>
    </>
  );
}
