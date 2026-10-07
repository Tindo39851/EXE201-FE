import { expect, Page, test } from '@playwright/test';

const API_URL = 'http://localhost:5000/api';

interface LoginPayload {
  data: { user: { id: string } };
}

interface VoiceTokenPayload {
  data: { roomId: string };
}

async function login(page: Page, username: string, password: string): Promise<string> {
  const response = await page.request.post(`${API_URL}/auth/login`, {
    data: { emailOrUsername: username, password },
  });
  expect(response.ok(), `login failed for ${username}: ${await response.text()}`).toBeTruthy();
  const payload = await response.json() as LoginPayload;
  await page.goto('/voice-lounges');
  await expect(page.getByRole('button', { name: 'JOIN ROOM' }).first()).toBeVisible();
  return payload.data.user.id;
}

async function joinFirstRoom(page: Page): Promise<string> {
  const tokenResponse = page.waitForResponse(response =>
    response.url().includes('/voice-token') && response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'JOIN ROOM' }).first().click();
  const response = await tokenResponse;
  expect(response.ok(), `voice token failed: ${await response.text()}`).toBeTruthy();
  const payload = await response.json() as VoiceTokenPayload;
  await expect(page.getByText('CONNECTED', { exact: true })).toBeVisible();
  return payload.data.roomId;
}

test('two users join, publish microphone, mute, deafen and disconnect', async ({ browser }) => {
  const demoContext = await browser.newContext({ permissions: ['microphone'] });
  const adminContext = await browser.newContext({ permissions: ['microphone'] });
  const demoPage = await demoContext.newPage();
  const adminPage = await adminContext.newPage();

  try {
    const demoUserId = await login(demoPage, 'demo', 'Demo123!');
    await login(adminPage, 'admin', 'Admin123!');

    const roomId = await joinFirstRoom(demoPage);
    expect(await joinFirstRoom(adminPage)).toBe(roomId);

    await expect(demoPage.getByRole('heading', { name: 'demo', exact: true })).toBeVisible();
    await expect(demoPage.getByRole('heading', { name: 'admin', exact: true })).toBeVisible();
    await expect(adminPage.getByRole('heading', { name: 'demo', exact: true })).toBeVisible();

    const muteButton = demoPage.getByTitle('Mute Microphone');
    await muteButton.click();
    await expect(demoPage.getByTitle('Unmute Microphone')).toBeVisible();
    await expect(adminPage.getByRole('group', { name: 'demo microphone muted' })).toBeVisible();
    await demoPage.getByTitle('Unmute Microphone').click();
    await expect(demoPage.getByTitle('Mute Microphone')).toBeVisible();
    await expect(adminPage.getByRole('group', { name: 'demo microphone active' })).toBeVisible();

    await demoPage.getByTitle('Deafen').click();
    await expect(demoPage.getByTitle('Undeafen')).toBeVisible();

    const serverMute = await adminPage.request.patch(
      `${API_URL}/community/rooms/${roomId}/members/${demoUserId}`,
      { data: { muted: true } }
    );
    expect(serverMute.ok(), `server mute failed: ${await serverMute.text()}`).toBeTruthy();
    await expect(adminPage.getByRole('group', { name: 'demo microphone muted' })).toBeVisible();
    await expect(demoPage.getByTitle('Unmute Microphone')).toBeVisible();
    await demoPage.getByTitle('Unmute Microphone').click();
    await expect(demoPage.getByTitle('Mute Microphone')).toBeVisible();
    await expect(adminPage.getByRole('group', { name: 'demo microphone active' })).toBeVisible();

    const kick = await adminPage.request.delete(
      `${API_URL}/community/rooms/${roomId}/members/${demoUserId}`
    );
    expect(kick.ok(), `kick failed: ${await kick.text()}`).toBeTruthy();
    await expect(demoPage.getByRole('button', { name: 'JOIN ROOM' }).first()).toBeVisible();

    await joinFirstRoom(demoPage);
    await expect(demoPage.getByRole('heading', { name: 'admin', exact: true })).toBeVisible();

    await adminContext.close();
    await expect(demoPage.getByRole('heading', { name: 'admin', exact: true })).not.toBeVisible();

    await demoPage.getByTitle('Disconnect from Room').click();
    await expect(demoPage.getByRole('button', { name: 'JOIN ROOM' }).first()).toBeVisible();
  } finally {
    await adminContext.close().catch(() => undefined);
    await demoContext.close().catch(() => undefined);
  }
});
