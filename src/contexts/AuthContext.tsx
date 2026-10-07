'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/services/api-client';
import type { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<AuthUser>;
  register: (username: string, email: string, password: string) => Promise<void>;
  sendRegistrationOtp: (username: string, email: string) => Promise<void>;
  verifyRegistrationOtp: (username: string, email: string, password: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (avatarUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({} as AuthUser),
  register: async () => {},
  sendRegistrationOtp: async () => {},
  verifyRegistrationOtp: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await apiClient.get<AuthUser>('/auth/me');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [fetchCurrentUser]);

  const login = async (emailOrUsername: string, password: string): Promise<AuthUser> => {
    const res = await apiClient.post<any>('/auth/login', { emailOrUsername, password });
    const userData: AuthUser = res.data?.user || res.data;
    setUser(userData);
    return userData;
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await apiClient.post<any>('/auth/register', { username, email, password });
    setUser(res.data?.user || res.data);
  };

  const sendRegistrationOtp = async (username: string, email: string) => {
    await apiClient.post('/auth/send-registration-otp', { username, email });
  };

  const verifyRegistrationOtp = async (username: string, email: string, password: string, otp: string) => {
    const res = await apiClient.post<any>('/auth/verify-registration-otp', { username, email, password, otp });
    setUser(res.data?.user || res.data);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (avatarUrl: string) => {
    const res = await apiClient.put<any>('/auth/profile', { avatarUrl });
    setUser(res.data?.user || res.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        sendRegistrationOtp,
        verifyRegistrationOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
