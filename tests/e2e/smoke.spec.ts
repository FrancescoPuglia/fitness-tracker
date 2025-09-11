import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Core Functionality', () => {
  test('@smoke loads app and displays today workout', async ({ page }) => {
    await page.goto('/');
    
    // Check main header
    await expect(page.getByRole('heading', { name: 'Fitness Tracker' })).toBeVisible();
    
    // Check navigation tabs
    await expect(page.getByRole('button', { name: /allenamento/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /dieta/i })).toBeVisible();
    
    // Check today's date is shown
    await expect(page.locator('text=mercoledì')).toBeVisible(); // 2025-09-11 is Wednesday
    
    // Check default exercises are loaded
    await expect(page.getByText('Panca Piana')).toBeVisible();
    await expect(page.getByText('Squat')).toBeVisible();
  });

  test('@smoke toggles exercise completion and persists', async ({ page }) => {
    await page.goto('/');
    
    // Find and toggle first exercise
    const squatCheckbox = page.locator('input[type="checkbox"]').first();
    await squatCheckbox.check();
    await expect(squatCheckbox).toBeChecked();
    
    // Check progress updates
    await expect(page.getByText('1 / 6 esercizi completati')).toBeVisible();
    
    // Refresh page and verify persistence
    await page.reload();
    await expect(squatCheckbox).toBeChecked();
  });

  test('@smoke navigates to diet tab and toggles meal', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to diet tab
    await page.getByRole('button', { name: /dieta/i }).click();
    
    // Check diet interface loaded
    await expect(page.getByText('Colazione')).toBeVisible();
    await expect(page.getByText('Pranzo')).toBeVisible();
    
    // Toggle first meal
    const breakfastCheckbox = page.locator('input[type="checkbox"]').first();
    await breakfastCheckbox.check();
    
    // Check macros update
    await expect(page.getByText('400')).toBeVisible(); // calories
    await expect(page.getByText('20g')).toBeVisible(); // protein
  });

  test('@smoke navigates to calendar and shows current month', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to calendar
    await page.getByRole('button', { name: /calendario/i }).click();
    
    // Check calendar loaded
    await expect(page.getByText('settembre 2025')).toBeVisible();
    
    // Check weekdays header
    await expect(page.getByText('Lun')).toBeVisible();
    await expect(page.getByText('Mar')).toBeVisible();
    
    // Check current day (11) is highlighted
    const currentDay = page.getByText('11').first();
    await expect(currentDay).toBeVisible();
  });

  test('@smoke opens statistics and shows empty state', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to statistics  
    await page.getByRole('button', { name: /statistiche/i }).click();
    
    // Check statistics interface
    await expect(page.getByText('Statistiche Generali')).toBeVisible();
    await expect(page.getByText('Record Personali')).toBeVisible();
    
    // Should show zero stats initially
    await expect(page.getByText('0').first()).toBeVisible();
  });

  test('@smoke accesses settings and export functionality', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to settings
    await page.getByRole('button', { name: /impostazioni/i }).click();
    
    // Check settings interface
    await expect(page.getByText('Impostazioni')).toBeVisible();
    await expect(page.getByText('Backup e Ripristino')).toBeVisible();
    
    // Check export button exists
    await expect(page.getByRole('button', { name: /esporta/i })).toBeVisible();
  });
});