'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useTournaments } from '../hooks/useTournaments';
import { formatCurrency } from '@/lib/utils';

export const TournamentHubSection: React.FC = () => {
  const { tournaments, isLoading } = useTournaments('ALL');

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-end pb-3 border-b border-gt-border/70">
        <div>
          <span className="text-gt-magenta section-label mb-1">
            SECTION_04A // ESPORTS
          </span>
          <h2 className="font-orbitron text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            TOURNAMENT HUB
            <span className="w-2 h-2 rounded-full bg-gt-magenta animate-ping"></span>
          </h2>
        </div>

        <Link
          href="/tournament"
          className="group font-mono text-xs text-gt-cyan hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
        >
          <span>FULL ARENA</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Tournaments List */}
      <div className="flex flex-col gap-3.5">
        {isLoading ? (
          <div className="py-8 text-center text-gt-text-dim font-mono text-xs">
            LOADING ARENA EVENTS...
          </div>
        ) : (
          tournaments.map((t) => (
            <div
              key={t.id}
              className="relative bg-gradient-to-r from-[#0D121B] to-[#0A0E17] border border-gt-border hover:border-gt-cyan/40 border-l-4 border-l-gt-cyan p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] group shimmer-effect rounded-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {t.featured && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-gt-yellow/15 border border-gt-yellow/40 text-gt-yellow font-mono text-[10px] font-bold flex items-center gap-1">
                      <Sparkles size={10} /> HOT
                    </span>
                  )}
                  <h3 className="font-orbitron font-bold text-white uppercase tracking-wider text-base group-hover:text-gt-cyan transition-colors">
                    {t.name}
                  </h3>
                </div>

                <div className="text-gt-text-dim text-xs font-mono flex items-center gap-2">
                  <span className="text-gt-text font-semibold">{t.game}</span>
                  <span className="text-gt-border-bright">•</span>
                  <span>{t.format}</span>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gt-border/50">
                <div className="flex items-center gap-1.5 text-gt-text-dim font-mono text-xs">
                  <Users size={14} className="text-gt-cyan" />
                  <span className="text-white font-bold">{t.teams}</span>
                  <span className="text-[10px]">TEAMS</span>
                </div>

                <div className="flex items-center gap-1.5 text-gt-magenta font-mono text-xs">
                  <Clock size={14} className="animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="font-bold tracking-wider">{t.countdown}</span>
                </div>

                <div className="font-orbitron font-extrabold text-gt-yellow text-glow-yellow text-lg text-right min-w-[95px]">
                  {formatCurrency(t.prize)}
                </div>

                <Link
                  href="/tournament"
                  className="px-4 py-1.5 border border-gt-cyan/70 text-gt-cyan font-mono text-xs uppercase tracking-wider hover:bg-gt-cyan hover:text-black transition-all duration-300 cyber-cut-sm active:scale-95 text-center font-bold"
                >
                  Register
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
