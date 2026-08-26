import api from './api';
import type { Notification, PaginatedResponse } from '../types';

export const notificationService = {
  async getNotifications(params?: {
    page?: number;
    unread_only?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.unread_count;
  },

  async markAsRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },
};
