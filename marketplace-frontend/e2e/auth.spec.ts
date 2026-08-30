import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Ищем ссылку на вход
    const loginLink = page.locator('a[href="/login"]').first();
    await loginLink.waitFor({ state: 'visible', timeout: 10000 });
    await loginLink.click();

    await expect(page).toHaveURL(/\/login/);
  });

  test('should login with test user', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Заполняем форму
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Нажимаем кнопку входа
    await page.click('button[type="submit"]');

    // Ждем перехода на главную
    await page.waitForTimeout(2000);

    // Проверяем, что мы вошли
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBeTruthy();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const registerLink = page.locator('a[href="/register"]').first();
    await registerLink.click();

    await expect(page).toHaveURL(/\/register/);
  });
});
