import { test, expect } from '@playwright/test';

test.describe('Messenger', () => {
  test.beforeEach(async ({ page }) => {
    // Войти в систему
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should navigate to messenger', async ({ page }) => {
    await page.click('text=Мессенджер');
    await expect(page).toHaveURL(/\/messenger/);
    await expect(page.locator('h6:has-text("Сообщения")')).toBeVisible();
  });

  test('should show empty state when no chats', async ({ page }) => {
    await page.goto('/messenger');
    await expect(page.locator('text=Выберите чат')).toBeVisible();
  });
});
