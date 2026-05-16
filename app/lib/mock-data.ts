export type RiskLevel = "Low" | "Medium" | "High";

export interface LeaderTrader {
  address: string;
  username: string;
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  followers: number;
  maxDrawdown: number;
  weeklyROI: number;
  isVerified: boolean;
  riskLevel: RiskLevel;
  avatarGradient: string;
  sparkline: number[];
  // Quant metrikleri
  avgLeverage?: number;
  avgTradeDuration?: string; // "2h", "4d" vb.
  profitFactor?: number;
  sharpeRatio?: number;
  riskScore?: number;  // 1-10
}

// Pre-computed sparklines to avoid hydration mismatch (Math.random differs server vs client)
const sparklines = {
  up1: [100, 108.2, 112.5, 119.3, 115.8, 124.1, 131.6],
  up2: [100, 104.7, 111.9, 116.4, 122.8, 118.3, 127.5],
  up3: [100, 106.1, 103.8, 112.4, 118.9, 125.2, 130.1],
  up4: [100, 107.3, 114.6, 110.2, 119.8, 126.4, 133.7],
  up5: [100, 103.4, 109.1, 115.7, 121.3, 124.8, 129.2],
  up6: [100, 105.8, 112.3, 108.9, 117.4, 123.6, 128.9],
  down1: [100, 95.3, 89.7, 84.2, 87.1, 79.6, 73.8],
  volatile1: [100, 115.2, 98.7, 121.4, 105.3, 88.9, 112.6],
  volatile2: [100, 87.3, 108.5, 94.1, 118.7, 102.4, 95.8],
  volatile3: [100, 112.8, 95.4, 107.2, 89.6, 114.3, 103.1],
};

let sparklineIndex = 0;
function generateSparkline(trend: "up" | "down" | "volatile"): number[] {
  const upKeys = ["up1", "up2", "up3", "up4", "up5", "up6"] as const;
  const volatileKeys = ["volatile1", "volatile2", "volatile3"] as const;

  if (trend === "down") return sparklines.down1;
  if (trend === "volatile") {
    const key = volatileKeys[sparklineIndex % volatileKeys.length];
    sparklineIndex++;
    return sparklines[key];
  }
  const key = upKeys[sparklineIndex % upKeys.length];
  sparklineIndex++;
  return sparklines[key];
}

