import api from './api';
import type { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(data: any): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put(`/user/${data.id}`, data);
    return response.data;
  },
};
