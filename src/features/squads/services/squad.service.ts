import { apiClient } from '@/services/api-client';
import type { PlayerProfile, SquadFilterDto, MatchmakingRequestDto, MatchmakingResult } from '../types/squad.types';

const MOCK_PLAYERS: PlayerProfile[] = [
  {
    id: 'p1',
    initial: 'A',
    username: 'AXIOM_V',
    timezone: 'PST',
    game: 'Valorant',
    rank: 'Radiant',
    status: 'LFG',
    description: 'Ex semi-pro IGL looking for 2 more for ranked grind. No excuses, all comms.',
    roles: ['IGL', 'Controller'],
    repScore: 9.9,
    winRate: '62%',
    accentColor: 'red',
    micAvailable: true,
  },
  {
    id: 'p2',
    initial: 'N',
    username: 'NULLSHIFT',
    timezone: 'W',
    game: 'CS2',
    rank: 'Global Elite',
    status: 'LFG',
    description: '3k+ hours GE. Looking for a structured 5 stack. Must have working mic and basic utility.',
    roles: ['AWPer', 'Entry'],
    repScore: 9.8,
    winRate: '57%',
    accentColor: 'yellow',
    micAvailable: true,
  },
  {
    id: 'p3',
    initial: 'C',
    username: 'CR4WLER',
    timezone: 'EST',
    game: 'League of Legends',
    rank: 'Challenger',
    status: 'LFG',
    description: 'KR Challenger jungler. Smurfing NA for fun. ADC duo preferred - must be Diamond+.',
    roles: ['Jungle', 'Mid'],
    repScore: 9.7,
    winRate: '71%',
    accentColor: 'blue',
    micAvailable: true,
  },
  {
    id: 'p4',
    initial: 'V',
    username: 'VECTOR_X',
    timezone: 'PT',
    game: 'Apex Legends',
    rank: 'Predator',
    status: 'LFG',
    description: 'Masters to Pred every season. Need a 3rd for ranked splits. Support/Recon only.',
    roles: ['Fragger', 'IGL'],
    repScore: 9.6,
    winRate: '68%',
    accentColor: 'red',
    micAvailable: true,
  },
  {
    id: 'p5',
    initial: 'G',
    username: 'GHOST_RIG',
    timezone: '-',
    game: 'Overwatch 2',
    rank: 'Top 500',
    status: 'LFG',
    description: 'T500 tank main. Flex to any anchor if needed. Looking for chill but focused duo/trio.',
    roles: ['Tank', 'Flex'],
    repScore: 9.5,
    winRate: '58%',
    accentColor: 'orange',
    micAvailable: true,
  },
  {
    id: 'p6',
    initial: 'K',
    username: 'KRYPT0N',
    timezone: '-',
    game: 'Valorant',
    rank: 'Immortal 1',
    status: 'LFG',
    description: 'Immo 3 duelist grinding to Radiant. Need IGL and controller. I entry, you strat.',
    roles: ['Duelist', 'Flex'],
    repScore: 9.4,
    winRate: '54%',
    accentColor: 'red',
    micAvailable: true,
  },
];

export const squadService = {
  /**
   * Fetch active players in LFG queue
   */
  async getActivePlayers(filters?: SquadFilterDto): Promise<PlayerProfile[]> {
    try {
      const response = await apiClient.get<PlayerProfile[]>('/squads/players', { params: filters });
      return response.data;
    } catch {
      // Graceful fallback to mock data when BE endpoint is not yet mounted
      if (!filters?.game || filters.game === 'ALL') {
        return MOCK_PLAYERS;
      }
      return MOCK_PLAYERS.filter(p =>
        p.game.toLowerCase().includes(filters.game!.toLowerCase())
      );
    }
  },

  /**
   * Request matchmaking lobby / find squad
   */
  async findSquad(dto: MatchmakingRequestDto): Promise<MatchmakingResult> {
    const response = await apiClient.post<MatchmakingResult>('/squads/matchmake', dto);
    return response.data;
  },

  /**
   * Invite a player to a lobby
   */
  async invitePlayer(playerId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/squads/invite/${playerId}`);
    return response.data;
  },
};
