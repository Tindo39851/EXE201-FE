'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Activity, Award, ArrowRight, ShieldAlert } from 'lucide-react';
import { useReputation } from '../hooks/useReputation';

const RINGS = [
  { label: 'AVG REP', value: 91, color: 'text-gt-cyan', stroke: '#00F0FF', shadow: 'rgba(0,240,255,0.4)' },
  { label: 'SQUAD SUCCESS', value: 98, color: 'text-gt-magenta', stroke: '#FF007F', shadow: 'rgba(255,0,127,0.4)' },
  { label: 'ZERO REPORTS', value: 97, color: 'text-gt-green', stroke: '#00FF66', shadow: 'rgba(0,255,102,0.4)' },
  { label: 'VERIFIED', value: 99, color: 'text-gt-yellow', stroke: '#FFD700', shadow: 'rgba(255,215,0,0.4)' }
];

export const ReputationSection: React.FC = () => {
  const { metrics, topPlayers, isLoading } = useReputation();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex justify-between items-end pb-3 border-b border-gt-border/70">
        <div>
          <span className="text-gt-red section-label mb-1">
            SECTION_04 // PLAYER INTEGRITY ENGINE
          </span>
          <h2 className="font-orbitron text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            REPUTATION SYSTEM
            <ShieldCheck size={20} className="text-gt-cyan animate-pulse" />
          </h2>
        </div>

        <Link
          href="/reputation"
          className="group font-mono text-xs text-gt-cyan hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
        >
          <span>FULL ENGINE</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: PLATFORM HEALTH */}
        <div className="relative bg-[#0D121B] border border-gt-border rounded-sm p-6 flex flex-col gap-4 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:border-gt-cyan/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gt-red">
              <ShieldAlert size={18} />
              <h3 className="font-orbitron font-bold uppercase text-sm tracking-wider text-white">PLATFORM HEALTH</h3>
            </div>
            
            <div className="text-gt-cyan font-orbitron font-extrabold bg-gt-cyan/15 border border-gt-cyan/40 px-2.5 py-0.5 rounded-sm text-xs shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              {metrics ? `${metrics.avgRepScore}/10` : '9.1/10'}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-gt-border/60 pb-2.5">
              <span className="text-gt-text-dim">Platform Avg Rep</span>
              <span className="text-gt-cyan font-bold font-orbitron text-sm">
                {metrics ? `${metrics.avgRepScore}/10` : '9.1/10'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gt-border/60 pb-2.5">
              <span className="text-gt-text-dim">Sessions Today</span>
              <span className="text-gt-green font-bold font-orbitron text-sm">
                {metrics ? metrics.totalSessions.toLocaleString() : '284,103'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gt-border/60 pb-2.5">
              <span className="text-gt-text-dim">Toxicity Rate</span>
              <span className="text-gt-red font-bold font-orbitron text-sm">
                {metrics ? `${metrics.toxicityRate}%` : '0.4%'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-gt-text-dim">Squad Success Rate</span>
              <span className="text-gt-cyan font-bold font-orbitron text-sm">
                {metrics ? `${metrics.successRate}%` : '97.8%'}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: PLAYER INTEGRITY METRICS */}
        <div className="relative bg-[#0D121B] border border-gt-border rounded-sm p-6 flex flex-col gap-4 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:border-gt-green/40 transition-all duration-300">
          <div className="flex items-center gap-2 text-gt-green">
            <Activity size={18} />
            <h3 className="font-orbitron font-bold uppercase text-sm tracking-wider text-white">INTEGRITY METRICS</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2 items-center mt-3">
            {RINGS.map((ring, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group cursor-default">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 group-hover:scale-105 transition-transform">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#162232" strokeWidth="3" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.5" 
                      fill="none" 
                      stroke={ring.stroke} 
                      strokeWidth="3" 
                      strokeDasharray="100" 
                      strokeDashoffset={100 - ring.value} 
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 6px ${ring.shadow})` }}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-orbitron font-extrabold text-[11px] sm:text-xs text-white">
                    {ring.value}%
                  </div>
                </div>
                <span className={`font-mono text-[9px] text-center w-full uppercase ${ring.color} font-semibold leading-tight`}>
                  {ring.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: TOP REP PLAYERS */}
        <div className="relative bg-[#0D121B] border border-gt-border rounded-sm p-6 flex flex-col gap-4 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:border-gt-yellow/40 transition-all duration-300">
          <div className="flex items-center gap-2 text-gt-yellow">
            <Award size={18} />
            <h3 className="font-orbitron font-bold uppercase text-sm tracking-wider text-white">TOP REP PLAYERS</h3>
          </div>

          <div className="flex flex-col gap-2.5 mt-1">
            {topPlayers.map((p) => (
              <div key={p.rank} className="flex items-center gap-3 p-1.5 rounded-sm hover:bg-[#131B27] transition-colors">
                <div className="text-gt-text-dim font-orbitron font-bold text-xs w-4">#{p.rank}</div>
                <div className="w-7 h-7 rounded-sm bg-gt-bg border border-gt-border flex items-center justify-center text-white font-orbitron text-xs font-bold">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-orbitron font-bold text-xs text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-gt-text-dim font-mono uppercase truncate">{p.game} • {p.tier}</div>
                </div>
                <div className={`flex items-center gap-1 font-mono font-bold text-xs ${p.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {p.rep}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Button link */}
      <div className="flex justify-center mt-2">
        <Link
          href="/reputation"
          className="px-8 py-3 border border-gt-cyan/70 text-gt-cyan hover:bg-gt-cyan hover:text-black font-orbitron text-xs font-bold uppercase tracking-widest transition-all duration-300 cyber-cut-sm shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] active:scale-95 flex items-center gap-2"
        >
          <span>VIEW FULL REPUTATION SYSTEM</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
};
