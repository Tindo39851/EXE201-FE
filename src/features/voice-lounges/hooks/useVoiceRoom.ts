'use client';

import { useState, useEffect, useCallback } from 'react';
import { voiceService } from '../services/voice.service';
import type { VoiceRoom, ChatMessage } from '../types/voice.types';
import { useAuth } from '@/contexts/AuthContext';

export function useVoiceRoom(roomId: string | null, onLeave?: () => void) {
  const { user } = useAuth();
  const [room, setRoom] = useState<VoiceRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDeafened, setIsDeafened] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load room details & sync presence
  const loadRoom = useCallback(async () => {
    if (!roomId) return;
    const data = await voiceService.getRoomDetails(roomId);
    if (data) {
      // Mark current user if present or append current user
      const currentUserName = user?.username || 'YOU';
      const hasCurrentUser = data.members.some(m => m.username === currentUserName || m.isCurrentUser);
      if (!hasCurrentUser) {
        data.members.push({
          id: `mem_current_${Date.now()}`,
          userId: user?.id || 'current-user',
          username: currentUserName,
          avatarLetter: currentUserName[0].toUpperCase(),
          avatarColor: '#00F0FF',
          role: 'Flex',
          rank: 'Diamond',
          isCurrentUser: true,
          muted: isMuted,
        });
        data.onlineCount = data.members.length;
      }
      setRoom(data);
    }
    setLoading(false);
  }, [roomId, user, isMuted]);

  // Load chat messages
  const loadMessages = useCallback(async () => {
    if (!roomId) return;
    const msgs = await voiceService.getMessages(roomId, room?.gameId);
    setMessages(msgs);
  }, [roomId, room?.gameId]);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      return;
    }

    setLoading(true);
    // Initial join
    voiceService.joinRoom(roomId, user ? { id: user.id, username: user.username } : undefined)
      .then(() => {
        loadRoom();
        loadMessages();
      });

    // Polling room state & chat
    const roomInterval = setInterval(loadRoom, 4000);
    const msgInterval = setInterval(loadMessages, 3000);

    return () => {
      clearInterval(roomInterval);
      clearInterval(msgInterval);
    };
  }, [roomId, loadRoom, loadMessages, user]);

  const toggleMute = async () => {
    if (!roomId) return;
    const nextState = !isMuted;
    setIsMuted(nextState);
    await voiceService.updateMemberMute(roomId, user?.id || 'current-user', nextState);
    loadRoom();
  };

  const toggleDeafen = () => {
    setIsDeafened(prev => !prev);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(prev => !prev);
  };

  const sendMessage = async (content: string) => {
    if (!roomId || !content.trim()) return;
    const sent = await voiceService.sendMessage(
      roomId, 
      content, 
      user ? { id: user.id, username: user.username } : undefined,
      room?.gameId
    );
    setMessages(prev => [...prev, sent]);
  };

  const leaveRoom = async () => {
    if (roomId) {
      await voiceService.leaveRoom(roomId, user?.id || 'current-user');
    }
    setRoom(null);
    if (onLeave) {
      onLeave();
    }
  };

  return {
    room,
    messages,
    loading,
    isMuted,
    isDeafened,
    isScreenSharing,
    toggleMute,
    toggleDeafen,
    toggleScreenShare,
    sendMessage,
    leaveRoom,
    refreshRoom: loadRoom,
  };
}
