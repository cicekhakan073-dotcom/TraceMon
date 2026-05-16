"use client";

import { leaders as mockLeaders } from "../lib/mock-data";

export function useLeaderboard() {
  // Use curated mock data — on-chain LeaderRegistry only has 1 leader registered,
  // which causes flicker between on-chain (1 result) and mock (10 results).
  // In production, this would read from an indexer with full trader data.
  return {
    leaders: mockLeaders,
    isLoading: false,
    error: null,
    isMock: true,
  };
}
