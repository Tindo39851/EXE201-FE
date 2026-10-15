'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlayerCard } from './PlayerCard';
import { AiSquadRecommendations } from './AiSquadRecommendations';
import { MySquadProfileModal } from './MySquadProfileModal';
import { useSquads } from '../hooks/useSquads';
import { squadService } from '../services/squad.service';
import { Gamepad2, ArrowRight, UserCheck, Zap, Loader2 } from 'lucide-react';

const GAMES = [
  'ALL',
  'Valorant',
  'League of Legends',
  'Liên Quân',
  'Free Fire',
];

export const SquadFinderSection: React.FC = () => {
  const router = useRouter();
  const { players, activeGame, selectGame, invitePlayer, isLoading, refetch } = useSquads('ALL');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [matchmaking, setMatchmaking] = useState(false);

  const handleQuickMatch = async () => {
    setMatchmaking(true);
    try {
      const res = await squadService.findSquad({
        gameId: activeGame === 'ALL' ? 'valorant' : activeGame.toLowerCase(),
        primaryRole: 'Flex',
        rank: 'All',
        region: 'VN',
        neededRoles: ['Flex'],
        micRequired: true,
      });

      const targetRoomId = res.roomId || res.lobbyId;
      if (targetRoomId) {
        router.push(`/voice-lounges?joinRoom=${encodeURIComponent(targetRoomId)}`);
      } else {
        router.push('/voice-lounges');
      }
    } catch {
      router.push('/voice-lounges');
    } finally {
      setMatchmaking(false);
    }
  };

  return (
    <div className="w-full">
      <MySquadProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onProfileSaved={() => refetch()}
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* AI Smart Squad Recommendation (Premium Feature) */}
        <AiSquadRecommendations activeGame={activeGame === 'ALL' ? 'Valorant' : activeGame} />

        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-gt-border/60">
          <div className="flex flex-col gap-1.5">
            <span className="section-label text-gt-cyan">
              SECTION_02 // LIVE PLAYERS
            </span>
            <div className="flex items-center gap-3">
              <h2 className="font-orbitron text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider text-glow-cyan">
                SQUAD FINDER
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-gt-cyan/10 border border-gt-cyan/30 text-gt-cyan font-mono text-[11px] font-bold">
                {players.length} ONLINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setProfileModalOpen(true)}
              className="px-4 py-2 bg-gt-cyan/10 hover:bg-gt-cyan/20 border border-gt-cyan/40 text-gt-cyan font-mono text-xs font-bold uppercase tracking-wider rounded-sm cyber-cut-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)]"
            >
              <UserCheck size={14} />
              <span>HỒ SƠ CỦA TÔI</span>
            </button>

            <button
              onClick={handleQuickMatch}
              disabled={matchmaking}
              className="px-4 py-2 bg-gradient-to-r from-gt-cyan to-blue-600 hover:from-gt-cyan/90 hover:to-blue-500 text-black font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-sm cyber-cut-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50"
            >
              {matchmaking ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>ĐANG GHÉP...</span>
                </>
              ) : (
                <>
                  <Zap size={14} />
                  <span>GHÉP ĐỘI NHANH</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Game Filters */}
        <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 items-center">
          {GAMES.map((game) => {
            const isActive = activeGame === game;
            return (
              <button
                key={game}
                onClick={() => selectGame(game)}
                className={`whitespace-nowrap font-mono text-xs uppercase tracking-wider px-4 py-2 transition-all duration-300 border cyber-cut-sm cursor-pointer select-none ${
                  isActive
                    ? 'bg-gt-cyan text-black border-gt-cyan font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105'
                    : 'bg-[#0D121B] text-gt-text-dim border-gt-border hover:border-gt-cyan/50 hover:text-gt-cyan'
                }`}
              >
                {game}
              </button>
            );
          })}
        </div>
        
        {/* Player Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-gt-cyan font-mono text-sm">
              CONNECTING TO SQUAD ENGINE...
            </div>
          ) : players.length > 0 ? (
            players.map((player) => (
              <PlayerCard key={player.id} player={player} onInvite={invitePlayer} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center border border-dashed border-gt-border rounded-sm bg-gt-bg-card">
              <Gamepad2 size={36} className="mx-auto text-gt-text-dim mb-3 animate-bounce" />
              <p className="font-mono text-sm text-gt-text-dim uppercase tracking-wider">
                No active squads in queue for {activeGame}.
              </p>
              <button
                onClick={() => selectGame('ALL')}
                className="mt-4 px-4 py-1.5 border border-gt-cyan text-gt-cyan font-orbitron text-xs uppercase"
              >
                View All Games
              </button>
            </div>
          )}
        </div>
        
        {/* Browse All Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/squad-finder"
            className="group relative font-orbitron font-extrabold uppercase text-xs tracking-widest text-gt-cyan border border-gt-cyan/80 bg-gt-bg-card/80 px-10 py-4 cyber-cut hover:bg-gt-cyan hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] flex items-center gap-3 active:scale-95 shimmer-effect"
          >
            <span>BROWSE ALL PLAYERS &amp; ROOMS</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
};
