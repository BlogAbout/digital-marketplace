import api from './api';
import type { SellerStatistics } from '../types';

export const statisticsService = {
  async getSellerStatistics(): Promise<SellerStatistics> {
    const response = await api.get('/statistics/seller');
    return response.data;
  },

  async getProductStatistics(productId: string): Promise<any> {
    const response = await api.get(`/statistics/product/${productId}`);
    return response.data;
  },
};
