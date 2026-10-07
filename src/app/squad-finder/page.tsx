'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { DiscordLobby, SquadFinderSection } from '@/features/squads';
import { Users, Radio } from 'lucide-react';

export default function SquadFinderPage() {
  const [activeTab, setActiveTab] = useState<'players' | 'matchmaking'>('players');

  return (
    <div className="min-h-screen bg-gt-bg text-gt-text flex flex-col font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex-1">
        {/* Mode Selector Tabs */}
        <div className="flex border-b border-gt-border/80 mb-8 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all cyber-cut-sm flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'players'
                ? 'bg-gt-cyan text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-gt-text-dim hover:text-white hover:bg-gt-bg-card-hover'
            }`}
          >
            <Users size={15} />
            <span>OPERATIVES ROSTER (INVITE PLAYERS)</span>
          </button>

          <button
            onClick={() => setActiveTab('matchmaking')}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all cyber-cut-sm flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'matchmaking'
                ? 'bg-gt-cyan text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-gt-text-dim hover:text-white hover:bg-gt-bg-card-hover'
            }`}
          >
            <Radio size={15} />
            <span>VOICE RADAR MATCHMAKING</span>
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'players' ? (
          <div>
            <SquadFinderSection />
          </div>
        ) : (
          <div className="bg-[#080B12] border border-gt-border rounded-sm overflow-hidden min-h-[680px]">
            <DiscordLobby />
          </div>
        )}
      </main>
    </div>
  );
}
