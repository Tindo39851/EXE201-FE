/**
 * Global and Cross-Cutting TypeScript definitions
 * Feature-specific types should reside in src/features/<feature>/types/
 */

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'MEMBER' | 'ADMIN';
  reputationScore: number;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

export type AuthPayload = AuthUser | { user: AuthUser };

export type AccentColor =
  | 'cyan'
  | 'magenta'
  | 'green'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'blue';

export type GameTitle =
  | 'League of Legends'
  | 'Valorant'
  | 'Liên Quân'
  | 'Free Fire';

