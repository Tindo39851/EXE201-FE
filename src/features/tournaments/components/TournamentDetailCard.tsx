'use client';

import React, { useState } from 'react';
import { Users, Zap, Radio } from 'lucide-react';
import type { Tournament } from '../types/tournament.types';
import { formatCurrency } from '@/lib/utils';
import { TournamentRegisterModal } from '@/components/ui/TournamentRegisterModal';

interface TournamentDetailCardProps {
  tournament: Tournament;
  onRegister?: (tournamentId: string) => Promise<any> | void;
}

export const TournamentDetailCard: React.FC<TournamentDetailCardProps> = ({
  tournament,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <TournamentRegisterModal
        tournament={tournament}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <div className="bg-[#0D121B] border border-gt-border p-6 sm:p-8 rounded-sm relative overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-gt-cyan/10 to-gt-magenta/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-gt-cyan font-bold tracking-wider uppercase px-2 py-0.5 border border-gt-cyan/40 bg-gt-cyan/10 rounded-sm">
              {tournament.status}
            </span>
            <span className="font-mono text-xs text-gt-text-dim uppercase">{tournament.format}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 mb-8 relative z-10 gap-4">
          <div>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
              {tournament.name}
            </h2>
            <div className="font-rajdhani text-base text-gt-text-dim mt-1 font-semibold">
              Official Competitive Arena • {tournament.game}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="font-orbitron text-4xl sm:text-5xl font-black text-gt-yellow text-glow-yellow">
              {formatCurrency(tournament.prize)}
            </div>
            <div className="font-mono text-xs text-gt-text-dim uppercase tracking-widest mt-1">
              PRIZE POOL GUARANTEED
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-gt-border/70 mb-8 relative z-10 font-mono">
          <div className="text-center sm:text-left border-r border-gt-border/40 pr-2">
            <div className="text-[11px] text-gt-text-dim uppercase mb-1">Teams Signed</div>
            <div className="font-orbitron text-xl font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
              <Users size={16} className="text-gt-cyan" />
              {tournament.teams}
            </div>
          </div>

          <div className="text-center sm:text-left border-r border-gt-border/40 pr-2">
            <div className="text-[11px] text-gt-text-dim uppercase mb-1">Match Format</div>
            <div className="font-orbitron text-xl font-bold text-white">{tournament.format.split(' ')[0]}</div>
          </div>

          <div className="text-center sm:text-left border-r border-gt-border/40 pr-2">
            <div className="text-[11px] text-gt-text-dim uppercase mb-1">Arena Status</div>
            <div className={`font-orbitron text-xl font-bold ${tournament.status === 'LIVE' ? 'text-gt-red' : 'text-gt-cyan'}`}>
              {tournament.status}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-[11px] text-gt-text-dim uppercase mb-1">Starts In</div>
            <div className="font-orbitron text-xl font-bold text-white">
              {tournament.status === 'LIVE' ? 'IN PROGRESS' : tournament.countdown}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gt-cyan hover:bg-white text-black font-orbitron font-extrabold text-xs uppercase px-8 py-3.5 glow-cyan transition-all duration-300 cyber-cut shimmer-effect flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <Zap size={15} />
            <span>REGISTER SQUAD</span>
          </button>

          <button
            onClick={() => alert(`Connecting to spectate server for ${tournament.name}...`)}
            className="border border-gt-cyan/80 text-gt-cyan font-orbitron font-bold text-xs uppercase px-8 py-3.5 hover:bg-gt-cyan/15 transition-all cyber-cut flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Radio size={15} />
            <span>SPECTATE LIVE STREAM</span>
          </button>
        </div>
      </div>
    </>
  );
};
