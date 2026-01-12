import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../shared/api/adminTypes';
import { api } from '../services/api';

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('gl_admin_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.getMe();
        setUser(me);
      } catch (e) {
        // Token invalid or expired
        console.error('Auth check failed', e);
        localStorage.removeItem('gl_admin_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { accessToken } = await api.adminLogin({ email, password });
    localStorage.setItem('gl_admin_token', accessToken);
    const me = await api.getMe();
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem('gl_admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
