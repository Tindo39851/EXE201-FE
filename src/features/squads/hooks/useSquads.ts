'use client';

import { useState, useEffect, useCallback } from 'react';
import { squadService } from '../services/squad.service';
import type { PlayerProfile, SquadFilterDto } from '../types/squad.types';

export function useSquads(initialGame: string = 'ALL') {
  const [activeGame, setActiveGame] = useState<string>(initialGame);
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async (game: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: SquadFilterDto = game === 'ALL' ? {} : { game };
      const data = await squadService.getActivePlayers(filters);
      setPlayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers(activeGame);
  }, [activeGame, fetchPlayers]);

  const selectGame = (game: string) => {
    setActiveGame(game);
  };

  const invitePlayer = async (playerId: string) => {
    try {
      return await squadService.invitePlayer(playerId);
    } catch (err) {
      throw err;
    }
  };

  return {
    players,
    activeGame,
    isLoading,
    error,
    selectGame,
    refetch: () => fetchPlayers(activeGame),
    invitePlayer,
  };
}
