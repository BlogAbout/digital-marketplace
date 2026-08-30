// Базовые типы
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Пользователь
export interface User extends BaseModel {
  name: string;
  email: string | null;
  phone: string | null;
  slogan: string | null;
  description: string | null;
  settings: UserSettings;
  balance: number;
  avatar_id: string | null;
  role: 'user' | 'moderator' | 'admin';
  is_block: boolean;
  last_active: string | null;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  timezone: string;
  locale: 'ru' | 'en';
  currency?: string;
}

// Товар
export interface Product extends BaseModel {
  name: string;
  slug: string;
  description: string;
  currency: string;
  is_free: boolean;
  cost: number;
  cost_old: number | null;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
  views_count: number;
  sales_count: number;
  is_link_domain: boolean;
  is_infinity_download: boolean;
  file_days_expired: number;
  category?: Category;
  author?: User;
  images?: ProductImage[];
}

export interface ProductImage extends BaseModel {
  type: string;
  sort_order: number;
  is_main: boolean;
  url: string | null;
}

// Категория
export interface Category extends BaseModel {
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  children?: Category[];
  products_count?: number;
}

// Блог
export interface Blog extends BaseModel {
  name: string;
  slug: string;
  description: string | null;
  posts_count: number;
  views_count: number;
  user?: User;
}

export interface BlogPost extends BaseModel {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  views_count: number;
  likes_count: number;
  blog?: Blog;
  author?: User;
}

// Заказ
export interface Order extends BaseModel {
  currency: string;
  is_free: boolean;
  cost: number;
  tax: number;
  discount: number;
  sum: number;
  total: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
  file_link: string | null;
  file_expired: string | null;
  domain: string | null;
  product?: Product;
  buyer?: User;
  seller?: User;
}

// Чат и сообщения
export interface Chat extends BaseModel {
  type: 'private' | 'group' | 'company' | 'support';
  name: string | null;
  participants?: User[];
  last_message?: Message;
}

export interface Message extends BaseModel {
  chat_id: string;
  user_id: string;
  text: string | null;
  media: any[] | null;
  is_pinned: boolean;
  is_edited: boolean;
  user?: User;
  reply_to?: Message;
}

// Уведомления
export interface Notification extends BaseModel {
  type: 'email' | 'toast' | 'push';
  title: string;
  message: string;
  data: any;
  read_at: string | null;
}

// Подписка
export interface Subscription extends BaseModel {
  subscriber_id: string;
  user_id: string;
  is_active: boolean;
  subscriber?: User;
  user?: User;
}

// API Response
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// Статистика
export interface SellerStatistics {
  total_revenue: number;
  total_sales: number;
  total_views: number;
  conversion_rate: number;
  average_check: number;
  daily_statistics: DailyStatistic[];
  top_products: Product[];
}

export interface DailyStatistic {
  date: string;
  revenue: number;
  sales: number;
}

export interface ProductComment {
  id: string;
  product_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  rating: number | null;
  likes_count: number;
  is_approved: boolean;
  user?: User;
  replies?: ProductComment[];
  created_at: string;
}
