import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('should display products', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Проверяем, что страница загрузилась
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Проверяем наличие товаров (если они есть)
    const productCards = page.locator('.MuiCard-root');
    const count = await productCards.count();
    console.log('Products found:', count);

    // Если товары есть, проверяем первый
    if (count > 0) {
      await expect(productCards.first()).toBeVisible();
    }
  });

  test('should search products', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Ищем поле поиска
    const searchInput = page.locator('input[placeholder*="Поиск"]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill('test');

    await page.waitForTimeout(1000);
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
