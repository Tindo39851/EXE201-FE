'use client';

import React, { useState } from 'react';
import { getApiErrorMessage } from '@/services/api-client';
import { Mic, Check } from 'lucide-react';
import type { PlayerProfile } from '../types/squad.types';

const colorStyles = {
  cyan: {
    border: 'border-gt-cyan/40',
    topLine: 'from-gt-cyan',
    badge: 'bg-gt-cyan/15 text-gt-cyan border-gt-cyan/50',
    dot: 'bg-gt-cyan shadow-[0_0_8px_#00F0FF]',
    glowHover: 'group-hover:border-gt-cyan/60 group-hover:shadow-[0_10px_30px_-5px_rgba(0,240,255,0.25)]',
    text: 'text-gt-cyan',
  },
  magenta: {
    border: 'border-gt-magenta/40',
    topLine: 'from-gt-magenta',
    badge: 'bg-gt-magenta/15 text-gt-magenta border-gt-magenta/50',
    dot: 'bg-gt-magenta shadow-[0_0_8px_#FF007F]',
    glowHover: 'group-hover:border-gt-magenta/60 group-hover:shadow-[0_10px_30px_-5px_rgba(255,0,127,0.25)]',
    text: 'text-gt-magenta',
  },
  green: {
    border: 'border-gt-green/40',
    topLine: 'from-gt-green',
    badge: 'bg-gt-green/15 text-gt-green border-gt-green/50',
    dot: 'bg-gt-green shadow-[0_0_8px_#00FF66]',
    glowHover: 'group-hover:border-gt-green/60 group-hover:shadow-[0_10px_30px_-5px_rgba(0,255,102,0.25)]',
    text: 'text-gt-green',
  },
  red: {
    border: 'border-gt-red/40',
    topLine: 'from-gt-red',
    badge: 'bg-gt-red/15 text-gt-red border-gt-red/50',
    dot: 'bg-gt-red shadow-[0_0_8px_#FF2A4D]',
    glowHover: 'group-hover:border-gt-red/60 group-hover:shadow-[0_10px_30px_-5px_rgba(255,42,77,0.25)]',
    text: 'text-gt-red',
  },
  yellow: {
    border: 'border-gt-yellow/40',
    topLine: 'from-gt-yellow',
    badge: 'bg-gt-yellow/15 text-gt-yellow border-gt-yellow/50',
    dot: 'bg-gt-yellow shadow-[0_0_8px_#FFD700]',
    glowHover: 'group-hover:border-gt-yellow/60 group-hover:shadow-[0_10px_30px_-5px_rgba(255,215,0,0.25)]',
    text: 'text-gt-yellow',
  },
  purple: {
    border: 'border-gt-purple/40',
    topLine: 'from-gt-purple',
    badge: 'bg-gt-purple/15 text-gt-purple border-gt-purple/50',
    dot: 'bg-gt-purple shadow-[0_0_8px_#9D00FF]',
    glowHover: 'group-hover:border-gt-purple/60 group-hover:shadow-[0_10px_30px_-5px_rgba(157,0,255,0.25)]',
    text: 'text-gt-purple',
  },
  orange: {
    border: 'border-gt-orange/40',
    topLine: 'from-gt-orange',
    badge: 'bg-gt-orange/15 text-gt-orange border-gt-orange/50',
    dot: 'bg-gt-orange shadow-[0_0_8px_#FF7700]',
    glowHover: 'group-hover:border-gt-orange/60 group-hover:shadow-[0_10px_30px_-5px_rgba(255,119,0,0.25)]',
    text: 'text-gt-orange',
  },
  blue: {
    border: 'border-gt-blue/40',
    topLine: 'from-gt-blue',
    badge: 'bg-gt-blue/15 text-gt-blue border-gt-blue/50',
    dot: 'bg-gt-blue shadow-[0_0_8px_#3A88FF]',
    glowHover: 'group-hover:border-gt-blue/60 group-hover:shadow-[0_10px_30px_-5px_rgba(58,136,255,0.25)]',
    text: 'text-gt-blue',
  },
};

interface PlayerCardComponentProps {
  player: PlayerProfile;
  onInvite?: (playerId: string) => Promise<unknown> | unknown;
}

export const PlayerCard: React.FC<PlayerCardComponentProps> = ({ player, onInvite }) => {
  const [invited, setInvited] = useState(false);
  const currentStyle = colorStyles[player.accentColor] || colorStyles.cyan;

  const handleInvite = async () => {
    try {
      if (onInvite) {
        await onInvite(player.id);
      }
      setInvited(true);
      setTimeout(() => setInvited(false), 3000);
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Please log in to invite players'));
    }
  };

  return (
    <div className={`relative bg-gradient-to-b from-[#0D131D] to-[#0A0E17] border border-gt-border rounded-sm p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 ${currentStyle.glowHover} group shimmer-effect`}>
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${currentStyle.topLine} via-white/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity`}></div>
      
      {/* Header Row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 flex items-center justify-center font-orbitron font-extrabold text-base bg-[#080D15] border ${currentStyle.border} ${currentStyle.text} cyber-cut-sm shadow-[0_0_12px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform`}>
            {player.initial}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron font-bold text-base text-white uppercase tracking-wider group-hover:text-gt-cyan transition-colors">
                {player.username}
              </h3>
              <span className="font-mono text-[11px] text-gt-text-dim">[{player.timezone}]</span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-gt-text-dim font-medium">{player.game}</span>
              <span className="text-gt-border-bright text-xs">•</span>
              <span className="font-mono text-xs flex items-center gap-1.5 text-gt-text">
                <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot}`}></span>
                {player.rank}
              </span>
            </div>
          </div>
        </div>

        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${currentStyle.badge} rounded-sm uppercase tracking-wider`}>
          {player.status}
        </span>
      </div>

      {/* Description */}
      <p className="font-rajdhani text-sm text-gt-text-dim leading-relaxed line-clamp-2 min-h-[42px] group-hover:text-gt-text transition-colors">
        {player.description}
      </p>

      {/* Roles & Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {player.roles.map((role, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-[#101724] border border-gt-border-bright/80 text-gt-text font-mono text-[11px] rounded-sm group-hover:border-gt-cyan/40 transition-colors"
          >
            {role}
          </span>
        ))}
        
        {player.micAvailable && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gt-green/10 border border-gt-green/30 text-gt-green font-mono text-[11px] rounded-sm">
            <Mic size={11} />
            <span>MIC</span>
          </span>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-auto pt-4 border-t border-gt-border/80 flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gt-cyan shadow-[0_0_8px_#00F0FF]"></span>
            <span className="font-bold text-white tracking-wide font-orbitron">{player.repScore.toFixed(1)}</span>
            <span className="text-[10px] text-gt-text-dim">REP</span>
          </div>

          <span className="text-gt-border-bright">•</span>

          <div className="text-gt-text-dim text-[11px]">
            {player.winRate} <span className="opacity-70">WR</span>
          </div>
        </div>

        <button
          onClick={handleInvite}
          className={`px-4 py-1.5 border font-orbitron text-xs font-bold uppercase tracking-wider transition-all duration-300 cyber-cut-sm active:scale-95 cursor-pointer ${
            invited
              ? 'bg-gt-green text-black border-gt-green'
              : 'border-gt-cyan/80 text-gt-cyan hover:bg-gt-cyan hover:text-black shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]'
          }`}
        >
          {invited ? (
            <span className="flex items-center gap-1">
              <Check size={12} /> SENT
            </span>
          ) : (
            'INVITE'
          )}
        </button>
      </div>
    </div>
  );
};
