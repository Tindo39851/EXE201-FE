'use client';

import React from 'react';
import type { Clan } from '../types/clan.types';

interface ClanLeaderboardProps {
  clans: Clan[];
  selectedClanId: number;
  onSelectClan: (id: number) => void;
}

export const ClanLeaderboard: React.FC<ClanLeaderboardProps> = ({
  clans,
  selectedClanId,
  onSelectClan,
}) => {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gt-yellow font-mono text-[10px] tracking-widest uppercase section-label mb-1">
            RANK_01 // GLOBAL STANDINGS
          </div>
          <h2 className="font-orbitron text-lg font-bold uppercase tracking-wider text-white">
            LEADERBOARD
          </h2>
        </div>
      </div>

      <div className="bg-[#0D121B] border border-gt-border rounded-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gt-border/80 font-mono text-xs text-gt-text-dim uppercase">
          <div className="col-span-1">#</div>
          <div className="col-span-5">CLAN</div>
          <div className="col-span-2 text-right">MEMBERS</div>
          <div className="col-span-2 text-right">WINS</div>
          <div className="col-span-2 text-right">RATING</div>
        </div>

        <div className="divide-y divide-gt-border/40 font-mono text-xs">
          {clans.map((clan, index) => {
            const rank = index + 1;
            const isSelected = selectedClanId === clan.id;
            return (
              <div
                key={clan.id}
                className={`grid grid-cols-12 gap-4 p-3.5 transition-colors items-center group cursor-pointer ${
                  isSelected ? 'bg-[#141E2E]' : 'hover:bg-[#121A28]'
                }`}
                onClick={() => onSelectClan(clan.id)}
              >
                <div className="col-span-1 font-orbitron font-bold text-sm">
                  {rank === 1 ? <span className="text-gt-yellow">#1</span> :
                   rank === 2 ? <span className="text-gt-cyan">#2</span> :
                   rank === 3 ? <span className="text-gt-magenta">#3</span> :
                   <span className="text-gt-text-dim">#{rank}</span>}
                </div>

                <div className="col-span-5 flex items-center gap-2">
                  <span className="text-gt-cyan font-bold text-[11px]">[{clan.tag}]</span>
                  <span className="font-orbitron text-xs sm:text-sm text-white group-hover:text-gt-cyan transition-colors truncate">
                    {clan.name}
                  </span>
                </div>

                <div className="col-span-2 text-right text-gt-text-dim">
                  {clan.members}
                </div>

                <div className="col-span-2 text-right text-gt-text-dim">
                  {clan.wins}
                </div>

                <div className="col-span-2 text-right font-orbitron font-bold text-gt-cyan">
                  {clan.rating}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
