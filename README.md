# TradeWatch

**Decentralized parallel copy trading protocol built on Monad.**

[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet-836EF9?style=flat-square)](https://testnet.monadexplorer.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square)](https://nextjs.org)
[![Solidity 0.8.20](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square)](https://soliditylang.org)

---

## Problem

Copy trading in DeFi is fundamentally broken:

1. **High latency kills profits.** On Ethereum, 12-second block times mean copy trades execute 15-45 seconds after the leader, causing 0.8-3.5% slippage per trade.
2. **MEV and frontrunning.** Shared state execution allows sandwich attacks and MEV extraction, eroding follower returns by up to 18% annually.
3. **No risk transparency.** Existing platforms show win rate and PnL but lack quantitative risk metrics (Sharpe Ratio, drawdown analysis, risk scoring) — leaving followers blind to actual risk exposure.

## Solution

TradeWatch solves these problems by leveraging Monad's parallel execution engine:

1. **Parallel copy execution.** Leader and follower trades execute in the same block with zero state conflicts, reducing copy delay to under 1 second.
2. **Isolated Vault Architecture.** Each follower's capital is held in an independent smart contract vault, eliminating cross-contamination and making sandwich attacks economically unviable.
3. **Quantitative risk engine.** Every trader is scored using a weighted mathematical model incorporating Max Drawdown, leverage, volatility, win rate, and trade frequency — giving followers transparent, data-driven decisions.

## Why Monad?

| Metric | Ethereum | Arbitrum | Solana | Monad |
|--------|----------|----------|--------|-------|
| Copy Delay | 15-45s | 2-8s | 1-5s | **0.5-2s** |
| Slippage | 0.8-3.5% | 0.3-1.2% | 0.2-0.8% | **0.05-0.15%** |
| Annual Cost ($100K) | $4,200-$18,400 | $1,560-$6,240 | $1,040-$4,160 | **$260-$780** |
| Frontrun Risk | High | Medium | Medium | **Low** |

Monad's 10,000 TPS and parallel execution save followers up to **93% in slippage costs** and deliver **+18.7% higher net returns** annually compared to Ethereum-based copy trading.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│         Next.js 16 + React 19 + wagmi v2                │
│         RainbowKit + recharts + Tailwind CSS 4          │
└──────────────────────┬──────────────────────────────────┘
                       │ RPC (viem)
┌──────────────────────▼──────────────────────────────────┐
│                  Monad Testnet                           │
│                                                         │
│  ┌─────────────────┐  ┌──────────────┐                  │
│  │ LeaderRegistry  │◄─│  TradeRouter  │                  │
│  │ - register      │  │ - mirror     │                  │
│  │ - stats         │  │ - route      │                  │
│  └─────────────────┘  └──────┬───────┘                  │
│                              │                          │
│  ┌───────────────────────────▼────────────────────────┐ │
│  │            TradeWatchFactory                        │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │ │
│  │  │ Vault A  │ │ Vault B  │ │ Vault C  │  ...      │ │
│  │  │ (User 1) │ │ (User 2) │ │ (User 3) │           │ │
│  │  └──────────┘ └──────────┘ └──────────┘           │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Isolated Vault Pattern:** Each follower gets a dedicated `CopyVault` contract. When a leader opens a position, `TradeRouter` mirrors the trade across all subscribed vaults in parallel. Each vault executes independently with its own balance, slippage limits, and stop-loss settings — enabling true parallel execution on Monad with zero state conflicts.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (Turbopack) | 16.2.6 |
| UI | React | 19 |
| Styling | Tailwind CSS | 4 |
| Charts | recharts | 2.15 |
| Wallet | RainbowKit + wagmi | 2.2.11 / 2.19.5 |
| Chain Interaction | viem | 2.49.2 |
| Smart Contracts | Solidity | 0.8.20 |
| Compiler | Hardhat | 2.28.6 |
| Network | Monad Testnet | Chain ID 10143 |

## Key Features

- **Leaderboard** with grid/table toggle, risk-based filtering, and animated rank borders for top 3 traders.
- **Trader comparison modal** — select any 2 traders for side-by-side metric analysis with grouped bar charts.
- **Quantitative trader profiles** — Risk Score gauge, Sharpe/Sortino ratios, Profit Factor, and Copy Score on every trader detail page.
- **Analytics dashboard** — data-driven "Why Monad?" page with slippage comparison charts, win rate vs ROI analysis, and risk distribution visualization.
- **One-click copy trading** — connect wallet, set deposit/slippage/stop-loss, and deploy an isolated vault in a single transaction.
- **Custom wallet UX** — branded Connect button with automatic Monad Testnet chain switching and wrong-network detection.
- **Live trade ticker** — real-time scrolling feed of platform activity on the landing page.
- **Glassmorphism UI** — frosted glass cards, animated gradient borders, and CSS-only animations throughout.

## Quantitative Risk Model

### Risk Score (1-10)

```
Risk Score = 0.35 x MaxDrawdown + 0.25 x Leverage + 0.20 x Volatility
           + 0.10 x (100 - WinRate) + 0.10 x TradeFrequency
```

Each parameter is normalized to a 0-10 scale. The weighted sum produces a single risk score:

| Score | Level | Profile |
|-------|-------|---------|
| 1-3 | Low | Conservative — low leverage, high consistency |
| 4-6 | Medium | Balanced — moderate leverage, optimized R:R |
| 7-8 | High | Aggressive — high leverage, trend following |
| 9-10 | Very High | Degen — extreme leverage, liquidation-prone |

### Copy Score (1-100)

A composite metric combining Sharpe Ratio (30%), inverse Risk Score (25%), total PnL (25%), and follower count (20%) to surface the most copy-worthy traders.

> **Key Insight:** Win rate alone does not determine profitability. 60% of the platform's most profitable traders have a 50-70% win rate but maintain Risk/Reward ratios above 2.5x. The Risk Score algorithm captures this balance.

## Getting Started

```bash
# 1. Clone
git clone https://github.com/pofishe/TradeWatch.git
cd TradeWatch

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Configure environment
# Create .env.local with:
#   NEXT_PUBLIC_WC_PROJECT_ID=your_reown_project_id
#   PRIVATE_KEY=0x_your_key (only needed for contract deployment)

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy Contracts (optional)

```bash
npx hardhat compile
node scripts/deploy.js
node scripts/seed.js
```

## Smart Contracts (Monad Testnet)

| Contract | Address |
|----------|---------|
| LeaderRegistry | [`0xE354ae12654C93C9927Bd9880e235b1DAc34f8FF`](https://testnet.monadexplorer.com/address/0xE354ae12654C93C9927Bd9880e235b1DAc34f8FF) |
| TradeRouter | [`0xE2388CF7B786fE3A8398d7dBa832B2F656c0A945`](https://testnet.monadexplorer.com/address/0xE2388CF7B786fE3A8398d7dBa832B2F656c0A945) |
| TradeWatchFactory | [`0x50d5916E944b0857ac00D978335f125530CADd9d`](https://testnet.monadexplorer.com/address/0x50d5916E944b0857ac00D978335f125530CADd9d) |

### Contract Overview

| Contract | Purpose |
|----------|---------|
| `LeaderRegistry.sol` | On-chain leader profiles and performance tracking |
| `TradeRouter.sol` | Fans out leader trades to all follower vaults in parallel |
| `CopyVault.sol` | Isolated per-follower vault with deposit, withdraw, pause, stop-loss |
| `TradeWatchFactory.sol` | Deploys new CopyVault instances for followers |

## Team

Built by **pofishe** for the Monad Hackathon.

## License

MIT
