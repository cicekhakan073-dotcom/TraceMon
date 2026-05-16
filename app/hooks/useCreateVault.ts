"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESSES, FACTORY_ABI } from "../config/contracts";

export function useCreateVault() {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  function createVault(leader: string, maxSlippageBps: number, depositMon: string) {
    writeContract({
      address: CONTRACT_ADDRESSES.factory,
      abi: FACTORY_ABI,
      functionName: "createVault",
      args: [leader as `0x${string}`, BigInt(maxSlippageBps)],
      value: parseEther(depositMon),
    });
  }

  return {
    createVault,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
    error,
    reset,
  };
}
