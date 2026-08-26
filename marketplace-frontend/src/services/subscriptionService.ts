import api from './api';
import type { Subscription, PaginatedResponse } from '../types';

export const subscriptionService = {
  async getFollowers(userId: string, page = 1): Promise<PaginatedResponse<Subscription>> {
    const response = await api.get(`/user/${userId}/followers`, {
      params: { page, per_page: 20 },
    });
    return response.data;
  },

  async getFollowing(userId: string, page = 1): Promise<PaginatedResponse<Subscription>> {
    const response = await api.get(`/user/${userId}/following`, {
      params: { page, per_page: 20 },
    });
    return response.data;
  },

  async subscribe(userId: string): Promise<Subscription> {
    const response = await api.post(`/user/${userId}/subscribe`);
    return response.data.subscription;
  },

  async unsubscribe(userId: string): Promise<void> {
    await api.delete(`/user/${userId}/unsubscribe`);
  },

  async checkSubscription(userId: string): Promise<boolean> {
    const response = await api.get(`/user/${userId}/check-subscription`);
    return response.data.is_subscribed;
  },
};
