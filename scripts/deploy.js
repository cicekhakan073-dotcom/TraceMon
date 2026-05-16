const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const RPC_URL = "https://testnet-rpc.monad.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("PRIVATE_KEY not found in .env.local");
  process.exit(1);
}

function loadArtifact(name) {
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", `${name}.sol`, `${name}.json`);
  return JSON.parse(fs.readFileSync(artifactPath, "utf8"));
}

async function deployContract(wallet, name, args = []) {
  const artifact = loadArtifact(name);
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log(`Deploying ${name}...`);
  const contract = await factory.deploy(...args);
  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log(`${name} deployed: ${addr}`);
  return contract;
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deploying with account:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "MON\n");

  if (balance === 0n) {
    console.error("No MON balance! Get testnet MON from https://faucet.monad.xyz/");
    process.exit(1);
  }

  // 1. Deploy LeaderRegistry
  const leaderRegistry = await deployContract(wallet, "LeaderRegistry");
  const leaderRegistryAddr = await leaderRegistry.getAddress();

  // 2. Deploy TradeRouter
  const tradeRouter = await deployContract(wallet, "TradeRouter", [leaderRegistryAddr]);
  const tradeRouterAddr = await tradeRouter.getAddress();

  // 3. Deploy TradeWatchFactory
  const factory = await deployContract(wallet, "TradeWatchFactory", [tradeRouterAddr]);
  const factoryAddr = await factory.getAddress();

  // 4. Set Factory on TradeRouter
  console.log("\nSetting Factory on TradeRouter...");
  const tx1 = await tradeRouter.setFactory(factoryAddr);
  await tx1.wait();
  console.log("Factory set");

  // 5. Set Router on LeaderRegistry
  console.log("Setting Router on LeaderRegistry...");
  const tx2 = await leaderRegistry.setRouter(tradeRouterAddr);
  await tx2.wait();
  console.log("Router set");

  console.log("\n========================================");
  console.log("DEPLOYMENT COMPLETE");
  console.log("========================================");
  console.log("LeaderRegistry:    " + leaderRegistryAddr);
  console.log("TradeRouter:       " + tradeRouterAddr);
  console.log("TradeWatchFactory: " + factoryAddr);
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
