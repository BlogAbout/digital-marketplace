import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('should display products list', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h4:has-text("Каталог товаров")')).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    await page.goto('/products');
    await page.fill('input[placeholder="Поиск товаров..."]', 'test');
    await page.waitForTimeout(500);
    await expect(page.locator('.product-card')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('/products');
    await page.click('div[role="button"]:has-text("Категория")');
    await page.click('li:has-text("Все категории")');
    await page.waitForTimeout(500);
  });

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/products');
    const firstProduct = page.locator('.product-card').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await expect(page).toHaveURL(/\/products\//);
    }
  });
});
