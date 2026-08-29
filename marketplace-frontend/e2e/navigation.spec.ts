import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to products', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const productsLink = page.locator('a[href="/products"]').first();
    await productsLink.click();

    await expect(page).toHaveURL(/\/products/);
  });

  test('should navigate to blog', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const blogLink = page.locator('a[href="/blog"]').first();
    await blogLink.click();

    await expect(page).toHaveURL(/\/blog/);
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();
  });
});
