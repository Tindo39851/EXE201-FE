import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('statusCode' in error)) return undefined;
  const statusCode = (error as { statusCode?: unknown }).statusCode;
  return typeof statusCode === 'number' ? statusCode : undefined;
}

/**
 * Centralized API Client
 * - withCredentials: true  → trình duyệt tự gửi/nhận HttpOnly cookies
 * - Response interceptor   → tự unwrap envelope { success, message, data: T }
 *                            nên tất cả services nhận thẳng T qua response.data
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const ACCESS_TOKEN_KEY = 'gametrust_token';
const REFRESH_TOKEN_KEY = 'gametrust_refresh_token';

export const tokenStorage = {
  getAccessToken: () => typeof window === 'undefined' ? null : localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => typeof window === 'undefined' ? null : localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

type RetryableRequest = InternalAxiosRequestConfig & { _authRetry?: boolean };
type AuthTokenResponse = { accessToken: string; refreshToken: string };
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<{ data?: AuthTokenResponse }>(
      `${baseURL}/auth/refresh`,
      { refreshToken },
      { withCredentials: true, timeout: 15000 },
    );
    const tokens = response.data?.data;
    if (!tokens?.accessToken || !tokens.refreshToken) return null;
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    return null;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // gửi HttpOnly cookie kèm mỗi request
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
// 1. Unwrap BE envelope: { success, message, data: T } → trả về T
// 2. Khi 401, dispatch event để AuthContext bắt và clear user state
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const requestUrl = originalRequest?.url || '';
    const isAuthRequest = /\/auth\/(login|register|direct-register|verify-registration-otp|send-registration-otp|refresh|refresh-token|logout)/.test(requestUrl);

    if (error.response?.status === 401 && originalRequest && !isAuthRequest) {
      if (!originalRequest._authRetry) {
        originalRequest._authRetry = true;
        refreshInFlight ??= refreshAccessToken().finally(() => { refreshInFlight = null; });
        const newAccessToken = await refreshInFlight;
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      }
      tokenStorage.clear();
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const customError: ApiError = {
      statusCode: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      errors: error.response?.data?.errors,
    };

    return Promise.reject(customError);
  }
);
