"use client";

import React, { useState, useEffect } from "react";
import KPICard from "@/components/dashboard/KPICard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import PerformanceGauge from "@/components/dashboard/PerformanceGauge";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { Users, FileText, DollarSign, TrendingUp, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Welcome back, Alex! Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Client
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Proposal
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Active Clients"
          value="8"
          trend="12%"
          trendDirection="up"
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <KPICard
          label="Open Proposals"
          value="5"
          trend="8%"
          trendDirection="up"
          icon={<FileText className="w-5 h-5 text-primary" />}
          showSparkline
        />
        <KPICard
          label="Pending Invoices"
          value="$14,850"
          trend="3%"
          trendDirection="down"
          icon={<DollarSign className="w-5 h-5 text-primary" />}
        />
        <KPICard
          label="Revenue This Month"
          value="$24,064"
          trend="18%"
          trendDirection="up"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          showSparkline
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <PerformanceGauge score={72} />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed title="Recent Activity" maxItems={6} />
        
        {/* Quick Stats */}
        <div className="kpi-card">
          <h3 className="text-lg font-bold text-text-primary mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-sm text-text-secondary">Total Earnings (2024)</p>
                <p className="text-2xl font-bold text-text-primary mt-1">$142,580</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-success font-semibold">↑ 24%</p>
                <p className="text-xs text-text-secondary">vs last year</p>
              </div>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-sm text-text-secondary">Proposal Acceptance Rate</p>
                <p className="text-2xl font-bold text-text-primary mt-1">78%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-success font-semibold">↑ 5%</p>
                <p className="text-xs text-text-secondary">vs last quarter</p>
              </div>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-sm text-text-secondary">Avg. Project Duration</p>
                <p className="text-2xl font-bold text-text-primary mt-1">6.2 weeks</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-error font-semibold">↑ 1.2w</p>
                <p className="text-xs text-text-secondary">vs average</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Client Satisfaction</p>
                <p className="text-2xl font-bold text-text-primary mt-1">4.8/5.0</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-success font-semibold">↑ 0.3</p>
                <p className="text-xs text-text-secondary">vs last year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
