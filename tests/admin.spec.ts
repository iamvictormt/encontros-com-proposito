import { test, expect } from '@playwright/test';

test('Admin panel is accessible and shows data', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'admin@meetoff.com');
  await page.fill('input[name="password"]', 'adminpassword');
  await page.click('button[type="submit"]');

  // Wait for redirect to /admin
  await page.waitForURL('**/admin');
  
  // Check sidebar links
  await expect(page.locator('nav')).toContainText('Eventos');
  await expect(page.locator('nav')).toContainText('Locais');
  await expect(page.locator('nav')).toContainText('Marcas');
  await expect(page.locator('nav')).toContainText('Produtos');
  await expect(page.locator('nav')).toContainText('Relatórios');

  // Check Dashboard content
  await expect(page.getByText('Visão Geral')).toBeVisible();

  // Navigate to Events
  await page.click('nav a:has-text("Eventos")');
  await page.waitForURL('**/admin/events');
  await expect(page.getByText('Gerenciar Eventos')).toBeVisible();
  // Should see the seeded event
  await expect(page.getByText('MeetOff Inauguração')).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'verification/admin_events.png' });

  // Navigate to Venues
  await page.click('nav a:has-text("Locais")');
  await page.waitForURL('**/admin/venues');
  await expect(page.getByText('Gerenciar Locais')).toBeVisible();
  await expect(page.getByText('Arena MeetOff')).toBeVisible();
  await page.screenshot({ path: 'verification/admin_venues.png' });

  // Navigate to Brands
  await page.click('nav a:has-text("Marcas")');
  await page.waitForURL('**/admin/brands');
  await expect(page.getByText('Gerenciar Marcas')).toBeVisible();
  await expect(page.getByText('MeetOff Original')).toBeVisible();
  await page.screenshot({ path: 'verification/admin_brands.png' });

  // Navigate to Products
  await page.click('nav a:has-text("Produtos")');
  await page.waitForURL('**/admin/products');
  await expect(page.getByText('Gerenciar Produtos')).toBeVisible();
  await expect(page.getByText('Camiseta Classic')).toBeVisible();
  await page.screenshot({ path: 'verification/admin_products.png' });
  
  // Navigate to Reports
  await page.click('nav a:has-text("Relatórios")');
  await page.waitForURL('**/admin/reports');
  await expect(page.getByText('Relatórios e Estatísticas')).toBeVisible();
  await page.screenshot({ path: 'verification/admin_reports.png' });
});
