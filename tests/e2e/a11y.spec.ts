import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('home page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Check for critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical'
    );
    
    expect(criticalViolations).toHaveLength(0);
  });

  test('workout tracker has proper form labels and roles', async ({ page }) => {
    await page.goto('/');
    
    // Check checkbox inputs have accessible labels
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    
    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      // Each checkbox should have an accessible name (via label, aria-label, etc.)
      await expect(checkbox).toHaveAccessibleName();
    }
    
    // Check number inputs have labels
    const numberInputs = page.locator('input[type="number"]');
    const numberCount = await numberInputs.count();
    
    for (let i = 0; i < numberCount; i++) {
      const input = numberInputs.nth(i);
      await expect(input).toBeVisible();
      // Number inputs should be focusable
      await input.focus();
    }
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation buttons
    const navButtons = page.getByRole('button').filter({ 
      hasText: /allenamento|dieta|calendario|statistiche|impostazioni/i 
    });
    
    const buttonCount = await navButtons.count();
    
    // Each nav button should be focusable
    for (let i = 0; i < buttonCount; i++) {
      const button = navButtons.nth(i);
      await button.focus();
      await expect(button).toBeFocused();
      
      // Should be activatable with Enter
      if (i === 1) { // Test diet tab
        await button.press('Enter');
        await expect(page.getByText('Colazione')).toBeVisible();
      }
    }
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });

  test('diet tracker accessibility', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /dieta/i }).click();
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical'
    );
    
    expect(criticalViolations).toHaveLength(0);
    
    // Test meal checkboxes are properly labeled
    const mealCheckboxes = page.locator('input[type="checkbox"]');
    const mealCount = await mealCheckboxes.count();
    
    for (let i = 0; i < mealCount; i++) {
      await expect(mealCheckboxes.nth(i)).toHaveAccessibleName();
    }
  });

  test('calendar accessibility', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /calendario/i }).click();
    
    // Calendar navigation buttons should be accessible
    const prevButton = page.getByRole('button', { name: '←' });
    const nextButton = page.getByRole('button', { name: '→' });
    
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Calendar days should be focusable
    const calendarDays = page.locator('button').filter({ hasText: /^\d+$/ });
    const dayButton = calendarDays.first();
    
    await dayButton.focus();
    await expect(dayButton).toBeFocused();
  });

  test('timer controls are accessible', async ({ page }) => {
    await page.goto('/');
    
    const startButton = page.getByRole('button', { name: /avvia/i });
    const resetButton = page.getByRole('button', { name: /reset/i });
    
    // Timer buttons should have clear labels
    await expect(startButton).toHaveAccessibleName('Avvia');
    await expect(resetButton).toHaveAccessibleName('Reset');
    
    // Should be keyboard operable
    await startButton.focus();
    await startButton.press('Enter');
    
    const stopButton = page.getByRole('button', { name: /stop/i });
    await expect(stopButton).toBeVisible();
  });
});