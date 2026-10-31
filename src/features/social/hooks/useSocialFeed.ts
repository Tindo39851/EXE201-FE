'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '@/services/api-client';
import { socialService } from '../services/social.service';
import type { SocialPost, OnlinePlayer, TrendingTag } from '../types/social.types';

export function useSocialFeed() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<string | number>>(() => new Set());

  const loadFeed = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setFeedError(null);
    try {
      const feedPosts = await socialService.getPosts(activeTab === 'ALL' ? undefined : activeTab);
      setPosts(feedPosts);
      const [players, tags] = await Promise.allSettled([
        socialService.getOnlinePlayers(), socialService.getTrendingTags(),
      ]);
      setOnlinePlayers(players.status === 'fulfilled' ? players.value : []);
      setTrendingTags(tags.status === 'fulfilled' ? tags.value : []);
    } catch (error: unknown) {
      if (!silent) setPosts([]);
      setFeedError(getApiErrorMessage(error, 'Could not load the community feed'));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    // Load once, then receive social changes over SSE. Keep a low-frequency
    // polling fallback for proxies or deployments that interrupt long streams.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFeed();
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const eventSource = new EventSource(`${apiBase.replace(/\/$/, '')}/social/events`, { withCredentials: true });
    eventSource.addEventListener('social-update', (event) => {
      const message = event as MessageEvent<string>;
      try {
        const detail = JSON.parse(message.data) as { type?: string; postId?: string };
        window.dispatchEvent(new CustomEvent('social:updated', { detail }));
      } catch {
        // Still refresh the feed if an event arrives with an unexpected payload.
      }
      void loadFeed(true);
    });
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadFeed(true);
    }, 30000);
    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') void loadFeed(true);
    };
    document.addEventListener('visibilitychange', refreshOnFocus);
    window.addEventListener('focus', refreshOnFocus);
    return () => {
      eventSource.close();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshOnFocus);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [loadFeed]);

  const toggleLike = async (postId: string | number) => {
    const post = posts.find(item => item.id === postId);
    if (!post || pendingLikeIds.has(postId)) return;
    setPendingLikeIds(prev => new Set(prev).add(postId));
    try {
      const result = await socialService.setPostLike(postId, !post.liked);
      setPosts(prev => prev.map(post => post.id === postId
        ? { ...post, liked: result.liked, likes: result.count }
        : post));
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Could not update like'));
    } finally {
      setPendingLikeIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  const deletePost = async (postId: string | number) => {
    try {
      await socialService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Could not delete post'));
    }
  };

  const createBroadcast = async (content: string) => {
    if (!content.trim()) return;
    setIsPosting(true);
    try {
      const newPost = await socialService.createPost({ content });
      setPosts(prev => [newPost, ...prev]);
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Failed to publish post'));
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
    feedError,
    pendingLikeIds,
    setActiveTab,
    toggleLike,
    deletePost,
    createBroadcast,
    refetch: loadFeed,
  };
}
