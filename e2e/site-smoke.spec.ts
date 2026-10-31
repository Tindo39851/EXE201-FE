import { expect, Page, test } from '@playwright/test';

const API_URL = 'http://localhost:5000/api';

const memberRoutes = [
  '/',
  '/squad-finder',
  '/voice-lounges',
  '/ai-chat',
  '/tournament',
  '/clan',
  '/reputation',
  '/profile',
  '/wallet',
];

async function login(page: Page, username: string, password: string) {
  const response = await page.request.post(`${API_URL}/auth/login`, {
    data: { emailOrUsername: username, password },
  });
  expect(response.ok(), `login failed for ${username}: ${await response.text()}`).toBeTruthy();
  const payload = await response.json() as { data: { accessToken: string; refreshToken: string } };
  await page.addInitScript(({ accessToken, refreshToken }) => {
    localStorage.setItem('gametrust_token', accessToken);
    localStorage.setItem('gametrust_refresh_token', refreshToken);
  }, payload.data);
}

async function expectRoutesHealthy(page: Page, routes: string[]) {
  const pageErrors: string[] = [];
  const serverErrors: string[] = [];

  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith('http://localhost:5000/api/') && response.status() >= 500) {
      serverErrors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.ok(), `document request failed for ${route}`).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(600);
  }

  expect(pageErrors, `browser runtime errors:\n${pageErrors.join('\n')}`).toEqual([]);
  expect(serverErrors, `backend 5xx responses:\n${serverErrors.join('\n')}`).toEqual([]);
}

test('member can render every public and authenticated page without runtime errors', async ({ page }) => {
  await login(page, 'demo', 'Demo123!');
  await expectRoutesHealthy(page, memberRoutes);
});

test('admin console renders without runtime errors', async ({ page }) => {
  await login(page, 'admin', 'Admin123!');
  await expectRoutesHealthy(page, ['/admin']);
});
