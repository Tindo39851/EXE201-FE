'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';
import type { GameHubItem } from '../types/voice.types';

interface GameFilterTabsProps {
  games: GameHubItem[];
  activeGameId: string;
  onSelectGame: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateRoomClick: () => void;
}

export const GameFilterTabs: React.FC<GameFilterTabsProps> = ({
  games,
  activeGameId,
  onSelectGame,
  searchQuery,
  onSearchChange,
  onCreateRoomClick,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
        {games.map(game => {
          const isActive = activeGameId.toLowerCase() === game.id.toLowerCase();
          return (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 border whitespace-nowrap ${
                isActive
                  ? 'bg-gt-cyan text-gt-bg font-bold border-gt-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-[#0D121B]/90 text-gray-300 border-gray-800 hover:border-gt-cyan/40 hover:text-white'
              }`}
            >
              <span>{game.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-gt-bg text-gt-cyan font-bold'
                    : 'bg-gray-800/80 text-gray-400'
                }`}
              >
                {game.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Create Room */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-[#0D121B]/80 border border-gray-800 focus:border-gt-cyan/60 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-gray-200 placeholder-gray-500 outline-none transition-colors"
          />
        </div>

        {/* Create Room Button */}
        <button
          onClick={onCreateRoomClick}
          className="flex items-center gap-2 bg-gt-cyan hover:bg-[#33f3ff] text-gt-bg px-4 py-2 rounded-lg font-orbitron font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>CREATE ROOM</span>
        </button>
      </div>
    </div>
  );
};
