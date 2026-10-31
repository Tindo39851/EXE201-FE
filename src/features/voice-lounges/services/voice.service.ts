import { apiClient } from '@/services/api-client';
import type { 
  VoiceRoom, 
  GameHubItem, 
  ChatMessage, 
  CreateRoomDto,
  VoiceJoinCredentials
} from '../types/voice.types';

interface ApiVoiceMember {
  id?: string;
  userId: string;
  username?: string;
  muted?: boolean;
}

interface ApiChannel {
  id: string;
  gameId?: string;
  name: string;
  type: 'TEXT' | 'VOICE';
  locked?: boolean;
  capacity?: number;
  rankRequirement?: string;
  playMode?: string;
  onlineCount?: number;
  members?: ApiVoiceMember[];
  ownerId?: string;
  ownerUsername?: string;
  isDefault?: boolean;
  createdAt?: string;
}

interface ApiGameHub {
  id: string;
  name: string;
  shortName?: string;
  channels?: ApiChannel[];
}

interface ApiChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  createdAt: string;
}

const SUPPORTED_GAME_IDS = new Set(['free-fire', 'league-of-legends', 'lien-quan', 'valorant']);
const SUPPORTED_ROOM_IDS = new Set([
  'room-lol-1', 'room-lol-2',
  'room-ff-1', 'room-ff-2',
  'room-aov-1', 'room-aov-2',
  'room-val-1', 'room-val-2',
]);

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
    id: 'room-aov-1',
    gameId: 'lien-quan',
    gameName: 'Liên Quân Mobile',
    name: 'Leo rank Cao Thủ ⚔️',
    tag: 'Cao Thủ',
    visibility: 'Public',
    ping: 16,
    capacity: 5,
    onlineCount: 4,
    members: [
      { id: 'm30', userId: 'u30', username: 'NAKROTH', avatarLetter: 'N', avatarColor: '#FFD700', isHost: true, role: 'Rừng', rank: 'Cao Thủ' },
      { id: 'm31', userId: 'u31', username: 'FLORENTINO', avatarLetter: 'F', avatarColor: '#00F0FF', role: 'Đường Tà Thần', rank: 'Cao Thủ' },
      { id: 'm32', userId: 'u32', username: 'ELSU', avatarLetter: 'E', avatarColor: '#00F0FF', role: 'Xạ Thủ', rank: 'Tinh Anh' },
      { id: 'm33', userId: 'u33', username: 'ALICE', avatarLetter: 'A', avatarColor: '#00F0FF', muted: true, role: 'Trợ Thủ', rank: 'Cao Thủ' },
    ],
  },
  {
    id: 'room-aov-2',
    gameId: 'lien-quan',
    gameName: 'Liên Quân Mobile',
    name: 'Chiến Tướng - 5v5 Tryhard 🔥',
    tag: 'Chiến Tướng',
    visibility: 'Public',
    ping: 24,
    capacity: 5,
    onlineCount: 2,
    members: [
      { id: 'm34', userId: 'u34', username: 'RAZ_QUYEN', avatarLetter: 'R', avatarColor: '#FFD700', isHost: true, role: 'Đường Giữa', rank: 'Chiến Tướng' },
      { id: 'm35', userId: 'u35', username: 'ZUKA_PANDA', avatarLetter: 'Z', avatarColor: '#00F0FF', role: 'Đường Tà Thần', rank: 'Chiến Tướng' },
    ],
  },
];

let localRooms: VoiceRoom[] = INITIAL_ROOMS.filter(room =>
  SUPPORTED_GAME_IDS.has(room.gameId) && SUPPORTED_ROOM_IDS.has(room.id)
);

