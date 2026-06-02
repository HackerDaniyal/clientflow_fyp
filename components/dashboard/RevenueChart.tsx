"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const mock = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 2800 },
  { month: "Mar", revenue: 4100 },
  { month: "Apr", revenue: 3600 },
];

export function RevenueChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mock}>
          <XAxis dataKey="month" stroke="#5A5A5A" fontSize={12} />
          <YAxis stroke="#5A5A5A" fontSize={12} />
          <Tooltip />
          <Bar dataKey="revenue" fill="#2F9B65" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
