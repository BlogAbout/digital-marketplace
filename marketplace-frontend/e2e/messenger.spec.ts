import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Messenger', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to messenger', async ({ page }) => {
    await page.goto('/messenger');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();
  });
});
