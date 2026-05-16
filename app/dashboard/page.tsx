"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Vault,
  Search,
  UserPlus,
  ArrowUpRight,
  ArrowDownToLine,
  Copy,
  CheckCircle,
  Clock,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { VaultCard, type VaultData } from "../components/VaultCard";
import { useUserVaults } from "../hooks/useUserVaults";

const mockVaults: VaultData[] = [
  {
    id: "v1",
    leaderName: "NadKing",
    leaderAddress: "0x1bC4...f9A1",
    leaderGradient: "from-green-400 to-emerald-600",
    deposited: 50,
    currentValue: 61.4,
    pnl: 2840,
    pnlPercent: 22.8,
    status: "Active",
  },
  {
    id: "v2",
    leaderName: "AlgoNad",
    leaderAddress: "0x6aC3...d5E8",
    leaderGradient: "from-violet-500 to-purple-700",
    deposited: 100,
    currentValue: 112.7,
    pnl: 4230,
    pnlPercent: 12.7,
    status: "Active",
  },
  {
    id: "v3",
    leaderName: "ScalpKing",
    leaderAddress: "0xdD45...8fA9",
    leaderGradient: "from-teal-400 to-green-500",
    deposited: 25,
    currentValue: 22.1,
    pnl: -580,
    pnlPercent: -11.6,
    status: "Paused",
  },
];

const portfolioSparkline = [
  { d: 0, v: 170 },
  { d: 1, v: 175 },
  { d: 2, v: 182 },
  { d: 3, v: 178 },
  { d: 4, v: 189 },
  { d: 5, v: 193 },
  { d: 6, v: 196.2 },
];

interface TxRecord {
  id: number;
  date: string;
  type: "Deposit" | "Withdraw" | "Copy Trade";
  amount: string;
  status: "Confirmed" | "Pending";
}

const mockTransactions: TxRecord[] = [
  { id: 1, date: "2025-05-15", type: "Copy Trade", amount: "MON/USDC Long", status: "Confirmed" },
  { id: 2, date: "2025-05-15", type: "Copy Trade", amount: "WETH/MON Short", status: "Confirmed" },
  { id: 3, date: "2025-05-14", type: "Deposit", amount: "25 MON", status: "Confirmed" },
  { id: 4, date: "2025-05-14", type: "Copy Trade", amount: "MON/USDC Long", status: "Confirmed" },
  { id: 5, date: "2025-05-13", type: "Copy Trade", amount: "DAK/MON Long", status: "Confirmed" },
  { id: 6, date: "2025-05-13", type: "Withdraw", amount: "10 MON", status: "Confirmed" },
  { id: 7, date: "2025-05-12", type: "Deposit", amount: "100 MON", status: "Confirmed" },
  { id: 8, date: "2025-05-12", type: "Copy Trade", amount: "WETH/MON Long", status: "Pending" },
];

const typeIcons: Record<TxRecord["type"], typeof ArrowUpRight> = {
  Deposit: ArrowDownToLine,
  Withdraw: ArrowUpRight,
  "Copy Trade": Copy,
};

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { vaults: onChainVaults, isMock } = useUserVaults();

  // Use on-chain vaults if available, otherwise mock
  const displayVaults = isMock || !onChainVaults ? mockVaults : mockVaults; // TODO: map onChainVaults after deploy
  const totalValue = displayVaults.reduce((s, v) => s + v.currentValue, 0);
  const totalPnl = displayVaults.reduce((s, v) => s + v.pnl, 0);
  const activeCount = displayVaults.filter((v) => v.status === "Active").length;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {!isConnected ? (
          /* Not connected state */
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-32">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Wallet size={32} className="text-primary" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-white">
              Connect your wallet
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Connect your wallet to view your dashboard
            </p>
            <div className="mt-6">
              <ConnectButton />
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Quick Actions */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <div className="flex gap-3">
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-primary/50 hover:text-white"
                >
                  <Search size={14} />
                  Find Leaders
                </Link>
                <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-hover">
                  <UserPlus size={14} />
                  Become a Leader
                </button>
              </div>
            </div>

            {/* Portfolio Overview */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Value */}
              <div className="glass-card rounded-2xl p-5">
                <div className="mb-1 text-xs text-zinc-500">Portfolio Value</div>
                <div className="text-2xl font-bold text-white">
                  {totalValue.toFixed(1)} MON
                </div>
                <div className="text-xs text-zinc-500">
                  ~${(totalValue * 2.4).toFixed(0)} USD
                </div>
              </div>

              {/* Total PnL */}
              <div className="glass-card rounded-2xl p-5">
                <div className="mb-1 text-xs text-zinc-500">Total PnL</div>
                <div
                  className={`text-2xl font-bold ${totalPnl >= 0 ? "text-accent" : "text-danger"}`}
                >
                  {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-500">All time</div>
              </div>

              {/* Active Vaults */}
              <div className="glass-card rounded-2xl p-5">
                <div className="mb-1 text-xs text-zinc-500">Active Vaults</div>
                <div className="text-2xl font-bold text-white">
                  {activeCount}
                  <span className="ml-1 text-sm font-normal text-zinc-500">
                    / {displayVaults.length}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">Isolated vaults</div>
              </div>

              {/* Mini Sparkline */}
              <div className="glass-card rounded-2xl p-5">
                <div className="mb-1 text-xs text-zinc-500">7D Trend</div>
                <div className="h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={portfolioSparkline}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke="#00D4AA"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 text-xs text-accent">+15.4%</div>
              </div>
            </div>

            {/* Vaults + Tx History */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Active Vaults */}
              <div className="space-y-5 lg:col-span-2">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Vault size={18} className="text-primary" />
                  Your Vaults
                </h2>
                {displayVaults.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                    <p className="text-sm text-zinc-500">
                      You haven&apos;t started copy trading yet.
                    </p>
                    <Link
                      href="/leaderboard"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Find a Leader
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {displayVaults.map((vault) => (
                      <VaultCard key={vault.id} vault={vault} />
                    ))}
                  </div>
                )}
              </div>

              {/* Transaction History */}
              <div className="lg:col-span-1">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
                  <TrendingUp size={18} className="text-primary" />
                  Recent Activity
                </h2>
                <div className="space-y-2">
                  {mockTransactions.map((tx) => {
                    const Icon = typeIcons[tx.type];
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            tx.type === "Deposit"
                              ? "bg-accent/10"
                              : tx.type === "Withdraw"
                                ? "bg-yellow-400/10"
                                : "bg-primary/10"
                          }`}
                        >
                          <Icon
                            size={14}
                            className={
                              tx.type === "Deposit"
                                ? "text-accent"
                                : tx.type === "Withdraw"
                                  ? "text-yellow-400"
                                  : "text-primary"
                            }
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white">
                              {tx.type}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                              {tx.status === "Confirmed" ? (
                                <CheckCircle size={10} className="text-accent" />
                              ) : (
                                <Clock size={10} className="text-yellow-400" />
                              )}
                              {tx.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="truncate text-[11px] text-zinc-400">
                              {tx.amount}
                            </span>
                            <span className="text-[10px] text-zinc-600">
                              {tx.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
