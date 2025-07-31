'use client';

import { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth.types';

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isLoading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};