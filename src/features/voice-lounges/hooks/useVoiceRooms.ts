'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { voiceService } from '../services/voice.service';
import type { VoiceRoom, GameHubItem, CreateRoomDto } from '../types/voice.types';

export function useVoiceRooms() {
  const [games, setGames] = useState<GameHubItem[]>([]);
  const [rooms, setRooms] = useState<VoiceRoom[]>([]);
  const [activeGameId, setActiveGameId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Fetch games categories
  const loadGames = useCallback(async () => {
    const list = await voiceService.getGameHubs();
    setGames(list);
  }, []);

  // Fetch rooms
  const loadRooms = useCallback(async () => {
    try {
      const roomList = await voiceService.getVoiceRooms(activeGameId);
      setRooms(roomList);
    } finally {
      setLoading(false);
    }
  }, [activeGameId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadGames(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadGames]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadRooms(), 0);
    // Poll rooms list every 5 seconds
    const interval = setInterval(loadRooms, 5000);
    return () => {
      window.clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [loadRooms]);

  // Compute total online count across all rooms
  const totalPlayersOnline = useMemo(() => {
    return rooms.reduce((sum, r) => sum + r.onlineCount, 0) + 25; // 37 in mockup
  }, [rooms]);

  // Filtered rooms based on game and search query
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesGame = activeGameId === 'all' || room.gameId.toLowerCase() === activeGameId.toLowerCase();
      const matchesSearch = !searchQuery.trim() || 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGame && matchesSearch;
    });
  }, [rooms, activeGameId, searchQuery]);

  const handleCreateRoom = async (dto: CreateRoomDto) => {
    const created = await voiceService.createRoom(dto);
    await loadRooms();
    setIsCreateModalOpen(false);
    return created;
  };

  return {
    games,
    rooms: filteredRooms,
    rawRoomsCount: rooms.length,
    activeGameId,
    setActiveGameId,
    searchQuery,
    setSearchQuery,
    totalPlayersOnline,
    loading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleCreateRoom,
    refreshRooms: loadRooms,
  };
}
