'use client';

import React, { useState } from 'react';
import { getApiErrorMessage } from '@/services/api-client';
import { Users, Trophy, Lock, Eye } from 'lucide-react';
import type { Clan } from '../types/clan.types';
import { ClanRosterModal } from '@/components/ui/ClanRosterModal';
import { clanService } from '../services/clan.service';

interface ClanDetailCardProps {
  clan: Clan;
}

export const ClanDetailCard: React.FC<ClanDetailCardProps> = ({ clan }) => {
  const [rosterOpen, setRosterOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await clanService.requestJoinClan(clan.id);
      alert(res.message || `Application submitted to join ${clan.name}!`);
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Please log in to apply for this clan'));
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <ClanRosterModal
        clan={clan}
        isOpen={rosterOpen}
        onClose={() => setRosterOpen(false)}
      />

      <div className="bg-[#0D121B] border border-gt-border rounded-sm overflow-hidden relative shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-[#0E1522] to-[#121B2A] relative flex items-center justify-center border-b border-gt-border/80">
          <div className="absolute inset-0 bg-grid opacity-30"></div>
          <div className="font-orbitron text-8xl font-black text-white/5 select-none absolute tracking-widest">
            [{clan.tag}]
          </div>
          <div className="absolute top-4 right-4 text-right z-10">
            <div className="font-mono text-[10px] text-gt-text-dim mb-1 tracking-widest uppercase">FACTION TIER</div>
            <div className="font-orbitron text-xs font-bold px-3 py-1 bg-gt-cyan/15 border border-gt-cyan/50 text-gt-cyan rounded-sm">
              {clan.tier}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Clan Info Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="space-y-2">
              <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                {clan.name}
              </h2>
              <div className="font-mono text-xs text-gt-text-dim flex gap-4">
                <span className="text-gt-cyan font-bold">[{clan.tag}]</span>
                <span>FOUNDED {clan.founded}</span>
                <span>🌐 {clan.region}</span>
              </div>
              <p className="text-gt-text-dim max-w-xl text-sm leading-relaxed pt-1">
                {clan.desc}
              </p>
            </div>
            
            <div className="text-left sm:text-right">
              <div className="font-mono text-[11px] text-gt-text-dim uppercase tracking-wider mb-1">CLAN RATING</div>
              <div className="font-orbitron text-4xl sm:text-5xl font-black text-gt-cyan text-glow-cyan">
                {clan.rating}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-gt-border/70 font-mono">
            <div>
              <div className="text-[11px] text-gt-text-dim uppercase mb-1">MEMBERS</div>
              <div className="font-orbitron text-xl font-bold text-white flex items-center gap-1.5">
                <Users size={15} className="text-gt-cyan" />
                {clan.members}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gt-text-dim uppercase mb-1">WINS</div>
              <div className="font-orbitron text-xl font-bold text-white flex items-center gap-1.5">
                <Trophy size={15} className="text-gt-yellow" />
                {clan.wins}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gt-text-dim uppercase mb-1">RATING</div>
              <div className="font-orbitron text-xl font-bold text-gt-cyan">{clan.rating}</div>
            </div>
            <div>
              <div className="text-[11px] text-gt-text-dim uppercase mb-1">FOUNDED</div>
              <div className="font-orbitron text-xl font-bold text-white">{clan.founded}</div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-2">
            <div className="space-y-3">
              <div>
                <div className="font-mono text-[11px] text-gt-text-dim uppercase mb-1.5">PRIMARY GAMES</div>
                <div className="flex flex-wrap gap-2">
                  {clan.games.map(game => (
                    <span key={game} className="font-mono text-xs px-2.5 py-1 bg-[#101724] border border-gt-border text-gt-text rounded-sm">
                      {game}
                    </span>
                  ))}
                </div>
              </div>
              <div className="font-mono text-xs">
                <span className="text-gt-text-dim uppercase mr-2">REQUIREMENT:</span>
                <span className="text-gt-yellow font-bold">{clan.req}</span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 sm:flex-initial px-4 py-2.5 border border-gt-cyan/60 text-gt-cyan font-mono text-xs uppercase hover:bg-gt-cyan/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Lock size={13} />
                <span>{applying ? 'SUBMITTING...' : 'APPLY TO JOIN'}</span>
              </button>
              <button
                onClick={() => setRosterOpen(true)}
                className="flex-1 sm:flex-initial px-6 py-2.5 border-2 border-gt-cyan text-gt-cyan font-orbitron text-xs font-bold hover:bg-gt-cyan hover:text-black transition-all glow-cyan cyber-cut-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye size={13} />
                <span>VIEW MEMBERS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
