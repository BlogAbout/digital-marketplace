import api from './api';
import type { ProductComment } from '../types';

export const commentService = {
  async getComments(productId: string): Promise<ProductComment[]> {
    const response = await api.get(`/shop/products/${productId}/comments`);
    return response.data.data;
  },

  async addComment(productId: string, data: {
    content: string;
    parent_id?: string;
    rating?: number;
  }): Promise<ProductComment> {
    const response = await api.post(`/shop/products/${productId}/comments`, data);
    return response.data.comment;
  },

  async likeComment(commentId: string): Promise<void> {
    await api.post(`/comments/${commentId}/like`);
  },

  async unlikeComment(commentId: string): Promise<void> {
    await api.post(`/comments/${commentId}/unlike`);
  },
};
