'use client';

import React, { useState } from 'react';
import { X, Trophy, Zap } from 'lucide-react';
import type { Tournament } from '@/features/tournaments/types/tournament.types';
import { formatCurrency } from '@/lib/utils';
import { tournamentService } from '@/features/tournaments/services/tournament.service';

interface TournamentRegisterModalProps {
  tournament: Tournament | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TournamentRegisterModal: React.FC<TournamentRegisterModalProps> = ({
  tournament,
  isOpen,
  onClose,
}) => {
  const [teamName, setTeamName] = useState('');
  const [captainDiscord, setCaptainDiscord] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !tournament) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await tournamentService.registerTeam(tournament.id, { teamName, captainDiscord });
      setIsSuccess(true);
      window.setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    } catch (submissionError) {
      setError(submissionError && typeof submissionError === 'object' && 'message' in submissionError
        ? String(submissionError.message) : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-lg bg-[#0B0F17] border-2 border-gt-cyan p-6 sm:p-8 rounded-sm cyber-cut shadow-[0_0_50px_rgba(0,240,255,0.4)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gt-text-dim hover:text-gt-cyan p-1 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-gradient-to-br from-gt-yellow/20 to-gt-cyan/20 border border-gt-yellow cyber-cut-sm mb-3 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            <Trophy size={24} className="text-gt-yellow" />
          </div>
          <h2 className="font-orbitron text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            REGISTER FOR {tournament.name}
          </h2>
          <p className="font-mono text-xs text-gt-cyan mt-1">
            PRIZE POOL: {formatCurrency(tournament.prize)} • FORMAT: {tournament.format}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 font-mono">
            <div className="w-12 h-12 mx-auto rounded-full bg-gt-green/20 border border-gt-green text-gt-green flex items-center justify-center animate-bounce">
              ✓
            </div>
            <h3 className="font-orbitron text-base font-bold text-white uppercase text-gt-green">
              TEAM SEED REGISTERED!
            </h3>
            <p className="text-xs text-gt-text-dim">
              Bracket placement confirmed. Match lobby details sent to team captain.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                Squad / Team Name
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CYBER PROTOCOL ELITE"
                className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan focus:border-gt-cyan focus:outline-none px-3.5 py-2.5 text-white rounded-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                Captain Discord Tag
              </label>
              <input
                type="text"
                required
                value={captainDiscord}
                onChange={(e) => setCaptainDiscord(e.target.value)}
                placeholder="Captain#1337"
                className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan focus:border-gt-cyan focus:outline-none px-3.5 py-2.5 text-white rounded-sm transition-colors"
              />
            </div>

            <div className="p-3.5 bg-[#070A10] border border-gt-border rounded-sm space-y-2">
              <span className="text-gt-text-dim text-[11px] block uppercase font-bold">
                Roster Allocation ({tournament.game})
              </span>
              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                <div className="p-1.5 bg-[#121A28] border border-gt-cyan/50 text-gt-cyan rounded-sm">P1 (Captain)</div>
                <div className="p-1.5 bg-[#121A28] border border-gt-border text-white rounded-sm">P2 (Flex)</div>
                <div className="p-1.5 bg-[#121A28] border border-gt-border text-white rounded-sm">P3 (Anchor)</div>
                <div className="p-1.5 bg-[#121A28] border border-gt-border text-white rounded-sm">P4 (Fragger)</div>
                <div className="p-1.5 bg-[#121A28] border border-gt-border text-white rounded-sm">P5 (Support)</div>
              </div>
            </div>

            {error && <div role="alert" className="border border-gt-red/60 bg-gt-red/10 p-3 text-gt-red">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gt-cyan hover:bg-white text-black font-orbitron text-xs font-black uppercase tracking-widest transition-all duration-300 cyber-cut shimmer-effect flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95"
            >
              <Zap size={15} />
              <span>{isSubmitting ? 'REGISTERING...' : 'CONFIRM BRACKET SEEDING'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
