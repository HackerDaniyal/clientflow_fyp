"use client";

import React from "react";
import { IconTrendingUp, IconFilter, IconStar } from "@tabler/icons-react";

type TimePoint = { date: string; count: number };
type FunnelStep = { label: string; value: number; color: string };
type TopCode = { code: string; label?: string | null; uses: number; maxUses: number };

export default function ReferralAnalyticsChart({
  timeSeries,
  funnel,
  topCodes,
  monthlyStats,
}: {
  timeSeries: TimePoint[];
  funnel: FunnelStep[];
  topCodes: TopCode[];
  monthlyStats: { month: string; created: number; linked: number }[];
}) {
  // Time series line chart
  const maxCount = Math.max(...timeSeries.map((t) => t.count), 1);
  const chartW = 100;
  const chartH = 40;
  const points = timeSeries
    .map((t, i) => {
      const x = (i / Math.max(timeSeries.length - 1, 1)) * chartW;
      const y = chartH - (t.count / maxCount) * chartH;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = points + ` ${chartW},${chartH} 0,${chartH}`;

  // Monthly bar chart
  const maxMonthly = Math.max(
    ...monthlyStats.map((m) => Math.max(m.created, m.linked)),
    1
  );

  return (
    <div className="space-y-6">
      {/* Row 1: Time series + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Time Series Chart (3 cols) */}
        <div className="lg:col-span-3 card bg-white">
          <div className="flex items-center gap-2 mb-4">
            <IconTrendingUp size={18} className="text-brand-accent" />
            <h3 className="text-[14px] font-medium text-brand-dark">Referral Activity — Last 90 Days</h3>
          </div>
          {timeSeries.length > 0 && timeSeries.some((t) => t.count > 0) ? (
            <div>
              <svg viewBox={`0 0 ${chartW} ${chartH + 5}`} className="w-full h-36" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3ACF84" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3ACF84" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <line
                    key={pct}
                    x1="0"
                    y1={chartH - (pct / 100) * chartH}
                    x2={chartW}
                    y2={chartH - (pct / 100) * chartH}
                    stroke="#E5E5E5"
                    strokeWidth="0.3"
                  />
                ))}
                {/* Area fill */}
                <polygon points={areaPoints} fill="url(#refGrad)" />
                {/* Line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke="#3ACF84"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex justify-between text-[10px] text-text-tertiary mt-1">
                <span>{timeSeries[0]?.date}</span>
                <span>{timeSeries[Math.floor(timeSeries.length / 2)]?.date}</span>
                <span>{timeSeries[timeSeries.length - 1]?.date}</span>
              </div>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-[13px] text-text-tertiary">
              No referral activity in the last 90 days
            </div>
          )}
        </div>

        {/* Conversion Funnel (2 cols) */}
        <div className="lg:col-span-2 card bg-white">
          <div className="flex items-center gap-2 mb-4">
            <IconFilter size={18} className="text-brand-accent" />
            <h3 className="text-[14px] font-medium text-brand-dark">Conversion Funnel</h3>
          </div>
          <div className="space-y-3">
            {funnel.map((step, i) => {
              const maxVal = funnel[0]?.value || 1;
              const pct = (step.value / maxVal) * 100;
              return (
                <div key={step.label}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-text-secondary">{step.label}</span>
                    <span className="font-medium text-brand-dark">{step.value}</span>
                  </div>
                  <div className="w-full h-6 bg-brand-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 flex items-center px-3"
                      style={{
                        width: `${Math.max(pct, 5)}%`,
                        backgroundColor: step.color,
                      }}
                    >
                      {pct > 20 && (
                        <span className="text-[10px] font-medium text-white">
                          {pct.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  {i < funnel.length - 1 && funnel[i + 1].value < step.value && (
                    <div className="text-[10px] text-text-tertiary text-right mt-0.5">
                      {((1 - funnel[i + 1].value / step.value) * 100).toFixed(0)}% drop-off
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Monthly comparison + Top codes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Stats Bar Chart */}
        <div className="card bg-white">
          <h3 className="text-[14px] font-medium text-brand-dark mb-4">Monthly — Created vs Linked</h3>
          {monthlyStats.length > 0 ? (
            <div className="space-y-2.5">
              {monthlyStats.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-[11px] text-text-tertiary w-12 shrink-0">{m.month}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-brand-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-dark rounded-full"
                          style={{ width: `${(m.created / maxMonthly) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-text-tertiary w-5 text-right">{m.created}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-brand-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-accent rounded-full"
                          style={{ width: `${(m.linked / maxMonthly) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-text-tertiary w-5 text-right">{m.linked}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-brand-light/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-dark" />
                  <span className="text-[10px] text-text-tertiary">Codes Created</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
                  <span className="text-[10px] text-text-tertiary">Clients Linked</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-text-tertiary text-center py-6">No monthly data</p>
          )}
        </div>

        {/* Top Performing Codes */}
        <div className="card bg-white">
          <div className="flex items-center gap-2 mb-4">
            <IconStar size={18} className="text-brand-accent" />
            <h3 className="text-[14px] font-medium text-brand-dark">Top Performing Codes</h3>
          </div>
          {topCodes.length > 0 ? (
            <div className="space-y-3">
              {topCodes.slice(0, 6).map((c, i) => {
                const pct = c.maxUses > 0 ? (c.uses / c.maxUses) * 100 : 0;
                return (
                  <div key={c.code} className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      i === 0 ? "bg-brand-accent text-white" : i === 1 ? "bg-brand-dark text-white" : "bg-brand-surface text-text-tertiary"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-mono font-medium text-brand-dark">{c.code}</span>
                        {c.label && (
                          <span className="text-[10px] bg-brand-surface text-brand-mid px-2 py-0.5 rounded-full">{c.label}</span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-brand-surface rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct >= 80 ? "bg-amber-500" : "bg-brand-accent"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-brand-dark shrink-0">{c.uses}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-text-tertiary text-center py-6">No codes with usage yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
