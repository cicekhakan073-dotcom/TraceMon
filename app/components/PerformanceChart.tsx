"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Period = "7D" | "30D" | "90D" | "ALL";

function generatePnLData(days: number, trend: number): { day: string; pnl: number }[] {
  const data: { day: string; pnl: number }[] = [];
  let cumulative = 0;
  for (let i = 0; i < days; i++) {
    cumulative += (Math.random() - 0.35) * trend;
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    data.push({
      day: `${date.getMonth() + 1}/${date.getDate()}`,
      pnl: Math.round(cumulative * 100) / 100,
    });
  }
  return data;
}

export function PerformanceChart({ positive }: { positive: boolean }) {
  const [period, setPeriod] = useState<Period>("30D");

  const data = useMemo(() => {
    const days = period === "7D" ? 7 : period === "30D" ? 30 : period === "90D" ? 90 : 180;
    return generatePnLData(days, positive ? 800 : 300);
  }, [period, positive]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Performance</h3>
        <div className="flex gap-1">
          {(["7D", "30D", "90D", "ALL"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-primary text-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#71717a" }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#71717a" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                background: "#1E1F2E",
                border: "1px solid #2A2B3A",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "PnL"]}
            />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke="#00D4AA"
              strokeWidth={2}
              fill="url(#pnlGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
