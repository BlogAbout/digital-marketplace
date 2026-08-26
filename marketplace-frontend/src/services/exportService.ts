import api from './api';

export const exportService = {
  async exportProducts(): Promise<Blob> {
    const response = await api.get('/export/products', {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportOrders(): Promise<Blob> {
    const response = await api.get('/export/orders', {
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
