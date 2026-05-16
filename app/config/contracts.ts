// Contract addresses — update after deploying to Monad testnet
export const CONTRACT_ADDRESSES = {
  factory: "0x50d5916E944b0857ac00D978335f125530CADd9d" as `0x${string}`,
  router: "0xE2388CF7B786fE3A8398d7dBa832B2F656c0A945" as `0x${string}`,
  leaderRegistry: "0xE354ae12654C93C9927Bd9880e235b1DAc34f8FF" as `0x${string}`,
} as const;

// --- ABIs ---

export const LEADER_REGISTRY_ABI = [
  {
    type: "function",
    name: "registerAsLeader",
    inputs: [
      { name: "name", type: "string" },
      { name: "performanceFee", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getLeaderInfo",
    inputs: [{ name: "leader", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "performanceFee", type: "uint256" },
          { name: "totalPnL", type: "int256" },
          { name: "totalTrades", type: "uint256" },
          { name: "winCount", type: "uint256" },
          { name: "followerCount", type: "uint256" },
          { name: "isActive", type: "bool" },
          { name: "registeredAt", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllLeaders",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isRegisteredLeader",
    inputs: [{ name: "leader", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLeaderCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "LeaderRegistered",
    inputs: [
      { name: "leader", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "performanceFee", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "LeaderStatsUpdated",
    inputs: [
      { name: "leader", type: "address", indexed: true },
      { name: "pnl", type: "int256", indexed: false },
      { name: "totalTrades", type: "uint256", indexed: false },
    ],
  },
] as const;

export const FACTORY_ABI = [
  {
    type: "function",
    name: "createVault",
    inputs: [
      { name: "leader", type: "address" },
      { name: "maxSlippage", type: "uint256" },
    ],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getVaultsForUser",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "VaultCreated",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "leader", type: "address", indexed: true },
      { name: "vault", type: "address", indexed: false },
    ],
  },
] as const;

export const TRADE_ROUTER_ABI = [
  {
    type: "function",
    name: "executeMirrorTrade",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "minAmountOut", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getVaultsForLeader",
    inputs: [{ name: "leader", type: "address" }],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultCountForLeader",
    inputs: [{ name: "leader", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "VaultRegistered",
    inputs: [
      { name: "leader", type: "address", indexed: true },
      { name: "vault", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "MirrorTradeInitiated",
    inputs: [
      { name: "leader", type: "address", indexed: true },
      { name: "tokenIn", type: "address", indexed: false },
      { name: "tokenOut", type: "address", indexed: false },
      { name: "amountIn", type: "uint256", indexed: false },
      { name: "vaultCount", type: "uint256", indexed: false },
    ],
  },
] as const;

export const COPY_VAULT_ABI = [
  {
    type: "function",
    name: "deposit",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMaxSlippage",
    inputs: [{ name: "_slippage", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getVaultInfo",
    inputs: [],
    outputs: [
      { name: "_owner", type: "address" },
      { name: "_leader", type: "address" },
      { name: "_deposited", type: "uint256" },
      { name: "_isActive", type: "bool" },
      { name: "_maxSlippage", type: "uint256" },
      { name: "_stopLoss", type: "uint256" },
      { name: "_balance", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "leader",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isActive",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "depositedAmount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Deposited",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "TradeExecuted",
    inputs: [
      { name: "tokenIn", type: "address", indexed: true },
      { name: "tokenOut", type: "address", indexed: true },
      { name: "amountIn", type: "uint256", indexed: false },
      { name: "amountOut", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "VaultPaused",
    inputs: [{ name: "owner", type: "address", indexed: true }],
  },
  {
    type: "event",
    name: "VaultUnpaused",
    inputs: [{ name: "owner", type: "address", indexed: true }],
  },
] as const;
