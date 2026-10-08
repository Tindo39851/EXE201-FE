export interface VoiceMember {
  id: string;
  userId: string;
  username: string;
  avatarLetter?: string;
  avatarColor?: string;
  role?: string;
  rank?: string;
  muted?: boolean;
  isHost?: boolean;
  isSpeaking?: boolean;
  isCurrentUser?: boolean;
  joinedAt?: string;
  connectionQuality?: string;
}

export type RoomTag = string;

export type RoomVisibility = 'Public' | 'Clan Only' | 'Rank Tryhard' | 'Private';

export interface VoiceRoom {
  id: string;
  gameId: string;
  gameName: string;
  name: string;
  tag: RoomTag;
  rankRequirement?: string;
  playMode?: string;
  visibility: RoomVisibility;
  ping: number; // in ms
  capacity: number;
  onlineCount: number;
  members: VoiceMember[];
  isLocked?: boolean;
  isDefault?: boolean;
  ownerId?: string;
  ownerUsername?: string;
  createdAt?: string;
}

export interface GameHubItem {
  id: string;
  name: string;
  shortName: string;
  count: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  authorUsername: string;
  authorAvatarLetter?: string;
  authorColor?: string;
  content: string;
  createdAt: string;
  isSystem?: boolean;
}

export interface CreateRoomDto {
  name: string;
  gameId: string;
  tag?: RoomTag;
  rankRequirement?: string;
  playMode?: string;
  capacity: number;
  visibility?: RoomVisibility;
}

export interface VoiceJoinCredentials {
  serverUrl: string;
  participantToken: string;
  expiresInSeconds: number;
  roomId: string;
  livekitRoomName: string;
}
