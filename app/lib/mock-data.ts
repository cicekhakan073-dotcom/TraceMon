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

function generateSparkline(trend: "up" | "down" | "volatile"): number[] {
  const points: number[] = [];
  let value = 100;
  for (let i = 0; i < 7; i++) {
    if (trend === "up") value += Math.random() * 15 - 3;
    else if (trend === "down") value += Math.random() * 10 - 12;
    else value += Math.random() * 30 - 15;
    points.push(Math.round(value * 100) / 100);
  }
  return points;
}

export const leaders: LeaderTrader[] = [
  {
    address: "0x7a3F...8e2D",
    username: "MonadWhale",
    totalPnL: 284520,
    winRate: 78.4,
    totalTrades: 1243,
    followers: 3841,
    maxDrawdown: 8.2,
    weeklyROI: 12.5,
    isVerified: true,
    riskLevel: "Medium",
    avatarGradient: "from-purple-500 to-blue-500",
    sparkline: generateSparkline("up"),
    avgLeverage: 7,
    avgTradeDuration: "6h",
    profitFactor: 2.14,
    sharpeRatio: 1.92,
    riskScore: 4.2,
  },
  {
    address: "0x1bC4...f9A1",
    username: "NadKing",
    totalPnL: 541230,
    winRate: 82.1,
    totalTrades: 876,
    followers: 5204,
    maxDrawdown: 5.1,
    weeklyROI: 18.3,
    isVerified: true,
    riskLevel: "Low",
    avatarGradient: "from-green-400 to-emerald-600",
    sparkline: generateSparkline("up"),
    avgLeverage: 5,
    avgTradeDuration: "2d",
    profitFactor: 2.87,
    sharpeRatio: 2.38,
    riskScore: 3.1,
  },
  {
    address: "0x9eF2...3bC7",
    username: "DeFiSensei",
    totalPnL: 167890,
    winRate: 71.3,
    totalTrades: 2104,
    followers: 2156,
    maxDrawdown: 12.7,
    weeklyROI: 8.9,
    isVerified: true,
    riskLevel: "Medium",
    avatarGradient: "from-orange-400 to-red-500",
    sparkline: generateSparkline("up"),
    avgLeverage: 8,
    avgTradeDuration: "12h",
    profitFactor: 1.76,
    sharpeRatio: 1.54,
    riskScore: 5.1,
  },
  {
    address: "0x4dA8...1eF5",
    username: "ParallelPro",
    totalPnL: 92340,
    winRate: 65.8,
    totalTrades: 3450,
    followers: 1892,
    maxDrawdown: 18.4,
    weeklyROI: 22.1,
    isVerified: false,
    riskLevel: "High",
    avatarGradient: "from-red-500 to-pink-600",
    sparkline: generateSparkline("volatile"),
    avgLeverage: 15,
    avgTradeDuration: "45m",
    profitFactor: 1.52,
    sharpeRatio: 0.94,
    riskScore: 7.3,
  },
  {
    address: "0xbB71...c4D2",
    username: "SteadyEddie",
    totalPnL: 78450,
    winRate: 84.6,
    totalTrades: 542,
    followers: 967,
    maxDrawdown: 3.2,
    weeklyROI: 4.7,
    isVerified: true,
    riskLevel: "Low",
    avatarGradient: "from-cyan-400 to-blue-500",
    sparkline: generateSparkline("up"),
    avgLeverage: 2,
    avgTradeDuration: "3d",
    profitFactor: 2.41,
    sharpeRatio: 2.61,
    riskScore: 1.8,
  },
  {
    address: "0x2fE9...a7B3",
    username: "MoonShotMike",
    totalPnL: -12340,
    winRate: 42.1,
    totalTrades: 891,
    followers: 234,
    maxDrawdown: 34.5,
    weeklyROI: -8.3,
    isVerified: false,
    riskLevel: "High",
    avatarGradient: "from-yellow-500 to-orange-600",
    sparkline: generateSparkline("down"),
    avgLeverage: 35,
    avgTradeDuration: "20m",
    profitFactor: 0.68,
    sharpeRatio: -0.42,
    riskScore: 8.9,
  },
  {
    address: "0x6aC3...d5E8",
    username: "AlgoNad",
    totalPnL: 345670,
    winRate: 76.9,
    totalTrades: 5621,
    followers: 4123,
    maxDrawdown: 9.8,
    weeklyROI: 14.2,
    isVerified: true,
    riskLevel: "Medium",
    avatarGradient: "from-violet-500 to-purple-700",
    sparkline: generateSparkline("up"),
    avgLeverage: 6,
    avgTradeDuration: "4h",
    profitFactor: 2.31,
    sharpeRatio: 1.87,
    riskScore: 4.5,
  },
  {
    address: "0xdD45...8fA9",
    username: "ScalpKing",
    totalPnL: 56780,
    winRate: 69.4,
    totalTrades: 8734,
    followers: 1456,
    maxDrawdown: 15.3,
    weeklyROI: 6.8,
    isVerified: false,
    riskLevel: "Medium",
    avatarGradient: "from-teal-400 to-green-500",
    sparkline: generateSparkline("volatile"),
    avgLeverage: 12,
    avgTradeDuration: "8m",
    profitFactor: 1.43,
    sharpeRatio: 1.12,
    riskScore: 5.8,
  },
  {
    address: "0x8eB2...2cD4",
    username: "DiamondHands",
    totalPnL: 198760,
    winRate: 58.2,
    totalTrades: 312,
    followers: 2890,
    maxDrawdown: 22.1,
    weeklyROI: 31.4,
    isVerified: true,
    riskLevel: "High",
    avatarGradient: "from-amber-400 to-yellow-600",
    sparkline: generateSparkline("volatile"),
    avgLeverage: 20,
    avgTradeDuration: "5d",
    profitFactor: 1.89,
    sharpeRatio: 0.78,
    riskScore: 7.6,
  },
  {
    address: "0x3fA1...b6E7",
    username: "SafeYield",
    totalPnL: 45230,
    winRate: 88.9,
    totalTrades: 234,
    followers: 678,
    maxDrawdown: 2.1,
    weeklyROI: 2.9,
    isVerified: true,
    riskLevel: "Low",
    avatarGradient: "from-indigo-400 to-blue-600",
    sparkline: generateSparkline("up"),
    avgLeverage: 1.5,
    avgTradeDuration: "7d",
    profitFactor: 3.12,
    sharpeRatio: 2.84,
    riskScore: 1.2,
  },
];
