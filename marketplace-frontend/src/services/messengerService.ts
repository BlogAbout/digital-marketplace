import api from './api';
import type { Chat, Message, PaginatedResponse } from '../types';

export const messengerService = {
  async getChats(): Promise<Chat[]> {
    const response = await api.get('/chats');
    return response.data.data;
  },

  async getChat(id: string): Promise<Chat> {
    const response = await api.get(`/chats/${id}`);
    return response.data.data;
  },

  async createPrivateChat(userId: string): Promise<Chat> {
    const response = await api.post('/chats/private', { user_id: userId });
    return response.data.chat;
  },

  async createGroupChat(name: string, participants: string[]): Promise<Chat> {
    const response = await api.post('/chats/group', { name, participants });
    return response.data.chat;
  },

  async getMessages(chatId: string, page = 1): Promise<PaginatedResponse<Message>> {
    const response = await api.get(`/chats/${chatId}/messages`, {
      params: { page, per_page: 50 },
    });
    return response.data;
  },

  async sendMessage(chatId: string, data: { text?: string; files?: File[] }): Promise<Message> {
    const formData = new FormData();

    if (data.text) {
      formData.append('text', data.text);
    }

    if (data.files) {
      data.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    }

    const response = await api.post(`/chats/${chatId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async editMessage(messageId: string, text: string): Promise<Message> {
    const response = await api.put(`/messages/${messageId}`, { text });
    return response.data.data;
  },

  async forwardMessage(messageId: string, chatId: string): Promise<Message> {
    const response = await api.post(`/messages/${messageId}/forward`, { chat_id: chatId });
    return response.data.data;
  },

  async markAsRead(messageId: string): Promise<void> {
    await api.post(`/messages/${messageId}/read`);
  },
};
