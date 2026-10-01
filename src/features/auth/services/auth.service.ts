import { apiClient, tokenStorage } from '@/services/api-client';
import type { AuthSession, AuthUser, LoginDto, RegisterDto } from '../types/auth.types';

export const authService = {
  async login(dto: LoginDto): Promise<AuthSession> {
    const response = await apiClient.post<AuthSession>('/auth/login', dto);
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  },

  async register(dto: RegisterDto): Promise<AuthSession> {
    const response = await apiClient.post<AuthSession>('/auth/register', dto);
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  },

  async me(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      await apiClient.post('/auth/logout', refreshToken ? { refreshToken } : undefined);
    } finally {
      tokenStorage.clear();
    }
  },
};
