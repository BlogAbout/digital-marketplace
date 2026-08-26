import { create } from 'zustand';
import axios from 'axios';
import { securityService } from '../services/securityService';

interface AuthState {
  user: any;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  checkTokenExpiration: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      securityService.setSecureToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ token, user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: any) => {
    set({ isLoading: true });
    try {
      const response = await axios.post('/api/auth/register', data);
      const { token, user } = response.data;
      securityService.setSecureToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ token, user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
    } finally {
      securityService.clearAllData();
      delete axios.defaults.headers.common['Authorization'];
      set({ user: null, token: null });
    }
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token || securityService.isTokenExpired(token)) {
      get().logout();
      return;
    }

    try {
      const response = await axios.get('/api/auth/me');
      set({ user: response.data });
    } catch (error) {
      get().logout();
    }
  },

  checkTokenExpiration: () => {
    const token = get().token;
    return token ? !securityService.isTokenExpired(token) : false;
  },
}));
