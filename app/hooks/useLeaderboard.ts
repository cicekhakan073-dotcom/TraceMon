"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES, LEADER_REGISTRY_ABI } from "../config/contracts";
import { leaders as mockLeaders } from "../lib/mock-data";
import type { LeaderInfo } from "../types/contracts";

export function useLeaderboard() {
  // 1. Get all leader addresses
  const {
    data: leaderAddresses,
    isLoading: isLoadingAddresses,
    error: addressError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.leaderRegistry,
    abi: LEADER_REGISTRY_ABI,
    functionName: "getAllLeaders",
  });

  // 2. Get info for each leader
  const contracts = (leaderAddresses ?? []).map((addr) => ({
    address: CONTRACT_ADDRESSES.leaderRegistry,
    abi: LEADER_REGISTRY_ABI,
    functionName: "getLeaderInfo" as const,
    args: [addr] as const,
  }));

  const {
    data: leaderInfos,
    isLoading: isLoadingInfos,
    error: infoError,
  } = useReadContracts({ contracts: contracts.length > 0 ? contracts : undefined });

  const isLoading = isLoadingAddresses || isLoadingInfos;
  const error = addressError || infoError;

  // If contracts fail or return nothing, fallback to mock data
  const useMock =
    !leaderAddresses ||
    leaderAddresses.length === 0 ||
    error ||
    CONTRACT_ADDRESSES.leaderRegistry === "0x0000000000000000000000000000000000000000";

  if (useMock) {
    return {
      leaders: mockLeaders,
      isLoading: false,
      error: null,
      isMock: true,
    };
  }

  const leaders: LeaderInfo[] = (leaderAddresses ?? []).map((addr, i) => {
    const result = leaderInfos?.[i]?.result as
      | {
          name: string;
          performanceFee: bigint;
          totalPnL: bigint;
          totalTrades: bigint;
          winCount: bigint;
          followerCount: bigint;
          isActive: boolean;
        }
      | undefined;

    return {
      address: addr,
      name: result?.name ?? "Unknown",
      performanceFee: result?.performanceFee ?? 0n,
      totalPnL: result?.totalPnL ?? 0n,
      totalTrades: result?.totalTrades ?? 0n,
      winCount: result?.winCount ?? 0n,
      followerCount: result?.followerCount ?? 0n,
      isActive: result?.isActive ?? false,
    };
  });

  return { leaders, isLoading, error, isMock: false };
}
