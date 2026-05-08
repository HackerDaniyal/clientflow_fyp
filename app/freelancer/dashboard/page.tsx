"use client";

import React, { useState, useEffect } from "react";
import KPICard from "@/components/dashboard/KPICard";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import PerformanceGauge from "@/components/dashboard/PerformanceGauge";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  Zap,
  Calendar,
  ChevronRight,
  Target
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-10 animate-pulse p-8">
        <div className="flex justify-between items-end">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-[32px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[450px] lg:col-span-2 rounded-[32px]" />
          <Skeleton className="h-[450px] rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 p-8">
      {/* Human-Centric Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20 flex items-center gap-2">
              <Zap size={12} fill="currentColor" />
              Busiest Day This Week
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {greeting}, <span className="text-primary">Alex</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg font-medium max-w-xl">
            You have <span className="text-slate-900 font-bold underline decoration-primary/30 decoration-4 underline-offset-4">3 new proposals</span> to review and a client meeting in <span className="text-slate-900 font-bold">45 minutes</span>.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-4 bg-white border border-slate-100 rounded-[20px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-3">
            <Calendar size={18} className="text-slate-400" />
            Schedule
          </button>
          <button className="px-8 py-4 bg-primary text-white rounded-[20px] font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
            <Plus size={20} />
            New Project
          </button>
        </div>
      </div>

      {/* KPI Cards (Humanized Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Revenue"
          value="$24,064"
          trend="+18.5%"
          trendDirection="up"
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          showSparkline
        />
        <KPICard
          label="Active Clients"
          value="12"
          trend="+2"
          trendDirection="up"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <KPICard
          label="Conversion Rate"
          value="64%"
          trend="-2.4%"
          trendDirection="down"
          icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
          showSparkline
        />
        <div className="bg-slate-900 rounded-[32px] p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Goal Progress</p>
              <h3 className="text-3xl font-black text-white">$15k <span className="text-slate-500 text-lg">/ $20k</span></h3>
            </div>
            <div className="mt-6">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-xs text-slate-400 mt-3 font-medium flex items-center justify-between">
                <span>Monthly Target</span>
                <span className="text-white font-bold">75%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bespoke Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div className="space-y-8">
          <PerformanceGauge score={84} />
          
          {/* Custom Insight Card (The "Human" Touch) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Sparkles size={48} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-3 leading-tight">Insight: Revenue is surging!</h4>
              <p className="text-indigo-100/80 text-sm leading-relaxed mb-6 font-medium">
                Your proposal acceptance rate is <span className="text-white font-bold underline decoration-white/30 decoration-2 underline-offset-4">up by 12%</span> this week. Consider increasing your rates for the next 3 leads.
              </p>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-all">
                Learn Strategy
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityFeed title="Latest Pulse" maxItems={6} />
        
        <div className="p-10 bg-white rounded-[32px] border border-slate-100 shadow-premium flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Business Vitals</h3>
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="space-y-8 flex-1">
            {[
              { label: "Client Satisfaction", value: "4.9/5.0", trend: "+0.3", trendColor: "text-emerald-600", icon: Sparkles },
              { label: "Avg. Response Time", value: "1.4 hrs", trend: "-15m", trendColor: "text-emerald-600", icon: Clock },
              { label: "Proposal Win Rate", value: "82%", trend: "+5%", trendColor: "text-emerald-600", icon: Target },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-primary/5 group-hover:text-primary transition-all flex items-center justify-center text-slate-400">
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn("text-sm font-black px-2 py-1 bg-slate-50 rounded-lg", stat.trendColor)}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-12 w-full py-5 bg-slate-50 hover:bg-slate-100 rounded-2xl font-black text-slate-900 text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
            View Full Report
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
