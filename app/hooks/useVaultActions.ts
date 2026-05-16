"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { COPY_VAULT_ABI } from "../config/contracts";

export function useVaultActions(vaultAddress: `0x${string}` | undefined) {
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isPending = isWritePending || isConfirming;

  function deposit(amountMon: string) {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: COPY_VAULT_ABI,
      functionName: "deposit",
      value: parseEther(amountMon),
    });
  }

  function withdraw(amountWei: bigint) {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: COPY_VAULT_ABI,
      functionName: "withdraw",
      args: [amountWei],
    });
  }

  function pause() {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: COPY_VAULT_ABI,
      functionName: "pause",
    });
  }

  function unpause() {
    if (!vaultAddress) return;
    writeContract({
      address: vaultAddress,
      abi: COPY_VAULT_ABI,
      functionName: "unpause",
    });
  }

  return { deposit, withdraw, pause, unpause, isPending, isSuccess, hash, error, reset };
}
