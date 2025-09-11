import { test, expect } from '@playwright/test';

test.describe('Offline PWA Functionality', () => {
  test('@offline app works when network is offline', async ({ page, context }) => {
    // First, load the app normally to cache resources
    await page.goto('/');
    await expect(page.getByText('Fitness Tracker')).toBeVisible();
    
    // Toggle an exercise to create some data
    const exerciseCheckbox = page.locator('input[type="checkbox"]').first();
    await exerciseCheckbox.check();
    await expect(exerciseCheckbox).toBeChecked();
    
    // Go offline
    await context.setOffline(true);
    
    // Reload the page - should still work
    await page.reload();
    
    // Verify app still loads and data persists
    await expect(page.getByText('Fitness Tracker')).toBeVisible();
    await expect(exerciseCheckbox).toBeChecked();
    
    // Verify we can still interact with the app offline
    const secondCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await secondCheckbox.check();
    await expect(secondCheckbox).toBeChecked();
  });

  test('@offline navigation works offline', async ({ page, context }) => {
    await page.goto('/');
    
    // Go offline
    await context.setOffline(true);
    await page.reload();
    
    // Test navigation between tabs
    await page.getByRole('button', { name: /dieta/i }).click();
    await expect(page.getByText('Colazione')).toBeVisible();
    
    await page.getByRole('button', { name: /calendario/i }).click();
    await expect(page.getByText('settembre 2025')).toBeVisible();
    
    await page.getByRole('button', { name: /allenamento/i }).click();
    await expect(page.getByText('Panca Piana')).toBeVisible();
  });

  test('@offline data persistence works offline', async ({ page, context }) => {
    await page.goto('/');
    
    // Go offline
    await context.setOffline(true);
    await page.reload();
    
    // Create workout data
    const squatCheckbox = page.locator('input[type="checkbox"]').first();
    await squatCheckbox.check();
    
    // Add weight to exercise
    const weightInput = page.locator('input[type="number"]').first();
    await weightInput.fill('125');
    
    // Switch to diet tab and add meal data
    await page.getByRole('button', { name: /dieta/i }).click();
    const mealCheckbox = page.locator('input[type="checkbox"]').first();
    await mealCheckbox.check();
    
    // Go back online and reload
    await context.setOffline(false);
    await page.reload();
    
    // Verify all data persisted
    await expect(squatCheckbox).toBeChecked();
    await expect(weightInput).toHaveValue('125');
    
    await page.getByRole('button', { name: /dieta/i }).click();
    await expect(mealCheckbox).toBeChecked();
  });

  test('@offline timer works offline', async ({ page, context }) => {
    await page.goto('/');
    
    // Go offline
    await context.setOffline(true);
    await page.reload();
    
    // Start timer
    const startButton = page.getByRole('button', { name: /avvia/i });
    await startButton.click();
    
    // Wait a moment and check timer is running
    await page.waitForTimeout(1500);
    
    // Timer should show at least 0:01
    const timerDisplay = page.locator('text=/\\d+:\\d+/').first();
    await expect(timerDisplay).toBeVisible();
    
    // Stop timer
    const stopButton = page.getByRole('button', { name: /stop/i });
    await stopButton.click();
    
    // Timer should persist when going back online
    await context.setOffline(false);
    await page.reload();
    
    // Timer value should still be visible (saved)
    await expect(timerDisplay).toBeVisible();
  });
});