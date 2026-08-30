import { test, expect } from '@playwright/test';

test.describe('Visual Tests', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('#root')).toBeVisible();
    await page.screenshot({ path: 'test-results/homepage.png' });
  });
});
