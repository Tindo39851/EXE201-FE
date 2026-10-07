'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { PlayerSlot } from './PlayerSlot';
import { RoomChat } from './RoomChat';
import { VoiceControls } from './VoiceControls';
import { useVoiceRoom } from '../hooks/useVoiceRoom';
import type { VoiceRoom } from '../types/voice.types';

interface ActiveRoomProps {
  initialRoom: VoiceRoom;
  onLeave: () => void;
}

export const ActiveRoom: React.FC<ActiveRoomProps> = ({ initialRoom, onLeave }) => {
  const {
    room,
    messages,
    isMuted,
    isDeafened,
    isScreenSharing,
    toggleMute,
    toggleDeafen,
    toggleScreenShare,
    sendMessage,
    leaveRoom,
  } = useVoiceRoom(initialRoom.id, onLeave);

  const currentRoom = room || initialRoom;

  // Build slots array matching capacity
  const displaySlots = [];
  const maxSlots = Math.min(currentRoom.capacity, 8);
  for (let i = 0; i < maxSlots; i++) {
    displaySlots.push(currentRoom.members[i] || null);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-[#07090E] border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Room Banner */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/80 bg-[#0B0F17]">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <h2 className="font-orbitron font-bold text-white text-base tracking-wide">
            {currentRoom.name}
          </h2>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded">
            {currentRoom.tag}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
          <Users className="w-4 h-4 text-gray-500" />
          <span>
            {currentRoom.onlineCount}/{currentRoom.capacity}
          </span>
        </div>
      </div>

      {/* Main Area: Player Slots + Room Chat */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Interactive Operative Grid */}
        <div className="flex-1 p-8 flex items-center justify-center overflow-x-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/10 via-[#07090E] to-[#07090E]">
          <div className="flex flex-wrap items-center justify-center gap-6 max-w-5xl">
            {displaySlots.map((member, index) => (
              <PlayerSlot
                key={member ? member.id : `empty_${index}`}
                member={member}
                isEmpty={!member}
              />
            ))}
          </div>
        </div>

        {/* Right: Text Chat Sidebar */}
        <RoomChat messages={messages} onSendMessage={sendMessage} />
      </div>

      {/* Persistent Bottom Audio Controls */}
      <VoiceControls
        room={currentRoom}
        isMuted={isMuted}
        isDeafened={isDeafened}
        isScreenSharing={isScreenSharing}
        onToggleMute={toggleMute}
        onToggleDeafen={toggleDeafen}
        onToggleScreenShare={toggleScreenShare}
        onLeaveRoom={leaveRoom}
      />
    </div>
  );
};
