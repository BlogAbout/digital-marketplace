import api from './api';
import type { PaginatedResponse } from '../types';

export interface Dispute {
  id: string;
  order_id: string;
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed' | 'rejected';
  resolution?: string;
  resolution_note?: string;
  refund_amount?: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  order?: any;
  messages?: DisputeMessage[];
}

export interface DisputeMessage {
  id: string;
  dispute_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: any;
}

export const disputeService = {
  async getDisputes(params?: {
    page?: number;
    status?: string;
  }): Promise<PaginatedResponse<Dispute>> {
    const response = await api.get('/disputes', { params });
    return response.data;
  },

  async getDispute(id: string): Promise<Dispute> {
    const response = await api.get(`/disputes/${id}`);
    return response.data.data;
  },

  async createDispute(data: {
    order_id: string;
    reason: string;
    description: string;
  }): Promise<Dispute> {
    const response = await api.post('/disputes', data);
    return response.data.dispute;
  },

  async addMessage(disputeId: string, message: string): Promise<DisputeMessage> {
    const response = await api.post(`/disputes/${disputeId}/messages`, { message });
    return response.data.data;
  },
};
