import { apiClient } from '@/services/api-client';
import type { Tournament, TournamentFilterDto, MatchBracketNode } from '../types/tournament.types';

const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'NEON CIRCUIT OPEN',
    game: 'Valorant',
    status: 'LIVE',
    format: '5v5 Double Elim',
    prize: 50000,
    countdown: '02:14:27',
    teams: 128,
    featured: true,
  },
  {
    id: 't2',
    name: 'DARKBYTE INVITATIONAL',
    game: 'CS2',
    status: 'OPEN',
    format: '5v5 Single Elim',
    prize: 25000,
    countdown: '09:40:40',
    teams: 64,
  },
  {
    id: 't3',
    name: 'PHANTOM LEAGUE S3',
    game: 'League of Legends',
    status: 'OPEN',
    format: '5v5 Swiss',
    prize: 100000,
    countdown: '23:05:24',
    teams: 256,
  },
  {
    id: 't4',
    name: 'APEX GRID MASTERS',
    game: 'Apex Legends',
    status: 'UPCOMING',
    format: '3v3 Battle Royale',
    prize: 15000,
    countdown: '48:00:00',
    teams: 60,
    featured: true,
  },
];

const MOCK_BRACKET: MatchBracketNode[] = [
  {
    id: 'm1',
    round: 'Quarterfinals',
    team1: { name: 'PHANTOM SYNDICATE', score: 2, won: true },
    team2: { name: 'NEON WOLVES', score: 1, won: false },
    status: 'COMPLETED',
  },
  {
    id: 'm2',
    round: 'Quarterfinals',
    team1: { name: 'DARK VECTOR', score: 2, won: true },
    team2: { name: 'GRID REAPERS', score: 0, won: false },
    status: 'COMPLETED',
  },
  {
    id: 'm3',
    round: 'Semifinals',
    team1: { name: 'PHANTOM SYNDICATE', score: '-' },
    team2: { name: 'DARK VECTOR', score: '-' },
    status: 'LIVE',
  },
  {
    id: 'm4',
    round: 'Finals',
    team1: { name: 'WINNER MATCH 3', score: '-' },
    team2: { name: 'TBD', score: '-' },
    status: 'SCHEDULED',
  },
];

export const tournamentService = {
  async getTournaments(filter?: TournamentFilterDto): Promise<Tournament[]> {
    try {
      const response = await apiClient.get<Tournament[]>('/tournaments', { params: filter });
      return response.data;
    } catch {
      if (!filter?.status || filter.status === 'ALL') {
        return MOCK_TOURNAMENTS;
      }
      return MOCK_TOURNAMENTS.filter(t => t.status === filter.status);
    }
  },

  async getTournamentById(id: string): Promise<Tournament> {
    try {
      const response = await apiClient.get<Tournament>(`/tournaments/${id}`);
      return response.data;
    } catch {
      return MOCK_TOURNAMENTS.find(t => t.id === id) || MOCK_TOURNAMENTS[0];
    }
  },

  async getBracket(tournamentId: string): Promise<MatchBracketNode[]> {
    try {
      const response = await apiClient.get<MatchBracketNode[]>(`/tournaments/${tournamentId}/bracket`);
      return response.data;
    } catch {
      return MOCK_BRACKET;
    }
  },

  async registerTeam(tournamentId: string, teamData: { teamName: string; captainDiscord: string }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/tournaments/${tournamentId}/register`, teamData);
    return response.data;
  },
};
