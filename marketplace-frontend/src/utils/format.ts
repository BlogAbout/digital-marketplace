import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, 'dd.MM.yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, 'dd.MM.yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, {
    addSuffix: true,
    locale: ru,
  });
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('ru-RU').format(number);
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
