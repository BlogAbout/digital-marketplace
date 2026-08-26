import type {User} from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  phone: null,
  slogan: null,
  description: null,
  settings: {
    theme: 'light',
    timezone: 'UTC',
    locale: 'ru',
  },
  balance: 0,
  avatar_id: null,
  role: 'user',
  is_block: false,
  last_active: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
