export type AiChatRole = 'user' | 'assistant';

export interface AiChatMessage {
  role: AiChatRole;
  content: string;
}

export interface AiChatResponse {
  reply: string;
  model: string;
}

export interface AiStatusResponse {
  configured: boolean;
  model: string;
}
