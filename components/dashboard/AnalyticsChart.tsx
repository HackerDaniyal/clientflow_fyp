"use client";

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 8500 },
  { month: "Feb", revenue: 12000 },
  { month: "Mar", revenue: 9800 },
  { month: "Apr", revenue: 15000 },
  { month: "May", revenue: 11200 },
  { month: "Jun", revenue: 13500 },
  { month: "Jul", revenue: 16000 },
  { month: "Aug", revenue: 14200 },
  { month: "Sep", revenue: 17500 },
  { month: "Oct", revenue: 19000 },
  { month: "Nov", revenue: 16800 },
  { month: "Dec", revenue: 21000 },
];

type TimePeriod = "Monthly" | "Quarterly" | "Yearly";

interface AnalyticsChartProps {
  title?: string;
}

export default function AnalyticsChart({ title = "Revenue Overview" }: AnalyticsChartProps) {
  const [period, setPeriod] = useState<TimePeriod>("Monthly");

  const processData = (data: typeof revenueData, period: TimePeriod): Array<{ [key: string]: string | number }> => {
    if (period === "Monthly") return data;
    if (period === "Quarterly") {
      const quarters = [
        { quarter: "Q1", revenue: 0 },
        { quarter: "Q2", revenue: 0 },
        { quarter: "Q3", revenue: 0 },
        { quarter: "Q4", revenue: 0 },
      ];
      data.forEach((item, index) => {
        const quarterIndex = Math.floor(index / 3);
        quarters[quarterIndex].revenue += item.revenue;
      });
      return quarters.map((q) => ({ ...q, revenue: Math.round(q.revenue / 3) }));
    }
    if (period === "Yearly") {
      const total = data.reduce((sum, item) => sum + item.revenue, 0);
      return [{ year: "2024", revenue: Math.round(total / 12) }];
    }
    return data;
  };

  const chartData = processData(revenueData, period);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-card rounded-card shadow-card p-3 border border-border">
          <p className="text-text-primary font-semibold mb-1">
            {payload[0].payload.month || payload[0].payload.quarter || payload[0].payload.year}
          </p>
          <p className="text-primary font-bold">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        <div className="flex gap-2">
          {(["Monthly", "Quarterly", "Yearly"] as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-button transition-all ${
                period === p ? "bg-primary text-white" : "bg-background text-text-secondary hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5733" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF5733" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis
            dataKey={period === "Quarterly" ? "quarter" : period === "Yearly" ? "year" : "month"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} dx={-10} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#FF5733" strokeWidth={2} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 6, stroke: "#FF5733", strokeWidth: 2, fill: "#fff" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
