"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { PerformanceChart } from "../../components/PerformanceChart";
import { TradeHistory } from "../../components/TradeHistory";
import { useCreateVault } from "../../hooks/useCreateVault";
import { useToast } from "../../components/Toast";
import { leaders } from "../../lib/mock-data";
import { analyzeTrader, getRiskColor } from "../../lib/quant-analysis";
import {
  BadgeCheck,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Activity,
  Clock,
  Info,
  Loader2,
  Gauge,
} from "lucide-react";

export default function TraderPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  const router = useRouter();
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const { createVault, isPending, isSuccess, error } = useCreateVault();
  const trader = leaders.find((l) => l.address === decodeURIComponent(address));

  const [depositAmount, setDepositAmount] = useState("");
  const [maxSlippage, setMaxSlippage] = useState(0.5);
  const [stopLoss, setStopLoss] = useState("");

  useEffect(() => {
    if (isSuccess) {
      toast("Vault created! Redirecting to dashboard...", "success");
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  }, [isSuccess, toast, router]);

  useEffect(() => {
    if (error) {
      toast(error.message.slice(0, 80), "error");
    }
  }, [error, toast]);

  function handleStartCopying() {
    if (!isConnected) {
      toast("Please connect your wallet first", "info");
      return;
    }
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast("Enter a deposit amount", "error");
      return;
    }
    const slippageBps = Math.round(maxSlippage * 100);
    createVault(trader!.address, slippageBps, depositAmount);
  }

  if (!trader) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-zinc-400">Trader not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isPositive = trader.totalPnL >= 0;
  const analysis = analyzeTrader(trader);

  const statsGrid = [
    {
      icon: isPositive ? TrendingUp : TrendingDown,
      label: "Total PnL",
      value: `${isPositive ? "+" : "-"}$${Math.abs(trader.totalPnL).toLocaleString()}`,
      color: isPositive ? "text-accent" : "text-danger",
    },
    {
      icon: Target,
      label: "Win Rate",
      value: `${trader.winRate}%`,
      color: "text-white",
    },
    {
      icon: BarChart3,
      label: "Total Trades",
      value: trader.totalTrades.toLocaleString(),
      color: "text-white",
    },
    {
      icon: Activity,
      label: "Avg Leverage",
      value: `${trader.avgLeverage ?? "—"}x`,
      color: "text-white",
    },
    {
      icon: TrendingDown,
      label: "Max Drawdown",
      value: `-${trader.maxDrawdown}%`,
      color: "text-danger",
    },
    {
      icon: Clock,
      label: "Avg Duration",
      value: trader.avgTradeDuration ?? "—",
      color: "text-white",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Trader Header */}
          <div className="glass-card glass-glow mb-10 flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${trader.avatarGradient} text-2xl font-bold text-white`}
              >
                {trader.username.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">
                    {trader.username}
                  </h1>
                  {trader.isVerified && (
                    <BadgeCheck size={20} className="text-primary" />
                  )}
                </div>
                <p className="text-sm text-zinc-500">{trader.address}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {trader.followers.toLocaleString()} followers
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    142 days active
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      trader.riskLevel === "Low"
                        ? "bg-accent/10 text-accent"
                        : trader.riskLevel === "Medium"
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "bg-danger/10 text-danger"
                    }`}
                  >
                    {trader.riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-zinc-500">Weekly ROI</div>
                <div
                  className={`text-lg font-bold ${
                    trader.weeklyROI >= 0 ? "text-accent" : "text-danger"
                  }`}
                >
                  {trader.weeklyROI >= 0 ? "+" : ""}
                  {trader.weeklyROI}%
                </div>
              </div>
              <a
                href="#copy-panel"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40"
              >
                Copy This Trader
              </a>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Chart + Stats + Trades */}
            <div className="space-y-8 lg:col-span-2">
              {/* Performance Chart */}
              <PerformanceChart positive={isPositive} />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {statsGrid.map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon size={16} className="text-primary" />
                    </div>
                    <div className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-zinc-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Risk Analysis */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Risk Analysis</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Risk Score Gauge */}
                  <div className="glass-card flex flex-col items-center justify-center rounded-xl p-6">
                    <div className="relative mb-3">
                      <svg width="120" height="70" viewBox="0 0 120 70">
                        {/* Background arc */}
                        <path
                          d="M 10 65 A 50 50 0 0 1 110 65"
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="10"
                          strokeLinecap="round"
                        />
                        {/* Score arc */}
                        <path
                          d="M 10 65 A 50 50 0 0 1 110 65"
                          fill="none"
                          stroke={getRiskColor(analysis.riskScore)}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${(analysis.riskScore / 10) * 157} 157`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                        <span className="text-2xl font-bold text-white">{analysis.riskScore}</span>
                        <span className="text-[10px] text-zinc-500">/10</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-zinc-400">Risk Score</span>
                    <span
                      className="mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{ color: getRiskColor(analysis.riskScore), backgroundColor: `${getRiskColor(analysis.riskScore)}15` }}
                    >
                      {analysis.riskLabel}
                    </span>
                  </div>

                  {/* Copy Score */}
                  <div className="glass-card flex flex-col items-center justify-center rounded-xl p-6">
                    <div className="relative mb-3">
                      <svg width="120" height="70" viewBox="0 0 120 70">
                        <path
                          d="M 10 65 A 50 50 0 0 1 110 65"
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="10"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 10 65 A 50 50 0 0 1 110 65"
                          fill="none"
                          stroke={analysis.copyScore >= 70 ? "#00D4AA" : analysis.copyScore >= 40 ? "#FBBF24" : "#FF4757"}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${(analysis.copyScore / 100) * 157} 157`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                        <span className="text-2xl font-bold text-white">{analysis.copyScore}</span>
                        <span className="text-[10px] text-zinc-500">/100</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-zinc-400">Copy Score</span>
                    <span
                      className="mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{
                        color: analysis.copyScore >= 70 ? "#00D4AA" : analysis.copyScore >= 40 ? "#FBBF24" : "#FF4757",
                        backgroundColor: analysis.copyScore >= 70 ? "#00D4AA15" : analysis.copyScore >= 40 ? "#FBBF2415" : "#FF475715",
                      }}
                    >
                      {analysis.copyScore >= 70 ? "Highly Recommended" : analysis.copyScore >= 40 ? "Moderate" : "Risky"}
                    </span>
                    <p className="mt-2 text-center text-[10px] text-zinc-600">
                      Based on Sharpe Ratio, Risk Score, PnL and follower count
                    </p>
                  </div>
                </div>

                {/* Quant Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">Sharpe</div>
                    <div className={`mt-1 text-lg font-bold ${analysis.sharpeRatio >= 1.5 ? "text-accent" : analysis.sharpeRatio >= 0.5 ? "text-yellow-400" : "text-danger"}`}>
                      {analysis.sharpeRatio}
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">Sortino</div>
                    <div className={`mt-1 text-lg font-bold ${analysis.sortinoRatio >= 2 ? "text-accent" : analysis.sortinoRatio >= 1 ? "text-yellow-400" : "text-danger"}`}>
                      {analysis.sortinoRatio}
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">Profit Factor</div>
                    <div className={`mt-1 text-lg font-bold ${analysis.profitFactor >= 2 ? "text-accent" : analysis.profitFactor >= 1.2 ? "text-yellow-400" : "text-danger"}`}>
                      {analysis.profitFactor}
                    </div>
                  </div>
                </div>

                {/* Profile Badge */}
                <div className="glass-card flex items-center gap-3 rounded-xl p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Gauge size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{analysis.profile.type}</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Profile
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                      {analysis.profile.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trade History */}
              <TradeHistory />
            </div>

            {/* Right Column - Copy Trading Panel */}
            <div id="copy-panel" className="lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-border bg-surface p-6">
                <h3 className="mb-6 text-lg font-semibold text-white">
                  Copy Trading
                </h3>

                {/* Deposit Amount */}
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-medium text-zinc-400">
                    Deposit Amount (MON)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-primary"
                    />
                    <button
                      onClick={() => setDepositAmount("100")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Max Slippage */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-400">
                      Max Slippage
                    </label>
                    <span className="text-xs font-bold text-white">
                      {maxSlippage.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={maxSlippage}
                    onChange={(e) => setMaxSlippage(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                    <span>0.1%</span>
                    <span>2.0%</span>
                  </div>
                </div>

                {/* Stop Loss */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-medium text-zinc-400">
                    Stop Loss % (optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Start Copying Button */}
                <button
                  onClick={handleStartCopying}
                  disabled={isPending}
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating Vault...
                    </>
                  ) : (
                    "Start Copying"
                  )}
                </button>

                {/* Info */}
                <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3">
                  <Info size={14} className="mt-0.5 shrink-0 text-primary" />
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    Performance fee: <span className="text-white">10% of profits</span>.
                    You only pay when you profit. Your funds stay in your isolated vault —
                    only you can withdraw.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
