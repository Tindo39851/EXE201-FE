'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeft, Shield } from 'lucide-react';
import { useClans, ClanDetailCard, ClanLeaderboard } from '@/features/clans';

const TIERS = ['ALL', 'ELITE', 'ALPHA', 'BETA', 'GAMMA'];
const REGIONS = ['ALL', 'Global', 'NA/EU', 'EU', 'AS', 'SEA', 'NA'];

export default function ClanHubPage() {
  const {
    clans,
    selectedClan,
    activeTier,
    activeRegion,
    setActiveTier,
    setActiveRegion,
    selectClanById,
  } = useClans();

  return (
    <main className="min-h-screen bg-gt-bg text-gt-text font-rajdhani selection:bg-gt-cyan/30 selection:text-gt-cyan">
      <Navbar />

      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <Link
            href="/"
            className="font-mono text-xs text-gt-cyan hover:text-white inline-flex items-center gap-1.5 group tracking-wider uppercase"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO HOME</span>
          </Link>

          <div className="space-y-1">
            <div className="text-gt-green font-mono text-xs tracking-widest uppercase section-label">
              CLAN_00 // GUILD DIRECTORY
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-black uppercase tracking-wider text-white flex items-center gap-3">
              CLAN HUB
              <Shield size={28} className="text-gt-cyan" />
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 items-center p-4 bg-[#0D121B] border border-gt-border rounded-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs uppercase text-gt-text-dim mr-2 font-bold">FACTION TIER:</span>
            <div className="flex flex-wrap gap-1.5">
              {TIERS.map(tier => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={`font-mono text-xs uppercase px-3 py-1 transition-all cyber-cut-sm cursor-pointer ${
                    activeTier === tier 
                      ? 'bg-gt-cyan text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                      : 'border border-gt-border text-gt-text-dim hover:border-gt-text-dim'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs uppercase text-gt-text-dim mr-2 font-bold">REGION:</span>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map(region => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`font-mono text-xs uppercase px-3 py-1 transition-all cyber-cut-sm cursor-pointer ${
                    activeRegion === region 
                      ? 'bg-gt-cyan text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                      : 'border border-gt-border text-gt-text-dim hover:border-gt-text-dim'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel - Clan List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="font-mono text-[11px] text-gt-text-dim uppercase tracking-wider mb-1">
              {clans.length} CLANS REGISTERED
            </div>

            {clans.map((clan) => {
              const isSelected = selectedClan?.id === clan.id;
              return (
                <div 
                  key={clan.id}
                  onClick={() => selectClanById(clan.id)}
                  className={`cursor-pointer p-4 rounded-sm border transition-all duration-300 flex items-center justify-between cyber-cut-sm ${
                    isSelected 
                      ? 'border-l-4 border-l-gt-cyan border-y-gt-cyan/40 border-r-gt-cyan/40 bg-[#121A28] shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                      : 'border-gt-border bg-[#0D121B] hover:bg-[#101724] hover:border-gt-border-bright'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#080B12] border border-gt-cyan/50 flex items-center justify-center font-orbitron font-extrabold text-gt-cyan text-xs cyber-cut-sm">
                      {clan.tag}
                    </div>
                    <div>
                      <div className="font-orbitron text-xs sm:text-sm font-bold text-white tracking-wide">
                        {clan.name}
                      </div>
                      <div className="font-mono text-[11px] text-gt-text-dim mt-0.5">
                        {clan.members} members • <span className="text-gt-cyan font-bold">{clan.rating}</span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] px-2 py-0.5 border border-gt-border rounded-sm uppercase text-gt-text-dim">
                    {clan.tier}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Panel - Clan Detail & Standings */}
          <div className="lg:col-span-8 space-y-8">
            {selectedClan && <ClanDetailCard clan={selectedClan} />}

            <ClanLeaderboard
              clans={clans}
              selectedClanId={selectedClan?.id ?? 1}
              onSelectClan={selectClanById}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
