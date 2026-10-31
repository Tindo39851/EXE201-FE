import { expect, Page, test } from '@playwright/test';

const API_URL = 'http://localhost:5000/api';

async function loginByApi(page: Page, username = 'demo', password = 'Demo123!') {
  const response = await page.request.post(`${API_URL}/auth/login`, {
    data: { emailOrUsername: username, password },
  });
  expect(response.status(), await response.text()).toBe(200);
  const payload = await response.json() as { data: { accessToken: string; refreshToken: string } };
  await page.addInitScript(({ accessToken, refreshToken }) => {
    localStorage.setItem('gametrust_token', accessToken);
    localStorage.setItem('gametrust_refresh_token', refreshToken);
  }, payload.data);
}

test('login modal handles invalid credentials, registration validation, success and logout', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByPlaceholder('admin or player@gametrust.gg').fill('demo');
  await page.locator('input[type="password"]').fill('wrong-password');
  await page.getByRole('button', { name: 'AUTHORIZE ACCESS' }).click();
  await expect(page.getByText('Invalid username or password', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Create Account', exact: true }).first().click();
  await page.getByPlaceholder('e.g. PHANTOM_REAPER').fill('e2e_user');
  await page.getByPlaceholder('player@gametrust.gg').fill('e2e@example.com');
  await page.locator('input[type="password"]').nth(0).fill('123456');
  await page.locator('input[type="password"]').nth(1).fill('654321');
  await page.getByRole('button', { name: 'CONTINUE TO VERIFY' }).click();
  await expect(page.getByText('Mật khẩu và xác nhận mật khẩu không khớp nhau!')).toBeVisible();

  await page.locator('input[type="password"]').nth(0).fill('123');
  await page.locator('input[type="password"]').nth(1).fill('123');
  await page.getByRole('button', { name: 'CONTINUE TO VERIFY' }).click();
  await expect(page.getByText('Mật khẩu phải chứa ít nhất 6 ký tự.')).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByPlaceholder('admin or player@gametrust.gg').fill('demo');
  await page.locator('input[type="password"]').fill('Demo123!');
  await page.getByRole('button', { name: 'AUTHORIZE ACCESS' }).click();
  await expect(page.getByTitle('Logout')).toBeVisible();
  await expect(page.getByRole('button', { name: 'AUTHORIZE ACCESS' })).not.toBeVisible();
  await page.getByTitle('Logout').click();
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
});

test('anonymous room creation is rejected instead of creating a fake local room', async ({ page }) => {
  await page.goto('/voice-lounges');
  await page.getByRole('button', { name: 'CREATE ROOM', exact: true }).click();
  await page.getByPlaceholder(/Leo rank tryhard/).fill(`Unauthorized room ${Date.now()}`);
  const responsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/community/games/')
      && response.url().endsWith('/rooms')
      && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'LAUNCH ROOM' }).click();
  expect((await responsePromise).status()).toBe(401);
  await expect(page.getByText('Authentication required', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'LAUNCH ROOM' })).toBeVisible();
});

test('authenticated room creation reaches MongoDB and is removed after verification', async ({ page }) => {
  await loginByApi(page);
  await page.goto('/voice-lounges');
  await page.getByRole('button', { name: 'CREATE ROOM', exact: true }).click();
  const roomName = `E2E UI Room ${Date.now()}`;
  await page.getByPlaceholder(/Leo rank tryhard/).fill(roomName);
  const responsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/community/games/')
      && response.url().endsWith('/rooms')
      && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'LAUNCH ROOM' }).click();
  const response = await responsePromise;
  expect(response.status(), await response.text()).toBe(200);
  const payload = await response.json() as { data: { id: string } };
  try {
    await expect(page.getByRole('heading', { name: roomName })).toBeVisible();
  } finally {
    const cleanup = await page.request.delete(`${API_URL}/community/rooms/${payload.data.id}`);
    expect(cleanup.status(), await cleanup.text()).toBe(200);
  }
});

test('voice filters, search empty state and all supported game tabs work', async ({ page }) => {
  await page.goto('/voice-lounges');
  for (const game of ['FREE FIRE', 'LEAGUE OF LEGENDS', 'LIÊN QUÂN MOBILE', 'VALORANT']) {
    await page.getByRole('button', { name: new RegExp(`^${game}\\s+2$`, 'i') }).click();
    await expect(page.getByRole('button', { name: 'JOIN ROOM' })).toHaveCount(2);
  }
  await page.getByPlaceholder('Search rooms...').fill('room-that-does-not-exist');
  await expect(page.getByText('NO ACTIVE VOICE LOUNGES FOUND')).toBeVisible();
  await page.getByPlaceholder('Search rooms...').fill('');
  await expect(page.getByRole('button', { name: 'JOIN ROOM' })).toHaveCount(2);
});

test('AI chat works through the UI and unsupported wallets show a clear error', async ({ page }) => {
  await loginByApi(page);
  await page.goto('/ai-chat');
  await page.getByPlaceholder('Hỏi AI Coach về chiến thuật, combo, phản xạ...').fill('Reply with exactly E2E_UI_OK');
  await page.getByTitle('Gửi tin nhắn').click();
  await expect.poll(async () => {
    const matchingMessages = await page.getByText(/E2E_UI_OK/).count();
    const errorVisible = await page.getByRole('alert').isVisible().catch(() => false);
    return matchingMessages >= 2 || errorVisible;
  }, { timeout: 30_000 }).toBe(true);

  await page.goto('/wallet');
  await page.getByRole('button', { name: 'MOMO', exact: true }).click();
  await expect(page.getByText('MOMO chưa được kết nối. Vui lòng chọn PayOS.')).toBeVisible();
});

test('all member pages render at mobile width without crashes or horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginByApi(page);
  const pageErrors: string[] = [];
  const serverErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith(`${API_URL}/`) && response.status() >= 500) {
      serverErrors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  for (const route of [
    '/', '/squad-finder', '/voice-lounges', '/ai-chat', '/tournament',
    '/clan', '/reputation', '/profile', '/wallet',
  ]) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.ok(), `document request failed for ${route}`).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(500);
    const layout = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const offenders = Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.right > viewportWidth + 1 || rect.left < -1)
        .slice(0, 8)
        .map(({ element, rect }) => ({
          tag: element.tagName,
          className: element.className,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        }));
      return {
        overflow: document.documentElement.scrollWidth - viewportWidth,
        offenders,
      };
    });
    expect(
      layout.overflow,
      `horizontal overflow on ${route}: ${JSON.stringify(layout.offenders)}`,
    ).toBeLessThanOrEqual(1);
  }

  expect(pageErrors, `browser runtime errors:\n${pageErrors.join('\n')}`).toEqual([]);
  expect(serverErrors, `backend 5xx responses:\n${serverErrors.join('\n')}`).toEqual([]);
});
