'use client';

import React from 'react';
import { MicOff, Volume2 } from 'lucide-react';
import type { VoiceMember } from '../types/voice.types';

interface PlayerSlotProps {
  member?: VoiceMember | null;
  isEmpty?: boolean;
}

export const PlayerSlot: React.FC<PlayerSlotProps> = ({ member, isEmpty }) => {
  if (isEmpty || !member) {
    return (
      <div className="w-48 h-56 rounded-xl border-2 border-dashed border-gray-800/80 bg-[#0B0F17]/40 flex flex-col items-center justify-center text-gray-600 hover:border-gt-cyan/30 transition-colors">
        <div className="w-16 h-16 rounded-full border border-dashed border-gray-800 flex items-center justify-center text-xl font-mono text-gray-600 mb-3">
          +
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-gray-600">
          Empty Slot
        </span>
      </div>
    );
  }

  const isCurrentUser = member.isCurrentUser || member.username === 'YOU';
  const isHost = member.isHost;

  return (
    <div
      className={`relative w-48 h-56 rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-300 ${
        isCurrentUser
          ? 'bg-[#0B0F17] border-2 border-gt-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)]'
          : isHost
          ? 'bg-[#0B0F17] border-2 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
          : 'bg-[#0B0F17]/90 border border-gray-800/80 hover:border-gray-700'
      }`}
    >
      {/* Top badges / status */}
      <div className="w-full flex items-center justify-between">
        {member.isSpeaking ? (
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            <Volume2 className="w-3 h-3 animate-pulse" />
            <span>SPEAKING</span>
          </span>
        ) : (
          <span />
        )}

        {isCurrentUser && (
          <span className="text-[10px] font-orbitron font-bold text-gt-cyan bg-cyan-950/80 px-2 py-0.5 rounded border border-gt-cyan/50 tracking-wider">
            YOU
          </span>
        )}
      </div>

      {/* Avatar Circle */}
      <div className="relative my-auto">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center font-orbitron font-bold text-2xl transition-all duration-300 ${
            isCurrentUser
              ? 'border-2 border-gt-cyan bg-cyan-950/20 text-gt-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : isHost
              ? 'border-2 border-amber-400 bg-amber-950/30 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'border border-gray-700 bg-gray-900 text-gray-300'
          }`}
        >
          {member.avatarLetter || member.username[0].toUpperCase()}
        </div>

        {/* Muted Icon Badge */}
        {member.muted && (
          <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-1 shadow-md">
            <MicOff className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="text-center w-full">
        <h4 className="font-orbitron font-bold text-sm tracking-wider text-white truncate">
          {member.username}
        </h4>
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-gray-400 mt-1">
          <span>{member.role || 'Player'}</span>
          <span>·</span>
          <span className="text-gray-300">{member.rank || 'Unranked'}</span>
        </div>
      </div>
    </div>
  );
};
