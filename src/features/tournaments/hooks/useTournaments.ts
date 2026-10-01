'use client';

import { useState, useEffect, useCallback } from 'react';
import { tournamentService } from '../services/tournament.service';
import type { Tournament, TournamentStatus, MatchBracketNode } from '../types/tournament.types';

export function useTournaments(initialStatus: TournamentStatus | 'ALL' = 'ALL') {
  const [activeTab, setActiveTab] = useState<TournamentStatus | 'ALL'>(initialStatus);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [bracket, setBracket] = useState<MatchBracketNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async (status: TournamentStatus | 'ALL') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tournamentService.getTournaments({ status });
      setTournaments(data);
      if (data.length > 0 && !selectedTournament) {
        setSelectedTournament(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTournament]);

  useEffect(() => {
    // Refresh whenever the tournament status filter changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTournaments(activeTab);
  }, [activeTab, fetchTournaments]);

  useEffect(() => {
    if (selectedTournament) {
      tournamentService.getBracket(selectedTournament.id).then(setBracket);
    }
  }, [selectedTournament]);

  const selectTournamentById = (id: string) => {
    const found = tournaments.find(t => t.id === id);
    if (found) {
      setSelectedTournament(found);
    }
  };

  const registerSquad = async (tournamentId: string, teamData: { teamName: string; captainDiscord: string }) => {
    return await tournamentService.registerTeam(tournamentId, teamData);
  };

  return {
    tournaments,
    selectedTournament,
    bracket,
    activeTab,
    isLoading,
    error,
    setActiveTab,
    selectTournamentById,
    registerSquad,
    refetch: () => fetchTournaments(activeTab),
  };
}
