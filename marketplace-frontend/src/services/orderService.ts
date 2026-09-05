import api from './api';
import type { Order } from '../types';

export const orderService = {
  async createOrder(data: {
    product_id: string;
    domain?: string;
    promo_code?: string;
  }): Promise<Order> {
    const response = await api.post('/shop/orders', data);
    return response.data.order;
  },

  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/shop/orders/my?type=buyer');
    return response.data.data;
  },

  async getMySales(): Promise<Order[]> {
    const response = await api.get('/shop/orders/my?type=seller');
    return response.data.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await api.get(`/shop/orders/${id}`);
    return response.data.data;
  },

  async payOrder(id: string): Promise<Order> {
    const response = await api.post(`/shop/orders/${id}/pay`);
    return response.data.order;
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.post(`/shop/orders/${id}/cancel`);
    return response.data.order;
  },

  async getDownloadLink(id: string): Promise<{ download_link: string; file_expired: string | null }> {
    const response = await api.get(`/shop/orders/${id}/download`);
    return response.data;
  },
};
