"use client";

import { useState, useEffect, useCallback } from "react";

interface TourStep {
  selector: string;
  title: string;
  description: string;
  position: "bottom" | "top";
}

const steps: TourStep[] = [
  {
    selector: '[href="/leaderboard"]',
    title: "Welcome to TradeWatch!",
    description: "Browse top traders on the leaderboard and find who to copy.",
    position: "bottom",
  },
  {
    selector: "#how-it-works",
    title: "How It Works",
    description: "Click any trader to see their full performance history and stats.",
    position: "top",
  },
  {
    selector: "[data-tour='connect-wallet']",
    title: "Connect Your Wallet",
    description: "Connect your wallet to start copy trading on Monad.",
    position: "bottom",
  },
  {
    selector: '[href="/leaderboard"]:last-of-type',
    title: "Start Copying!",
    description: "Set your limits and start copying top traders with one click!",
    position: "top",
  },
];

const STORAGE_KEY = "tradewatch_onboarding_done";

export function OnboardingTour() {
  const [current, setCurrent] = useState(-1);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Small delay to let page render
      setTimeout(() => setCurrent(0), 800);
    }
  }, []);

  const updateRect = useCallback((stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      // Fallback: center of screen
      setRect(new DOMRect(window.innerWidth / 2 - 100, 200, 200, 40));
    }
  }, []);

  useEffect(() => {
    if (current >= 0) {
      updateRect(current);
    }
  }, [current, updateRect]);

  // Update position on scroll/resize
  useEffect(() => {
    if (current < 0) return;
    const handler = () => updateRect(current);
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [current, updateRect]);

  const finish = () => {
    setCurrent(-1);
    setRect(null);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const next = () => {
    if (current >= steps.length - 1) {
      finish();
    } else {
      setCurrent(current + 1);
    }
  };

  if (current < 0 || !rect) return null;

  const step = steps[current];
  const isLast = current === steps.length - 1;

  // Tooltip position
  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    left: Math.min(Math.max(rect.left + rect.width / 2 - 150, 16), window.innerWidth - 316),
    ...(step.position === "bottom"
      ? { top: rect.bottom + 12 }
      : { top: rect.top - 12, transform: "translateY(-100%)" }),
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/40" onClick={finish} />

      {/* Spotlight */}
      <div
        className="fixed z-[9998] rounded-lg ring-2 ring-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        }}
      />

      {/* Tooltip */}
      <div style={tooltipStyle} className="animate-fade-in-up w-[300px]">
        <div className="glass-card rounded-xl border border-primary/30 p-4 shadow-lg shadow-primary/10">
          {/* Arrow */}
          {step.position === "bottom" && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-primary/30" />
          )}
          {step.position === "top" && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-primary/30" />
          )}

          {/* Step indicator */}
          <div className="mb-2 flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === current ? "w-4 bg-primary" : "w-1.5 bg-zinc-600"
                }`}
              />
            ))}
            <span className="ml-auto text-[10px] text-zinc-500">
              {current + 1}/{steps.length}
            </span>
          </div>

          <h4 className="mb-1 text-sm font-semibold text-white">{step.title}</h4>
          <p className="mb-4 text-xs leading-relaxed text-zinc-400">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={finish}
              className="text-[11px] text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Skip Tour
            </button>
            <button
              onClick={next}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
            >
              {isLast ? "Got it!" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
