"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { LeaderTrader } from "../lib/mock-data";

const rankColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-zinc-300",
  3: "text-orange-400",
};

const riskBadge: Record<string, string> = {
  Low: "text-accent bg-accent/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  High: "text-danger bg-danger/10",
};

function formatPnL(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  if (value <= -1000) return `-$${(Math.abs(value) / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function LeaderTable({ leaders }: { leaders: LeaderTrader[] }) {
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="sticky left-0 bg-surface/90 backdrop-blur-sm px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500">#</th>
              <th className="sticky left-10 bg-surface/90 backdrop-blur-sm px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500 min-w-[160px]">Trader</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500">PnL</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500">Win Rate</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500">Followers</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500">Weekly ROI</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500">Risk</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500">Max DD</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500"></th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => {
              const isPositive = leader.totalPnL >= 0;
              const rank = index + 1;
              return (
                <Link
                  key={leader.address}
                  href={`/trader/${leader.address}`}
                  className="contents"
                >
                  <tr className="border-b border-white/[0.04] transition-colors hover:bg-surface-light/50 cursor-pointer">
                    <td className="sticky left-0 bg-surface/50 backdrop-blur-sm px-4 py-3">
                      <span className={`text-xs font-bold ${rankColors[rank] || "text-zinc-500"}`}>
                        {rank}
                      </span>
                    </td>
                    <td className="sticky left-10 bg-surface/50 backdrop-blur-sm px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${leader.avatarGradient} text-[10px] font-bold text-white`}
                        >
                          {leader.username.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="truncate text-xs font-semibold text-white">
                              {leader.username}
                            </span>
                            {leader.isVerified && (
                              <BadgeCheck size={11} className="shrink-0 text-primary" />
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-600">{leader.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`tabular-nums text-xs font-bold ${isPositive ? "text-accent" : "text-danger"}`}>
                        {isPositive ? "+" : ""}{formatPnL(leader.totalPnL)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="tabular-nums text-xs text-white">{leader.winRate}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="tabular-nums text-xs text-zinc-400">{leader.followers.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`tabular-nums text-xs font-medium ${leader.weeklyROI >= 0 ? "text-accent" : "text-danger"}`}>
                        {leader.weeklyROI >= 0 ? "+" : ""}{leader.weeklyROI}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${riskBadge[leader.riskLevel]}`}>
                        {leader.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="tabular-nums text-xs text-danger">-{leader.maxDrawdown}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-[10px] font-medium text-primary transition-colors hover:bg-primary hover:text-white">
                        Copy
                      </span>
                    </td>
                  </tr>
                </Link>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
