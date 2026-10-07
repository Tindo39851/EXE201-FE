'use client';

import { useState, useEffect, useCallback } from 'react';
import { voiceService } from '../services/voice.service';
import type { VoiceRoom, ChatMessage } from '../types/voice.types';

const sameMessages = (current: ChatMessage[], incoming: ChatMessage[]) =>
  current.length === incoming.length && current.every((message, index) => {
    const next = incoming[index];
    return message.id === next.id
      && message.content === next.content
      && message.createdAt === next.createdAt
      && message.authorUsername === next.authorUsername;
  });

export function useVoiceRoom(roomId: string | null) {
  const [room, setRoom] = useState<VoiceRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load room details & sync presence
  const loadRoom = useCallback(async () => {
    if (!roomId) return;
    const data = await voiceService.getRoomDetails(roomId);
    if (data) setRoom(data);
    setLoading(false);
  }, [roomId]);

  // Load chat messages
  const loadMessages = useCallback(async () => {
    if (!roomId) return;
    const msgs = await voiceService.getMessages(roomId, room?.gameId);
    setMessages(current => sameMessages(current, msgs) ? current : msgs);
  }, [roomId, room?.gameId]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const initialLoad = window.setTimeout(() => {
      void loadRoom();
      void loadMessages();
    }, 0);

    // Polling room state & chat
    const roomInterval = setInterval(loadRoom, 4000);
    const msgInterval = setInterval(loadMessages, 3000);

    return () => {
      clearInterval(roomInterval);
      clearInterval(msgInterval);
      window.clearTimeout(initialLoad);
    };
  }, [roomId, loadRoom, loadMessages]);

  const sendMessage = async (content: string) => {
    if (!roomId || !content.trim()) return;
    const sent = await voiceService.sendMessage(
      roomId, 
      content, 
      undefined,
      room?.gameId
    );
    setMessages(prev => [...prev, sent]);
  };

  return {
    room,
    messages,
    loading,
    sendMessage,
    refreshRoom: loadRoom,
  };
}
