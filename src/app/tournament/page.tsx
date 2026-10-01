'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeft, Trophy, Clock, Radio } from 'lucide-react';
import { useTournaments, TournamentDetailCard, LiveBracket } from '@/features/tournaments';
import { formatCurrency } from '@/lib/utils';

export default function TournamentPage() {
  const {
    tournaments,
    selectedTournament,
    bracket,
    activeTab,
    setActiveTab,
    selectTournamentById,
    registerSquad,
  } = useTournaments('ALL');

  return (
    <div className="min-h-screen bg-gt-bg text-gt-text font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />
      
      <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-20">
        
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <Link
            href="/"
            className="font-mono text-xs text-gt-cyan hover:text-white inline-flex items-center gap-1.5 mb-4 group tracking-wider uppercase"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO HOME</span>
          </Link>

          <div className="text-gt-magenta section-label mb-1">
            TOUR_00 // ESPORTS ARENA
          </div>

          <h1 className="font-orbitron text-3xl sm:text-4xl text-white font-black tracking-wider flex items-center gap-3">
            TOURNAMENT HUB
            <Trophy size={28} className="text-gt-yellow" />
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gt-border/80 mb-8 gap-1">
          {(['ALL', 'LIVE', 'OPEN', 'UPCOMING'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 px-6 font-mono text-xs tracking-widest uppercase transition-all duration-300 cyber-cut-sm cursor-pointer select-none ${
                activeTab === tab
                  ? 'bg-gt-cyan text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-gt-text-dim hover:text-white hover:bg-gt-bg-card-hover'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Two Panel Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Tournament List */}
          <div className="w-full lg:w-[36%] flex flex-col gap-3">
            <div className="font-mono text-[11px] text-gt-text-dim uppercase tracking-wider flex justify-between">
              <span>{tournaments.length} EVENTS AVAILABLE</span>
              <span className="text-gt-cyan">SELECT TO VIEW BRACKET</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {tournaments.map((tournament) => {
                const isSelected = selectedTournament?.id === tournament.id;
                return (
                  <div 
                    key={tournament.id}
                    onClick={() => selectTournamentById(tournament.id)}
                    className={`p-4 cursor-pointer transition-all duration-300 rounded-sm cyber-cut-sm border ${
                      isSelected 
                        ? 'bg-[#101724] border-l-4 border-l-gt-cyan border-y-gt-cyan/40 border-r-gt-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]' 
                        : 'bg-[#0D121B] border-gt-border hover:border-gt-border-bright hover:bg-[#111824]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      {tournament.status === 'LIVE' && (
                        <span className="bg-gt-red text-white text-[9px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 font-mono animate-pulse">
                          <Radio size={10} /> LIVE
                        </span>
                      )}
                      {tournament.status === 'OPEN' && (
                        <span className="bg-gt-cyan/15 text-gt-cyan border border-gt-cyan/50 text-[9px] font-bold px-2 py-0.5 rounded-sm font-mono">
                          OPEN
                        </span>
                      )}
                      {tournament.status === 'UPCOMING' && (
                        <span className="bg-[#1A2636] text-gt-text-dim text-[9px] font-bold px-2 py-0.5 rounded-sm font-mono">
                          UPCOMING
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-gt-text-dim uppercase">{tournament.format}</span>
                    </div>
                    
                    <h3 className="font-orbitron font-bold text-white text-sm uppercase truncate mb-1">
                      {tournament.name}
                    </h3>

                    <div className="text-gt-text-dim text-xs font-mono mb-3">
                      {tournament.game}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-gt-border/40">
                      <span className="text-gt-yellow font-orbitron font-bold">{formatCurrency(tournament.prize)}</span>
                      <span className="text-gt-magenta font-mono text-[11px] flex items-center gap-1">
                        <Clock size={11} /> {tournament.countdown}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Selected Tournament Detail & Bracket */}
          <div className="w-full lg:w-[64%] flex flex-col gap-8">
            {selectedTournament && (
              <TournamentDetailCard
                tournament={selectedTournament}
                onRegister={registerSquad}
              />
            )}

            <LiveBracket matches={bracket} />
          </div>
        </div>
      </main>
    </div>
  );
}
