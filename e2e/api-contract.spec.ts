import { APIRequestContext, expect, test } from '@playwright/test';

const API_URL = 'http://localhost:5000/api';

type Envelope<T> = { data: T };
type AuthPayload = { accessToken: string; refreshToken: string; user: { id: string; role: string } };
type CommunityItem = { id: string; type?: string; name?: string; members?: unknown[]; onlineCount?: number };

type PlaywrightFixture = {
  request: { newContext(): Promise<APIRequestContext> };
};

async function apiContext(playwright: PlaywrightFixture) {
  const context = await playwright.request.newContext();
  const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'fetch']);
  return new Proxy(context, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if (typeof property === 'string' && methods.has(property) && typeof value === 'function') {
        return (path: string, options?: unknown) => value.call(target, `${API_URL}${path}`, options);
      }
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as APIRequestContext;
}

async function login(context: APIRequestContext, username: string, password: string) {
  const response = await context.post('/auth/login', {
    data: { emailOrUsername: username, password },
  });
  expect(response.status(), `login failed for ${username}: ${await response.text()}`).toBe(200);
  return (await response.json() as Envelope<AuthPayload>).data;
}

async function expectStatus(response: Awaited<ReturnType<APIRequestContext['get']>>, status: number) {
  expect(response.status(), await response.text()).toBe(status);
}

test('authentication, token rotation and role protection cover success and failure paths', async ({ playwright }) => {
  const anonymous = await apiContext(playwright);
  const member = await apiContext(playwright);
  const admin = await apiContext(playwright);
  try {
    await expectStatus(await anonymous.post('/auth/login', { data: {} }), 400);
    await expectStatus(await anonymous.post('/auth/send-registration-otp', { data: { email: 'not-an-email' } }), 400);
    await expectStatus(await anonymous.post('/auth/send-registration-otp', { data: { email: 'demo@gametrust.gg' } }), 400);
    await expectStatus(await anonymous.post('/auth/login', {
      data: { emailOrUsername: 'demo', password: 'definitely-wrong' },
    }), 401);
    await expectStatus(await anonymous.get('/auth/me'), 401);
    await expectStatus(await anonymous.post('/auth/refresh', { data: {} }), 400);
    await expectStatus(await anonymous.post('/auth/refresh', { data: { refreshToken: 'invalid-token' } }), 401);
    await expectStatus(await anonymous.post('/auth/logout', { data: {} }), 200);

    const memberAuth = await login(member, 'demo', 'Demo123!');
    expect(memberAuth.user.role).toBe('MEMBER');
    await expectStatus(await member.get('/auth/me'), 200);
    await expectStatus(await member.get('/admin/users'), 403);

    const rotated = await member.post('/auth/refresh', {
      data: { refreshToken: memberAuth.refreshToken },
    });
    await expectStatus(rotated, 200);
    const rotatedAuth = (await rotated.json() as Envelope<AuthPayload>).data;
    expect(rotatedAuth.refreshToken).not.toBe(memberAuth.refreshToken);
    await expectStatus(await member.post('/auth/refresh', {
      data: { refreshToken: memberAuth.refreshToken },
    }), 401);
    await expectStatus(await member.post('/auth/logout', {
      data: { refreshToken: rotatedAuth.refreshToken },
    }), 200);
    await expectStatus(await member.post('/auth/refresh', {
      data: { refreshToken: rotatedAuth.refreshToken },
    }), 401);

    const adminAuth = await login(admin, 'admin', 'Admin123!');
    expect(adminAuth.user.role).toBe('ADMIN');
    await expectStatus(await admin.get('/admin/users'), 200);
    await expectStatus(await admin.get('/admin/tournaments'), 200);
    await expectStatus(await admin.get('/admin/reports'), 200);
    await expectStatus(await admin.get('/admin/clans'), 200);
  } finally {
    await Promise.all([anonymous.dispose(), member.dispose(), admin.dispose()]);
  }
});

