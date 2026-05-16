"use client";

import { useEffect } from "react";
import { BadgeCheck, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { LeaderTrader } from "../lib/mock-data";

interface CompareModalProps {
  traders: [LeaderTrader, LeaderTrader];
  onClose: () => void;
}

export function CompareModal({ traders, onClose }: CompareModalProps) {
  const [a, b] = traders;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const metrics = [
    { label: "Total PnL", a: a.totalPnL, b: b.totalPnL, format: (v: number) => `$${(v / 1000).toFixed(1)}K` },
    { label: "Win Rate", a: a.winRate, b: b.winRate, format: (v: number) => `${v}%` },
    { label: "Total Trades", a: a.totalTrades, b: b.totalTrades, format: (v: number) => `${v}` },
    { label: "Followers", a: a.followers, b: b.followers, format: (v: number) => `${v}` },
    { label: "Max Drawdown", a: a.maxDrawdown, b: b.maxDrawdown, format: (v: number) => `${v}%`, lowerBetter: true },
    { label: "Weekly ROI", a: a.weeklyROI, b: b.weeklyROI, format: (v: number) => `${v}%` },
  ];

  const chartData = metrics.map((m) => ({
    name: m.label,
    [a.username]: m.a,
    [b.username]: m.b,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface p-6 sm:p-8 animate-fade-in-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-surface-light hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="mb-8 text-center text-xl font-bold text-white">
          Trader Comparison
        </h2>

        {/* Trader Headers */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[a, b].map((trader) => (
            <div
              key={trader.address}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-light/50 p-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${trader.avatarGradient} text-sm font-bold text-white`}
              >
                {trader.username.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-white">
                    {trader.username}
                  </span>
                  {trader.isVerified && (
                    <BadgeCheck size={14} className="text-primary" />
                  )}
                </div>
                <span className="text-xs text-zinc-500">{trader.address}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="mb-8 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1E1F2E",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey={a.username} fill="#836EF9" radius={[4, 4, 0, 0]} />
              <Bar dataKey={b.username} fill="#00D4AA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metric Comparison Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => {
            const aWins = m.lowerBetter ? m.a < m.b : m.a > m.b;
            const bWins = m.lowerBetter ? m.b < m.a : m.b > m.a;
            return (
              <div
                key={m.label}
                className="rounded-xl border border-border bg-surface-light/30 p-4"
              >
                <div className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">
                  {m.label}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-bold ${aWins ? "text-accent" : "text-zinc-400"}`}
                  >
                    {m.format(m.a)}
                  </span>
                  <span className="text-[10px] text-zinc-600">vs</span>
                  <span
                    className={`text-sm font-bold ${bWins ? "text-accent" : "text-zinc-400"}`}
                  >
                    {m.format(m.b)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[a, b].map((trader) => (
            <a
              key={trader.address}
              href={`/trader/${trader.address}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Copy {trader.username}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
