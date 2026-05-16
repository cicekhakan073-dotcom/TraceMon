"use client";

import { useReadContract } from "wagmi";
import { COPY_VAULT_ABI } from "../config/contracts";
import type { VaultInfo } from "../types/contracts";

export function useVaultInfo(vaultAddress: `0x${string}` | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: vaultAddress,
    abi: COPY_VAULT_ABI,
    functionName: "getVaultInfo",
    query: { enabled: !!vaultAddress },
  });

  const vault: VaultInfo | null = data
    ? {
        address: vaultAddress!,
        owner: data[0],
        leader: data[1],
        depositedAmount: data[2],
        isActive: data[3],
        maxSlippage: data[4],
        stopLoss: data[5],
        balance: data[6],
      }
    : null;

  return { vault, isLoading, error };
}
