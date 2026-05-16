"use client";

import { Pause, Play, Plus, ArrowDownToLine } from "lucide-react";
import { useState } from "react";

export interface VaultData {
  id: string;
  leaderName: string;
  leaderAddress: string;
  leaderGradient: string;
  deposited: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  status: "Active" | "Paused";
}

export function VaultCard({ vault }: { vault: VaultData }) {
  const [status, setStatus] = useState(vault.status);
  const isPositive = vault.pnl >= 0;

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 hover:border-primary/30">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${vault.leaderGradient} text-sm font-bold text-white`}
          >
            {vault.leaderName.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {vault.leaderName}
            </div>
            <div className="text-xs text-zinc-500">{vault.leaderAddress}</div>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
            status === "Active"
              ? "bg-accent/10 text-accent"
              : "bg-yellow-400/10 text-yellow-400"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Values */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Deposited
          </div>
          <div className="text-sm font-bold text-white">
            {vault.deposited} MON
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Current
          </div>
          <div className="text-sm font-bold text-white">
            {vault.currentValue.toFixed(1)} MON
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            PnL
          </div>
          <div
            className={`text-sm font-bold ${isPositive ? "text-accent" : "text-danger"}`}
          >
            {isPositive ? "+" : ""}${vault.pnl.toLocaleString()}
            <span className="ml-1 text-[10px] opacity-70">
              ({isPositive ? "+" : ""}{vault.pnlPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-primary/50 hover:text-white">
          <Plus size={14} />
          Add Funds
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-primary/50 hover:text-white">
          <ArrowDownToLine size={14} />
          Withdraw
        </button>
        <button
          onClick={() => setStatus(status === "Active" ? "Paused" : "Active")}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
            status === "Active"
              ? "border border-danger/30 text-danger hover:bg-danger/10"
              : "border border-accent/30 text-accent hover:bg-accent/10"
          }`}
        >
          {status === "Active" ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
    </div>
  );
}
