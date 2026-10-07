'use client';

import React from 'react';
import { Wifi, Users, MicOff } from 'lucide-react';
import type { VoiceRoom, VoiceMember } from '../types/voice.types';

interface RoomCardProps {
  room: VoiceRoom;
  onJoin: (room: VoiceRoom) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  const isFull = room.onlineCount >= room.capacity;
  const fillPercentage = Math.min(100, Math.round((room.onlineCount / room.capacity) * 100));

  // Determine tag style colors
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Diamond Rank':
        return 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30';
      case 'Casual':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
      case 'Climbing':
      case 'Heroic Ranked':
        return 'bg-rose-950/40 text-rose-400 border-rose-500/30';
      case 'Clan Internal':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/30';
      case 'Rank Tryhard':
        return 'bg-purple-950/40 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-800/40 text-gray-300 border-gray-700/50';
    }
  };

  // Determine progress bar color
  const getProgressBarColor = () => {
    if (isFull) return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
    if (fillPercentage >= 75) return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]';
    return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]';
  };

  // Build slot items up to room capacity (clamped to max 8 for clean card display)
  const displayCapacity = Math.min(room.capacity, 8);
  const slots: (VoiceMember | null)[] = [];
  for (let i = 0; i < displayCapacity; i++) {
    slots.push(room.members[i] || null);
  }

  return (
    <div className="group relative bg-[#0B0F17]/90 border border-gray-800/80 hover:border-gt-cyan/50 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between">
      {/* Top Header: Title & Ping */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="font-orbitron font-semibold text-white text-base tracking-wide truncate group-hover:text-gt-cyan transition-colors">
            {room.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 shrink-0">
            <Wifi className="w-3.5 h-3.5" />
            <span>{room.ping}ms</span>
          </div>
        </div>

        {/* Badges: Tag & Visibility */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getTagStyle(room.tag)}`}>
            {room.tag}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                room.visibility === 'Public' ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-amber-400'
              }`}
            />
            <span>{room.visibility}</span>
          </div>
        </div>

        {/* Avatars Row & Capacity */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {slots.map((member, index) => {
              if (member) {
                const isHost = member.isHost || index === 0;
                return (
                  <div
                    key={member.id || index}
                    className="relative flex items-center justify-center"
                    title={member.username}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-orbitron font-bold text-xs transition-transform duration-200 group-hover:scale-105 ${
                        isHost
                          ? 'border-2 border-amber-400 text-amber-400 bg-amber-950/20 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                          : 'border border-gray-700 bg-gray-900/90 text-cyan-300'
                      }`}
                    >
                      {member.avatarLetter || member.username[0].toUpperCase()}
                    </div>
                    {member.muted && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-rose-500 text-white rounded-full p-0.5">
                        <MicOff className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                );
              }

              // Empty Slot
              return (
                <div
                  key={`empty_${index}`}
                  className="w-9 h-9 rounded-full border border-dashed border-gray-800 flex items-center justify-center text-gray-600 text-xs font-mono"
                >
                  +
                </div>
              );
            })}
          </div>

          <span className="text-xs font-mono text-gray-400">
            {room.onlineCount}/{room.capacity}
          </span>
        </div>

        {/* Capacity Progress Bar */}
        <div className="w-full h-1 bg-gray-800/80 rounded-full overflow-hidden mb-6">
          <div
            className={`h-full transition-all duration-500 rounded-full ${getProgressBarColor()}`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>

      {/* Card Footer: Game & Join Button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800/40">
        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
          <Users className="w-3.5 h-3.5 text-gray-500" />
          <span>{room.gameName}</span>
        </div>

        {isFull ? (
          <button
            disabled
            className="px-4 py-1.5 rounded-lg font-orbitron font-bold text-[11px] tracking-wider uppercase bg-gray-800/60 text-gray-500 cursor-not-allowed border border-gray-700/30"
          >
            ROOM FULL
          </button>
        ) : (
          <button
            onClick={() => onJoin(room)}
            className="px-4 py-1.5 rounded-lg font-orbitron font-bold text-[11px] tracking-wider uppercase bg-cyan-950/40 text-gt-cyan border border-gt-cyan/40 hover:bg-gt-cyan hover:text-gt-bg hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-200 active:scale-95"
          >
            JOIN ROOM
          </button>
        )}
      </div>
    </div>
  );
};
