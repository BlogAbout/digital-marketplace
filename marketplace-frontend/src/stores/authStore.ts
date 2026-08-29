import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  balance?: number;
  settings?: any;
}

interface AuthState {
  user: User | null;
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
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });
      const { token, user } = response.data;

      // Сохраняем токен
      localStorage.setItem('token', token);
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
      const response = await axios.post('http://localhost:8080/api/auth/register', data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ token, user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = get().token;
      if (token) {
        await axios.post('http://localhost:8080/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ user: null, token: null });
      window.location.href = '/login';
    }
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:8080/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data });
    } catch (error) {
      console.error('Fetch user error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      }
    }
  },

  checkTokenExpiration: () => {
    const token = get().token;
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
}));
