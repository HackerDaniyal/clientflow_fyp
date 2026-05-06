"use client";

import React from "react";
import { Info, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon?: React.ReactNode;
  showSparkline?: boolean;
}

export default function KPICard({
  label,
  value,
  trend,
  trendDirection,
  icon,
  showSparkline = false,
}: KPICardProps) {
  const isPositive = trendDirection === "up";

  return (
    <div className="kpi-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm font-medium">{label}</span>
            <Info className="w-4 h-4 text-text-secondary cursor-help" />
          </div>
          {icon ? (
            <div className="p-2 bg-primary-light rounded-button">{icon}</div>
          ) : (
            <div className="p-2 bg-primary-light rounded-button">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>

        <div className="mb-3">
          <h3 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary leading-tight">
            {value}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-error" />
          )}
          <span className={`text-sm font-semibold ${isPositive ? "text-success" : "text-error"}`}>
            {trend}
          </span>
          <span className="text-text-secondary text-sm">vs last month</span>
        </div>
      </div>

      {showSparkline && (
        <div className="mt-2 mb-3">
          <div className="flex items-end gap-1 h-8">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-primary opacity-30 rounded-sm"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      )}

      <a href="#" className="text-primary text-sm font-medium hover:opacity-80 transition-opacity inline-flex items-center gap-1" onClick={(e) => e.preventDefault()}>
        See Details
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
