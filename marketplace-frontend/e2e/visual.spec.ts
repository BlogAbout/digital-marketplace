import { test, expect } from '@playwright/test';

test.describe('Visual Tests', () => {
  test('homepage should look correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('products page should look correct', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveScreenshot('products.png');
  });

  test('login page should look correct', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login.png');
  });
});
