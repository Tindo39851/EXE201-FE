export type UserRole = 'MEMBER' | 'MODERATOR' | 'ADMIN';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  reputationScore: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
}

export interface LoginDto {
  emailOrUsername: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}
