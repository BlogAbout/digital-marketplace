import { z } from 'zod';

export const validationService = {
  emailSchema: z.string().email('Неверный формат email'),

  passwordSchema: z.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/[a-z]/, 'Пароль должен содержать строчные буквы')
    .regex(/[A-Z]/, 'Пароль должен содержать заглавные буквы')
    .regex(/[0-9]/, 'Пароль должен содержать цифры'),

  phoneSchema: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'Неверный формат телефона'),

  urlSchema: z.string()
    .url('Неверный формат URL'),

  validateEmail(email: string): boolean {
    return this.emailSchema.safeParse(email).success;
  },

  validatePassword(password: string): boolean {
    return this.passwordSchema.safeParse(password).success;
  },

  validatePhone(phone: string): boolean {
    return this.phoneSchema.safeParse(phone).success;
  },

  validateUrl(url: string): boolean {
    return this.urlSchema.safeParse(url).success;
  },
};
