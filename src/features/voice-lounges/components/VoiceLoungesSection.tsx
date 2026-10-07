'use client';

import React, { useState } from 'react';
import { GameFilterTabs } from './GameFilterTabs';
import { RoomCard } from './RoomCard';
import { CreateRoomModal } from './CreateRoomModal';
import { ActiveRoom } from './ActiveRoom';
import { useVoiceRooms } from '../hooks/useVoiceRooms';
import type { VoiceRoom } from '../types/voice.types';

export const VoiceLoungesSection: React.FC = () => {
  const [activeJoinedRoom, setActiveJoinedRoom] = useState<VoiceRoom | null>(null);

  const {
    games,
    rooms,
    rawRoomsCount,
    activeGameId,
    setActiveGameId,
    searchQuery,
    setSearchQuery,
    totalPlayersOnline,
    loading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleCreateRoom,
  } = useVoiceRooms();

  // If user is currently in a room, render the inside room view (Screenshot 2)
  if (activeJoinedRoom) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ActiveRoom
          initialRoom={activeJoinedRoom}
          onLeave={() => setActiveJoinedRoom(null)}
        />
      </div>
    );
  }

  // Otherwise, render the Room Listing grid (Screenshot 1)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Subheader Breadcrumbs & Live Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">
            <span>-- HOME</span>
            <span>/</span>
            <span className="text-gt-cyan">VOICE LOUNGES</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="font-orbitron font-extrabold text-2xl lg:text-3xl text-white tracking-wider">
              VOICE LOUNGES
            </h1>
            <span className="text-[11px] font-mono text-gray-400 tracking-wider">
              VOICE ROOMS · LIVE · {rawRoomsCount} ROOMS ACTIVE
            </span>
          </div>
        </div>

        {/* Live Players Online Counter */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#0D121B]/80 border border-gray-800 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="font-bold">{totalPlayersOnline}</span>
          <span className="text-gray-400">PLAYERS ONLINE</span>
        </div>
      </div>

      {/* Filter Tabs & Search & Create */}
      <GameFilterTabs
        games={games}
        activeGameId={activeGameId}
        onSelectGame={setActiveGameId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateRoomClick={() => setIsCreateModalOpen(true)}
      />

      {/* Rooms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-56 bg-[#0D121B]/60 rounded-xl border border-gray-800"
            />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="py-20 text-center bg-[#0D121B]/40 rounded-2xl border border-dashed border-gray-800">
          <p className="font-orbitron text-gray-400 text-sm tracking-wide">
            NO ACTIVE VOICE LOUNGES FOUND
          </p>
          <p className="text-xs font-mono text-gray-500 mt-2">
            Be the first operative to deploy a room in this sector.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 px-4 py-2 bg-gt-cyan/20 border border-gt-cyan/50 text-gt-cyan hover:bg-gt-cyan hover:text-gt-bg text-xs font-mono uppercase tracking-wider rounded-lg transition-all"
          >
            + Create Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onJoin={joined => setActiveJoinedRoom(joined)}
            />
          ))}
        </div>
      )}

      {/* Modal for creating a new room */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRoom}
      />
    </div>
  );
};
