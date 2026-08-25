import api from './api';
import type { Product, PaginatedResponse, Category } from '../types';

export const productService = {
  async getProducts(params?: {
    page?: number;
    per_page?: number;
    category_id?: string;
    search?: string;
  }): Promise<PaginatedResponse<Product>> {
    const response = await api.get('/shop/products', { params });
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/shop/products/${id}`);
    return response.data.data;
  },

  async createProduct(data: FormData): Promise<Product> {
    const response = await api.post('/shop/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.product;
  },

  async updateProduct(id: string, data: FormData): Promise<Product> {
    const response = await api.put(`/shop/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.product;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/shop/products/${id}`);
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/shop/categories');
    return response.data.data;
  },
};
