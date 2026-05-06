"use client";

import React from "react";

interface PerformanceGaugeProps {
  score?: number;
  label?: string;
  size?: number;
}

export default function PerformanceGauge({ score = 72, label = "Sales Performance", size = 240 }: PerformanceGaugeProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score < 50) return "#EF4444";
    if (score <= 75) return "#F59E0B";
    return "#10B981";
  };

  const gaugeColor = getColor(score);
  const gradientId = `gauge-gradient-${score}`;

  return (
    <div className="kpi-card flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold text-text-primary mb-4">{label}</h3>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gaugeColor} />
              <stop offset="100%" stopColor={score < 50 ? "#F87171" : score <= 75 ? "#FBBF24" : "#34D399"} />
            </linearGradient>
          </defs>

          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F0F0F0" strokeWidth={strokeWidth} />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: gaugeColor }}>
            {score}
          </span>
          <span className="text-text-secondary text-sm mt-1">out of 100</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error"></div>
          <span className="text-text-secondary">&lt; 50</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <span className="text-text-secondary">50-75</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span className="text-text-secondary">&gt; 75</span>
        </div>
      </div>
    </div>
  );
}
