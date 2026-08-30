import { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Ждем сохранения токена
  await page.waitForFunction(() => localStorage.getItem('token') !== null);

  // Ждем перехода
  await page.waitForTimeout(1000);
}

export async function logout(page: Page) {
  await page.evaluate(() => localStorage.removeItem('token'));
  await page.goto('/login');
}
