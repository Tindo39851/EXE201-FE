'use client';

import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import type { MatchBracketNode } from '../types/tournament.types';

interface LiveBracketProps {
  matches: MatchBracketNode[];
}

export const LiveBracket: React.FC<LiveBracketProps> = ({ matches }) => {
  const qfMatches = matches.filter(m => m.round === 'Quarterfinals');
  const sfMatches = matches.filter(m => m.round === 'Semifinals');
  const fMatches = matches.filter(m => m.round === 'Finals');

  return (
    <div className="bg-[#0D121B] border border-gt-border p-6 rounded-sm">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gt-border/80">
        <div>
          <div className="text-gt-text-dim font-mono text-[10px] uppercase tracking-widest mb-1">
            — BRACKET_01 // REALTIME TREE
          </div>
          <h3 className="font-orbitron text-lg text-white font-extrabold flex items-center gap-2">
            LIVE CHAMPIONSHIP BRACKET
            <Trophy size={16} className="text-gt-yellow" />
          </h3>
        </div>
        <span className="font-mono text-xs text-gt-green flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gt-green animate-ping"></span>
          REALTIME
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative font-mono text-xs">
        {/* Quarterfinals */}
        <div className="flex flex-col gap-4">
          <div className="text-[11px] text-gt-text-dim uppercase text-center font-bold tracking-wider">
            Quarterfinals
          </div>
          {qfMatches.map((m) => (
            <div key={m.id} className="bg-[#090C12] border border-gt-border rounded-sm overflow-hidden shadow-sm">
              <div className="flex justify-between items-center p-2.5 border-b border-gt-border bg-gt-cyan/10 border-l-2 border-l-gt-cyan">
                <span className="text-white font-bold truncate pr-2">{m.team1.name}</span>
                <span className="text-gt-cyan font-orbitron font-bold">{m.team1.score}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 text-gt-text-dim border-l-2 border-l-transparent">
                <span className="truncate pr-2">{m.team2.name}</span>
                <span className="font-orbitron">{m.team2.score}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Semifinals */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="text-[11px] text-gt-text-dim uppercase text-center font-bold tracking-wider">
            Semifinals
          </div>
          {sfMatches.map((m) => (
            <div key={m.id} className="bg-[#090C12] border border-gt-cyan/40 rounded-sm overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div className="flex justify-between items-center p-2.5 border-b border-gt-border border-l-2 border-l-gt-cyan">
                <span className="text-white font-bold truncate pr-2">{m.team1.name}</span>
                <span className="text-gt-text-dim font-orbitron">{m.team1.score}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 border-l-2 border-l-gt-cyan">
                <span className="text-white font-bold truncate pr-2">{m.team2.name}</span>
                <span className="text-gt-text-dim font-orbitron">{m.team2.score}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Finals */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="text-[11px] text-gt-yellow uppercase text-center font-bold tracking-wider flex items-center justify-center gap-1">
            <Sparkles size={12} /> Grand Finals
          </div>
          {fMatches.map((m) => (
            <div key={m.id} className="bg-[#090C12] border border-gt-yellow/60 rounded-sm overflow-hidden shadow-[0_0_20px_rgba(255,215,0,0.15)]">
              <div className="flex justify-between items-center p-2.5 border-b border-gt-border border-l-2 border-l-gt-yellow">
                <span className="text-gt-yellow font-bold truncate pr-2">{m.team1.name}</span>
                <span className="text-gt-text-dim font-orbitron">{m.team1.score}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 border-l-2 border-l-gt-yellow">
                <span className="text-gt-yellow font-bold truncate pr-2">{m.team2.name}</span>
                <span className="text-gt-text-dim font-orbitron">{m.team2.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
