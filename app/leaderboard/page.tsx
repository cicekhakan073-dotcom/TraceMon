"use client";

import { useState, useMemo } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LeaderCard } from "../components/LeaderCard";
import { LeaderTable } from "../components/LeaderTable";
import { CompareModal } from "../components/CompareModal";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { type RiskLevel, type LeaderTrader } from "../lib/mock-data";
import { Trophy, LayoutGrid, List, X, GitCompareArrows } from "lucide-react";

type SortKey = "pnl" | "winRate" | "followers";
type TimeFilter = "7d" | "30d" | "all";
type ViewMode = "grid" | "table";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-surface-light" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-surface-light" />
          <div className="h-3 w-32 rounded bg-surface-light" />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-2 w-10 rounded bg-surface-light" />
            <div className="h-4 w-16 rounded bg-surface-light" />
          </div>
        ))}
      </div>
      <div className="mb-4 h-12 rounded bg-surface-light" />
      <div className="flex justify-between">
        <div className="h-3 w-20 rounded bg-surface-light" />
        <div className="h-7 w-14 rounded-lg bg-surface-light" />
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { leaders, isLoading, isMock } = useLeaderboard();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [sortBy, setSortBy] = useState<SortKey>("pnl");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (address: string) => {
    setCompareList((prev) =>
      prev.includes(address)
        ? prev.filter((a) => a !== address)
        : prev.length < 2
        ? [...prev, address]
        : prev
    );
  };

  const compareTraders = useMemo(() => {
    if (compareList.length !== 2) return null;
    const all = leaders as LeaderTrader[];
    const t1 = all.find((l) => l.address === compareList[0]);
    const t2 = all.find((l) => l.address === compareList[1]);
    if (t1 && t2) return [t1, t2] as [LeaderTrader, LeaderTrader];
    return null;
  }, [compareList, leaders]);

  // Leaders from hook are always mock (LeaderTrader[]) until contracts are deployed
  const filtered = useMemo(() => {
    if (!Array.isArray(leaders)) return [];
    let result = [...leaders];

    if (riskFilter !== "All") {
      result = result.filter(
        (l) => "riskLevel" in l && l.riskLevel === riskFilter
      );
    }

    result.sort((a, b) => {
      if (!("totalPnL" in a)) return 0;
      const aData = a as { totalPnL: number; winRate: number; followers: number };
      const bData = b as { totalPnL: number; winRate: number; followers: number };
      if (sortBy === "pnl") return bData.totalPnL - aData.totalPnL;
      if (sortBy === "winRate") return bData.winRate - aData.winRate;
      return bData.followers - aData.followers;
    });

    return result;
  }, [leaders, riskFilter, sortBy]);

  const filterBtn = (
    label: string,
    active: boolean,
    onClick: () => void
  ) => (
    <button
      key={label}
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "bg-surface-light text-zinc-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Trophy size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  Leaderboard
                </h1>
                <p className="text-sm text-zinc-400">
                  Find and copy the best-performing traders on Monad
                  {isMock && (
                    <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      Demo Data
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Period:</span>
              <div className="flex gap-1">
                {(["7d", "30d", "all"] as TimeFilter[]).map((t) =>
                  filterBtn(t.toUpperCase(), timeFilter === t, () =>
                    setTimeFilter(t)
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Risk:</span>
              <div className="flex gap-1">
                {(["All", "Low", "Medium", "High"] as const).map((r) =>
                  filterBtn(r, riskFilter === r, () => setRiskFilter(r))
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Sort:</span>
              <div className="flex gap-1">
                {(
                  [
                    ["pnl", "PnL"],
                    ["winRate", "Win Rate"],
                    ["followers", "Followers"],
                  ] as [SortKey, string][]
                ).map(([key, label]) =>
                  filterBtn(label, sortBy === key, () => setSortBy(key))
                )}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-surface-light text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-white"
                    : "bg-surface-light text-zinc-400 hover:text-white"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Grid / Table */}
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">
              No leaders found matching your filters.
            </div>
          ) : viewMode === "table" ? (
            <LeaderTable leaders={filtered.filter((l) => "avatarGradient" in l) as import("../lib/mock-data").LeaderTrader[]} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((leader, index) =>
                "avatarGradient" in leader ? (
                  <LeaderCard
                    key={leader.address}
                    leader={leader}
                    rank={index < 3 ? index + 1 : undefined}
                    isComparing={compareList.includes(leader.address)}
                    onToggleCompare={() => toggleCompare(leader.address)}
                    compareDisabled={compareList.length >= 2 && !compareList.includes(leader.address)}
                  />
                ) : null
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Compare Sticky Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <GitCompareArrows size={16} className="text-primary" />
              <span className="text-sm text-zinc-300">
                {compareList.length}/2 traders selected
              </span>
              <div className="flex -space-x-2">
                {compareList.map((addr) => {
                  const trader = (leaders as LeaderTrader[]).find((l) => l.address === addr);
                  if (!trader) return null;
                  return (
                    <div
                      key={addr}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-gradient-to-br ${trader.avatarGradient} text-[10px] font-bold text-white`}
                    >
                      {trader.username.charAt(0)}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareList([])}
                className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-surface-light hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCompare(true)}
                disabled={compareList.length < 2}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && compareTraders && (
        <CompareModal
          traders={compareTraders}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}
