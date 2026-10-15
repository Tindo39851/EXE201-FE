import type { AccentColor, GameTitle } from '@/types';

export interface PlayerProfile {
  id: string;
  initial: string;
  username: string;
  timezone: string;
  game: GameTitle | string;
  rank: string;
  status: 'LFG' | 'LFT' | 'Online';
  description: string;
  roles: string[];
  lookingFor?: string;
  repScore: number;
  matches?: number;
  winRate: string;
  accentColor: AccentColor;
  micAvailable: boolean;
  isPremium?: boolean;
}

export interface SquadFilterDto {
  game?: string;
  rank?: string;
  role?: string;
  region?: string;
  micRequired?: boolean;
}

export interface MatchmakingRequestDto {
  gameId: string;
  primaryRole: string;
  rank: string;
  region: string;
  neededRoles: string[];
  micRequired: boolean;
}

export interface MatchmakingResult {
  lobbyId: string;
  roomId?: string;
  roomName?: string;
  game: string;
  channel?: string;
  matchedCount?: number;
  maxPlayers?: number;
  voiceChannelUrl: string;
  status: 'QUEUED' | 'MATCHED' | 'FAILED';
}

export interface SquadInvite {
  id: string;
  invitedBy?: string;
  recipientUsername?: string;
  playerId?: string;
  roomId?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt?: string;
}

export interface UpdateSquadProfileDto {
  game: string;
  rank: string;
  roles: string[];
  region?: string;
  micAvailable: boolean;
  bio?: string;
  lookingForSquad?: boolean;
}
