'use client';

import React from 'react';
import { X, Shield, Users, Trophy, Award, Mic } from 'lucide-react';
import type { Clan } from '@/features/clans/types/clan.types';

interface ClanRosterModalProps {
  clan: Clan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClanRosterModal: React.FC<ClanRosterModalProps> = ({ clan, isOpen, onClose }) => {
  if (!isOpen || !clan) return null;

  const mockMembers = [
    { name: `${clan.tag}_COMMANDER`, role: 'Guild Leader / IGL', rank: 'Radiant #4', rep: 9.9, mic: true },
    { name: `${clan.tag}_VIPER`, role: 'First Fragger', rank: 'Radiant #12', rep: 9.8, mic: true },
    { name: `${clan.tag}_NEXUS`, role: 'Sentinel / Strat', rank: 'Immortal 3', rep: 9.7, mic: true },
    { name: `${clan.tag}_CYPHER`, role: 'Smokes / Flex', rank: 'Immortal 3', rep: 9.6, mic: true },
    { name: `${clan.tag}_REAPER`, role: 'Initiator', rank: 'Immortal 2', rep: 9.5, mic: true },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-2xl bg-[#0B0F17] border-2 border-gt-cyan p-6 sm:p-8 rounded-sm cyber-cut shadow-[0_0_50px_rgba(0,240,255,0.35)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gt-text-dim hover:text-gt-cyan p-1 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gt-border pb-4 mb-6">
          <div className="w-12 h-12 bg-[#080B12] border-2 border-gt-cyan rounded-sm flex items-center justify-center font-orbitron font-black text-gt-cyan text-sm cyber-cut-sm">
            {clan.tag}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron text-xl font-bold text-white uppercase">{clan.name}</h2>
              <span className="font-mono text-xs px-2 py-0.5 border border-gt-cyan text-gt-cyan rounded-sm">
                {clan.tier}
              </span>
            </div>
            <p className="font-mono text-xs text-gt-text-dim mt-0.5">
              ROSTER ACTIVE // {clan.members} MEMBERS TOTAL
            </p>
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
          {mockMembers.map((member, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-[#0E1420] border border-gt-border hover:border-gt-cyan/50 rounded-sm font-mono text-xs transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-gt-bg border border-gt-border flex items-center justify-center font-orbitron font-bold text-gt-cyan text-xs">
                  {i + 1}
                </div>
                <div>
                  <div className="font-orbitron font-bold text-white group-hover:text-gt-cyan transition-colors">
                    {member.name}
                  </div>
                  <div className="text-gt-text-dim text-[11px]">{member.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gt-yellow font-semibold">{member.rank}</span>
                <span className="text-gt-cyan flex items-center gap-1">
                  <Award size={13} /> {member.rep} REP
                </span>
                {member.mic && (
                  <span className="p-1 bg-gt-green/10 border border-gt-green/30 text-gt-green rounded-sm">
                    <Mic size={12} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gt-border flex justify-between items-center">
          <span className="font-mono text-xs text-gt-text-dim">
            Minimum Requirement: <strong className="text-gt-yellow">{clan.req}</strong>
          </span>
          <button
            onClick={() => {
              alert('Application sent to Clan Leader!');
              onClose();
            }}
            className="px-6 py-2.5 bg-gt-cyan hover:bg-white text-black font-orbitron text-xs font-bold uppercase tracking-wider cyber-cut-sm cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            Apply To Join Clan
          </button>
        </div>
      </div>
    </div>
  );
};
