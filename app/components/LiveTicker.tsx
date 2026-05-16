"use client";

interface TickerItem {
  id: number;
  avatar: string;
  gradient: string;
  text: string;
  highlight: string;
  highlightColor: "green" | "red" | "purple";
}

const tickerData: TickerItem[] = [
  { id: 1, avatar: "M", gradient: "from-purple-500 to-blue-500", text: "MonadWhale opened MON/USDC Long", highlight: "+$2,340", highlightColor: "green" },
  { id: 2, avatar: "N", gradient: "from-green-400 to-emerald-600", text: "NadKing closed WETH/MON Short", highlight: "+8.5%", highlightColor: "green" },
  { id: 3, avatar: "A", gradient: "from-violet-500 to-purple-700", text: "AlgoNad copied by", highlight: "12 followers", highlightColor: "purple" },
  { id: 4, avatar: "D", gradient: "from-orange-400 to-red-500", text: "DeFiSensei opened WBTC/MON Long", highlight: "+$1,890", highlightColor: "green" },
  { id: 5, avatar: "P", gradient: "from-red-500 to-pink-600", text: "ParallelPro closed MON/USDT Short", highlight: "-$430", highlightColor: "red" },
  { id: 6, avatar: "S", gradient: "from-cyan-400 to-blue-500", text: "SteadyEddie opened MON/USDC Long", highlight: "+$670", highlightColor: "green" },
  { id: 7, avatar: "N", gradient: "from-green-400 to-emerald-600", text: "NadKing copied by", highlight: "8 followers", highlightColor: "purple" },
  { id: 8, avatar: "A", gradient: "from-violet-500 to-purple-700", text: "AlgoNad closed WETH/MON Long", highlight: "+12.3%", highlightColor: "green" },
  { id: 9, avatar: "D", gradient: "from-amber-400 to-yellow-600", text: "DiamondHands opened MON/USDC Long", highlight: "+$4,120", highlightColor: "green" },
  { id: 10, avatar: "M", gradient: "from-purple-500 to-blue-500", text: "MonadWhale closed DAK/MON Short", highlight: "+$3,200", highlightColor: "green" },
  { id: 11, avatar: "S", gradient: "from-indigo-400 to-blue-600", text: "SafeYield deposited", highlight: "50 MON", highlightColor: "purple" },
  { id: 12, avatar: "P", gradient: "from-red-500 to-pink-600", text: "ParallelPro opened WETH/MON Long", highlight: "+$560", highlightColor: "green" },
  { id: 13, avatar: "N", gradient: "from-green-400 to-emerald-600", text: "NadKing opened MON/USDT Long", highlight: "+$1,450", highlightColor: "green" },
  { id: 14, avatar: "A", gradient: "from-violet-500 to-purple-700", text: "AlgoNad copied by", highlight: "23 followers", highlightColor: "purple" },
  { id: 15, avatar: "D", gradient: "from-orange-400 to-red-500", text: "DeFiSensei closed MON/USDC Short", highlight: "-$210", highlightColor: "red" },
  { id: 16, avatar: "M", gradient: "from-purple-500 to-blue-500", text: "MonadWhale copied by", highlight: "5 followers", highlightColor: "purple" },
];

const colorMap = {
  green: "text-accent",
  red: "text-danger",
  purple: "text-primary",
};

export function LiveTicker() {
  // Duplicate items for seamless loop
  const items = [...tickerData, ...tickerData];

  return (
    <div className="relative overflow-hidden border-t border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex h-10 items-center ticker-scroll">
        {items.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex shrink-0 items-center gap-2 px-4">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.gradient} text-[8px] font-bold text-white`}
            >
              {item.avatar}
            </div>
            <span className="whitespace-nowrap text-xs text-zinc-400">
              {item.text}{" "}
              <span className={`font-semibold ${colorMap[item.highlightColor]}`}>
                {item.highlight}
              </span>
            </span>
            <span className="text-zinc-600">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
