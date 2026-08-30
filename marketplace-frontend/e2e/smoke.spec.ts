import { test, expect } from '@playwright/test';

test('app should load', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  // Проверить, что root элемент существует
  await expect(page.locator('#root')).toBeVisible();

  // Сделать скриншот для отладки
  await page.screenshot({ path: 'debug-homepage.png' });

  // Вывести содержимое body для отладки
  const bodyContent = await page.locator('body').innerHTML();
  console.log('Body content length:', bodyContent.length);
  console.log('Body content preview:', bodyContent.substring(0, 500));
});
