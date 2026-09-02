import { test, expect } from '@playwright/test';

test.describe('Dashboard & Feature Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('displays dashboard metrics and activity feed', async ({ page }) => {
    await expect(page.locator('text=Total Active Users')).toBeVisible();
    await expect(page.locator('text=Service Uptime')).toBeVisible();
    await expect(page.locator('text=System Performance')).toBeVisible();
  });

  test('navigates seamlessly to Users and Posts views', async ({ page }) => {
    // Navigate to Users
    await page.click('nav a:has-text("Users")');
    await expect(page).toHaveURL(/.*\/users/);
    await expect(page.locator('h2')).toContainText('User Management');

    // Navigate to Posts
    await page.click('nav a:has-text("Posts")');
    await expect(page).toHaveURL(/.*\/posts/);
    await expect(page.locator('h2')).toContainText('Articles & Architecture Insights');
  });
});
