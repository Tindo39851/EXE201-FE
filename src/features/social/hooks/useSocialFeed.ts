'use client';

import { useState, useEffect, useCallback } from 'react';
import { socialService } from '../services/social.service';
import type { SocialPost, OnlinePlayer, TrendingTag } from '../types/social.types';

export function useSocialFeed() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const [feedPosts, players, tags] = await Promise.all([
        socialService.getPosts(activeTab === 'ALL' ? undefined : activeTab),
        socialService.getOnlinePlayers(),
        socialService.getTrendingTags(),
      ]);
      setPosts(feedPosts);
      setOnlinePlayers(players);
      setTrendingTags(tags);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    // Refresh whenever the selected feed category changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFeed();
  }, [loadFeed]);

  const toggleLike = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
        };
      }
      return p;
    }));

    try {
      await socialService.toggleLikePost(postId);
    } catch {
      // Revert if API fails
    }
  };

  const createBroadcast = async (content: string) => {
    if (!content.trim()) return;
    setIsPosting(true);
    try {
      const newPost = await socialService.createPost({ content });
      setPosts(prev => [newPost, ...prev]);
    } finally {
      setIsPosting(false);
    }
  };

  return {
    posts,
    onlinePlayers,
    trendingTags,
    activeTab,
    isLoading,
    isPosting,
    setActiveTab,
    toggleLike,
    createBroadcast,
    refetch: loadFeed,
  };
}
