import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError } from '@/types';

/**
 * Centralized API Client
 * Follows the Light Clean Architecture requirement:
 * All feature services must route through this client.
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach authentication token if available
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gametrust_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors and handle global auth states
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    const customError: ApiError = {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors,
    };

    if (customError.statusCode === 401 && typeof window !== 'undefined') {
      // Clear token on Unauthorized response
      localStorage.removeItem('gametrust_token');
    }

    return Promise.reject(customError);
  }
);
