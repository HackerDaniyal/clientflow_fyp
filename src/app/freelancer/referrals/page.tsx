import React from "react";
import {
  IconLink,
  IconPlus,
  IconUsers,
  IconTrendingUp,
  IconChartBar,
  IconHash,
  IconPercentage
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";
import { generateReferralCode } from "./actions";
import CopyCodeButton from "./CopyCodeButton";

export default async function ReferralsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch referral codes with usage stats
  const { data: codes } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('freelancer_id', user?.id)
    .order('created_at', { ascending: false });

  // Fetch linked clients for detailed analytics
  const { data: linkedClients } = await supabase
    .from('client_freelancer_links')
    .select('id, referral_code_id, created_at')
    .eq('freelancer_id', user?.id);

  // Calculate real stats
  const totalCodes = codes?.length || 0;
  const activeCodes = codes?.filter(c => c.is_active).length || 0;
  const inactiveCodes = totalCodes - activeCodes;
  const totalConversions = codes?.reduce((sum, c) => sum + (c.use_count || 0), 0) || 0;
  const usedCodes = codes?.filter(c => (c.use_count || 0) > 0).length || 0;

  // Meaningful conversion rate: % of codes that have been used at least once
  const conversionRate = totalCodes > 0
    ? ((usedCodes / totalCodes) * 100).toFixed(1)
    : "0";

  // Average uses per code
  const avgUsesPerCode = totalCodes > 0
    ? (totalConversions / totalCodes).toFixed(1)
    : "0";

  // Remaining capacity
  const totalCapacity = codes?.reduce((sum, c) => sum + (c.max_uses || 100), 0) || 0;
  const remainingCapacity = totalCapacity - totalConversions;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-brand-dark">Referral System</h1>
          <p className="text-sm text-text-secondary">Invite clients and track your conversion rate.</p>
        </div>
        <form action={generateReferralCode}>
          <button type="submit" className="pill-btn">
            <IconPlus size={16} stroke={2} />
            Generate New Code
          </button>
        </form>
      </header>

      {/* Stats Overview - 6 cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <IconHash size={16} stroke={2} />
            </div>
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Total Codes</span>
          </div>
          <p className="text-2xl font-semibold text-brand-dark">{totalCodes}</p>
        </div>

        <div className="card bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <IconLink size={16} stroke={2} />
            </div>
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Active</span>
          </div>
          <p className="text-2xl font-semibold text-brand-dark">{activeCodes}</p>
        </div>

        <div className="card bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <IconUsers size={16} stroke={2} />
            </div>
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Linked Clients</span>
          </div>
          <p className="text-2xl font-semibold text-brand-dark">{totalConversions}</p>
        </div>

        <div className="card bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <IconPercentage size={16} stroke={2} />
            </div>
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Conv. Rate</span>
          </div>
          <p className="text-2xl font-semibold text-brand-dark">{conversionRate}%</p>
          <p className="text-[10px] text-text-tertiary mt-1">{usedCodes} of {totalCodes} codes used</p>
        </div>

        <div className="card bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <IconTrendingUp size={16} stroke={2} />
            </div>
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Avg Uses/Code</span>
          </div>
          <p className="text-2xl font-semibold text-brand-dark">{avgUsesPerCode}</p>
        </div>

        <div className="card bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
              <IconChartBar size={16} stroke={2} />
            </div>
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Remaining</span>
          </div>
          <p className="text-2xl font-semibold text-brand-dark">{remainingCapacity}</p>
          <p className="text-[10px] text-text-tertiary mt-1">slots left</p>
        </div>
      </section>

      {/* Detailed Analytics Bar */}
      {totalCodes > 0 && (
        <section className="card bg-white">
          <h3 className="section-title mb-4">Usage Analytics</h3>
          <div className="space-y-4">
            {/* Usage bar */}
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-text-secondary">Overall Capacity</span>
                <span className="text-brand-dark font-medium">{totalConversions} / {totalCapacity} used</span>
              </div>
              <div className="w-full h-3 bg-brand-light/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-accent rounded-full transition-all"
                  style={{ width: `${totalCapacity > 0 ? (totalConversions / totalCapacity) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Active vs Inactive */}
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-text-secondary">Code Status</span>
                <span className="text-brand-dark font-medium">{activeCodes} active, {inactiveCodes} inactive</span>
              </div>
              <div className="w-full h-3 bg-brand-light/30 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${totalCodes > 0 ? (activeCodes / totalCodes) * 100 : 0}%` }}
                />
                <div
                  className="h-full bg-gray-300 rounded-full transition-all"
                  style={{ width: `${totalCodes > 0 ? (inactiveCodes / totalCodes) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Code List */}
      <section className="space-y-4">
        <h3 className="section-title">Your Referral Codes</h3>
        {codes && codes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {codes.map((code) => {
              const usagePercent = (code.max_uses || 100) > 0
                ? ((code.use_count || 0) / (code.max_uses || 100)) * 100
                : 0;
              const isFull = usagePercent >= 100;

              return (
                <div key={code.id} className="card bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`border-[0.5px] border-brand-light rounded-medium px-4 py-2 font-mono text-lg font-medium ${isFull ? 'bg-red-50 text-red-600' : 'bg-brand-surface text-brand-dark'}`}>
                      {code.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${code.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <p className="text-[13px] font-medium text-brand-dark">
                          {code.is_active ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <p className="text-[11px] text-text-tertiary">Created {new Date(code.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[11px] text-text-tertiary uppercase tracking-wider">Usage</p>
                      <p className={`text-[14px] font-medium ${isFull ? 'text-red-600' : 'text-brand-dark'}`}>
                        {code.use_count || 0} / {code.max_uses || 100}
                      </p>
                      {/* Mini progress bar */}
                      <div className="w-20 h-1.5 bg-brand-light/30 rounded-full mt-1 ml-auto overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isFull ? 'bg-red-500' : usagePercent > 75 ? 'bg-amber-500' : 'bg-brand-accent'}`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                    <CopyCodeButton code={code.code} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-12 border-dashed border-2">
            <IconLink size={48} stroke={1.5} className="mx-auto text-text-tertiary mb-3 opacity-20" />
            <p className="text-text-secondary">No referral codes yet. Generate one to start inviting clients.</p>
          </div>
        )}
      </section>

      {/* Recent Linked Clients */}
      {linkedClients && linkedClients.length > 0 && (
        <section className="card bg-white">
          <h3 className="section-title mb-4">Recent Linked Clients</h3>
          <div className="space-y-3">
            {linkedClients.slice(0, 5).map((link) => (
              <div key={link.id} className="flex items-center justify-between py-2 border-b border-brand-light last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent text-xs font-semibold">
                    C
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-brand-dark">Client Linked</p>
                    <p className="text-[11px] text-text-tertiary">
                      via code: {codes?.find(c => c.id === link.referral_code_id)?.code || "Unknown"}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-text-tertiary">
                  {new Date(link.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
