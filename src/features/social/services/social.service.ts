import { apiClient, getApiErrorMessage, getApiErrorStatus } from '@/services/api-client';
import type { SocialComment, SocialPost, OnlinePlayer, TrendingTag, CreatePostDto } from '../types/social.types';

export const socialService = {
  async getPosts(category?: string): Promise<SocialPost[]> {
    const response = await apiClient.get<SocialPost[]>('/social/feed', { params: { category } });
    return response.data;
  },

  async createPost(dto: CreatePostDto): Promise<SocialPost> {
    try {
      const response = await apiClient.post<SocialPost>('/social/posts', dto);
      return response.data;
    } catch (err: unknown) {
      if (getApiErrorStatus(err) === 401) throw new Error('Please sign in to publish a post');
      throw new Error(getApiErrorMessage(err, 'Failed to publish post'));
    }
  },

  async deletePost(postId: string | number): Promise<void> {
    try {
      await apiClient.delete(`/social/posts/${postId}`);
    } catch (err: unknown) {
      throw new Error(getApiErrorMessage(err, 'Failed to delete post'));
    }
  },

  async setPostLike(postId: string | number, liked: boolean): Promise<{ liked: boolean; count: number }> {
    try {
      const response = liked
        ? await apiClient.put<{ liked: boolean; count: number }>(`/social/posts/${postId}/like`)
        : await apiClient.delete<{ liked: boolean; count: number }>(`/social/posts/${postId}/like`);
      return response.data;
    } catch (err: unknown) {
      if (getApiErrorStatus(err) === 401) throw new Error('Please sign in to like posts');
      throw new Error(getApiErrorMessage(err, 'Failed to update post reaction'));
    }
  },

  async getComments(postId: string | number): Promise<SocialComment[]> {
    const response = await apiClient.get<SocialComment[]>(`/social/posts/${postId}/comments`);
    return response.data;
  },

  async createComment(postId: string | number, content: string): Promise<SocialComment> {
    try {
      const response = await apiClient.post<SocialComment>(`/social/posts/${postId}/comments`, { content });
      return response.data;
    } catch (err: unknown) {
      if (getApiErrorStatus(err) === 401) throw new Error('Please sign in to comment');
      throw new Error(getApiErrorMessage(err, 'Failed to publish comment'));
    }
  },

  async getOnlinePlayers(): Promise<OnlinePlayer[]> {
    const response = await apiClient.get<OnlinePlayer[]>('/social/online-players');
    return response.data;
  },

  async getTrendingTags(): Promise<TrendingTag[]> {
    const response = await apiClient.get<TrendingTag[]>('/social/trending-tags');
    return response.data;
  },
};
