"use client";

import Link from "next/link";
import { BadgeCheck, Users, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { LeaderTrader } from "../lib/mock-data";

function formatPnL(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  if (value <= -1000) return `-$${(Math.abs(value) / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

const riskColors: Record<string, string> = {
  Low: "text-accent bg-accent/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  High: "text-danger bg-danger/10",
};

interface LeaderCardProps {
  leader: LeaderTrader;
  rank?: number;
  isComparing?: boolean;
  onToggleCompare?: () => void;
  compareDisabled?: boolean;
}

export function LeaderCard({ leader, rank, isComparing, onToggleCompare, compareDisabled }: LeaderCardProps) {
  const sparkData = leader.sparkline.map((v, i) => ({ day: i, value: v }));
  const isPositive = leader.totalPnL >= 0;

  const borderClass =
    rank === 1 ? "animated-border animated-border-gold" :
    rank === 2 ? "animated-border animated-border-silver" :
    rank === 3 ? "animated-border animated-border-bronze" : "";

  return (
    <Link
      href={`/trader/${leader.address}`}
      className={`group relative glass-card glass-card-hover flex flex-col rounded-2xl p-5 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(131,110,249,0.1)] ${borderClass}`}
    >
      {/* Compare Toggle */}
      {onToggleCompare && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare();
          }}
          disabled={compareDisabled}
          className={`absolute right-3 top-3 z-10 rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
            isComparing
              ? "bg-primary text-white"
              : compareDisabled
              ? "bg-surface-light/50 text-zinc-600 cursor-not-allowed"
              : "bg-surface-light text-zinc-400 hover:bg-primary/20 hover:text-primary"
          }`}
        >
          {isComparing ? "Selected" : "Compare"}
        </button>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${leader.avatarGradient} text-sm font-bold text-white`}
        >
          {leader.username.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-white">
              {leader.username}
            </span>
            {leader.isVerified && (
              <BadgeCheck size={14} className="shrink-0 text-primary" />
            )}
          </div>
          <span className="text-xs text-zinc-500">{leader.address}</span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${riskColors[leader.riskLevel]}`}
        >
          {leader.riskLevel}
        </span>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            PnL
          </div>
          <div
            className={`text-sm font-bold ${isPositive ? "text-accent" : "text-danger"}`}
          >
            {isPositive ? "+" : ""}
            {formatPnL(leader.totalPnL)}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Win Rate
          </div>
          <div className="text-sm font-bold text-white">
            {leader.winRate}%
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Followers
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-white">
            <Users size={12} className="text-zinc-500" />
            {leader.followers.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-4 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#00D4AA" : "#FF4757"}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <TrendingUp size={12} />
          <span>
            {leader.weeklyROI >= 0 ? "+" : ""}
            {leader.weeklyROI}% this week
          </span>
        </div>
        <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          Copy
        </span>
      </div>
    </Link>
  );
}
