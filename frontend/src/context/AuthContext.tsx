'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch {
      // User is not authenticated or token expired
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token) {
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setLoading(false);
          // Async update user in background
          refreshUser().finally(() => setLoading(false));
          return;
        } else {
          await refreshUser();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Handle routing based on Auth State
  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem('token');
    const isLoginPage = pathname === '/login';

    if (!token && !isLoginPage) {
      router.push('/login');
    } else if (token && isLoginPage) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
      setUser(data.user);
      router.push('/dashboard');
    } catch (err) {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      setLoading(false);
      router.push('/login');
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
