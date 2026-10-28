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
    const response = await apiClient.get<AdminUser[]>('/admin/users');
    return response.data || [];
  },

  async toggleUserStatus(userId: string): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  async getTournaments(): Promise<AdminTournament[]> {
    const response = await apiClient.get<AdminTournament[]>('/admin/tournaments');
    return response.data || [];
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
    const response = await apiClient.get<AdminReport[]>('/admin/reports');
    return response.data || [];
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
    const response = await apiClient.get<AdminClan[]>('/admin/clans');
    return response.data || [];
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
