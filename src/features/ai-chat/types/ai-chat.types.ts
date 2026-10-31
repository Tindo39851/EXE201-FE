export type AiChatRole = 'user' | 'assistant';

export interface AiChatMessage {
  role: AiChatRole;
  content: string;
  recommendations?: AiRoomRecommendation[];
}

export interface AiChatResponse {
  reply: string;
  model: string;
  recommendations?: AiRoomRecommendation[];
}

export interface AiRoomRecommendation {
  id: string;
  roomName: string;
  gameId: string;
  gameName: string;
  rankRequirement: string;
  playMode: string;
  onlineCount: number;
  capacity: number;
  availableSlots: number;
  joinUrl: string;
}

export interface AiStatusResponse {
  configured: boolean;
  model: string;
}

export interface AiPlayerAnalysisResponse {
  toxicityScore: number;
  isToxic: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  summary: string;
  evidence: string[];
  recommendation: 'NO_ACTION' | 'WARN' | 'REVIEW_FOR_POSSIBLE_BAN';
  humanReviewRequired: boolean;
  model: string;
}
