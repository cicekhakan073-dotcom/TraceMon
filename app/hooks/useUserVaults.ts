"use client";

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES, FACTORY_ABI, COPY_VAULT_ABI } from "../config/contracts";
import type { VaultInfo } from "../types/contracts";

export function useUserVaults() {
  const { address } = useAccount();

  // 1. Get vault addresses for the connected user
  const {
    data: vaultAddresses,
    isLoading: isLoadingAddresses,
    error: addressError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.factory,
    abi: FACTORY_ABI,
    functionName: "getVaultsForUser",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // 2. Get info for each vault
  const contracts = (vaultAddresses ?? []).map((addr) => ({
    address: addr as `0x${string}`,
    abi: COPY_VAULT_ABI,
    functionName: "getVaultInfo" as const,
  }));

  const {
    data: vaultInfos,
    isLoading: isLoadingInfos,
    error: infoError,
  } = useReadContracts({
    contracts: contracts.length > 0 ? contracts : undefined,
  });

  const isLoading = isLoadingAddresses || isLoadingInfos;
  const error = addressError || infoError;

  const isPlaceholder =
    CONTRACT_ADDRESSES.factory === "0x0000000000000000000000000000000000000000";

  if (isPlaceholder) {
    return { vaults: null, isLoading: false, error: null, isMock: true };
  }

  const vaults: VaultInfo[] = (vaultAddresses ?? []).map((addr, i) => {
    const result = vaultInfos?.[i]?.result as
      | readonly [string, string, bigint, boolean, bigint, bigint, bigint]
      | undefined;

    return {
      address: addr,
      owner: result?.[0] ?? "",
      leader: result?.[1] ?? "",
      depositedAmount: result?.[2] ?? 0n,
      isActive: result?.[3] ?? false,
      maxSlippage: result?.[4] ?? 0n,
      stopLoss: result?.[5] ?? 0n,
      balance: result?.[6] ?? 0n,
    };
  });

  return { vaults, isLoading, error, isMock: false };
}
