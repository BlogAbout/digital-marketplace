import api from './api';
import type { PaginatedResponse } from '../types';

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
  messages?: SupportTicketMessage[];
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal: boolean;
  created_at: string;
  user?: any;
}

export const supportService = {
  async getTickets(params?: {
    page?: number;
    status?: string;
  }): Promise<PaginatedResponse<SupportTicket>> {
    const response = await api.get('/support/tickets', { params });
    return response.data;
  },

  async getTicket(id: string): Promise<SupportTicket> {
    const response = await api.get(`/support/tickets/${id}`);
    return response.data.data;
  },

  async createTicket(data: {
    subject: string;
    description: string;
    priority?: string;
    category?: string;
  }): Promise<SupportTicket> {
    const response = await api.post('/support/tickets', data);
    return response.data.ticket;
  },

  async addMessage(ticketId: string, message: string): Promise<SupportTicketMessage> {
    const response = await api.post(`/support/tickets/${ticketId}/messages`, { message });
    return response.data.data;
  },
};
