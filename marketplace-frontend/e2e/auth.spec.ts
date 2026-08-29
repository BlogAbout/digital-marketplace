import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Используем более надежные селекторы
    const loginButton = page.locator('a[href="/login"]').first();
    await loginButton.click();

    await expect(page).toHaveURL(/\/login/);
  });

  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Проверяем наличие формы
    await expect(page.locator('h1, h4, h5').first()).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const registerLink = page.locator('a[href="/register"]').first();
    await registerLink.click();

    await expect(page).toHaveURL(/\/register/);
  });
});
