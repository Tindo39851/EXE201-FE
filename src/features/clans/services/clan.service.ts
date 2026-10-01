import { apiClient } from '@/services/api-client';
import type { Clan, ClanFilterDto } from '../types/clan.types';

const MOCK_CLANS: Clan[] = [
  { id: 1, name: 'PHANTOM SYNDICATE', tag: 'PSY', members: 847, rating: '9.842', tier: 'ELITE', color: 'cyan', wins: 412, founded: '2019', region: 'Global', desc: 'Oldest and most decorated clan on GameTrust. Elite traders and tournament champions across all major titles.', games: ['Valorant', 'CS2', 'LoL'], req: 'Trust Score 9.5+' },
  { id: 2, name: 'NEON WOLVES', tag: 'NW', members: 634, rating: '9.711', tier: 'ELITE', color: 'green', wins: 388, founded: '2020', region: 'NA/EU', desc: 'Fierce competitors with a focus on tactical shooters and tournament dominance.', games: ['Valorant', 'Apex Legends'], req: 'Trust Score 9.0+' },
  { id: 3, name: 'DARK VECTOR', tag: 'DV', members: 512, rating: '9.582', tier: 'ALPHA', color: 'purple', wins: 312, founded: '2021', region: 'EU', desc: 'High-tier competitive squadron specializing in MOBA strategy and scrim execution.', games: ['LoL', 'Dota 2'], req: 'Trust Score 8.5+' },
  { id: 4, name: 'GRID REAPERS', tag: 'GR', members: 423, rating: '9.402', tier: 'ALPHA', color: 'orange', wins: 295, founded: '2021', region: 'AS', desc: 'Aggressive playstyle and high-tempo strategies in tactical FPS.', games: ['CS2', 'Overwatch 2'], req: 'Trust Score 8.5+' },
  { id: 5, name: 'CYBER UNIT 7', tag: 'CU7', members: 308, rating: '9.261', tier: 'BETA', color: 'blue', wins: 184, founded: '2022', region: 'SEA', desc: 'Dedicated to cultivating upcoming talent in the tier-2 esports scene.', games: ['Valorant', 'Rocket League'], req: 'Trust Score 8.0+' },
  { id: 6, name: 'VOID PROTOCOL', tag: 'VP', members: 381, rating: '9.134', tier: 'BETA', color: 'magenta', wins: 196, founded: '2020', region: 'NA', desc: 'Masters of the void. Semi-competitive squad for high-ranked grinds.', games: ['Apex Legends', 'Fortnite'], req: 'Trust Score 7.5+' },
  { id: 7, name: 'NEON SERPENTS', tag: 'NS', members: 278, rating: '8.940', tier: 'BETA', color: 'green', wins: 145, founded: '2023', region: 'EU', desc: 'New contenders rising through the leaderboard quickly.', games: ['Valorant'], req: 'Trust Score 7.0+' },
  { id: 8, name: 'IRON CIRCUIT', tag: 'IC', members: 244, rating: '8.812', tier: 'GAMMA', color: 'gray', wins: 98, founded: '2023', region: 'Global', desc: 'Open guild welcoming casual and competitive players building rank.', games: ['CS2', 'LoL'], req: 'None' },
];

export const clanService = {
  async getClans(filter?: ClanFilterDto): Promise<Clan[]> {
    try {
      const response = await apiClient.get<Clan[]>('/clans', { params: filter });
      return response.data;
    } catch {
      return MOCK_CLANS.filter(clan => {
        if (filter?.tier && filter.tier !== 'ALL' && clan.tier !== filter.tier) return false;
        if (filter?.region && filter.region !== 'ALL' && clan.region !== filter.region) return false;
        return true;
      });
    }
  },

  async getClanById(id: number): Promise<Clan> {
    try {
      const response = await apiClient.get<Clan>(`/clans/${id}`);
      return response.data;
    } catch {
      return MOCK_CLANS.find(c => c.id === id) || MOCK_CLANS[0];
    }
  },

  async requestJoinClan(clanId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/clans/${clanId}/join-request`);
      return response.data;
    } catch {
      return { success: true, message: 'Membership application submitted successfully' };
    }
  },
};
