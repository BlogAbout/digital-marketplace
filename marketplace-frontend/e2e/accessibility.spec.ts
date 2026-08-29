import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage should have minimal accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['landmark-one-main', 'page-has-heading-one'])
      .analyze();

    // Проверяем только критические ошибки
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('products page should have minimal accessibility violations', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['landmark-one-main', 'page-has-heading-one'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical'
    );

    expect(criticalViolations).toEqual([]);
  });
});
