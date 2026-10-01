import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiResponse } from '@/types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const ACCESS_TOKEN_KEY = 'gametrust_token';
const REFRESH_TOKEN_KEY = 'gametrust_refresh_token';

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

interface RefreshPayload {
  accessToken: string;
  refreshToken: string;
}

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

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post<ApiResponse<RefreshPayload>>(
    `${baseURL}/auth/refresh-token`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  );
  const tokens = response.data.data;
  tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
  return tokens.accessToken;
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
      response.data = payload.data;
    }
    return response;
  },
  async (error: AxiosError<Record<string, unknown>>) => {
    const config = error.config as RetryableConfig | undefined;
    const isAuthRequest = config?.url?.includes('/auth/login') ||
      config?.url?.includes('/auth/register') || config?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && config && !config._retry && !isAuthRequest && tokenStorage.getRefreshToken()) {
      config._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null; });
        const accessToken = await refreshPromise;
        config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(config);
      } catch {
        tokenStorage.clear();
      }
    }

    const body = error.response?.data;
    const customError: ApiError = {
      statusCode: error.response?.status || 500,
      message: typeof body?.message === 'string' ? body.message : error.message || 'An unexpected error occurred',
      errors: body?.validationErrors as Record<string, string[]> | undefined,
    };
    if (customError.statusCode === 401) tokenStorage.clear();
    return Promise.reject(customError);
  },
);
