'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStorage } from '@/services/api-client';
import { authService } from '../services/auth.service';
import type { AuthUser, LoginDto, RegisterDto } from '../types/auth.types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      if (!tokenStorage.getAccessToken()) {
        if (active) setIsLoading(false);
        return;
      }
      try {
        const currentUser = await authService.me();
        if (active) setUser(currentUser);
      } catch {
        tokenStorage.clear();
      } finally {
        if (active) setIsLoading(false);
      }
    }
    restoreSession();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const session = await authService.login(dto);
    setUser(session.user);
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    const session = await authService.register(dto);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isLoading, login, register, logout }), [user, isLoading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
