import { apiClient } from '@/services/api-client';
import type { AuthUser } from '@/types';

export interface AdminUser extends AuthUser {
  active?: boolean;
  createdAt?: string;
}

export interface AdminTournament {
  id: string;
  title: string;
  game: string;
  format: string;
  prizePool: string;
  maxTeams: number;
  registeredTeams?: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  bannerUrl?: string;
}

export interface AdminReport {
  id: string;
  type: string;
  user: string;
  reason?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  reporter?: string;
  badgeColor?: string;
  resolution?: string;
  createdAt?: string;
}

export interface AdminClan {
  id: string | number;
  name: string;
  tag: string;
  leader?: string;
  membersCount?: number;
  tier?: string;
  rating?: number;
  region?: string;
}

export const adminService = {
  async getUsers(): Promise<AdminUser[]> {
    try {
      const response = await apiClient.get<AdminUser[]>('/admin/users');
      return response.data || [];
    } catch {
      return [
        {
          id: 'admin_1',
          username: 'admin',
          email: 'admin@gametrust.gg',
          role: 'ADMIN',
          reputationScore: 100,
          active: true,
        },
        {
          id: 'member_1',
          username: 'demo',
          email: 'demo@gametrust.gg',
          role: 'MEMBER',
          reputationScore: 95,
          active: true,
        },
      ];
    }
  },

  async toggleUserStatus(userId: string): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  async getTournaments(): Promise<AdminTournament[]> {
    try {
      const response = await apiClient.get<AdminTournament[]>('/admin/tournaments');
      return response.data || [];
    } catch {
      return [
        {
          id: 'tourn_val_01',
          title: 'Cyberpunk Champions Cup 2026',
          game: 'VALORANT',
          format: '5v5 Single Elimination',
          prizePool: '$10,000 USD',
          maxTeams: 16,
          registeredTeams: 12,
          status: 'UPCOMING',
          startDate: '2026-11-15',
        },
        {
          id: 'tourn_cs2_02',
          title: 'Neon Major Championship',
          game: 'CS2',
          format: '5v5 Double Elimination',
          prizePool: '$25,000 USD',
          maxTeams: 32,
          registeredTeams: 28,
          status: 'ONGOING',
          startDate: '2026-10-01',
        },
      ];
    }
  },

  async createTournament(data: Partial<AdminTournament>): Promise<AdminTournament> {
    const response = await apiClient.post<AdminTournament>('/admin/tournaments', data);
    return response.data;
  },

  async updateTournamentStatus(id: string, status: string): Promise<AdminTournament> {
    const response = await apiClient.patch<AdminTournament>(`/admin/tournaments/${id}/status`, { status });
    return response.data;
  },

  async deleteTournament(id: string): Promise<void> {
    await apiClient.delete(`/admin/tournaments/${id}`);
  },

  async getReports(): Promise<AdminReport[]> {
    try {
      const response = await apiClient.get<AdminReport[]>('/admin/reports');
      return response.data || [];
    } catch {
      return [
        {
          id: '#RPT_1024',
          type: 'TOXICITY',
          user: 'TOXIC_WARRIOR',
          reason: 'Verbal harassment and abusive language in lobby voice chat',
          status: 'PENDING',
          reporter: 'CyberSoldier',
          badgeColor: 'red',
        },
        {
          id: '#RPT_1025',
          type: 'CHEATING',
          user: 'AIM_BOTTER_99',
          reason: 'Third party aim-assist and wallhack detection in tournament qualifiers',
          status: 'PENDING',
          reporter: 'PhantomReaper',
          badgeColor: 'red',
        },
        {
          id: '#RPT_1026',
          type: 'AFK',
          user: 'GHOST_LEAVER',
          reason: 'Abandoned competitive ranked match at round 3 without reconnecting',
          status: 'PENDING',
          reporter: 'NeonBlade',
          badgeColor: 'yellow',
        },
      ];
    }
  },

  async resolveReport(id: string, action: 'PENALTY' | 'BAN'): Promise<AdminReport> {
    const response = await apiClient.patch<AdminReport>(`/admin/reports/${id}/resolve`, { action });
    return response.data;
  },

  async dismissReport(id: string): Promise<AdminReport> {
    const response = await apiClient.patch<AdminReport>(`/admin/reports/${id}/dismiss`);
    return response.data;
  },

  async getClans(): Promise<AdminClan[]> {
    try {
      const response = await apiClient.get<AdminClan[]>('/admin/clans');
      return response.data || [];
    } catch {
      return [
        {
          id: 1,
          name: 'Cyber Samurai',
          tag: 'CSAM',
          leader: 'RONIN_X',
          membersCount: 48,
          tier: 'ELITE',
          rating: 2840,
          region: 'APAC',
        },
        {
          id: 2,
          name: 'Neon Phantoms',
          tag: 'NPH',
          leader: 'SHADOW_WALKER',
          membersCount: 35,
          tier: 'PRO',
          rating: 2650,
          region: 'NA-EAST',
        },
        {
          id: 3,
          name: 'Apex Syndicate',
          tag: 'APEX',
          leader: 'SYNDICATE_BOSS',
          membersCount: 22,
          tier: 'CHALLENGER',
          rating: 2490,
          region: 'EU-CENTRAL',
        },
      ];
    }
  },

  async deleteClan(id: string | number): Promise<void> {
    await apiClient.delete(`/admin/clans/${id}`);
  },

  async updateUserReputation(userId: string, score: number): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/reputation`, { score });
    return response.data;
  },

  async updateUserRole(userId: string, role: string): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
};