test('public resources return valid data and reject invalid identifiers and query values', async ({ playwright }) => {
  const context = await apiContext(playwright);
  try {
    const gamesResponse = await context.get('/community/games');
    await expectStatus(gamesResponse, 200);
    const games = (await gamesResponse.json() as Envelope<Array<CommunityItem & { channels: CommunityItem[] }>>).data;
    expect(games).toHaveLength(4);
    expect(new Set(games.map((game) => game.id))).toEqual(
      new Set(['free-fire', 'league-of-legends', 'lien-quan', 'valorant']),
    );

    const textChannel = games.flatMap((game) => game.channels).find((channel) => channel.type === 'TEXT');
    const voiceChannel = games.flatMap((game) => game.channels).find((channel) => channel.type === 'VOICE');
    expect(textChannel).toBeTruthy();
    expect(voiceChannel).toBeTruthy();

    await expectStatus(await context.get('/community/games/not-a-real-game'), 404);
    await expectStatus(await context.get('/community/channels/not-a-real-channel/messages'), 404);
    await expectStatus(await context.get(`/community/channels/${voiceChannel!.id}/messages`), 400);
    await expectStatus(await context.get(`/community/channels/${textChannel!.id}/messages?before=not-a-date`), 400);
    await expectStatus(await context.get('/community/rooms/not-a-real-room'), 404);
    await expectStatus(await context.get('/tournaments/not-a-real-tournament'), 404);
    await expectStatus(await context.get('/clans/not-a-real-clan'), 400);

    for (const path of [
      '/tournaments', '/clans', '/reputation/metrics', '/reputation/reports',
      '/reputation/reviews', '/reputation/top-players', '/social/feed',
      '/social/online-players', '/social/trending-tags', '/squads/players',
    ]) {
      await expectStatus(await context.get(path), 200);
    }
  } finally {
    await context.dispose();
  }
});

test('community message lifecycle enforces validation, authorship and cleanup', async ({ playwright }) => {
  const member = await apiContext(playwright);
  const admin = await apiContext(playwright);
  let messageId: string | undefined;
  let textChannelId: string | undefined;
  try {
    await login(member, 'demo', 'Demo123!');
    await login(admin, 'admin', 'Admin123!');
    const channelsResponse = await member.get('/community/games/free-fire/channels');
    const channels = (await channelsResponse.json() as Envelope<CommunityItem[]>).data;
    textChannelId = channels.find((channel) => channel.type === 'TEXT')?.id;
    expect(textChannelId).toBeTruthy();

    await expectStatus(await member.post(`/community/channels/${textChannelId}/messages`, {
      data: { content: '   ' },
    }), 400);
    await expectStatus(await member.post(`/community/channels/${textChannelId}/messages`, {
      data: { content: 'x'.repeat(2001) },
    }), 400);

    const created = await admin.post(`/community/channels/${textChannelId}/messages`, {
      data: { content: '  E2E message lifecycle  ' },
    });
    await expectStatus(created, 200);
    const createdMessage = (await created.json() as Envelope<{ id: string; content: string }>).data;
    messageId = createdMessage.id;
    expect(createdMessage.content).toBe('E2E message lifecycle');

    await expectStatus(await member.patch(`/community/messages/${messageId}`, {
      data: { content: 'unauthorized edit' },
    }), 403);
    await expectStatus(await member.delete(`/community/messages/${messageId}`), 403);
    await expectStatus(await admin.patch(`/community/messages/${messageId}`, {
      data: { content: '  E2E edited  ' },
    }), 200);

    const messages = await admin.get(`/community/channels/${textChannelId}/messages?limit=100`);
    await expectStatus(messages, 200);
    const list = (await messages.json() as Envelope<Array<{ id: string; content: string }>>).data;
    expect(list.find((item) => item.id === messageId)?.content).toBe('E2E edited');

    await expectStatus(await admin.delete(`/community/messages/${messageId}`), 200);
    messageId = undefined;
  } finally {
    if (messageId && textChannelId) {
      await admin.delete(`/community/messages/${messageId}`).catch(() => undefined);
    }
    await Promise.all([member.dispose(), admin.dispose()]);
  }
});

