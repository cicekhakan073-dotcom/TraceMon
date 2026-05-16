"use client";

interface Trade {
  id: number;
  pair: string;
  side: "Long" | "Short";
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  date: string;
}

const mockTrades: Trade[] = [
  { id: 1, pair: "MON/USDC", side: "Long", entryPrice: 2.34, exitPrice: 2.61, pnl: 1350, pnlPercent: 11.5, date: "2025-05-14" },
  { id: 2, pair: "WETH/MON", side: "Short", entryPrice: 0.0087, exitPrice: 0.0082, pnl: 890, pnlPercent: 5.7, date: "2025-05-14" },
  { id: 3, pair: "MON/USDC", side: "Long", entryPrice: 2.18, exitPrice: 2.34, pnl: 2100, pnlPercent: 7.3, date: "2025-05-13" },
  { id: 4, pair: "WBTC/MON", side: "Long", entryPrice: 0.000042, exitPrice: 0.000039, pnl: -780, pnlPercent: -7.1, date: "2025-05-13" },
  { id: 5, pair: "MON/USDT", side: "Short", entryPrice: 2.45, exitPrice: 2.31, pnl: 1560, pnlPercent: 5.7, date: "2025-05-12" },
  { id: 6, pair: "WETH/MON", side: "Long", entryPrice: 0.0079, exitPrice: 0.0085, pnl: 1890, pnlPercent: 7.6, date: "2025-05-12" },
  { id: 7, pair: "MON/USDC", side: "Short", entryPrice: 2.52, exitPrice: 2.58, pnl: -430, pnlPercent: -2.4, date: "2025-05-11" },
  { id: 8, pair: "DAK/MON", side: "Long", entryPrice: 0.015, exitPrice: 0.019, pnl: 3200, pnlPercent: 26.7, date: "2025-05-11" },
  { id: 9, pair: "MON/USDC", side: "Long", entryPrice: 2.11, exitPrice: 2.23, pnl: 950, pnlPercent: 5.7, date: "2025-05-10" },
  { id: 10, pair: "WETH/MON", side: "Short", entryPrice: 0.0091, exitPrice: 0.0088, pnl: 670, pnlPercent: 3.3, date: "2025-05-10" },
];

export function TradeHistory() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="mb-4 text-sm font-semibold text-white">Recent Trades</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-zinc-500">
              <th className="pb-3 pr-4">Pair</th>
              <th className="pb-3 pr-4">Side</th>
              <th className="pb-3 pr-4">Entry</th>
              <th className="pb-3 pr-4">Exit</th>
              <th className="pb-3 pr-4">PnL</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockTrades.map((trade, i) => (
              <tr
                key={trade.id}
                className={`border-b border-border/50 ${
                  i % 2 === 0 ? "bg-surface" : "bg-surface-light/30"
                }`}
              >
                <td className="py-3 pr-4 font-medium text-white">
                  {trade.pair}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      trade.side === "Long"
                        ? "bg-accent/10 text-accent"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {trade.side}
                  </span>
                </td>
                <td className="py-3 pr-4 text-zinc-400">{trade.entryPrice}</td>
                <td className="py-3 pr-4 text-zinc-400">{trade.exitPrice}</td>
                <td className="py-3 pr-4">
                  <div
                    className={`font-medium ${
                      trade.pnl >= 0 ? "text-accent" : "text-danger"
                    }`}
                  >
                    {trade.pnl >= 0 ? "+" : ""}${Math.abs(trade.pnl).toLocaleString()}
                    <span className="ml-1 text-xs opacity-70">
                      ({trade.pnlPercent >= 0 ? "+" : ""}
                      {trade.pnlPercent}%)
                    </span>
                  </div>
                </td>
                <td className="py-3 text-zinc-500">{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
