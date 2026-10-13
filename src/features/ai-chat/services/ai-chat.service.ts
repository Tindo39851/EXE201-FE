import { apiClient } from '@/services/api-client';
import type { AiChatMessage, AiChatResponse, AiStatusResponse } from '../types/ai-chat.types';

export const aiChatService = {
  async getStatus(): Promise<AiStatusResponse> {
    const response = await apiClient.get<AiStatusResponse>('/ai/status');
    return response.data;
  },

  async chat(messages: AiChatMessage[]): Promise<AiChatResponse> {
    const response = await apiClient.post<AiChatResponse>('/ai/chat', { messages });
    return response.data;
  },
};