test('voice room lifecycle covers validation, locking, permissions, idempotency and cleanup', async ({ playwright }) => {
  const member = await apiContext(playwright);
  const admin = await apiContext(playwright);
  let roomId: string | undefined;
  try {
    const memberAuth = await login(member, 'demo', 'Demo123!');
    await login(admin, 'admin', 'Admin123!');

    await expectStatus(await member.post('/community/games/free-fire/rooms', {
      data: { name: '', capacity: 2 },
    }), 400);
    await expectStatus(await member.post('/community/games/free-fire/rooms', {
      data: { name: 'x'.repeat(61), capacity: 2 },
    }), 400);
    await expectStatus(await member.post('/community/games/free-fire/rooms', {
      data: { name: 'invalid capacity', capacity: 1 },
    }), 400);
    await expectStatus(await member.post('/community/games/not-a-real-game/rooms', {
      data: { name: 'invalid game', capacity: 2 },
    }), 404);

    const created = await admin.post('/community/games/free-fire/rooms', {
      data: { name: `E2E Room ${Date.now()}`, capacity: 2 },
    });
    await expectStatus(created, 200);
    roomId = (await created.json() as Envelope<CommunityItem>).data.id;

    await expectStatus(await member.patch(`/community/rooms/${roomId}`, {
      data: { name: 'forbidden rename' },
    }), 403);
    await expectStatus(await member.delete(`/community/rooms/${roomId}`), 403);
    await expectStatus(await admin.patch(`/community/rooms/${roomId}`, { data: {} }), 400);
    await expectStatus(await admin.patch(`/community/rooms/${roomId}`, {
      data: { locked: true },
    }), 200);
    await expectStatus(await member.post(`/community/rooms/${roomId}/join`), 400);
    await expectStatus(await admin.patch(`/community/rooms/${roomId}`, {
      data: { locked: false, name: 'E2E Room Updated' },
    }), 200);

    const concurrentJoins = await Promise.all(
      Array.from({ length: 8 }, () => member.post(`/community/rooms/${roomId}/join`)),
    );
    for (const response of concurrentJoins) await expectStatus(response, 200);
    await expectStatus(await member.post(`/community/rooms/${roomId}/join`), 200);
    const room = await member.get(`/community/rooms/${roomId}`);
    const roomData = (await room.json() as Envelope<CommunityItem>).data;
    expect(roomData.onlineCount).toBe(1);
    expect(roomData.members).toHaveLength(1);

    await expectStatus(await member.patch(`/community/rooms/${roomId}/members/${memberAuth.user.id}`, {
      data: { muted: true },
    }), 403);
    await expectStatus(await admin.patch(`/community/rooms/${roomId}/members/not-a-real-user`, {
      data: { muted: true },
    }), 404);
    await expectStatus(await admin.patch(`/community/rooms/${roomId}/members/${memberAuth.user.id}`, {
      data: {},
    }), 400);

    await expectStatus(await member.post(`/community/rooms/${roomId}/leave`), 200);
    await expectStatus(await member.post(`/community/rooms/${roomId}/leave`), 200);
    await expectStatus(await admin.delete(`/community/rooms/${roomId}`), 200);
    await expectStatus(await admin.get(`/community/rooms/${roomId}`), 404);
    roomId = undefined;
  } finally {
    if (roomId) {
      await member.post(`/community/rooms/${roomId}/leave`).catch(() => undefined);
      await admin.delete(`/community/rooms/${roomId}`).catch(() => undefined);
    }
    await Promise.all([member.dispose(), admin.dispose()]);
  }
});

test('AI and remaining write endpoints reject unsafe or malformed requests', async ({ playwright }) => {
  const anonymous = await apiContext(playwright);
  const member = await apiContext(playwright);
  const admin = await apiContext(playwright);
  try {
    await login(member, 'demo', 'Demo123!');
    await login(admin, 'admin', 'Admin123!');

    await expectStatus(await anonymous.get('/ai/status'), 401);
    await expectStatus(await member.get('/ai/status'), 200);
    await expectStatus(await member.post('/ai/chat', { data: { messages: [] } }), 400);
    await expectStatus(await member.post('/ai/chat', {
      data: { messages: Array.from({ length: 21 }, () => ({ role: 'user', content: 'hello' })) },
    }), 400);
    await expectStatus(await member.post('/ai/chat', {
      data: { messages: [{ role: 'system', content: 'invalid role' }] },
    }), 400);
    await expectStatus(await member.post('/ai/chat', {
      data: { messages: [{ role: 'user', content: 'x'.repeat(4001) }] },
    }), 400);

    const aiResponse = await member.post('/ai/chat', {
      data: { messages: [{ role: 'user', content: 'Reply with exactly E2E_OK' }] },
    });
    if (aiResponse.status() === 200) {
      const aiData = (await aiResponse.json() as Envelope<{ reply: string; model: string }>).data;
      expect(aiData.reply).toContain('E2E_OK');
      expect(aiData.model).toBeTruthy();
    } else {
      expect([402, 429, 502, 503], await aiResponse.text()).toContain(aiResponse.status());
    }

    await expectStatus(await anonymous.get('/payment/balance'), 401);
    await expectStatus(await anonymous.get('/payment/check-status/999999999999'), 401);
    await expectStatus(await member.post('/payment/create-payment-link', {
      data: { amountVnd: 9999 },
    }), 400);
    await expectStatus(await member.post('/payment/create-payment-link', {
      data: { amountVnd: 50_000_001 },
    }), 400);
    await expectStatus(await member.get('/payment/check-status/999999999999'), 404);
    await expectStatus(await member.post('/payment/simulate-success/999999999999'), 404);
    await expectStatus(await member.post('/squads/matchmake', { data: {} }), 400);
    await expectStatus(await member.post('/social/posts', { data: { content: ' ' } }), 400);
    await expectStatus(await member.post('/reputation/reviews', { data: {} }), 400);
    await expectStatus(await member.post('/reputation/reports', { data: {} }), 400);
    await expectStatus(await member.post('/tournaments/not-a-real-tournament/register', { data: {} }), 400);
    await expectStatus(await admin.patch('/admin/users/not-a-real-user/role', {
      data: { role: 'OWNER' },
    }), 404);
  } finally {
    await Promise.all([anonymous.dispose(), member.dispose(), admin.dispose()]);
  }
});
