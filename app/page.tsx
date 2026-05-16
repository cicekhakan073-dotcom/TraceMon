"use client";

import Link from "next/link";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import {
  Zap,
  Layers,
  DollarSign,
  BarChart3,
  Search,
  SlidersHorizontal,
  Copy,
} from "lucide-react";
import { CountUp } from "./components/CountUp";
import { LiveTicker } from "./components/LiveTicker";

const stats = [
  { icon: Zap, value: "10,000", label: "TPS", desc: "Transactions per second" },
  { icon: Layers, value: "Parallel", label: "Execution", desc: "Zero state conflicts" },
  { icon: DollarSign, value: "$0.001", label: "Gas", desc: "Near-zero fees" },
  { icon: BarChart3, value: "Real-time", label: "Analytics", desc: "MonadDb powered" },
];

const steps = [
  {
    icon: Search,
    title: "Choose a Leader",
    desc: "Browse the leaderboard and find top-performing traders with verified track records.",
    step: "01",
  },
  {
    icon: SlidersHorizontal,
    title: "Set Your Limits",
    desc: "Define your risk tolerance, max slippage, stop-loss, and capital allocation.",
    step: "02",
  },
  {
    icon: Copy,
    title: "Auto-Copy Trades",
    desc: "When a leader opens a position, your isolated vault mirrors the trade in parallel — instantly.",
    step: "03",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(131,110,249,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(131,110,249,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="animate-fade-in-up mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
                <Zap size={14} />
                Powered by Monad
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
                Copy the Best.{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Trade in Parallel.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
                TradeWatch leverages Monad&apos;s 10,000 TPS parallel execution to
                mirror top traders&apos; strategies — instantly, with zero state
                conflicts.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/leaderboard"
                  className="animated-border animated-border-primary inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40"
                >
                  Start Copying
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-8 text-sm font-semibold text-zinc-300 transition-all hover:border-primary/50 hover:text-white"
                >
                  Become a Leader
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="gradient-border-top bg-black/40 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 px-6 py-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white tabular-nums">
                    {stat.value === "10,000" ? (
                      <CountUp end={10000} suffix="" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs text-zinc-500">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Ticker */}
        <LiveTicker />

        {/* How It Works */}
        <section id="how-it-works" className="animate-fade-in-up py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Start copy trading in three simple steps
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.step}
                  className="group glass-card glass-card-hover relative rounded-2xl p-8 hover:border-primary/30"
                >
                  <div className="absolute -top-4 right-6 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    Step {step.step}
                  </div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to trade smarter?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
              Join the first parallel copy trading protocol on Monad and start
              earning today.
            </p>
            <Link
              href="/leaderboard"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40"
            >
              Explore Leaderboard
            </Link>
          </div>
        </section>
      </main>

      <Footer />

    </div>
  );
}
