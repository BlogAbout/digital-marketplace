import api from './api';

export const notificationService = {
  async getNotifications(params?: {
    page?: number;
    unread_only?: boolean;
  }) {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  async getUnreadCount() {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return 0;

      const response = await api.get('/notifications/unread-count');
      return response.data.unread_count;
    } catch (error) {
      console.error('Error loading unread count:', error);
      return 0;
    }
  },

  async markAsRead(id: string) {
    await api.post(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    await api.post('/notifications/read-all');
  },
};
