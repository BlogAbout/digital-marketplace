import { test, expect } from '@playwright/test';

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Войти в систему
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should navigate to profile', async ({ page }) => {
    await page.click('text=Профиль');
    await expect(page).toHaveURL(/\/profile/);
  });

  test('should show user information', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should edit profile', async ({ page }) => {
    await page.goto('/profile');
    await page.click('button:has-text("Редактировать")');
    await page.fill('input[value="Test User"]', 'Updated User');
    await page.click('button:has-text("Сохранить")');
    await expect(page.locator('text=Updated User')).toBeVisible();
  });
});
