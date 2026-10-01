'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeft, ShieldCheck, Award, ShieldAlert } from 'lucide-react';
import { useReputation } from '@/features/reputation';

export default function ReputationPage() {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Reports' | 'Reviews' | 'Leaderboard'>('Overview');
  const { metrics, reports, reviews } = useReputation();

  return (
    <div className="min-h-screen bg-gt-bg text-gt-text font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-gt-cyan hover:text-white transition-colors mb-4 group tracking-wider uppercase"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO HOME</span>
          </Link>

          <div className="section-label text-gt-orange mb-1 font-mono text-xs uppercase tracking-widest">
            REP_00 // PLAYER INTEGRITY ENGINE
          </div>

          <h1 className="font-orbitron text-3xl md:text-5xl font-black uppercase text-white tracking-widest flex items-center gap-3">
            REPUTATION SYSTEM
            <ShieldCheck size={32} className="text-gt-cyan" />
          </h1>
        </div>

        {/* Interactive Tabs */}
        <div className="flex border-b border-gt-border/80 mb-8 overflow-x-auto gap-1">
          {(['Overview', 'Reports', 'Reviews', 'Leaderboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all cyber-cut-sm cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gt-cyan text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-gt-text-dim hover:text-white hover:bg-gt-bg-card-hover'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="bg-[#0D121B] border border-gt-border p-6 mb-8 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gt-border/60">
            <div className="pt-2 lg:pt-0">
              <div className="font-orbitron text-2xl md:text-3xl font-black text-gt-cyan mb-1">
                {metrics ? `${metrics.avgRepScore}` : '9.1'}
              </div>
              <div className="font-mono text-xs text-gt-text-dim uppercase tracking-wider">Avg Rep Score</div>
            </div>
            <div className="pt-2 lg:pt-0 lg:pl-6">
              <div className="font-orbitron text-2xl md:text-3xl font-black text-gt-green mb-1">
                {metrics ? metrics.squadsFormed.toLocaleString() : '62,100'}
              </div>
              <div className="font-mono text-xs text-gt-text-dim uppercase tracking-wider">Squads Formed</div>
            </div>
            <div className="pt-2 lg:pt-0 lg:pl-6">
              <div className="font-orbitron text-2xl md:text-3xl font-black text-gt-magenta mb-1">
                {metrics ? metrics.activeNow.toLocaleString() : '1,203'}
              </div>
              <div className="font-mono text-xs text-gt-text-dim uppercase tracking-wider">Active Now</div>
            </div>
            <div className="pt-2 lg:pt-0 lg:pl-6">
              <div className="font-orbitron text-2xl md:text-3xl font-black text-gt-yellow mb-1">
                {metrics ? metrics.totalSessions.toLocaleString() : '284,103'}
              </div>
              <div className="font-mono text-xs text-gt-text-dim uppercase tracking-wider">Total Sessions</div>
            </div>
            <div className="pt-2 lg:pt-0 lg:pl-6">
              <div className="font-orbitron text-2xl md:text-3xl font-black text-gt-green mb-1">
                {metrics ? `${metrics.toxicityRate}%` : '0.4%'}
              </div>
              <div className="font-mono text-xs text-gt-text-dim uppercase tracking-wider">Toxicity Rate</div>
            </div>
            <div className="pt-2 lg:pt-0 lg:pl-6">
              <div className="font-orbitron text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gt-cyan via-gt-magenta to-gt-yellow mb-1">
                {metrics ? `${metrics.successRate}%` : '97.8%'}
              </div>
              <div className="font-mono text-xs text-gt-text-dim uppercase tracking-wider">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Tab Views */}
        {(activeTab === 'Overview' || activeTab === 'Leaderboard') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Health Metrics */}
            <div className="bg-[#0D121B] border border-gt-border border-l-4 border-l-gt-cyan p-6 rounded-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="section-label text-gt-cyan mb-1 font-mono text-[10px] uppercase tracking-wide">
                    DIST_01 // INTEGRITY METRICS
                  </div>
                  <h2 className="font-orbitron text-base font-bold text-white uppercase">
                    HEALTH METRICS
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <RingProgress percentage={91} color="#00F0FF" label="AVG REP INDEX" />
                <RingProgress percentage={98} color="#FF007F" label="SESSION SUCCESS" />
                <RingProgress percentage={97} color="#00FF66" label="ZERO REPORTS" />
                <RingProgress percentage={99} color="#FFD700" label="VERIFIED PLAYERS" />
              </div>
            </div>

            {/* Score Distribution */}
            <div className="bg-[#0D121B] border border-gt-border border-l-4 border-l-gt-green p-6 rounded-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="section-label text-gt-green mb-1 font-mono text-[10px] uppercase tracking-wide">
                    DIST_02 // TRUST TIERS
                  </div>
                  <h2 className="font-orbitron text-base font-bold text-white uppercase">
                    SCORE DISTRIBUTION
                  </h2>
                </div>
              </div>
              
              <div className="space-y-4">
                <BarRow label="1-3" count="10K" percentage={20} colorClass="bg-gt-red" />
                <BarRow label="3-5" count="18K" percentage={35} colorClass="bg-gt-orange" />
                <BarRow label="5-7" count="14K" percentage={28} colorClass="bg-gt-yellow" />
                <BarRow label="7-9" count="10K" percentage={20} colorClass="bg-gt-green" />
                <BarRow label="9-10" count="4K" percentage={8} colorClass="bg-gt-cyan" />
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'Overview' || activeTab === 'Reports' || activeTab === 'Reviews') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Reports */}
            <div className="bg-[#0D121B] border border-gt-border border-l-4 border-l-gt-red p-6 rounded-sm">
              <div className="flex justify-between items-start mb-6 pb-2 border-b border-gt-border/60">
                <div>
                  <div className="section-label text-gt-red mb-1 font-mono text-[10px] uppercase tracking-wide">
                    RPT_LIVE // ENFORCEMENT
                  </div>
                  <h2 className="font-orbitron text-base font-bold text-white uppercase flex items-center gap-2">
                    RECENT REPORTS
                    <ShieldAlert size={16} className="text-gt-red" />
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gt-green animate-pulse"></span>
                  <span className="font-mono text-xs text-gt-green uppercase tracking-wide font-semibold">Monitoring Active</span>
                </div>
              </div>

              <div className="space-y-3">
                {reports.map((report) => (
                  <ReportRow
                    key={report.id}
                    id={report.id}
                    type={report.type}
                    user={report.user}
                    status={report.status}
                    badgeColor={report.badgeColor}
                  />
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-[#0D121B] border border-gt-border border-l-4 border-l-gt-magenta p-6 rounded-sm">
              <div className="mb-6 pb-2 border-b border-gt-border/60">
                <div className="section-label text-gt-magenta mb-1 font-mono text-[10px] uppercase tracking-wide">
                  REV_LIVE // COMMUNITY REVIEWS
                </div>
                <h2 className="font-orbitron text-base font-bold text-white uppercase flex items-center gap-2">
                  RECENT REVIEWS
                  <Award size={16} className="text-gt-yellow" />
                </h2>
              </div>

              <div className="space-y-5">
                {reviews.map((review) => (
                  <ReviewRow
                    key={review.id}
                    user={review.user}
                    stars={review.stars}
                    quote={review.quote}
                    author={review.author}
                    time={review.time}
                    badge={review.badge}
                    badgeColor={review.badgeColor}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

function RingProgress({ percentage, color, label }: { percentage: number, color: string, label: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center group cursor-default">
      <div className="relative w-20 h-20 mb-2 group-hover:scale-105 transition-transform">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#131B27"
            strokeWidth="5"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="font-orbitron font-extrabold text-sm"
            style={{ color }}
          >
            {percentage}%
          </span>
        </div>
      </div>
      <div className="font-mono text-[9px] text-gt-text-dim uppercase text-center leading-tight font-semibold">
        {label}
      </div>
    </div>
  );
}

function BarRow({ label, count, percentage, colorClass }: { label: string, count: string, percentage: number, colorClass: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 font-mono text-xs text-gt-text-dim text-right">
        {label}
      </div>
      <div className="flex-1 h-2 bg-[#101724] rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-700`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-10 font-mono text-xs text-white text-left font-bold">
        {count}
      </div>
    </div>
  );
}

function ReportRow({ id, type, user, status, badgeColor }: { id: string, type: string, user: string, status: string, badgeColor: 'red' | 'yellow' | 'cyan' }) {
  const badgeColors = {
    red: 'bg-gt-red/20 text-gt-red border-gt-red/50 shadow-[0_0_8px_rgba(255,42,77,0.3)]',
    yellow: 'bg-gt-yellow/20 text-gt-yellow border-gt-yellow/50 shadow-[0_0_8px_rgba(255,215,0,0.3)]',
    cyan: 'bg-gt-cyan/20 text-gt-cyan border-gt-cyan/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]',
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gt-border/40 last:border-0 last:pb-0 font-mono text-xs">
      <div className="flex items-center gap-3">
        <span className="text-gt-text-dim text-[11px]">{id}</span>
        <span className="font-bold text-white uppercase">{type}</span>
        <span className="text-gt-text-dim text-[11px] hidden sm:inline-block">by {user}</span>
      </div>
      <div className={`px-2 py-0.5 text-[9px] uppercase tracking-wider border rounded-sm font-bold ${badgeColors[badgeColor]}`}>
        {status}
      </div>
    </div>
  );
}

function ReviewRow({ user, stars, quote, author, time, badge, badgeColor }: { user: string, stars: number, quote: string, author: string, time: string, badge: string, badgeColor: 'cyan' | 'magenta' | 'green' }) {
  const borderColors = {
    cyan: 'border-gt-cyan/60 text-gt-cyan bg-gt-cyan/10',
    magenta: 'border-gt-magenta/60 text-gt-magenta bg-gt-magenta/10',
    green: 'border-gt-green/60 text-gt-green bg-gt-green/10',
  };

  return (
    <div className="pb-4 border-b border-gt-border/40 last:border-0 last:pb-0">
      <div className="flex justify-between items-start mb-1.5">
        <div className="flex items-center gap-3">
          <span className="font-orbitron font-bold text-xs text-white uppercase">{user}</span>
          <div className="flex text-gt-yellow text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < stars ? 'text-gt-yellow' : 'text-gt-border'}>★</span>
            ))}
          </div>
        </div>
        <div className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider border rounded-sm ${borderColors[badgeColor]}`}>
          {badge}
        </div>
      </div>
      <p className="font-rajdhani text-sm text-gt-text-dim italic mb-1.5 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="font-mono text-[11px] text-gt-text-dim/80">
        by <span className="text-gt-text">{author}</span> • {time}
      </div>
    </div>
  );
}
