export interface LeaderInfo {
  address: string;
  name: string;
  performanceFee: bigint;
  totalPnL: bigint;
  totalTrades: bigint;
  winCount: bigint;
  followerCount: bigint;
  isActive: boolean;
}

export interface VaultInfo {
  address: string;
  owner: string;
  leader: string;
  depositedAmount: bigint;
  isActive: boolean;
  maxSlippage: bigint;
  stopLoss: bigint;
  balance: bigint;
}

export interface TradeRecord {
  id: number;
  pair: string;
  side: "Long" | "Short";
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  timestamp: number;
}