export const voiceService = {
  /**
   * Get all game categories with room counts
   */
  async getGameHubs(): Promise<GameHubItem[]> {
    const res = await apiClient.get<ApiGameHub[]>('/community/games');
    const items: GameHubItem[] = (Array.isArray(res.data) ? res.data : [])
      .filter(g => SUPPORTED_GAME_IDS.has(g.id))
      .map(g => {
        const voiceChannels = (g.channels || []).filter(c => c.type === 'VOICE');
        return {
          id: g.id,
          name: g.id === 'lien-quan' ? 'Liên Quân Mobile' : g.name,
          shortName: g.shortName || g.name.substring(0, 3).toUpperCase(),
          count: voiceChannels.length,
        };
      });
    const totalCount = items.reduce((sum, g) => sum + g.count, 0);
    return [{ id: 'all', name: 'ALL GAMES', shortName: 'ALL', count: totalCount }, ...items];
  },

  /**
   * Get all active voice rooms, with optional gameId filter
   */
  async getVoiceRooms(gameId?: string): Promise<VoiceRoom[]> {
    if (gameId && gameId !== 'all') {
        const res = await apiClient.get<ApiChannel[]>(`/community/games/${gameId}/channels`);
        if (Array.isArray(res.data)) {
          const voiceChannels = res.data.filter(c => c.type === 'VOICE');
          return voiceChannels.map(c => ({
              id: c.id,
              gameId: c.gameId || gameId,
              gameName: c.gameId ? c.gameId.replace(/-/g, ' ').toUpperCase() : 'GAME HUB',
              name: c.name,
              tag: 'Casual',
              visibility: c.locked ? 'Clan Only' : 'Public',
              ping: Math.floor(Math.random() * 20) + 15,
              capacity: c.capacity || 10,
              onlineCount: c.onlineCount || (c.members ? c.members.length : 0),
              isLocked: !!c.locked,
              isDefault: !!c.isDefault,
              ownerId: c.ownerId,
              ownerUsername: c.ownerUsername,
              createdAt: c.createdAt,
              members: (c.members || []).map((m, idx) => ({
                id: m.id || `m_${idx}`,
                userId: m.userId,
                username: m.username || `User_${idx}`,
                avatarLetter: (m.username || 'U')[0].toUpperCase(),
                avatarColor: idx === 0 ? '#FFD700' : '#00F0FF',
                isHost: m.userId === c.ownerId,
                muted: !!m.muted,
              })),
            }));
        }
        return [];
    } else {
        // Fetch all games and collect their voice channels
        const res = await apiClient.get<ApiGameHub[]>('/community/games');
        if (Array.isArray(res.data) && res.data.length > 0) {
          const beVoiceChannels: VoiceRoom[] = [];
          for (const g of res.data) {
            const vChannels = (g.channels || []).filter(c => c.type === 'VOICE');
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
                isLocked: !!c.locked,
                isDefault: !!c.isDefault,
                ownerId: c.ownerId,
                ownerUsername: c.ownerUsername,
                createdAt: c.createdAt,
                members: (c.members || []).map((m, idx) => ({
                  id: m.id || `m_${idx}`,
                  userId: m.userId,
                  username: m.username || `User_${idx}`,
                  avatarLetter: (m.username || 'U')[0].toUpperCase(),
                  avatarColor: idx === 0 ? '#FFD700' : '#00F0FF',
                  isHost: m.userId === c.ownerId,
                  muted: !!m.muted,
                })),
              });
            }
          }
          return beVoiceChannels;
        }
        return [];
    }
  },

  /**
   * Get details for a single room
   */
  async getRoomDetails(roomId: string): Promise<VoiceRoom | null> {
    const res = await apiClient.get<ApiChannel>(`/community/rooms/${roomId}`);
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
          isLocked: !!c.locked,
          isDefault: !!c.isDefault,
          ownerId: c.ownerId,
          ownerUsername: c.ownerUsername,
          createdAt: c.createdAt,
          members: (c.members || []).map((m, idx) => ({
            id: m.id || `m_${idx}`,
            userId: m.userId,
            username: m.username || `User_${idx}`,
            avatarLetter: (m.username || 'U')[0].toUpperCase(),
            avatarColor: idx === 0 ? '#FFD700' : '#00F0FF',
            isHost: m.userId === c.ownerId,
            muted: !!m.muted,
          })),
    };
  },

  /**
   * Create a new voice room
   */
  async createRoom(dto: CreateRoomDto): Promise<VoiceRoom> {
    const res = await apiClient.post<ApiChannel>(`/community/games/${dto.gameId}/rooms`, {
      name: dto.name,
      capacity: dto.capacity,
      rankRequirement: dto.rankRequirement,
      playMode: dto.playMode,
    });
    const c = res.data;
    const newRoom: VoiceRoom = {
      id: c.id,
      gameId: dto.gameId,
      gameName: dto.gameId.replace(/-/g, ' ').toUpperCase(),
      name: c.name,
      tag: dto.tag || dto.rankRequirement || 'Casual',
      rankRequirement: c.rankRequirement || dto.rankRequirement,
      playMode: c.playMode || dto.playMode,
      visibility: dto.visibility || 'Public',
      ping: 20,
      capacity: dto.capacity,
      onlineCount: 0,
      members: [],
    };
    localRooms = [newRoom, ...localRooms];
    return newRoom;
  },

  /**
   * Request a short-lived, microphone-only LiveKit token from the authenticated backend.
   * This deliberately has no mock fallback: a failed token request must never look connected.
   */
  async createVoiceToken(roomId: string): Promise<VoiceJoinCredentials> {
    const response = await apiClient.post<VoiceJoinCredentials>(
      `/community/rooms/${roomId}/voice-token`
    );
    return response.data;
  },

  /**
   * Join a voice room
   */
  async joinRoom(roomId: string, currentUser?: { id: string; username: string }): Promise<VoiceRoom> {
    await apiClient.post(`/community/rooms/${roomId}/join`);
    void currentUser;
    const room = await this.getRoomDetails(roomId);
    if (!room) throw new Error('Voice room not found after joining.');
    return room;
  },

  /**
   * Leave a voice room
   */
  async leaveRoom(roomId: string, userId: string = 'current-user'): Promise<void> {
    await apiClient.post(`/community/rooms/${roomId}/leave`);

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
    await apiClient.delete(`/community/rooms/${roomId}/members/${memberUserId}`);
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
    await apiClient.patch(`/community/rooms/${roomId}`, data);
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
    await apiClient.delete(`/community/rooms/${roomId}`);
    localRooms = localRooms.filter(r => r.id !== roomId);
  },

  /**
   * Get messages for a room/channel
   */
  async getMessages(channelId: string, gameId?: string): Promise<ChatMessage[]> {
    const targetChannel = gameId ? `${gameId}_general` : channelId;
    const res = await apiClient.get<ApiChatMessage[]>(`/community/channels/${targetChannel}/messages`);
    return (Array.isArray(res.data) ? res.data : []).map(m => ({
          id: m.id,
          channelId: m.channelId,
          authorId: m.authorId,
          authorUsername: m.authorUsername,
          authorAvatarLetter: (m.authorUsername || 'U')[0].toUpperCase(),
          authorColor: '#00F0FF',
          content: m.content,
          createdAt: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  },

  /**
   * Send a chat message
   */
  async sendMessage(channelId: string, content: string, gameId?: string): Promise<ChatMessage> {
    const targetChannel = gameId ? `${gameId}_general` : channelId;
    const res = await apiClient.post<ApiChatMessage>(`/community/channels/${targetChannel}/messages`, { content });
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
  },

  /**
   * Delete message
   */
  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/community/messages/${messageId}`);
  },

  /**
   * Update member audio state (mute/unmute)
   */
  async updateMemberMute(roomId: string, userId: string, muted: boolean): Promise<void> {
    await apiClient.patch(`/community/rooms/${roomId}/members/${userId}`, { muted });

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