// Real-world inspired data based on Hyperliquid / GMX / dYdX top trader patterns
export const leaders: LeaderTrader[] = [
  {
    address: "0xHLf8...42aE",
    username: "HyperVault",
    totalPnL: 2_847_300,
    winRate: 67.2,
    totalTrades: 4_312,
    followers: 11_240,
    maxDrawdown: 14.3,
    weeklyROI: 9.4,
    isVerified: true,
    riskLevel: "Medium",
    avatarGradient: "from-purple-500 to-blue-500",
    sparkline: generateSparkline("up"),
    avgLeverage: 10,
    avgTradeDuration: "3h",
    profitFactor: 2.41,
    sharpeRatio: 2.18,
    riskScore: 4.7,
  },
  {
    address: "0xCBb3...9fD1",
    username: "CBquant",
    totalPnL: 5_134_600,
    winRate: 73.8,
    totalTrades: 1_876,
    followers: 18_420,
    maxDrawdown: 7.6,
    weeklyROI: 11.2,
    isVerified: true,
    riskLevel: "Low",
    avatarGradient: "from-green-400 to-emerald-600",
    sparkline: generateSparkline("up"),
    avgLeverage: 5,
    avgTradeDuration: "1d",
    profitFactor: 3.12,
    sharpeRatio: 2.87,
    riskScore: 2.9,
  },
  {
    address: "0xa4E7...c3B8",
    username: "0xSifu",
    totalPnL: 1_423_780,
    winRate: 61.4,
    totalTrades: 7_845,
    followers: 8_670,
    maxDrawdown: 19.2,
    weeklyROI: 16.8,
    isVerified: true,
    riskLevel: "High",
    avatarGradient: "from-orange-400 to-red-500",
    sparkline: generateSparkline("volatile"),
    avgLeverage: 20,
    avgTradeDuration: "45m",
    profitFactor: 1.89,
    sharpeRatio: 1.34,
    riskScore: 6.8,
  },
  {
    address: "0x71dF...eA24",
    username: "deltahedge",
    totalPnL: 892_450,
    winRate: 81.3,
    totalTrades: 623,
    followers: 5_340,
    maxDrawdown: 4.1,
    weeklyROI: 5.3,
    isVerified: true,
    riskLevel: "Low",
    avatarGradient: "from-cyan-400 to-blue-500",
    sparkline: generateSparkline("up"),
    avgLeverage: 2,
    avgTradeDuration: "4d",
    profitFactor: 2.94,
    sharpeRatio: 2.71,
    riskScore: 1.9,
  },
  {
    address: "0x3eC9...87fB",
    username: "GMXwhale",
    totalPnL: 3_671_200,
    winRate: 58.9,
    totalTrades: 2_456,
    followers: 14_890,
    maxDrawdown: 21.7,
    weeklyROI: 24.6,
    isVerified: true,
    riskLevel: "High",
    avatarGradient: "from-red-500 to-pink-600",
    sparkline: generateSparkline("volatile"),
    avgLeverage: 25,
    avgTradeDuration: "2h",
    profitFactor: 1.67,
    sharpeRatio: 0.92,
    riskScore: 7.4,
  },
  {
    address: "0xfB42...1dC6",
    username: "perp_ace",
    totalPnL: 678_900,
    winRate: 70.5,
    totalTrades: 12_340,
    followers: 6_210,
    maxDrawdown: 11.8,
    weeklyROI: 7.9,
    isVerified: true,
    riskLevel: "Medium",
    avatarGradient: "from-violet-500 to-purple-700",
    sparkline: generateSparkline("up"),
    avgLeverage: 8,
    avgTradeDuration: "6h",
    profitFactor: 2.08,
    sharpeRatio: 1.76,
    riskScore: 4.3,
  },
  {
    address: "0xdA57...b9E3",
    username: "degenSpartan",
    totalPnL: -487_620,
    winRate: 38.7,
    totalTrades: 3_210,
    followers: 1_890,
    maxDrawdown: 62.4,
    weeklyROI: -14.2,
    isVerified: false,
    riskLevel: "High",
    avatarGradient: "from-yellow-500 to-orange-600",
    sparkline: generateSparkline("down"),
    avgLeverage: 50,
    avgTradeDuration: "12m",
    profitFactor: 0.54,
    sharpeRatio: -0.87,
    riskScore: 9.4,
  },
  {
    address: "0x92aB...4eF7",
    username: "fundingArb",
    totalPnL: 1_245_800,
    winRate: 86.2,
    totalTrades: 945,
    followers: 7_830,
    maxDrawdown: 3.4,
    weeklyROI: 3.8,
    isVerified: true,
    riskLevel: "Low",
    avatarGradient: "from-indigo-400 to-blue-600",
    sparkline: generateSparkline("up"),
    avgLeverage: 1.5,
    avgTradeDuration: "6d",
    profitFactor: 3.47,
    sharpeRatio: 3.02,
    riskScore: 1.4,
  },
  {
    address: "0x5cD8...a1B2",
    username: "thetaGang",
    totalPnL: 456_120,
    winRate: 76.1,
    totalTrades: 5_678,
    followers: 4_560,
    maxDrawdown: 9.3,
    weeklyROI: 6.1,
    isVerified: false,
    riskLevel: "Medium",
    avatarGradient: "from-teal-400 to-green-500",
    sparkline: generateSparkline("up"),
    avgLeverage: 7,
    avgTradeDuration: "8h",
    profitFactor: 1.93,
    sharpeRatio: 1.58,
    riskScore: 4.1,
  },
  {
    address: "0xeF13...7cA9",
    username: "monadMaxi",
    totalPnL: 2_134_500,
    winRate: 64.7,
    totalTrades: 1_567,
    followers: 9_120,
    maxDrawdown: 16.8,
    weeklyROI: 19.3,
    isVerified: true,
    riskLevel: "Medium",
    avatarGradient: "from-amber-400 to-yellow-600",
    sparkline: generateSparkline("volatile"),
    avgLeverage: 12,
    avgTradeDuration: "1h",
    profitFactor: 2.23,
    sharpeRatio: 1.41,
    riskScore: 5.6,
  },
];
