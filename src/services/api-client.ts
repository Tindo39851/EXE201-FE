import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type { ApiError } from '@/types';

/**
 * Centralized API Client
 * - withCredentials: true  → trình duyệt tự gửi/nhận HttpOnly cookies
 * - Response interceptor   → tự unwrap envelope { success, message, data: T }
 *                            nên tất cả services nhận thẳng T qua response.data
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
// Cookie được gửi tự động nhờ withCredentials, không cần đọc localStorage nữa.
apiClient.interceptors.request.use(
  (config) => config,
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
  (error: AxiosError<ApiError>) => {
    const customError: ApiError = {
      statusCode: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      errors: error.response?.data?.errors,
    };

    if (customError.statusCode === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject(customError);
  }
);
