/**
 * Global and Cross-Cutting TypeScript definitions
 * Feature-specific types should reside in src/features/<feature>/types/
 */

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
  | 'CS2'
  | 'Apex Legends'
  | 'Liên Quân'
  | 'Free Fire'
  | 'Overwatch 2'
  | 'Fortnite'
  | 'Dota 2';
