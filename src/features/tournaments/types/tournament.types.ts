import type { GameTitle } from '@/types';

export type TournamentStatus = 'LIVE' | 'OPEN' | 'UPCOMING';

export interface Tournament {
  id: string;
  name: string;
  game: GameTitle | string;
  status: TournamentStatus;
  format: string;
  prize: number;
  countdown: string;
  teams: number;
  featured?: boolean;
}

export interface TournamentFilterDto {
  status?: TournamentStatus | 'ALL';
  game?: string;
}

export interface MatchBracketNode {
  id: string;
  round: 'Quarterfinals' | 'Semifinals' | 'Finals';
  team1: { name: string; score: number | string; won?: boolean };
  team2: { name: string; score: number | string; won?: boolean };
  status: 'COMPLETED' | 'LIVE' | 'SCHEDULED';
}

export interface TournamentRegistration {
  id?: string;
  teamName?: string;
  status?: string;
  captainDiscord?: string;
  tournamentId?: string;
}

export type TournamentTeamData = Record<string, unknown>;
