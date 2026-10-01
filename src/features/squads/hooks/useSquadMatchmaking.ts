'use client';

import { useState } from 'react';
import { squadService } from '../services/squad.service';
import type { MatchmakingRequestDto, MatchmakingResult } from '../types/squad.types';

export function useSquadMatchmaking() {
  const [isSearching, setIsSearching] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchmakingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startMatchmaking = async (dto: MatchmakingRequestDto) => {
    setIsSearching(true);
    setMatchResult(null);
    setError(null);

    try {
      // Simulate real matchmaking delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await squadService.findSquad(dto);
      setMatchResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Matchmaking failed');
      throw err;
    } finally {
      setIsSearching(false);
    }
  };

  const resetMatchmaking = () => {
    setMatchResult(null);
    setError(null);
  };

  return {
    isSearching,
    matchResult,
    error,
    startMatchmaking,
    resetMatchmaking,
  };
}
