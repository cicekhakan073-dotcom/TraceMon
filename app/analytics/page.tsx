"use client";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  pitchStats,
  generateSlippageComparisonData,
  generateWinRateVsPnlData,
  generateRiskDistributionData,
} from "../lib/quant-analysis";
import { Zap, Clock, Shield, TrendingUp, BarChart3, Quote } from "lucide-react";

const statIcons = [Zap, Clock, Shield, TrendingUp, BarChart3];

const slippageData = generateSlippageComparisonData();
const winRateData = generateWinRateVsPnlData();
const riskData = generateRiskDistributionData();

const tooltipStyle = {
  background: "#1E1F2E",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="animate-fade-in-up mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <BarChart3 size={14} />
              Quantitative Analysis
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Why{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Monad
              </span>{" "}
              for Copy Trading?
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
              Data-driven analysis proving Monad&apos;s superiority for parallel copy trading execution.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="animate-fade-in-up mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pitchStats.stats.slice(0, 4).map((stat, i) => {
              const Icon = statIcons[i] ?? Zap;
              return (
                <div
                  key={stat.metric}
                  className="glass-card glass-card-hover rounded-2xl p-6"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div className="mb-1 text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mb-2 text-sm font-medium text-zinc-300">{stat.metric}</div>
                  <p className="text-xs leading-relaxed text-zinc-500">{stat.detail}</p>
                </div>
              );
            })}
          </div>

          {/* Slippage Comparison */}
          <section className="animate-fade-in-up mb-16">
            <h2 className="mb-2 text-2xl font-bold text-white">Slippage Comparison</h2>
            <p className="mb-8 text-sm text-zinc-400">
              Annual slippage cost for a $100K portfolio across different networks.
            </p>
            <div className="glass-card rounded-2xl p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={slippageData} barSize={48}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="network"
                      tick={{ fill: "#a1a1aa", fontSize: 13 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Annual Cost"]}
                    />
                    <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                      {slippageData.map((entry) => (
                        <Cell
                          key={entry.network}
                          fill={entry.network === "Monad" ? "#836EF9" : "#3f3f46"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-center text-xs text-zinc-500">
                Monad saves traders up to <span className="font-semibold text-accent">93%</span> in annual slippage costs compared to Ethereum.
              </p>
            </div>
          </section>

          {/* Win Rate vs ROI */}
          <section className="animate-fade-in-up mb-16">
            <h2 className="mb-2 text-2xl font-bold text-white">Win Rate vs Actual ROI</h2>
            <p className="mb-8 text-sm text-zinc-400">
              High win rate does not equal high profit. Risk/Reward ratio matters more.
            </p>
            <div className="glass-card rounded-2xl p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winRateData} barSize={48}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="winRate"
                      tick={{ fill: "#a1a1aa", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value) => [`${Number(value)}%`, "Avg ROI"]}
                    />
                    <Bar dataKey="avgROI" radius={[6, 6, 0, 0]}>
                      {winRateData.map((entry) => (
                        <Cell
                          key={entry.winRate}
                          fill={entry.avgROI >= 100 ? "#00D4AA" : entry.avgROI >= 0 ? "#836EF9" : "#FF4757"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
                  ROI 100%+ (Top Performers)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                  ROI 0-99%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-danger" />
                  Negative ROI
                </span>
              </div>
            </div>
          </section>

          {/* Risk Distribution */}
          <section className="animate-fade-in-up mb-16">
            <h2 className="mb-2 text-2xl font-bold text-white">Platform Risk Distribution</h2>
            <p className="mb-8 text-sm text-zinc-400">
              How our traders are distributed across risk profiles.
            </p>
            <div className="glass-card rounded-2xl p-6">
              <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="percentage"
                        stroke="none"
                      >
                        {riskData.map((entry) => (
                          <Cell key={entry.range} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => [`${Number(value)}%`, "Traders"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {riskData.map((entry) => (
                    <div key={entry.range} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-zinc-300">{entry.range}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-light">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${entry.percentage}%`, backgroundColor: entry.color }}
                          />
                        </div>
                        <span className="w-10 text-right text-sm font-semibold text-white">
                          {entry.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Key Insight */}
          <section className="animate-fade-in-up mb-16">
            <div className="glass-card glass-glow relative rounded-2xl p-8 sm:p-10">
              <Quote size={40} className="absolute left-6 top-6 text-primary/20" />
              <div className="relative">
                <h3 className="mb-4 text-lg font-semibold text-primary">Key Insight</h3>
                <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
                  {pitchStats.keyInsight}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
