import { apiClient } from '@/services/api-client';
import type { 
  VoiceRoom, 
  GameHubItem, 
  ChatMessage, 
  CreateRoomDto,
  VoiceMember
} from '../types/voice.types';

const INITIAL_GAMES: GameHubItem[] = [
  { id: 'all', name: 'ALL GAMES', shortName: 'ALL', count: 12 },
  { id: 'league-of-legends', name: 'League of Legends', shortName: 'LOL', count: 5 },
  { id: 'free-fire', name: 'Free Fire', shortName: 'FF', count: 2 },
  { id: 'valorant', name: 'Valorant', shortName: 'VAL', count: 3 },
  { id: 'cs2', name: 'CS2', shortName: 'CS2', count: 2 },
];

const INITIAL_ROOMS: VoiceRoom[] = [
  {
    id: 'room-lol-1',
    gameId: 'league-of-legends',
    gameName: 'League of Legends',
    name: 'Late night ranked grind 🌙',
    tag: 'Diamond Rank',
    visibility: 'Public',
    ping: 28,
    capacity: 5,
    onlineCount: 3,
    members: [
      { id: 'm1', userId: 'u1', username: 'SYNAPSE', avatarLetter: 'S', avatarColor: '#FFD700', isHost: true, isSpeaking: true, role: 'Bot', rank: 'Grandmaster' },
      { id: 'm2', userId: 'u2', username: 'HECTER', avatarLetter: 'H', avatarColor: '#00F0FF', role: 'Support', rank: 'Diamond' },
      { id: 'm3', userId: 'u3', username: 'RIFTBREAK', avatarLetter: 'R', avatarColor: '#00F0FF', muted: true, role: 'Mid', rank: 'Diamond' },
    ],
  },
  {
    id: 'room-lol-2',
    gameId: 'league-of-legends',
    gameName: 'League of Legends',
    name: '5-stack ARAM just for fun',
    tag: 'Casual',
    visibility: 'Public',
    ping: 14,
    capacity: 5,
    onlineCount: 5,
    members: [
      { id: 'm4', userId: 'u4', username: 'IVOR', avatarLetter: 'I', avatarColor: '#00F0FF' },
      { id: 'm5', userId: 'u5', username: 'WRAITH', avatarLetter: 'W', avatarColor: '#FFD700', isHost: true },
      { id: 'm6', userId: 'u6', username: 'VALKYRIE', avatarLetter: 'V', avatarColor: '#00F0FF' },
      { id: 'm7', userId: 'u7', username: 'CIPHER', avatarLetter: 'C', avatarColor: '#00F0FF' },
      { id: 'm8', userId: 'u8', username: 'LUMEN', avatarLetter: 'L', avatarColor: '#00F0FF', muted: true },
    ],
  },
  {
    id: 'room-lol-3',
    gameId: 'league-of-legends',
    gameName: 'League of Legends',
    name: 'Flex rank – need a support',
    tag: 'Climbing',
    visibility: 'Public',
    ping: 22,
    capacity: 5,
    onlineCount: 2,
    members: [
      { id: 'm9', userId: 'u9', username: 'NOVA', avatarLetter: 'N', avatarColor: '#00F0FF' },
      { id: 'm10', userId: 'u10', username: 'DUSK', avatarLetter: 'D', avatarColor: '#FFD700', isHost: true },
    ],
  },
  {
    id: 'room-lol-4',
    gameId: 'league-of-legends',
    gameName: 'League of Legends',
    name: '[PSY] Clan practice room',
    tag: 'Clan Internal',
    visibility: 'Clan Only',
    ping: 11,
    capacity: 8,
    onlineCount: 3,
    members: [
      { id: 'm11', userId: 'u11', username: 'APEX_ONE', avatarLetter: 'A', avatarColor: '#FFD700', isHost: true },
      { id: 'm12', userId: 'u12', username: 'PHANTOM', avatarLetter: 'P', avatarColor: '#00F0FF' },
      { id: 'm13', userId: 'u13', username: 'SHADOW', avatarLetter: 'S', avatarColor: '#00F0FF', muted: true },
    ],
  },
  {
    id: 'room-lol-5',
    gameId: 'league-of-legends',
    gameName: 'League of Legends',
    name: 'Gold to Plat grind – duo needed',
    tag: 'Rank Tryhard',
    visibility: 'Rank Tryhard',
    ping: 31,
    capacity: 2,
    onlineCount: 1,
    members: [
      { id: 'm14', userId: 'u14', username: 'GLITCH', avatarLetter: 'G', avatarColor: '#00F0FF', isHost: true },
    ],
  },
  {
    id: 'room-ff-1',
    gameId: 'free-fire',
    gameName: 'Free Fire',
    name: 'Rush squad – BOOYAH! 🔥',
    tag: 'Heroic Ranked',
    visibility: 'Public',
    ping: 18,
    capacity: 4,
    onlineCount: 3,
    members: [
      { id: 'm15', userId: 'u15', username: 'BLAZE', avatarLetter: 'B', avatarColor: '#FFD700', isHost: true },
      { id: 'm16', userId: 'u16', username: 'RAIDER', avatarLetter: 'R', avatarColor: '#00F0FF' },
      { id: 'm17', userId: 'u17', username: 'DRACO', avatarLetter: 'D', avatarColor: '#00F0FF', muted: true },
    ],
  },
  {
    id: 'room-ff-2',
    gameId: 'free-fire',
    gameName: 'Free Fire',
    name: 'Custom room – 12 squad battle',
    tag: 'Tournament',
    visibility: 'Public',
    ping: 25,
    capacity: 12,
    onlineCount: 7,
    members: [
      { id: 'm18', userId: 'u18', username: 'TITAN', avatarLetter: 'T', avatarColor: '#FFD700', isHost: true },
      { id: 'm19', userId: 'u19', username: 'VIPER', avatarLetter: 'V', avatarColor: '#00F0FF' },
      { id: 'm20', userId: 'u20', username: 'KAI', avatarLetter: 'K', avatarColor: '#00F0FF' },
    ],
  },
  {
    id: 'room-val-1',
    gameId: 'valorant',
    gameName: 'Valorant',
    name: 'Duelist diff incoming 🗡️',
    tag: 'Diamond Rank',
    visibility: 'Public',
    ping: 19,
    capacity: 5,
    onlineCount: 4,
    members: [
      { id: 'm21', userId: 'u21', username: 'JETT_MAIN', avatarLetter: 'J', avatarColor: '#FFD700', isHost: true },
      { id: 'm22', userId: 'u22', username: 'OMEN_GOD', avatarLetter: 'O', avatarColor: '#00F0FF' },
      { id: 'm23', userId: 'u23', username: 'SOVA_DART', avatarLetter: 'S', avatarColor: '#00F0FF' },
      { id: 'm24', userId: 'u24', username: 'CYPHER_CAM', avatarLetter: 'C', avatarColor: '#00F0FF', muted: true },
    ],
  },
  {
    id: 'room-val-2',
    gameId: 'valorant',
    gameName: 'Valorant',
    name: 'Premier team tryout – IGL calling',
    tag: 'Rank Tryhard',
    visibility: 'Public',
    ping: 21,
    capacity: 5,
    onlineCount: 3,
    members: [
      { id: 'm25', userId: 'u25', username: 'TACTIC', avatarLetter: 'T', avatarColor: '#FFD700', isHost: true },
      { id: 'm26', userId: 'u26', username: 'ASTRID', avatarLetter: 'A', avatarColor: '#00F0FF' },
      { id: 'm27', userId: 'u27', username: 'NEXUS', avatarLetter: 'N', avatarColor: '#00F0FF' },
    ],
  },
  {
    id: 'room-val-3',
    gameId: 'valorant',
    gameName: 'Valorant',
    name: 'Ascendant push – smoke main',
    tag: 'Climbing',
    visibility: 'Public',
    ping: 20,
    capacity: 5,
    onlineCount: 2,
    members: [
      { id: 'm28', userId: 'u28', username: 'VORTEX', avatarLetter: 'V', avatarColor: '#FFD700', isHost: true },
      { id: 'm29', userId: 'u29', username: 'BREACH', avatarLetter: 'B', avatarColor: '#00F0FF' },
    ],
  },
  {
    id: 'room-cs2-1',
    gameId: 'cs2',
    gameName: 'CS2',
    name: 'Late night Mirage executes',
    tag: 'Climbing',
    visibility: 'Public',
    ping: 16,
    capacity: 5,
    onlineCount: 4,
    members: [
      { id: 'm30', userId: 'u30', username: 'AWP_KING', avatarLetter: 'A', avatarColor: '#FFD700', isHost: true },
      { id: 'm31', userId: 'u31', username: 'FLASH_BANG', avatarLetter: 'F', avatarColor: '#00F0FF' },
      { id: 'm32', userId: 'u32', username: 'SMOKE_MID', avatarLetter: 'S', avatarColor: '#00F0FF' },
      { id: 'm33', userId: 'u33', username: 'DEFUSE', avatarLetter: 'D', avatarColor: '#00F0FF', muted: true },
    ],
  },
  {
    id: 'room-cs2-2',
    gameId: 'cs2',
    gameName: 'CS2',
    name: 'Faceit level 8+ grind',
    tag: 'Rank Tryhard',
    visibility: 'Public',
    ping: 24,
    capacity: 5,
    onlineCount: 2,
    members: [
      { id: 'm34', userId: 'u34', username: 'ENTRY_FRAG', avatarLetter: 'E', avatarColor: '#FFD700', isHost: true },
      { id: 'm35', userId: 'u35', username: 'CLUTCH_GOD', avatarLetter: 'C', avatarColor: '#00F0FF' },
    ],
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'room-lol-1': [
    {
      id: 'msg-1',
      channelId: 'room-lol-1',
      authorId: 'u1',
      authorUsername: 'SYNAPSE',
      authorAvatarLetter: 'S',
      authorColor: '#00F0FF',
      content: "alright let's grind 3 more games, we're on a win streak",
      createdAt: '1m ago',
    },
    {
      id: 'msg-2',
      channelId: 'room-lol-1',
      authorId: 'u2',
      authorUsername: 'HECTER',
      authorAvatarLetter: 'H',
      authorColor: '#00F0FF',
      content: "I'm on support, ping me if you need a gank covered",
      createdAt: '1m ago',
    },
    {
      id: 'msg-3',
      channelId: 'room-lol-1',
      authorId: 'u3',
      authorUsername: 'RIFTBREAK',
      authorAvatarLetter: 'R',
      authorColor: '#00F0FF',
      content: 'mid diff incoming, get ready everyone',
      createdAt: '1m ago',
    },
    {
      id: 'msg-4',
      channelId: 'room-lol-1',
      authorId: 'system',
      authorUsername: 'SYSTEM',
      content: '— CRONUS joined the room —',
      createdAt: 'just now',
      isSystem: true,
    },
    {
      id: 'msg-5',
      channelId: 'room-lol-1',
      authorId: 'u1',
      authorUsername: 'SYNAPSE',
      authorAvatarLetter: 'S',
      authorColor: '#00F0FF',
      content: 'welcome! do we need another support or ADC?',
      createdAt: 'just now',
    },
    {
      id: 'msg-6',
      channelId: 'room-lol-1',
      authorId: 'u2',
      authorUsername: 'HECTER',
      authorAvatarLetter: 'H',
      authorColor: '#00F0FF',
      content: "support slot open, let's go squad 🚀",
      createdAt: 'just now',
    },
    {
      id: 'msg-7',
      channelId: 'room-lol-1',
      authorId: 'u3',
      authorUsername: 'RIFTBREAK',
      authorAvatarLetter: 'R',
      authorColor: '#00F0FF',
      content: 'game 1 pick Orianna, game 2 pick Syndra ok?',
      createdAt: 'just now',
    },
  ],
};

let localRooms: VoiceRoom[] = [...INITIAL_ROOMS];
let localMessages: Record<string, ChatMessage[]> = { ...INITIAL_MESSAGES };

export const voiceService = {
  /**
   * Get all game categories with room counts
   */
  async getGameHubs(): Promise<GameHubItem[]> {
    try {
      const res = await apiClient.get<any[]>('/community/games');
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Map backend games to GameHubItem
        const items: GameHubItem[] = res.data.map(g => {
          const voiceChannels = (g.channels || []).filter((c: any) => c.type === 'VOICE');
          return {
            id: g.id,
            name: g.name,
            shortName: g.shortName || g.name.substring(0, 3).toUpperCase(),
            count: voiceChannels.length || 2,
          };
        });
        const totalCount = items.reduce((sum, g) => sum + g.count, 0);
        return [{ id: 'all', name: 'ALL GAMES', shortName: 'ALL', count: totalCount }, ...items];
      }
    } catch {
      // Backend not yet returning or error -> fallback to rich initial list
    }
    return INITIAL_GAMES;
  },

  /**
   * Get all active voice rooms, with optional gameId filter
   */
  async getVoiceRooms(gameId?: string): Promise<VoiceRoom[]> {
    try {
      if (gameId && gameId !== 'all') {
        const res = await apiClient.get<any[]>(`/community/games/${gameId}/channels`);
        if (Array.isArray(res.data)) {
          const voiceChannels = res.data.filter((c: any) => c.type === 'VOICE');
          if (voiceChannels.length > 0) {
            const mapped: VoiceRoom[] = voiceChannels.map((c: any) => ({
              id: c.id,
              gameId: c.gameId || gameId,
              gameName: c.gameId ? c.gameId.replace(/-/g, ' ').toUpperCase() : 'GAME HUB',
              name: c.name,
              tag: 'Casual',
              visibility: c.locked ? 'Clan Only' : 'Public',
              ping: Math.floor(Math.random() * 20) + 15,
              capacity: c.capacity || 10,
              onlineCount: c.onlineCount || (c.members ? c.members.length : 0),
              members: (c.members || []).map((m: any, idx: number) => ({
                id: m.id || `m_${idx}`,
                userId: m.userId,
                username: m.username || `User_${idx}`,
                avatarLetter: (m.username || 'U')[0].toUpperCase(),
                avatarColor: idx === 0 ? '#FFD700' : '#00F0FF',
                isHost: idx === 0,
                muted: !!m.muted,
              })),
            }));
            // Merge with local rich mock rooms for this game so UI looks full
            const localForGame = localRooms.filter(r => r.gameId.toLowerCase() === gameId.toLowerCase());
            return [...mapped, ...localForGame.filter(lr => !mapped.some(m => m.id === lr.id))];
          }
        }
      } else {
        // Fetch all games and collect their voice channels
        const res = await apiClient.get<any[]>('/community/games');
        if (Array.isArray(res.data) && res.data.length > 0) {
          const beVoiceChannels: VoiceRoom[] = [];
          for (const g of res.data) {
            const vChannels = (g.channels || []).filter((c: any) => c.type === 'VOICE');
            for (const c of vChannels) {
              beVoiceChannels.push({
                id: c.id,
                gameId: g.id,
                gameName: g.name,
                name: c.name,
                tag: 'Casual',
                visibility: c.locked ? 'Clan Only' : 'Public',
                ping: Math.floor(Math.random() * 20) + 15,
                capacity: c.capacity || 10,
                onlineCount: c.onlineCount || 0,
                members: (c.members || []).map((m: any, idx: number) => ({
                  id: m.id || `m_${idx}`,
                  userId: m.userId,
                  username: m.username || `User_${idx}`,
                  avatarLetter: (m.username || 'U')[0].toUpperCase(),
                  avatarColor: idx === 0 ? '#FFD700' : '#00F0FF',
                  isHost: idx === 0,
                  muted: !!m.muted,
                })),
              });
            }
          }
          if (beVoiceChannels.length > 0) {
            // Combine with initial rich mockup rooms
            const merged = [...localRooms];
            for (const b of beVoiceChannels) {
              if (!merged.some(m => m.id === b.id)) {
                merged.push(b);
              }
            }
            return merged;
          }
        }
      }
    } catch {
      // Fallback to local rich mock rooms
    }

    if (!gameId || gameId === 'all') {
      return localRooms;
    }
    return localRooms.filter(r => r.gameId.toLowerCase() === gameId.toLowerCase());
  },

  /**
   * Get details for a single room
   */
  async getRoomDetails(roomId: string): Promise<VoiceRoom | null> {
    try {
      const res = await apiClient.get<any>(`/community/rooms/${roomId}`);
      if (res.data) {
        const c = res.data;
        return {
          id: c.id,
          gameId: c.gameId || 'league-of-legends',
          gameName: c.gameId ? c.gameId.replace(/-/g, ' ') : 'League of Legends',
          name: c.name,
          tag: 'Diamond Rank',
          visibility: c.locked ? 'Clan Only' : 'Public',
          ping: 28,
          capacity: c.capacity || 10,
          onlineCount: c.onlineCount || (c.members ? c.members.length : 0),
          members: (c.members || []).map((m: any, idx: number) => ({
            id: m.id || `m_${idx}`,
            userId: m.userId,
            username: m.username,
            avatarLetter: (m.username || 'U')[0].toUpperCase(),
            avatarColor: idx === 0 ? '#FFD700' : '#00F0FF',
            isHost: idx === 0,
            muted: !!m.muted,
          })),
        };
      }
    } catch {
      // Fallback
    }

    const found = localRooms.find(r => r.id === roomId);
    return found || localRooms[0];
  },

  /**
   * Create a new voice room
   */
  async createRoom(dto: CreateRoomDto): Promise<VoiceRoom> {
    try {
      const res = await apiClient.post<any>(`/community/games/${dto.gameId}/rooms`, {
        name: dto.name,
        capacity: dto.capacity,
      });
      if (res.data) {
        const c = res.data;
        const newRoom: VoiceRoom = {
          id: c.id,
          gameId: dto.gameId,
          gameName: dto.gameId.replace(/-/g, ' ').toUpperCase(),
          name: c.name,
          tag: dto.tag || 'Casual',
          visibility: dto.visibility || 'Public',
          ping: 20,
          capacity: dto.capacity,
          onlineCount: 0,
          members: [],
        };
        localRooms = [newRoom, ...localRooms];
        return newRoom;
      }
    } catch {
      // Local fallback
    }

    const newRoom: VoiceRoom = {
      id: `room-custom-${Date.now()}`,
      gameId: dto.gameId,
      gameName: dto.gameId.replace(/-/g, ' ').toUpperCase(),
      name: dto.name,
      tag: dto.tag || 'Casual',
      visibility: dto.visibility || 'Public',
      ping: Math.floor(Math.random() * 20) + 14,
      capacity: dto.capacity,
      onlineCount: 1,
      members: [
        {
          id: `m_${Date.now()}`,
          userId: 'current-user',
          username: 'YOU',
          avatarLetter: 'U',
          avatarColor: '#00F0FF',
          isHost: true,
          role: 'Flex',
          rank: 'Diamond',
        },
      ],
    };
    localRooms = [newRoom, ...localRooms];
    return newRoom;
  },

  /**
   * Join a voice room
   */
  async joinRoom(roomId: string, currentUser?: { id: string; username: string }): Promise<VoiceRoom> {
    try {
      await apiClient.post(`/community/rooms/${roomId}/join`);
    } catch {
      // Continue with local update for seamless experience
    }

    const roomIndex = localRooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      const room = { ...localRooms[roomIndex] };
      const userExists = room.members.some(m => m.userId === (currentUser?.id || 'current-user'));
      if (!userExists) {
        const username = currentUser?.username || 'YOU';
        const newMember: VoiceMember = {
          id: `mem_${Date.now()}`,
          userId: currentUser?.id || 'current-user',
          username: username,
          avatarLetter: username[0].toUpperCase(),
          avatarColor: '#00F0FF',
          role: 'Flex',
          rank: 'Diamond',
          isCurrentUser: true,
          muted: false,
        };
        room.members = [...room.members, newMember];
        room.onlineCount = room.members.length;
        localRooms[roomIndex] = room;
      }
      return localRooms[roomIndex];
    }

    return localRooms[0];
  },

  /**
   * Leave a voice room
   */
  async leaveRoom(roomId: string, userId: string = 'current-user'): Promise<void> {
    try {
      await apiClient.post(`/community/rooms/${roomId}/leave`);
    } catch {
      // Local update
    }

    const roomIndex = localRooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      const room = { ...localRooms[roomIndex] };
      room.members = room.members.filter(m => m.userId !== userId && !m.isCurrentUser);
      room.onlineCount = room.members.length;
      localRooms[roomIndex] = room;
    }
  },

  /**
   * Kick a member from a voice room
   */
  async kickMember(roomId: string, memberUserId: string): Promise<void> {
    try {
      await apiClient.delete(`/community/rooms/${roomId}/members/${memberUserId}`);
    } catch {
      // Local update
    }
    const roomIndex = localRooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      const room = { ...localRooms[roomIndex] };
      room.members = room.members.filter(m => m.userId !== memberUserId);
      room.onlineCount = room.members.length;
      localRooms[roomIndex] = room;
    }
  },

  /**
   * Update room configuration (name, capacity, locked)
   */
  async updateRoom(roomId: string, data: { name?: string; capacity?: number; locked?: boolean }): Promise<void> {
    try {
      await apiClient.patch(`/community/rooms/${roomId}`, data);
    } catch {
      // Local update
    }
    const room = localRooms.find(r => r.id === roomId);
    if (room) {
      if (data.name) room.name = data.name;
      if (data.capacity) room.capacity = data.capacity;
      if (data.locked !== undefined) room.visibility = data.locked ? 'Clan Only' : 'Public';
    }
  },

  /**
   * Delete custom voice room
   */
  async deleteRoom(roomId: string): Promise<void> {
    try {
      await apiClient.delete(`/community/rooms/${roomId}`);
    } catch {
      // Local update
    }
    localRooms = localRooms.filter(r => r.id !== roomId);
  },

  /**
   * Get messages for a room/channel
   */
  async getMessages(channelId: string, gameId?: string): Promise<ChatMessage[]> {
    try {
      // Try fetching from the channel directly or the game general channel
      const targetChannel = gameId ? `${gameId}_general` : channelId;
      const res = await apiClient.get<any[]>(`/community/channels/${targetChannel}/messages`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(m => ({
          id: m.id,
          channelId: m.channelId,
          authorId: m.authorId,
          authorUsername: m.authorUsername,
          authorAvatarLetter: (m.authorUsername || 'U')[0].toUpperCase(),
          authorColor: '#00F0FF',
          content: m.content,
          createdAt: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      }
    } catch {
      // Fallback
    }

    return localMessages[channelId] || localMessages['room-lol-1'] || [];
  },

  /**
   * Send a chat message
   */
  async sendMessage(channelId: string, content: string, currentUser?: { id: string; username: string }, gameId?: string): Promise<ChatMessage> {
    try {
      const targetChannel = gameId ? `${gameId}_general` : channelId;
      const res = await apiClient.post<any>(`/community/channels/${targetChannel}/messages`, { content });
      if (res.data) {
        const m = res.data;
        return {
          id: m.id,
          channelId: m.channelId,
          authorId: m.authorId,
          authorUsername: m.authorUsername,
          authorAvatarLetter: (m.authorUsername || 'U')[0].toUpperCase(),
          authorColor: '#00F0FF',
          content: m.content,
          createdAt: 'just now',
        };
      }
    } catch {
      // Local fallback
    }

    const username = currentUser?.username || 'YOU';
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      authorId: currentUser?.id || 'current-user',
      authorUsername: username,
      authorAvatarLetter: username[0].toUpperCase(),
      authorColor: '#00F0FF',
      content,
      createdAt: 'just now',
    };

    if (!localMessages[channelId]) {
      localMessages[channelId] = [...(localMessages['room-lol-1'] || [])];
    }
    localMessages[channelId] = [...localMessages[channelId], newMsg];
    return newMsg;
  },

  /**
   * Delete message
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await apiClient.delete(`/community/messages/${messageId}`);
    } catch {
      // Local fallback
    }
  },

  /**
   * Update member audio state (mute/unmute)
   */
  async updateMemberMute(roomId: string, userId: string, muted: boolean): Promise<void> {
    try {
      await apiClient.patch(`/community/rooms/${roomId}/members/${userId}`, { muted });
    } catch {
      // Local fallback
    }

    const roomIndex = localRooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      const room = { ...localRooms[roomIndex] };
      room.members = room.members.map(m => {
        if (m.userId === userId || (m.isCurrentUser && userId === 'current-user')) {
          return { ...m, muted };
        }
        return m;
      });
      localRooms[roomIndex] = room;
    }
  },
};
