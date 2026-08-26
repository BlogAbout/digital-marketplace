import api from './api';
import type { BlogPost, Blog, PaginatedResponse } from '../types';

export const blogService = {
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    blog_id?: string;
  }): Promise<PaginatedResponse<BlogPost>> {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  async getPost(id: string): Promise<BlogPost> {
    const response = await api.get(`/posts/${id}`);
    return response.data.data;
  },

  async getBlogs(): Promise<Blog[]> {
    const response = await api.get('/blog');
    return response.data.data;
  },

  async getBlog(id: string): Promise<Blog> {
    const response = await api.get(`/blog/${id}`);
    return response.data.data;
  },

  async createPost(data: any): Promise<BlogPost> {
    const response = await api.post('/posts', data);
    return response.data.post;
  },

  async updatePost(id: string, data: any): Promise<BlogPost> {
    const response = await api.put(`/posts/${id}`, data);
    return response.data.post;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};
