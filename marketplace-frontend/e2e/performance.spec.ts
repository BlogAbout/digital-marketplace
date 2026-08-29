import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000); // Менее 3 секунд
  });

  test('products page should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });
});
