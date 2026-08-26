import api from './api';

export interface DeveloperApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rate_limit: number;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export const apiKeyService = {
  async getKeys(): Promise<DeveloperApiKey[]> {
    const response = await api.get('/api-keys');
    return response.data;
  },

  async createKey(data: {
    name: string;
    permissions?: string[];
    rate_limit?: number;
    expires_at?: string;
  }): Promise<DeveloperApiKey> {
    const response = await api.post('/api-keys', data);
    return response.data;
  },

  async deleteKey(id: string): Promise<void> {
    await api.delete(`/api-keys/${id}`);
  },
};
