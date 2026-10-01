'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Trophy, ArrowRight } from 'lucide-react';
import { useClans } from '../hooks/useClans';

export const ClanHubSection: React.FC = () => {
  const { clans, isLoading } = useClans();
  const topClans = clans.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-end pb-3 border-b border-gt-border/70">
        <div>
          <span className="text-gt-green section-label mb-1">
            SECTION_01B // GUILD WARS
          </span>
          <h2 className="font-orbitron text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            CLAN HUB
            <Shield size={18} className="text-gt-green" />
          </h2>
        </div>

        <Link
          href="/clan"
          className="group font-mono text-xs text-gt-cyan hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
        >
          <span>DIRECTORY</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Table Box */}
      <div className="bg-[#0B0F17] border border-gt-border rounded-sm overflow-hidden p-4 sm:p-5 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 pb-3 border-b border-gt-border/80 font-mono text-[11px] text-gt-text-dim uppercase tracking-wider">
          <div className="col-span-2"># RANK</div>
          <div className="col-span-5">CLAN NAME</div>
          <div className="col-span-2 text-right">MBR</div>
          <div className="col-span-2 text-right">RATING</div>
          <div className="col-span-1 text-center">TIER</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-gt-border/40">
          {isLoading ? (
            <div className="py-6 text-center text-gt-text-dim font-mono text-xs">
              FETCHING GUILD STANDINGS...
            </div>
          ) : (
            topClans.map((clan, index) => (
              <div
                key={clan.tag}
                className="grid grid-cols-12 gap-3 py-3.5 items-center font-mono hover:bg-[#121A28] px-2 rounded-sm transition-all duration-200 group"
              >
                <div className="col-span-2 flex items-center gap-1 font-orbitron font-extrabold text-sm sm:text-base">
                  {index === 0 ? (
                    <span className="text-gt-yellow text-glow-yellow flex items-center gap-1">
                      <Trophy size={14} /> #1
                    </span>
                  ) : index === 1 ? (
                    <span className="text-gt-cyan">#2</span>
                  ) : index === 2 ? (
                    <span className="text-gt-magenta">#3</span>
                  ) : (
                    <span className="text-gt-text-dim">#{index + 1}</span>
                  )}
                </div>

                <div className="col-span-5 flex items-center gap-2 truncate">
                  <span className="text-gt-cyan font-bold text-xs">[{clan.tag}]</span>
                  <span className="text-white font-rajdhani font-semibold text-sm sm:text-base truncate group-hover:text-gt-cyan transition-colors">
                    {clan.name}
                  </span>
                </div>

                <div className="col-span-2 text-right text-gt-text-dim text-xs font-mono">
                  {clan.members}
                </div>

                <div className="col-span-2 text-right text-gt-cyan font-orbitron font-bold text-xs sm:text-sm">
                  {clan.rating}
                </div>

                <div className="col-span-1 flex justify-center">
                  <span className="text-[9px] font-bold px-2 py-0.5 border border-gt-cyan/50 text-gt-cyan bg-gt-cyan/10 rounded-sm tracking-wider uppercase">
                    {clan.tier}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Button link */}
      <div className="flex justify-center mt-1">
        <Link
          href="/clan"
          className="w-full sm:w-auto px-8 py-3 border border-gt-cyan/70 text-gt-cyan hover:bg-gt-cyan hover:text-black font-orbitron text-xs font-bold uppercase tracking-widest transition-all duration-300 cyber-cut-sm text-center shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] active:scale-95 flex items-center justify-center gap-2"
        >
          <span>SEE ALL 8 CLANS</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
};
