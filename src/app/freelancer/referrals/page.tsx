import React from "react";
import {
  IconLink,
  IconPlus,
  IconUsers,
  IconTrendingUp,
  IconChartBar,
  IconHash,
  IconPercentage,
  IconTag,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";
import { generateReferralCode } from "./actions";
import ReferralAnalyticsChart from "./ReferralAnalyticsChart";
import CampaignCodeList from "./CampaignCodeList";

export default async function ReferralsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch referral codes with usage stats
  const { data: codes } = await supabase
    .from("referral_codes")
    .select("*")
    .eq("freelancer_id", user?.id)
    .order("created_at", { ascending: false });

  // Fetch linked clients with client name
  const { data: linkedClients } = await supabase
    .from("client_freelancer_links")
    .select(
      `id, referral_code_id, client_id, created_at,
       client:client_id(full_name, avatar_url)`
    )
    .eq("freelancer_id", user?.id)
    .order("created_at", { ascending: false });

  // Fetch active workspaces linked to these codes
  const linkedClientIds = linkedClients?.map((l) => l.client_id) || [];
  let activeWorkspaces = 0;
  if (linkedClientIds.length > 0) {
    const { count } = await supabase
      .from("workspaces")
      .select("*", { count: "exact", head: true })
      .in("client_id", linkedClientIds)
      .eq("freelancer_id", user?.id)
      .eq("status", "active");
    activeWorkspaces = count || 0;
  }

  // ── Stats ──
  const allCodes = codes || [];
  const totalCodes = allCodes.length;
  const activeCodes = allCodes.filter((c) => c.is_active).length;
  const inactiveCodes = totalCodes - activeCodes;
  const totalConversions = allCodes.reduce((s, c) => s + (c.use_count || 0), 0);
  const usedCodes = allCodes.filter((c) => (c.use_count || 0) > 0).length;
  const conversionRate = totalCodes > 0 ? ((usedCodes / totalCodes) * 100).toFixed(1) : "0";
  const avgUsesPerCode = totalCodes > 0 ? (totalConversions / totalCodes).toFixed(1) : "0";
  const totalCapacity = allCodes.reduce((s, c) => s + (c.max_uses || 100), 0);
  const remainingCapacity = totalCapacity - totalConversions;

  // ── Campaign aggregation ──
  const campaignMap = new Map<string, { label: string; codeCount: number; totalUses: number; activeCodes: number }>();
  for (const c of allCodes) {
    const key = c.label || "";
    const existing = campaignMap.get(key) || { label: c.label || "", codeCount: 0, totalUses: 0, activeCodes: 0 };
    existing.codeCount++;
    existing.totalUses += c.use_count || 0;
    if (c.is_active) existing.activeCodes++;
    campaignMap.set(key, existing);
  }
  const campaigns = Array.from(campaignMap.values())
    .filter((c) => c.label)
    .sort((a, b) => b.totalUses - a.totalUses);

  // ── Time series (last 90 days) ──
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const timeSeries: { date: string; count: number }[] = [];
  const linkDates = linkedClients?.map((l) => l.created_at) || [];

  for (let d = new Date(ninetyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const dayStr = d.toISOString().split("T")[0];
    const count = linkDates.filter((ld) => ld.startsWith(dayStr)).length;
    timeSeries.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    });
  }

  // ── Funnel ──
  const funnel = [
    { label: "Codes Generated", value: totalCodes, color: "#1A3D2B" },
    { label: "Codes Shared (used ≥1)", value: usedCodes, color: "#1A6B45" },
    { label: "Clients Linked", value: totalConversions, color: "#3ACF84" },
    { label: "Active Workspaces", value: activeWorkspaces, color: "#2F9B65" },
  ];

  // ── Top codes ──
  const topCodes = [...allCodes]
    .sort((a, b) => (b.use_count || 0) - (a.use_count || 0))
    .slice(0, 6)
    .map((c) => ({
      code: c.code,
      label: c.label || null,
      uses: c.use_count || 0,
      maxUses: c.max_uses || 100,
    }));

  // ── Monthly stats ──
  const monthlyStats: { month: string; created: number; linked: number }[] = [];
  const codeDates = allCodes.map((c) => c.created_at);
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toLocaleDateString("en-US", { month: "short" });
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const created = codeDates.filter((cd) => cd.startsWith(yearMonth)).length;
    const linked = linkDates.filter((ld) => ld.startsWith(yearMonth)).length;
    monthlyStats.push({ month: monthStr, created, linked });
  }

  // ── Prepare serializable codes for client component ──
  const serializableCodes = allCodes.map((c) => ({
    id: c.id,
    code: c.code,
    label: c.label || null,
    is_active: c.is_active,
    use_count: c.use_count || 0,
    max_uses: c.max_uses || 100,
    created_at: c.created_at,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-brand-dark">Referral Analytics</h1>
          <p className="text-[13px] text-text-secondary">Track campaign performance and client conversions.</p>
        </div>
        <form action={generateReferralCode} className="flex items-center gap-2">
          <input
            type="text"
            name="label"
            placeholder="Campaign label (optional)"
            className="bg-brand-surface border border-brand-light rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand-accent w-48"
          />
          <button type="submit" className="pill-btn bg-brand-accent text-white">
            <IconPlus size={16} stroke={2} />
            Generate Code
          </button>
        </form>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-brand-mid">
              <IconHash size={16} />
            </div>
          </div>
          <p className="text-2xl font-medium text-brand-dark">{totalCodes}</p>
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider mt-0.5">Total Codes</p>
        </div>
        <div className="card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-brand-accent">
              <IconLink size={16} />
            </div>
          </div>
          <p className="text-2xl font-medium text-brand-dark">{activeCodes}</p>
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider mt-0.5">Active</p>
        </div>
        <div className="card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-brand-green">
              <IconUsers size={16} />
            </div>
          </div>
          <p className="text-2xl font-medium text-brand-dark">{totalConversions}</p>
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider mt-0.5">Linked Clients</p>
        </div>
        <div className="card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-amber-600">
              <IconPercentage size={16} />
            </div>
          </div>
          <p className="text-2xl font-medium text-brand-dark">{conversionRate}%</p>
          <p className="text-[10px] text-text-tertiary mt-0.5">{usedCodes} of {totalCodes} used</p>
        </div>
        <div className="card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-indigo-600">
              <IconTrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-medium text-brand-dark">{avgUsesPerCode}</p>
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider mt-0.5">Avg Uses/Code</p>
        </div>
        <div className="card bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center text-teal-600">
              <IconChartBar size={16} />
            </div>
          </div>
          <p className="text-2xl font-medium text-brand-dark">{remainingCapacity}</p>
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider mt-0.5">Slots Left</p>
        </div>
      </section>

      {/* Campaign Performance Section */}
      {campaigns.length > 0 && (
        <section className="card bg-white">
          <div className="flex items-center gap-2 mb-5">
            <IconTag size={18} className="text-brand-accent" />
            <h3 className="text-[15px] font-medium text-brand-dark">Campaign Performance</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((camp) => {
              const convPct = camp.codeCount > 0 ? (camp.activeCodes / camp.codeCount) * 100 : 0;
              const usePct = totalCapacity > 0 ? (camp.totalUses / totalCapacity) * 100 : 0;
              return (
                <div key={camp.label} className="border border-brand-light rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-brand-dark flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-accent" />
                      {camp.label}
                    </span>
                    <span className="text-[11px] text-text-tertiary">{camp.codeCount} codes</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xl font-medium text-brand-dark">{camp.totalUses}</p>
                      <p className="text-[10px] text-text-tertiary">Total Uses</p>
                    </div>
                    <div>
                      <p className="text-xl font-medium text-brand-dark">{camp.activeCodes}</p>
                      <p className="text-[10px] text-text-tertiary">Active</p>
                    </div>
                  </div>
                  {/* Usage bar */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-text-tertiary">Activation rate</span>
                      <span className="text-brand-dark font-medium">{convPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-accent rounded-full transition-all"
                        style={{ width: `${convPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Analytics Charts */}
      <ReferralAnalyticsChart
        timeSeries={timeSeries}
        funnel={funnel}
        topCodes={topCodes}
        monthlyStats={monthlyStats}
      />

      {/* Code List with Campaign Filter */}
      <section className="space-y-4">
        <h3 className="text-[15px] font-medium text-brand-dark">Your Referral Codes</h3>
        {allCodes.length > 0 ? (
          <CampaignCodeList codes={serializableCodes} campaigns={campaigns} />
        ) : (
          <div className="card text-center py-12 border-dashed border-2">
            <IconLink size={48} stroke={1.5} className="mx-auto text-text-tertiary mb-3 opacity-20" />
            <p className="text-text-secondary">
              No referral codes yet. Generate one to start inviting clients.
            </p>
          </div>
        )}
      </section>

      {/* Recent Linked Clients */}
      {linkedClients && linkedClients.length > 0 && (
        <section className="card bg-white">
          <h3 className="text-[15px] font-medium text-brand-dark mb-4">Recent Linked Clients</h3>
          <div className="space-y-3">
            {linkedClients.slice(0, 8).map((link) => {
              const refCode = allCodes.find((c) => c.id === link.referral_code_id);
              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between py-2 border-b border-brand-light/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-accent/15 flex items-center justify-center text-brand-accent text-[11px] font-semibold">
                      {(link.client as { full_name?: string })?.full_name
                        ?.split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-brand-dark">
                        {(link.client as { full_name?: string })?.full_name || "Client"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] text-text-tertiary">
                          via{" "}
                          <span className="font-mono text-brand-mid">{refCode?.code || "Unknown"}</span>
                        </p>
                        {refCode?.label && (
                          <span className="text-[10px] bg-brand-surface text-brand-mid px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <IconTag size={9} />
                            {refCode.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-text-tertiary">
                    {new Date(link.created_at).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
