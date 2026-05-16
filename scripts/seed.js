const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const RPC_URL = "https://testnet-rpc.monad.xyz";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ADDRESSES = {
  leaderRegistry: "0xE354ae12654C93C9927Bd9880e235b1DAc34f8FF",
  tradeRouter: "0xE2388CF7B786fE3A8398d7dBa832B2F656c0A945",
  factory: "0x50d5916E944b0857ac00D978335f125530CADd9d",
};

function loadABI(name) {
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", `${name}.sol`, `${name}.json`);
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")).abi;
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Seeding with account:", wallet.address);

  const leaderRegistry = new ethers.Contract(ADDRESSES.leaderRegistry, loadABI("LeaderRegistry"), wallet);

  // Register 3 leaders
  console.log("\n--- Registering Leaders ---");
  const leaders = [
    { name: "NadKing", fee: 1000 },
    { name: "AlgoNad", fee: 800 },
    { name: "DeFiSensei", fee: 1200 },
  ];

  for (const leader of leaders) {
    try {
      const tx = await leaderRegistry.registerAsLeader(leader.name, leader.fee);
      await tx.wait();
      console.log(`Registered: ${leader.name} (fee: ${leader.fee / 100}%)`);
    } catch (e) {
      console.log(`${leader.name}: ${e.reason || e.message}`);
    }
  }

  const count = await leaderRegistry.getLeaderCount();
  console.log("\nTotal leaders registered:", count.toString());

  console.log("\n========================================");
  console.log("SEED COMPLETE");
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
